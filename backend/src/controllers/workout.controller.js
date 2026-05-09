import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { telegramConfig, workoutLog, bodyWeight } from "../db/schema.js";
import { getUpdates, sendMessage } from "../services/telegram.service.js";
import {
  parseWorkoutMessage,
  parseBodyWeight,
} from "../services/workout-parser.service.js";
import { getWorkoutInsights } from "../services/gemini.service.js";
import { buildWeeklySummary } from "../services/scheduler.service.js";

export const syncFromTelegram = async (req, res) => {
  try {
    const [config] = await db
      .select()
      .from(telegramConfig)
      .where(eq(telegramConfig.userId, req.user.id));

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "No Telegram config found",
      });
    }

    const offset = config.lastUpdateId ? config.lastUpdateId + 1 : undefined;
    const result = await getUpdates(config.botToken, config.chatId, { offset });

    if (!result.ok) {
      return res.status(502).json({
        success: false,
        message: `Telegram API error: ${result.error}`,
      });
    }

    const newWorkouts = [];
    const newWeights = [];
    const errors = [];

    for (const update of result.updates) {
      if (!update.text || update.from.isBot) continue;

      const workout = parseWorkoutMessage(update.text);

      if (workout && workout.error === "unknown_exercise") {
        await sendMessage(
          config.botToken,
          config.chatId,
          `Unknown exercise: "${workout.exercise}"\n\nCheck supported exercises or use a shortcut like bp, dl, sq, ohp, rdl.`,
          { replyToMessageId: update.messageId }
        );
        errors.push({ message: update.text, error: "unknown_exercise", exercise: workout.exercise });
        continue;
      }

      if (workout) {
        const [inserted] = await db
          .insert(workoutLog)
          .values({
            id: randomUUID(),
            userId: req.user.id,
            exercise: workout.exercise,
            sets: workout.sets,
            reps: workout.reps,
            weight: workout.weight,
            unit: workout.unit,
            rawMessage: update.text,
            telegramMessageId: update.messageId,
            loggedAt: new Date(update.date),
          })
          .returning();
        newWorkouts.push(inserted);
        continue;
      }

      const bw = parseBodyWeight(update.text);
      if (bw) {
        const [inserted] = await db
          .insert(bodyWeight)
          .values({
            id: randomUUID(),
            userId: req.user.id,
            weight: bw.weight,
            unit: bw.unit,
            loggedAt: new Date(update.date),
          })
          .returning();
        newWeights.push(inserted);
        continue;
      }

      await sendMessage(
        config.botToken,
        config.chatId,
        `Wrong format.\n\nUse: exercise SETSxREPS WEIGHTkg\nExample: bench press 4x8 80kg\n\nFor body weight: bw 78.5kg`,
        { replyToMessageId: update.messageId }
      );
      errors.push({ message: update.text, error: "wrong_format" });
    }

    if (result.maxUpdateId) {
      await db
        .update(telegramConfig)
        .set({ lastUpdateId: result.maxUpdateId, updatedAt: new Date() })
        .where(eq(telegramConfig.userId, req.user.id));
    }

    return res.json({
      success: true,
      data: {
        syncedWorkouts: newWorkouts.length,
        syncedWeights: newWeights.length,
        errors: errors.length,
        errorDetails: errors,
        workouts: newWorkouts,
        weights: newWeights,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to sync",
    });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const { exercise, days } = req.query;

    const workouts = await db
      .select()
      .from(workoutLog)
      .where(eq(workoutLog.userId, req.user.id))
      .orderBy(desc(workoutLog.loggedAt));

    let filtered = workouts;

    if (exercise) {
      filtered = filtered.filter((w) =>
        w.exercise.toLowerCase().includes(exercise.toLowerCase())
      );
    }

    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - parseInt(days));
      filtered = filtered.filter((w) => new Date(w.loggedAt) >= cutoff);
    }

    return res.json({
      success: true,
      data: { count: filtered.length, workouts: filtered },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workouts",
    });
  }
};

export const getBodyWeightHistory = async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(bodyWeight)
      .where(eq(bodyWeight.userId, req.user.id))
      .orderBy(desc(bodyWeight.loggedAt));

    return res.json({
      success: true,
      data: {
        count: entries.length,
        latest: entries[0] || null,
        history: entries,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch body weight history",
    });
  }
};

function computeStats(workouts) {
  const exercises = {};

  for (const w of workouts) {
    if (!exercises[w.exercise]) {
      exercises[w.exercise] = {
        exercise: w.exercise,
        totalSets: 0,
        totalReps: 0,
        maxWeight: 0,
        totalVolume: 0,
        sessions: 0,
        unit: w.unit || "kg",
        history: [],
      };
    }

    const stat = exercises[w.exercise];
    stat.totalSets += w.sets;
    stat.totalReps += w.sets * w.reps;
    stat.maxWeight = Math.max(stat.maxWeight, w.weight || 0);
    stat.totalVolume += w.sets * w.reps * (w.weight || 0);
    stat.sessions += 1;
    stat.history.push({
      date: w.loggedAt,
      weight: w.weight,
      sets: w.sets,
      reps: w.reps,
    });
  }

  const uniqueDays = new Set(
    workouts.map((w) => new Date(w.loggedAt).toISOString().split("T")[0])
  );

  return {
    totalWorkouts: workouts.length,
    totalSessions: uniqueDays.size,
    activeDays: uniqueDays.size,
    uniqueExercises: Object.keys(exercises).length,
    exercises,
    personalRecords: Object.entries(exercises).map(([name, s]) => ({
      exercise: name,
      maxWeight: s.maxWeight,
      unit: s.unit,
    })),
  };
}

export const getStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const workouts = await db
      .select()
      .from(workoutLog)
      .where(eq(workoutLog.userId, req.user.id))
      .orderBy(desc(workoutLog.loggedAt));

    const filtered = workouts.filter((w) => new Date(w.loggedAt) >= cutoff);
    const stats = computeStats(filtered);

    return res.json({
      success: true,
      data: { period: `${days} days`, ...stats },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to compute stats",
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Gemini API key not configured",
      });
    }

    const workouts = await db
      .select()
      .from(workoutLog)
      .where(eq(workoutLog.userId, req.user.id))
      .orderBy(desc(workoutLog.loggedAt));

    if (workouts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No workout data found",
      });
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const recent = workouts.filter((w) => new Date(w.loggedAt) >= cutoff);
    const stats = computeStats(recent.length > 0 ? recent : workouts);
    const insights = await getWorkoutInsights(workouts, stats);

    return res.json({
      success: true,
      data: { stats, insights },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate insights",
    });
  }
};

export const getWeeklySummary = async (req, res) => {
  try {
    const summary = await buildWeeklySummary(req.user.id);

    return res.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate weekly summary",
    });
  }
};

import cron from "node-cron";
import { db } from "../db/index.js";
import { telegramConfig, workoutLog, bodyWeight } from "../db/schema.js";
import { sendMessage } from "./telegram.service.js";
import { eq, desc } from "drizzle-orm";

function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const start = new Date(now);
  start.setDate(now.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function getPrevWeekRange() {
  const { start } = getWeekRange();
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  prevEnd.setHours(23, 59, 59, 999);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - 6);
  prevStart.setHours(0, 0, 0, 0);

  return { start: prevStart, end: prevEnd };
}

async function buildWeeklySummary(userId) {
  const { start, end } = getWeekRange();
  const prev = getPrevWeekRange();

  const allWorkouts = await db
    .select()
    .from(workoutLog)
    .where(eq(workoutLog.userId, userId))
    .orderBy(desc(workoutLog.loggedAt));

  const thisWeek = allWorkouts.filter(
    (w) => new Date(w.loggedAt) >= start && new Date(w.loggedAt) <= end
  );
  const lastWeek = allWorkouts.filter(
    (w) => new Date(w.loggedAt) >= prev.start && new Date(w.loggedAt) <= prev.end
  );

  if (thisWeek.length === 0) {
    return "*Weekly Summary*\n\nNo workouts logged this week.";
  }

  const exercises = {};
  let totalVolume = 0;

  for (const w of thisWeek) {
    if (!exercises[w.exercise]) {
      exercises[w.exercise] = { maxWeight: 0, sessions: 0, totalSets: 0 };
    }
    const e = exercises[w.exercise];
    e.maxWeight = Math.max(e.maxWeight, w.weight || 0);
    e.sessions += 1;
    e.totalSets += w.sets;
    totalVolume += w.sets * w.reps * (w.weight || 0);
  }

  const uniqueDays = new Set(
    thisWeek.map((w) => new Date(w.loggedAt).toISOString().split("T")[0])
  );

  const prevVolume = lastWeek.reduce(
    (sum, w) => sum + w.sets * w.reps * (w.weight || 0),
    0
  );
  const volumeDiff = prevVolume > 0
    ? ((totalVolume - prevVolume) / prevVolume * 100).toFixed(1)
    : null;

  const allTimePRs = {};
  for (const w of allWorkouts) {
    if (!allTimePRs[w.exercise] || (w.weight || 0) > allTimePRs[w.exercise]) {
      allTimePRs[w.exercise] = w.weight || 0;
    }
  }

  const newPRs = Object.entries(exercises)
    .filter(([name, e]) => e.maxWeight > 0 && e.maxWeight >= (allTimePRs[name] || 0))
    .map(([name]) => name);

  const weightEntries = await db
    .select()
    .from(bodyWeight)
    .where(eq(bodyWeight.userId, userId))
    .orderBy(desc(bodyWeight.loggedAt));

  const thisWeekWeight = weightEntries.find(
    (w) => new Date(w.loggedAt) >= start && new Date(w.loggedAt) <= end
  );
  const lastWeekWeight = weightEntries.find(
    (w) => new Date(w.loggedAt) >= prev.start && new Date(w.loggedAt) <= prev.end
  );

  let lines = [
    "*Your Weekly Summary*",
    "---",
    "",
    `*${thisWeek.length} exercises* across *${uniqueDays.size} days*`,
    `Total volume: *${Math.round(totalVolume).toLocaleString()} kg*`,
  ];

  if (volumeDiff !== null) {
    const arrow = parseFloat(volumeDiff) >= 0 ? "UP" : "DOWN";
    lines.push(`${arrow} ${Math.abs(parseFloat(volumeDiff))}% vs last week`);
  }

  lines.push("", "*Top Exercises:*");
  const sorted = Object.entries(exercises).sort((a, b) => b[1].sessions - a[1].sessions);
  for (const [name, e] of sorted.slice(0, 5)) {
    const pr = newPRs.includes(name) ? " [PR]" : "";
    const weightStr = e.maxWeight > 0 ? ` - ${e.maxWeight}kg` : "";
    lines.push(`- ${name}: ${e.totalSets} sets${weightStr}${pr}`);
  }

  if (newPRs.length > 0) {
    lines.push("", `*New PRs:* ${newPRs.join(", ")}`);
  }

  if (thisWeekWeight) {
    let weightLine = `\n*Body weight:* ${thisWeekWeight.weight}${thisWeekWeight.unit}`;
    if (lastWeekWeight) {
      const diff = (thisWeekWeight.weight - lastWeekWeight.weight).toFixed(1);
      const sign = parseFloat(diff) >= 0 ? "+" : "";
      weightLine += ` (${sign}${diff}${thisWeekWeight.unit} vs last week)`;
    }
    lines.push(weightLine);
  }

  return lines.join("\n");
}

async function askWeeklyWeight() {
  try {
    const configs = await db.select().from(telegramConfig);

    for (const config of configs) {
      await sendMessage(
        config.botToken,
        config.chatId,
        "*New week check-in*\n\nWhat is your current body weight?\n\nReply with: `bw 78.5kg` or `weight 172lbs`"
      );
    }
  } catch (error) {
    console.error("Failed to send weight check-in:", error.message);
  }
}

async function sendWeeklySummaries() {
  try {
    const configs = await db.select().from(telegramConfig);

    for (const config of configs) {
      const summary = await buildWeeklySummary(config.userId);
      await sendMessage(config.botToken, config.chatId, summary);
    }
  } catch (error) {
    console.error("Failed to send weekly summaries:", error.message);
  }
}

export function initScheduler() {
  cron.schedule("0 8 * * 1", askWeeklyWeight);
  cron.schedule("0 21 * * 0", sendWeeklySummaries);
  console.log("Scheduler initialized: weight check-in (Mon 8AM), weekly summary (Sun 9PM)");
}

export { buildWeeklySummary };

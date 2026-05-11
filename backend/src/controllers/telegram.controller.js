import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { telegramConfig } from "../db/schema.js";
import {
  verifyBot,
  getChatInfo,
  getUpdates,
  setWebhook,
  sendMessage,
} from "../services/telegram.service.js";
import { workoutLog, bodyWeight } from "../db/schema.js";
import { parseWorkoutMessage, parseBodyWeight } from "../services/workout-parser.service.js";

export const saveConfig = async (req, res) => {
  try {
    const { botToken, chatId } = req.body;

    if (!botToken || !chatId) {
      return res.status(400).json({
        success: false,
        message: "botToken and chatId are required",
      });
    }

    const botCheck = await verifyBot(botToken);
    if (!botCheck.ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid bot token",
      });
    }

    const chatCheck = await getChatInfo(botToken, chatId);
    if (!chatCheck.ok) {
      return res.status(400).json({
        success: false,
        message: `Cannot access chat: ${chatCheck.description}`,
      });
    }

    const existing = await db
      .select()
      .from(telegramConfig)
      .where(eq(telegramConfig.userId, req.user.id));

    let config;

    if (existing.length > 0) {
      const [updated] = await db
        .update(telegramConfig)
        .set({
          botToken,
          chatId: String(chatId),
          botUsername: botCheck.result.username,
          chatTitle: chatCheck.result.title || null,
          updatedAt: new Date(),
        })
        .where(eq(telegramConfig.userId, req.user.id))
        .returning();
      config = updated;
    } else {
      const [inserted] = await db
        .insert(telegramConfig)
        .values({
          id: randomUUID(),
          userId: req.user.id,
          botToken,
          chatId: String(chatId),
          botUsername: botCheck.result.username,
          chatTitle: chatCheck.result.title || null,
        })
        .returning();
      config = inserted;
    }

    if (process.env.WEBHOOK_URL) {
      const webhookUrl = `${process.env.WEBHOOK_URL}/api/telegram/webhook/${botToken}`;
      await setWebhook(botToken, webhookUrl);
    }

    return res.json({
      success: true,
      data: {
        id: config.id,
        chatId: config.chatId,
        botUsername: config.botUsername,
        chatTitle: config.chatTitle,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save Telegram config",
    });
  }
};

export const getConfig = async (req, res) => {
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

    return res.json({
      success: true,
      data: {
        id: config.id,
        chatId: config.chatId,
        botUsername: config.botUsername,
        chatTitle: config.chatTitle,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Telegram config",
    });
  }
};

export const deleteConfig = async (req, res) => {
  try {
    const [deleted] = await db
      .delete(telegramConfig)
      .where(eq(telegramConfig.userId, req.user.id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "No Telegram config found",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete Telegram config",
    });
  }
};

export const fetchMessages = async (req, res) => {
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

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const result = await getUpdates(config.botToken, config.chatId, { limit });

    if (!result.ok) {
      return res.status(502).json({
        success: false,
        message: `Telegram API error: ${result.error}`,
      });
    }

    return res.json({
      success: true,
      data: {
        chatId: config.chatId,
        chatTitle: config.chatTitle,
        count: result.updates.length,
        messages: result.updates,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const handleWebhook = async (req, res) => {
  const { botToken } = req.params;
  const update = req.body;

  // Telegram expects a 200 OK fast, otherwise it retries.
  res.status(200).send("OK");

  if (!update.message || !update.message.text || update.message.from.is_bot) {
    return;
  }

  try {
    const [config] = await db
      .select()
      .from(telegramConfig)
      .where(eq(telegramConfig.botToken, botToken));

    if (!config || String(config.chatId) !== String(update.message.chat.id)) {
      return;
    }

    const text = update.message.text;
    const messageId = update.message.message_id;
    const date = new Date(update.message.date * 1000);

    const workout = parseWorkoutMessage(text);

    if (workout && workout.error === "unknown_exercise") {
      await sendMessage(
        config.botToken,
        config.chatId,
        `Unknown exercise: "${workout.exercise}"\n\nCheck supported exercises or use a shortcut like bp, dl, sq, ohp, rdl.`,
        { replyToMessageId: messageId }
      );
      return;
    }

    if (workout) {
      await db.insert(workoutLog).values({
        id: randomUUID(),
        userId: config.userId,
        exercise: workout.exercise,
        sets: workout.sets,
        reps: workout.reps,
        weight: workout.weight,
        unit: workout.unit,
        rawMessage: text,
        telegramMessageId: messageId,
        loggedAt: date,
      });
      return;
    }

    const bw = parseBodyWeight(text);
    if (bw) {
      await db.insert(bodyWeight).values({
        id: randomUUID(),
        userId: config.userId,
        weight: bw.weight,
        unit: bw.unit,
        loggedAt: date,
      });
      return;
    }

    await sendMessage(
      config.botToken,
      config.chatId,
      `Wrong format.\n\nUse: exercise SETSxREPS WEIGHTkg\nExample: bench press 4x8 80kg\n\nFor body weight: bw 78.5kg`,
      { replyToMessageId: messageId }
    );
  } catch (error) {
    console.error("Webhook processing error:", error.message);
  }
};

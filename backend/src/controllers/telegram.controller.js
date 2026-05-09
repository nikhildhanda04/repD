import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { telegramConfig } from "../db/schema.js";
import {
  verifyBot,
  getChatInfo,
  getUpdates,
} from "../services/telegram.service.js";

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

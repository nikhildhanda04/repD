import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  saveConfig,
  getConfig,
  deleteConfig,
  fetchMessages,
  handleWebhook,
} from "../controllers/telegram.controller.js";

const router = Router();

// Public route for Telegram to hit
router.post("/webhook/:botToken", handleWebhook);

router.use(requireAuth);

router.put("/config", saveConfig);
router.get("/config", getConfig);
router.delete("/config", deleteConfig);
router.get("/messages", fetchMessages);

export default router;

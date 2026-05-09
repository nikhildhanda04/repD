import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  saveConfig,
  getConfig,
  deleteConfig,
  fetchMessages,
} from "../controllers/telegram.controller.js";

const router = Router();

router.use(requireAuth);

router.put("/config", saveConfig);
router.get("/config", getConfig);
router.delete("/config", deleteConfig);
router.get("/messages", fetchMessages);

export default router;

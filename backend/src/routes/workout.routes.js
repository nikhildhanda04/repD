import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  syncFromTelegram,
  getWorkouts,
  getStats,
  getInsights,
  getBodyWeightHistory,
  getWeeklySummary,
} from "../controllers/workout.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/sync", syncFromTelegram);
router.get("/", getWorkouts);
router.get("/stats", getStats);
router.get("/insights", getInsights);
router.get("/bodyweight", getBodyWeightHistory);
router.get("/summary", getWeeklySummary);

export default router;

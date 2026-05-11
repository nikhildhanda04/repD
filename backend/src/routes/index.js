import { Router } from "express";
import userRoutes from "./user.routes.js";
import telegramRoutes from "./telegram.routes.js";
import workoutRoutes from "./workout.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/telegram", telegramRoutes);
router.use("/workouts", workoutRoutes);
router.use("/contact", contactRoutes);

export default router;

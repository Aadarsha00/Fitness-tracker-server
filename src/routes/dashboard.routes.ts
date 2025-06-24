import express from "express";
import {
  getWorkoutAnalytics,
  getBodyPartDistribution,
  getWorkoutSummary,
  debugDashboardData,
  getBodyWeightProgress,
  getExercisePerformance,
  getPersonalRecords,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { allUser } from "../@types/global.types";

const router = express.Router();

router.use(authenticate(allUser));

router.get("/debug", debugDashboardData);
router.get("/workout-analytics", getWorkoutAnalytics);
router.get("/body-weight-progress", getBodyWeightProgress);
router.get("/exercise-performance", getExercisePerformance);
router.get("/body-part-distribution", getBodyPartDistribution);
router.get("/workout-summary", getWorkoutSummary);
router.get("/personal-records", getPersonalRecords);

export default router;

import express from "express";
import {
  getWorkoutAnalytics,
  getBodyWeightProgress,
  getExercisePerformance,
  getBodyPartDistribution,
  getWorkoutSummary,
  getPersonalRecords,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { allUser } from "../@types/global.types";

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate(allUser));

//?Get workout analytics (frequency over time)
router.get("/workout-analytics", getWorkoutAnalytics);

//?Get body weight progress
router.get("/body-weight-progress", getBodyWeightProgress);

//?Get exercise performance (strength progression for specific exercise)
router.get("/exercise-performance", getExercisePerformance);

//?Get body part distribution (pie chart data)
router.get("/body-part-distribution", getBodyPartDistribution);

//?Get workout summary stats
router.get("/workout-summary", getWorkoutSummary);

//?Get personal records
router.get("/personal-records", getPersonalRecords);

export default router;

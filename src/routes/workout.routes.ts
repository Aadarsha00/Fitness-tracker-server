import express from "express";
import {
  createWorkout,
  deleteWorkout,
  getUserWorkOut,
  getWorkOutById,
  updateWorkout,
} from "../controllers/workout.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { allUser } from "../@types/global.types";
const router = express.Router();

//?Create workout
router.post("/", authenticate(allUser), createWorkout);

//?Get workout by id
router.get("/id/:id", authenticate(allUser), getWorkOutById);

//?Get users workout
router.get("/user/:userId", authenticate(allUser), getUserWorkOut);

//?Update workout
router.patch("/:id", authenticate(allUser), updateWorkout);

//?DElete workout
router.delete("/:id", authenticate(allUser), deleteWorkout);

export default router;

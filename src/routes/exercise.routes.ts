import express from "express";
import {
  createExercise,
  deleteExercise,
  getAllBodyParts,
  getAllExercise,
  getExerciseById,
  updateExercise,
} from "../controllers/exercise.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { allUser } from "../@types/global.types";
const router = express.Router();

//?Create Exercise
router.post("/", authenticate(allUser), createExercise);

//?Get all exercise
router.get("/", getAllExercise);

//?get all bodyparts
router.get("/bodyParts", getAllBodyParts);

//?get exercise by id
router.get("/:id", getExerciseById);

//?Update exercise
router.patch("/:id", authenticate(allUser), updateExercise);

//?delete exercise
router.delete("/:id", authenticate(allUser), deleteExercise);

export default router;

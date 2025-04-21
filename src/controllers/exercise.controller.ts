import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { Exercise } from "../models/exercise.model";
import { customError } from "../middleware/errorHandler.middleware";
import { Role } from "../@types/global.types";

//?Create exercise
export const createExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, bodyPart, instruction } = req.body;
    const userId = req.user._id;

    //checking if the exercise with the same name exist
    const existingExercise = await Exercise.findOne({ name });
    if (existingExercise) {
      throw new customError("Exercise with this name already exist", 400);
    }

    const exercise = await Exercise.create({
      name,
      bodyPart,
      instruction,
      createdBy: userId || null,
      isCustom: !!userId,
    });
    res.status(201).json({
      status: "success",
      success: true,
      data: exercise,
      message: "Exercise created successfully",
    });
  }
);

//?Get all exercise
export const getAllExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const { bodyPart } = req.query;

    let query = {};
    if (bodyPart) {
      query = { bodyPart };
    }
    const exercise = await Exercise.find(query).sort({ name: 1 });
    res.status(200).json({
      status: "success",
      success: true,
      data: exercise,
      message: "Exercises fetched successfully",
    });
  }
);

//?Get all bodyParts
export const getAllBodyParts = asyncHandler(
  async (req: Request, res: Response) => {
    // distinct will get all unique bodyParts from the exercises collection
    const bodyParts = await Exercise.distinct("bodyPart");

    res.status(200).json({
      status: "success",
      success: true,
      data: bodyParts,
      message: "Body parts fetched successfully",
    });
  }
);

//?Find exercise by id
export const getExerciseById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      throw new customError("Exercise does not exist", 404);
    }
    res.status(200).json({
      status: "success",
      success: true,
      data: exercise,
      message: "Exercise fetched successfully",
    });
  }
);

//?Update exercise
export const updateExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, bodyPart, instruction } = req.body;
    const userId = req.user._id;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      throw new customError("Exercise does not exist", 404);
    }

    //only the creator can change their custom exercise
    const isCreator = exercise.createdBy.equals(userId);
    if (!isCreator) {
      throw new customError("Not authorized to access", 403);
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      {
        name,
        bodyPart,
        instruction,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      success: true,
      data: updatedExercise,
      message: "Exercise updated successfully",
    });
  }
);

//?Delete exercise
export const deleteExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.user._id;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      throw new customError("Exercise does not exist", 404);
    }
    //Only al;lowing the user who created it to delete it
    const isCreator = exercise.createdBy.toString() === userId.toString();
    const isAdmin = req.user.role === Role.admin;
    if ((!isCreator && exercise.isCustom) || (!exercise.isCustom && !isAdmin)) {
      throw new customError("Unauthorized", 403);
    }
    await Exercise.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      success: true,
      message: "Exercise deleted successfully",
    });
  }
);

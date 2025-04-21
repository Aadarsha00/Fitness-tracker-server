import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { Workout } from "../models/workout.model";
import { customError } from "../middleware/errorHandler.middleware";
import { User } from "../models/user.model";
import { Exercise } from "../models/exercise.model";

//?Create workout
export const createWorkout = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { name, exercises, notes, date } = req.body;

    // Validate exercise IDs
    const exerciseIds = exercises.map((ex: any) => ex.exercise);
    const existingExercises = await Exercise.find({
      _id: { $in: exerciseIds },
    });

    // Check if all IDs are valid
    if (existingExercises.length !== exerciseIds.length) {
      throw new customError("This exercise does not exist.", 400);
    }
    const workout = await Workout.create({
      user: userId,
      name,
      exercises,
      notes,
      date,
    });
    res.status(201).json({ status: "success", data: workout });
  }
);

//?Get users workout
export const getUserWorkOut = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    let query: any = { user: userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    const workout = await Workout.find(query)
      .populate("exercises.exercise")
      .sort({ date: -1 });
    res.status(200).json({
      status: "Success",
      success: true,
      data: workout,
      message: "Users Workout fetched successfully",
    });
  }
);

//?get workout by id
export const getWorkOutById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const workoutId = req.params.id;
    const workout = await Workout.findOne({
      _id: workoutId,
      user: userId,
    }).populate("exercises.exercise");
    if (!workout) {
      throw new customError("Workout not found", 404);
    }
    res.status(200).json({
      status: "Success",
      success: true,
      data: workout,
      message: "Workout fetched successfully",
    });
  }
);

//?Update workout
export const updateWorkout = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const workoutId = req.params.id;
    const { name, exercises, notes, date } = req.body;

    //  Check if workout exists and belongs to the user
    const existingWorkout = await Workout.findOne({
      user: userId,
      _id: workoutId,
    });
    if (!existingWorkout) {
      throw new customError("Workout not found", 404);
    }

    //  Validate exercise IDs
    if (exercises && Array.isArray(exercises)) {
      const exerciseIds = exercises.map((ex) => ex.exercise);
      const existingExercises = await Exercise.countDocuments({
        _id: { $in: exerciseIds },
      });

      if (existingExercises !== exerciseIds.length) {
        throw new customError("One or more exercises do not exist", 400);
      }
    }

    // Update the workout
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      { name, exercises, notes, date },
      { new: true, runValidators: true }
    ).populate("exercises.exercise");

    res.status(200).json({
      status: "Success",
      success: true,
      data: updatedWorkout,
      message: "Workout updated successfully",
    });
  }
);

//?Delete workout
export const deleteWorkout = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const workoutId = req.params.id;

    // check if the workout exist and beolngs to the user
    const workout = await Workout.findOne({
      user: userId,
      _id: workoutId,
    });
    if (!workout) {
      throw new customError("Workout doesnot exist", 404);
    }
    //DelEte whole workout
    await Workout.findByIdAndDelete(workoutId);

    //delete one workout from users workout list
    await User.findByIdAndUpdate(userId, {
      $pull: { workout: workoutId },
    });
    res.status(201).json({
      status: "success",
      success: true,
      message: "Workout deleted successfully",
    });
  }
);

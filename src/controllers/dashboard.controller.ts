import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { Workout } from "../models/workout.model";
import mongoose from "mongoose";

export const getWorkoutSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const summary = await Workout.aggregate([
      { $match: { user: userIdForQuery, date: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalExercises: { $sum: { $size: "$exercises" } },
          avgExercisesPerWorkout: { $avg: { $size: "$exercises" } },
        },
      },
      {
        $project: {
          totalWorkouts: 1,
          totalExercises: 1,
          avgExercisesPerWorkout: { $round: ["$avgExercisesPerWorkout", 1] },
          _id: 0,
        },
      },
    ]);

    const volumeData = await Workout.aggregate([
      { $match: { user: userIdForQuery, date: { $gte: startDate } } },
      { $unwind: "$exercises" },
      { $unwind: "$exercises.sets" },
      {
        $group: {
          _id: null,
          totalVolume: {
            $sum: {
              $multiply: [
                { $ifNull: ["$exercises.sets.weight", 0] },
                { $ifNull: ["$exercises.sets.reps", 0] },
              ],
            },
          },
        },
      },
    ]);

    const result = {
      totalWorkouts: 0,
      totalExercises: 0,
      avgExercisesPerWorkout: 0,
      ...summary[0],
      totalVolume: volumeData[0]?.totalVolume || 0,
    };

    res.status(200).json({
      status: "success",
      success: true,
      data: result,
      message: "Workout summary fetched successfully",
    });
  }
);

export const getWorkoutAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const workoutFrequency = await Workout.aggregate([
      {
        $match: { user: userIdForQuery, date: { $gte: startDate } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          count: { $sum: 1 },
          date: { $first: "$date" },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          date: "$date",
          workouts: "$count",
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      success: true,
      data: { workoutFrequency },
      message: "Workout analytics fetched successfully",
    });
  }
);

export const getBodyPartDistribution = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const bodyPartData = await Workout.aggregate([
      { $match: { user: userIdForQuery, date: { $gte: startDate } } },
      { $unwind: "$exercises" },
      {
        $lookup: {
          from: "exercises",
          localField: "exercises.exercise",
          foreignField: "_id",
          as: "exerciseDetails",
        },
      },
      { $unwind: "$exerciseDetails" },
      {
        $group: {
          _id: "$exerciseDetails.bodyPart",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          bodyPart: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      success: true,
      data: bodyPartData,
      message: "Body part distribution fetched successfully",
    });
  }
);

export const getBodyWeightProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const bodyWeightData = await Workout.aggregate([
      {
        $match: {
          user: userIdForQuery,
          date: { $gte: startDate },
          bodyWeight: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          date: { $first: "$date" },
          weight: { $first: "$bodyWeight" },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          date: 1,
          weight: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      success: true,
      data: bodyWeightData,
      message: "Body weight progress fetched successfully",
    });
  }
);

export const getExercisePerformance = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { exerciseId, period = "30" } = req.query;

    if (!exerciseId) {
      res.status(400).json({
        status: "error",
        success: false,
        message: "Exercise ID is required",
      });
    }

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const performanceData = await Workout.aggregate([
      { $match: { user: userIdForQuery, date: { $gte: startDate } } },
      { $unwind: "$exercises" },
      {
        $match: {
          "exercises.exercise": new mongoose.Types.ObjectId(
            exerciseId as string
          ),
        },
      },
      { $unwind: "$exercises.sets" },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          date: { $first: "$date" },
          maxWeight: { $max: "$exercises.sets.weight" },
          maxReps: { $max: "$exercises.sets.reps" },
          totalVolume: {
            $sum: {
              $multiply: ["$exercises.sets.weight", "$exercises.sets.reps"],
            },
          },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          date: 1,
          maxWeight: 1,
          maxReps: 1,
          totalVolume: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      success: true,
      data: performanceData,
      message: "Exercise performance fetched successfully",
    });
  }
);

export const getPersonalRecords = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const personalRecords = await Workout.aggregate([
      { $match: { user: userIdForQuery } },
      { $unwind: "$exercises" },
      { $unwind: "$exercises.sets" },
      {
        $lookup: {
          from: "exercises",
          localField: "exercises.exercise",
          foreignField: "_id",
          as: "exerciseDetails",
        },
      },
      { $unwind: "$exerciseDetails" },
      {
        $group: {
          _id: "$exercises.exercise",
          exerciseName: { $first: "$exerciseDetails.name" },
          maxWeight: { $max: "$exercises.sets.weight" },
          maxReps: { $max: "$exercises.sets.reps" },
          maxVolume: {
            $max: {
              $multiply: ["$exercises.sets.weight", "$exercises.sets.reps"],
            },
          },
          lastPerformed: { $max: "$date" },
        },
      },
      {
        $project: {
          exerciseId: "$_id",
          exerciseName: 1,
          maxWeight: 1,
          maxReps: 1,
          maxVolume: 1,
          lastPerformed: 1,
          _id: 0,
        },
      },
      { $sort: { maxWeight: -1 } },
    ]);

    res.status(200).json({
      status: "success",
      success: true,
      data: personalRecords,
      message: "Personal records fetched successfully",
    });
  }
);

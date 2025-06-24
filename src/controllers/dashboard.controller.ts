import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { Workout } from "../models/workout.model";
import mongoose from "mongoose";

// Add this debug function first to check your data
export const debugDashboardData = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    console.log("=== DEBUG DASHBOARD DATA ===");
    console.log("User ID:", userId);
    console.log("User ID type:", typeof userId);
    console.log("Is ObjectId:", mongoose.Types.ObjectId.isValid(userId));

    // Check if user has any workouts at all
    const totalWorkouts = await Workout.countDocuments({ user: userId });
    console.log("Total workouts for user:", totalWorkouts);

    // Get a sample workout to see the structure
    const sampleWorkout = await Workout.findOne({ user: userId }).lean();
    console.log("Sample workout:", JSON.stringify(sampleWorkout, null, 2));

    res.json({
      userId,
      userIdType: typeof userId,
      totalWorkouts,
      sampleWorkout,
    });
  }
);

// Updated getWorkoutSummary with debugging
export const getWorkoutSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    console.log("=== WORKOUT SUMMARY DEBUG ===");
    console.log("User ID:", userId);
    console.log("Period:", period);

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    console.log("Start date:", startDate);
    console.log("Current date:", new Date());

    // First, check if we have any workouts for this user
    const allWorkoutsCount = await Workout.countDocuments({ user: userId });
    console.log("Total workouts for user:", allWorkoutsCount);

    // Check workouts in date range
    const workoutsInRange = await Workout.countDocuments({
      user: userId,
      date: { $gte: startDate },
    });
    console.log("Workouts in date range:", workoutsInRange);

    // Try with ObjectId conversion if needed
    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
      console.log("Converted userId to ObjectId:", userIdForQuery);
    }

    const summary = await Workout.aggregate([
      {
        $match: {
          user: userIdForQuery, // Use converted userId
          date: { $gte: startDate },
        },
      },
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

    console.log("Summary result:", summary);

    // Calculate total volume with debugging
    const volumeData = await Workout.aggregate([
      {
        $match: {
          user: userIdForQuery, // Use converted userId
          date: { $gte: startDate },
        },
      },
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

    console.log("Volume data result:", volumeData);

    const result = {
      totalWorkouts: 0,
      totalExercises: 0,
      avgExercisesPerWorkout: 0,
      ...summary[0],
      totalVolume: volumeData[0]?.totalVolume || 0,
    };

    console.log("Final result:", result);

    res.status(200).json({
      status: "success",
      success: true,
      data: result,
      message: "Workout summary fetched successfully",
    });
  }
);

// Updated getBodyPartDistribution with debugging
export const getBodyPartDistribution = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    console.log("=== BODY PART DISTRIBUTION DEBUG ===");
    console.log("User ID:", userId);

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Convert userId if needed
    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    // First check if we have workouts with exercises
    const workoutsWithExercises = await Workout.find({
      user: userIdForQuery,
      date: { $gte: startDate },
      exercises: { $exists: true, $ne: [] },
    }).limit(1);

    console.log("Sample workout with exercises:", workoutsWithExercises[0]);

    const bodyPartData = await Workout.aggregate([
      {
        $match: {
          user: userIdForQuery,
          date: { $gte: startDate },
        },
      },
      { $unwind: "$exercises" },
      {
        $lookup: {
          from: "exercises", // Make sure this collection name is correct
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

    console.log("Body part data result:", bodyPartData);

    res.status(200).json({
      status: "success",
      success: true,
      data: bodyPartData,
      message: "Body part distribution fetched successfully",
    });
  }
);

// Updated getWorkoutAnalytics with debugging
export const getWorkoutAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { period = "30" } = req.query;

    console.log("=== WORKOUT ANALYTICS DEBUG ===");
    console.log("User ID:", userId);

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Convert userId if needed
    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    console.log("Date range:", startDate, "to", new Date());

    const workoutFrequency = await Workout.aggregate([
      {
        $match: {
          user: userIdForQuery,
          date: { $gte: startDate },
        },
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
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          date: "$date",
          workouts: "$count",
          _id: 0,
        },
      },
    ]);

    console.log("Workout frequency result:", workoutFrequency);

    res.status(200).json({
      status: "success",
      success: true,
      data: { workoutFrequency },
      message: "Workout analytics fetched successfully",
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
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          date: "$date",
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
      return;
    }

    const daysBack = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let userIdForQuery = userId;
    if (typeof userId === "string") {
      userIdForQuery = new mongoose.Types.ObjectId(userId);
    }

    const performanceData = await Workout.aggregate([
      {
        $match: {
          user: userIdForQuery,
          date: { $gte: startDate },
        },
      },
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
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          date: "$date",
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
      {
        $match: {
          user: userIdForQuery,
        },
      },
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
      {
        $sort: { maxWeight: -1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      success: true,
      data: personalRecords,
      message: "Personal records fetched successfully",
    });
  }
);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalRecords = exports.getExercisePerformance = exports.getBodyWeightProgress = exports.getWorkoutAnalytics = exports.getBodyPartDistribution = exports.getWorkoutSummary = exports.debugDashboardData = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const workout_model_1 = require("../models/workout.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Add this debug function first to check your data
exports.debugDashboardData = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    console.log("=== DEBUG DASHBOARD DATA ===");
    console.log("User ID:", userId);
    console.log("User ID type:", typeof userId);
    console.log("Is ObjectId:", mongoose_1.default.Types.ObjectId.isValid(userId));
    // Check if user has any workouts at all
    const totalWorkouts = yield workout_model_1.Workout.countDocuments({ user: userId });
    console.log("Total workouts for user:", totalWorkouts);
    // Get a sample workout to see the structure
    const sampleWorkout = yield workout_model_1.Workout.findOne({ user: userId }).lean();
    console.log("Sample workout:", JSON.stringify(sampleWorkout, null, 2));
    res.json({
        userId,
        userIdType: typeof userId,
        totalWorkouts,
        sampleWorkout,
    });
}));
// Updated getWorkoutSummary with debugging
exports.getWorkoutSummary = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { period = "30" } = req.query;
    console.log("=== WORKOUT SUMMARY DEBUG ===");
    console.log("User ID:", userId);
    console.log("Period:", period);
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    console.log("Start date:", startDate);
    console.log("Current date:", new Date());
    // First, check if we have any workouts for this user
    const allWorkoutsCount = yield workout_model_1.Workout.countDocuments({ user: userId });
    console.log("Total workouts for user:", allWorkoutsCount);
    // Check workouts in date range
    const workoutsInRange = yield workout_model_1.Workout.countDocuments({
        user: userId,
        date: { $gte: startDate },
    });
    console.log("Workouts in date range:", workoutsInRange);
    // Try with ObjectId conversion if needed
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
        console.log("Converted userId to ObjectId:", userIdForQuery);
    }
    const summary = yield workout_model_1.Workout.aggregate([
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
    const volumeData = yield workout_model_1.Workout.aggregate([
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
    const result = Object.assign(Object.assign({ totalWorkouts: 0, totalExercises: 0, avgExercisesPerWorkout: 0 }, summary[0]), { totalVolume: ((_a = volumeData[0]) === null || _a === void 0 ? void 0 : _a.totalVolume) || 0 });
    console.log("Final result:", result);
    res.status(200).json({
        status: "success",
        success: true,
        data: result,
        message: "Workout summary fetched successfully",
    });
}));
// Updated getBodyPartDistribution with debugging
exports.getBodyPartDistribution = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query;
    console.log("=== BODY PART DISTRIBUTION DEBUG ===");
    console.log("User ID:", userId);
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    // Convert userId if needed
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    // First check if we have workouts with exercises
    const workoutsWithExercises = yield workout_model_1.Workout.find({
        user: userIdForQuery,
        date: { $gte: startDate },
        exercises: { $exists: true, $ne: [] },
    }).limit(1);
    console.log("Sample workout with exercises:", workoutsWithExercises[0]);
    const bodyPartData = yield workout_model_1.Workout.aggregate([
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
}));
// Updated getWorkoutAnalytics with debugging
exports.getWorkoutAnalytics = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query;
    console.log("=== WORKOUT ANALYTICS DEBUG ===");
    console.log("User ID:", userId);
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    // Convert userId if needed
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    console.log("Date range:", startDate, "to", new Date());
    const workoutFrequency = yield workout_model_1.Workout.aggregate([
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
}));
exports.getBodyWeightProgress = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const bodyWeightData = yield workout_model_1.Workout.aggregate([
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
}));
exports.getExercisePerformance = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const performanceData = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userIdForQuery,
                date: { $gte: startDate },
            },
        },
        { $unwind: "$exercises" },
        {
            $match: {
                "exercises.exercise": new mongoose_1.default.Types.ObjectId(exerciseId),
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
}));
exports.getPersonalRecords = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const personalRecords = yield workout_model_1.Workout.aggregate([
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
}));

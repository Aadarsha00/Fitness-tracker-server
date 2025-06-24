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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalRecords = exports.getWorkoutSummary = exports.getBodyPartDistribution = exports.getExercisePerformance = exports.getBodyWeightProgress = exports.getWorkoutAnalytics = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const workout_model_1 = require("../models/workout.model");
//?Get workout analytics for dashboard
exports.getWorkoutAnalytics = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query; // Default to 30 days
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    // Workout frequency over time
    const workoutFrequency = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userId,
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
    res.status(200).json({
        status: "success",
        success: true,
        data: { workoutFrequency },
        message: "Workout analytics fetched successfully",
    });
}));
//?Get body weight progress
exports.getBodyWeightProgress = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "90" } = req.query; // Default to 90 days
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const bodyWeightData = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userId,
                date: { $gte: startDate },
                bodyWeight: { $exists: true, $ne: null },
            },
        },
        {
            $sort: { date: 1 },
        },
        {
            $project: {
                date: "$date",
                weight: "$bodyWeight",
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
//?Get exercise performance (strength progression)
exports.getExercisePerformance = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { exerciseId, period = "90" } = req.query;
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
    const performanceData = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userId,
                date: { $gte: startDate },
            },
        },
        { $unwind: "$exercises" },
        {
            $match: {
                "exercises.exercise": exerciseId,
            },
        },
        { $unwind: "$exercises.sets" },
        {
            $group: {
                _id: "$date",
                maxWeight: { $max: "$exercises.sets.weight" },
                totalReps: { $sum: "$exercises.sets.reps" },
                totalSets: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
        {
            $project: {
                date: "$_id",
                maxWeight: 1,
                totalReps: 1,
                totalSets: 1,
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
//?Get body part distribution
exports.getBodyPartDistribution = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const bodyPartData = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userId,
                date: { $gte: startDate },
            },
        },
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
}));
//?Get workout summary stats
exports.getWorkoutSummary = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { period = "30" } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const summary = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userId,
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
    // Calculate total volume (weight × reps)
    const volumeData = yield workout_model_1.Workout.aggregate([
        {
            $match: {
                user: userId,
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
    const result = Object.assign(Object.assign({}, summary[0]), { totalVolume: ((_a = volumeData[0]) === null || _a === void 0 ? void 0 : _a.totalVolume) || 0 });
    res.status(200).json({
        status: "success",
        success: true,
        data: result,
        message: "Workout summary fetched successfully",
    });
}));
//?Get personal records
exports.getPersonalRecords = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const personalRecords = yield workout_model_1.Workout.aggregate([
        {
            $match: { user: userId },
        },
        { $unwind: "$exercises" },
        { $unwind: "$exercises.sets" },
        {
            $group: {
                _id: "$exercises.exercise",
                maxWeight: { $max: "$exercises.sets.weight" },
                maxReps: { $max: "$exercises.sets.reps" },
                bestDate: { $first: "$date" },
            },
        },
        {
            $lookup: {
                from: "exercises",
                localField: "_id",
                foreignField: "_id",
                as: "exerciseDetails",
            },
        },
        { $unwind: "$exerciseDetails" },
        {
            $project: {
                exerciseName: "$exerciseDetails.name",
                bodyPart: "$exerciseDetails.bodyPart",
                maxWeight: 1,
                maxReps: 1,
                bestDate: 1,
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

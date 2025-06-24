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
exports.getPersonalRecords = exports.getExercisePerformance = exports.getBodyWeightProgress = exports.getBodyPartDistribution = exports.getWorkoutAnalytics = exports.getWorkoutSummary = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const workout_model_1 = require("../models/workout.model");
const mongoose_1 = __importDefault(require("mongoose"));
exports.getWorkoutSummary = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { period = "30" } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const summary = yield workout_model_1.Workout.aggregate([
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
    const volumeData = yield workout_model_1.Workout.aggregate([
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
    const result = Object.assign(Object.assign({ totalWorkouts: 0, totalExercises: 0, avgExercisesPerWorkout: 0 }, summary[0]), { totalVolume: ((_a = volumeData[0]) === null || _a === void 0 ? void 0 : _a.totalVolume) || 0 });
    res.status(200).json({
        status: "success",
        success: true,
        data: result,
        message: "Workout summary fetched successfully",
    });
}));
exports.getWorkoutAnalytics = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const workoutFrequency = yield workout_model_1.Workout.aggregate([
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
}));
exports.getBodyPartDistribution = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { period = "30" } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const bodyPartData = yield workout_model_1.Workout.aggregate([
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
    }
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const performanceData = yield workout_model_1.Workout.aggregate([
        { $match: { user: userIdForQuery, date: { $gte: startDate } } },
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
}));
exports.getPersonalRecords = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    let userIdForQuery = userId;
    if (typeof userId === "string") {
        userIdForQuery = new mongoose_1.default.Types.ObjectId(userId);
    }
    const personalRecords = yield workout_model_1.Workout.aggregate([
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
}));

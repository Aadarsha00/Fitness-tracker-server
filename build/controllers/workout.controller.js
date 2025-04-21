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
exports.deleteWorkout = exports.updateWorkout = exports.getWorkOutById = exports.getUserWorkOut = exports.createWorkout = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const workout_model_1 = require("../models/workout.model");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
const user_model_1 = require("../models/user.model");
const exercise_model_1 = require("../models/exercise.model");
//?Create workout
exports.createWorkout = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { name, exercises, notes, date } = req.body;
    // Validate exercise IDs
    const exerciseIds = exercises.map((ex) => ex.exercise);
    const existingExercises = yield exercise_model_1.Exercise.find({
        _id: { $in: exerciseIds },
    });
    // Check if all IDs are valid
    if (existingExercises.length !== exerciseIds.length) {
        throw new errorHandler_middleware_1.customError("This exercise does not exist.", 400);
    }
    const workout = yield workout_model_1.Workout.create({
        user: userId,
        name,
        exercises,
        notes,
        date,
    });
    res.status(201).json({ status: "success", data: workout });
}));
//?Get users workout
exports.getUserWorkOut = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    let query = { user: userId };
    if (startDate || endDate) {
        query.date = {};
        if (startDate)
            query.date.$gte = new Date(startDate);
        if (endDate)
            query.date.$lte = new Date(endDate);
    }
    const workout = yield workout_model_1.Workout.find(query)
        .populate("exercises.exercise")
        .sort({ date: -1 });
    res.status(200).json({
        status: "Success",
        success: true,
        data: workout,
        message: "Users Workout fetched successfully",
    });
}));
//?get workout by id
exports.getWorkOutById = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const workoutId = req.params.id;
    const workout = yield workout_model_1.Workout.findOne({
        _id: workoutId,
        user: userId,
    }).populate("exercises.exercise");
    if (!workout) {
        throw new errorHandler_middleware_1.customError("Workout not found", 404);
    }
    res.status(200).json({
        status: "Success",
        success: true,
        data: workout,
        message: "Workout fetched successfully",
    });
}));
//?Update workout
exports.updateWorkout = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const workoutId = req.params.id;
    const { name, exercises, notes, date } = req.body;
    //  Check if workout exists and belongs to the user
    const existingWorkout = yield workout_model_1.Workout.findOne({
        user: userId,
        _id: workoutId,
    });
    if (!existingWorkout) {
        throw new errorHandler_middleware_1.customError("Workout not found", 404);
    }
    //  Validate exercise IDs
    if (exercises && Array.isArray(exercises)) {
        const exerciseIds = exercises.map((ex) => ex.exercise);
        const existingExercises = yield exercise_model_1.Exercise.countDocuments({
            _id: { $in: exerciseIds },
        });
        if (existingExercises !== exerciseIds.length) {
            throw new errorHandler_middleware_1.customError("One or more exercises do not exist", 400);
        }
    }
    // Update the workout
    const updatedWorkout = yield workout_model_1.Workout.findByIdAndUpdate(workoutId, { name, exercises, notes, date }, { new: true, runValidators: true }).populate("exercises.exercise");
    res.status(200).json({
        status: "Success",
        success: true,
        data: updatedWorkout,
        message: "Workout updated successfully",
    });
}));
//?Delete workout
exports.deleteWorkout = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const workoutId = req.params.id;
    // check if the workout exist and beolngs to the user
    const workout = yield workout_model_1.Workout.findOne({
        user: userId,
        _id: workoutId,
    });
    if (!workout) {
        throw new errorHandler_middleware_1.customError("Workout doesnot exist", 404);
    }
    //DelEte whole workout
    yield workout_model_1.Workout.findByIdAndDelete(workoutId);
    //delete one workout from users workout list
    yield user_model_1.User.findByIdAndUpdate(userId, {
        $pull: { workout: workoutId },
    });
    res.status(201).json({
        status: "success",
        success: true,
        message: "Workout deleted successfully",
    });
}));

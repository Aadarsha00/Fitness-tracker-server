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
exports.deleteExercise = exports.updateExercise = exports.getExerciseById = exports.getAllBodyParts = exports.getAllExercise = exports.createExercise = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const exercise_model_1 = require("../models/exercise.model");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
const global_types_1 = require("../@types/global.types");
//?Create exercise
exports.createExercise = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, bodyPart, instruction } = req.body;
    const userId = req.user._id;
    //checking if the exercise with the same name exist
    const existingExercise = yield exercise_model_1.Exercise.findOne({ name });
    if (existingExercise) {
        throw new errorHandler_middleware_1.customError("Exercise with this name already exist", 400);
    }
    const exercise = yield exercise_model_1.Exercise.create({
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
}));
//?Get all exercise
exports.getAllExercise = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bodyPart } = req.query;
    let query = {};
    if (bodyPart) {
        query = { bodyPart };
    }
    const exercise = yield exercise_model_1.Exercise.find(query).sort({ name: 1 });
    res.status(200).json({
        status: "success",
        success: true,
        data: exercise,
        message: "Exercises fetched successfully",
    });
}));
//?Get all bodyParts
exports.getAllBodyParts = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // distinct will get all unique bodyParts from the exercises collection
    const bodyParts = yield exercise_model_1.Exercise.distinct("bodyPart");
    res.status(200).json({
        status: "success",
        success: true,
        data: bodyParts,
        message: "Body parts fetched successfully",
    });
}));
//?Find exercise by id
exports.getExerciseById = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const exercise = yield exercise_model_1.Exercise.findById(id);
    if (!exercise) {
        throw new errorHandler_middleware_1.customError("Exercise does not exist", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: exercise,
        message: "Exercise fetched successfully",
    });
}));
//?Update exercise
exports.updateExercise = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, bodyPart, instruction } = req.body;
    const userId = req.user._id;
    const exercise = yield exercise_model_1.Exercise.findById(id);
    if (!exercise) {
        throw new errorHandler_middleware_1.customError("Exercise does not exist", 404);
    }
    //only the creator can change their custom exercise
    const isCreator = exercise.createdBy.equals(userId);
    if (!isCreator) {
        throw new errorHandler_middleware_1.customError("Not authorized to access", 403);
    }
    const updatedExercise = yield exercise_model_1.Exercise.findByIdAndUpdate(id, {
        name,
        bodyPart,
        instruction,
    }, { new: true, runValidators: true });
    res.status(200).json({
        status: "success",
        success: true,
        data: updatedExercise,
        message: "Exercise updated successfully",
    });
}));
//?Delete exercise
exports.deleteExercise = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.user._id;
    const exercise = yield exercise_model_1.Exercise.findById(id);
    if (!exercise) {
        throw new errorHandler_middleware_1.customError("Exercise does not exist", 404);
    }
    //Only al;lowing the user who created it to delete it
    const isCreator = exercise.createdBy.toString() === userId.toString();
    const isAdmin = req.user.role === global_types_1.Role.admin;
    if ((!isCreator && exercise.isCustom) || (!exercise.isCustom && !isAdmin)) {
        throw new errorHandler_middleware_1.customError("Unauthorized", 403);
    }
    yield exercise_model_1.Exercise.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
        success: true,
        message: "Exercise deleted successfully",
    });
}));

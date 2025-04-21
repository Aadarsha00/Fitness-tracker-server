"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const workoutSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Workout name is required"],
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    exercises: [
        {
            exercise: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Exercise",
                required: true,
            },
            sets: [
                {
                    weight: {
                        type: Number,
                        min: [0, "Weight cannot be negative"],
                    },
                    reps: {
                        type: Number,
                        min: [0, "Reps cannot be negative"],
                    },
                    notes: {
                        type: String,
                    },
                },
            ],
            duration: {
                type: Number, // in minutes, if applicable
            },
        },
    ],
    notes: {
        type: String,
    },
    bodyWeight: {
        type: Number,
        min: [0, "Body weight cannot be negative"],
    },
}, { timestamps: true });
exports.Workout = mongoose_1.default.model("Workout", workoutSchema);

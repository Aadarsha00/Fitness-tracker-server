import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export const Workout = mongoose.model("Workout", workoutSchema);

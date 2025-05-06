import mongoose, { model } from "mongoose";
import { Role } from "../@types/global.types";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName is required"],
      max: [15, "UserName can't be more than 10 characters."],
      min: [3, "UserName must be more than 3 characters."],
      unique: [true, "Username already exist!"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "User with this email already exist"],
      match: [emailRegex, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [5, "Password must be more than 3 characters"],
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user,
    },
    workout: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    achievement: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);

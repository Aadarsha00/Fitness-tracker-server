import mongoose from "mongoose";
import { BodyPart } from "../@types/global.types";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      unique: true,
    },
    bodyPart: {
      type: String,
      required: [true, "Body Part is required"],
      enum: Object.values(BodyPart),
    },

    instruction: {
      type: String,
      required: [true, "Instructions are required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Exercise = mongoose.model("Exercise", exerciseSchema);

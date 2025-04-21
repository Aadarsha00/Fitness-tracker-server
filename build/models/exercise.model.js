"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const global_types_1 = require("../@types/global.types");
const exerciseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Exercise name is required"],
        unique: true,
    },
    bodyPart: {
        type: String,
        required: [true, "Body Part is required"],
        enum: Object.values(global_types_1.BodyPart),
    },
    instruction: {
        type: String,
        required: [true, "Instructions are required"],
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Exercise = mongoose_1.default.model("Exercise", exerciseSchema);

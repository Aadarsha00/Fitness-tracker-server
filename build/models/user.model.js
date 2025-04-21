"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const global_types_1 = require("../@types/global.types");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: [true, "UserName is required"],
        max: [15, "UserName can't be more than 10 characters."],
        min: [3, "UserName must be more than 3 characters."],
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
        enum: Object.values(global_types_1.Gender),
    },
    role: {
        type: String,
        enum: Object.values(global_types_1.Role),
        default: global_types_1.Role.user,
    },
    workout: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Workout",
        },
    ],
    achievement: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Achievement",
        },
    ],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);

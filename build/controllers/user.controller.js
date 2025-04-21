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
exports.deleteUser = exports.findAllUsers = exports.findUserById = exports.updateUser = exports.loginUser = exports.registerUser = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const user_model_1 = require("../models/user.model");
const jwt_utils_1 = require("../utils/jwt.utils");
//?Sign-up user
exports.registerUser = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.password) {
        throw new errorHandler_middleware_1.customError("Password is required", 404);
    }
    const hashedPassword = yield (0, bcrypt_utils_1.hash)(body.password);
    console.log("🚀 ~ hashedPassword:", hashedPassword);
    body.password = hashedPassword;
    const user = yield user_model_1.User.create(body);
    res.status(201).json({
        status: "Success",
        success: true,
        message: "User created successfully",
        data: user,
    });
}));
//?Login User
exports.loginUser = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        throw new errorHandler_middleware_1.customError("Email is required", 404);
    }
    if (!password) {
        throw new errorHandler_middleware_1.customError("Password is required", 404);
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new errorHandler_middleware_1.customError("user not found", 404);
    }
    const isMatch = yield (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isMatch) {
        throw new errorHandler_middleware_1.customError("Password is required", 404);
    }
    const payload = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
    };
    const token = (0, jwt_utils_1.generateToken)(payload);
    res
        .status(200)
        .cookie("access_token", token, {
        httpOnly: true,
    })
        .json({
        status: "success",
        success: true,
        message: "User logged in successfully",
        data: user,
        token,
    });
}));
//?Update User
exports.updateUser = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.body;
    const id = req.params.id;
    const user = yield user_model_1.User.findByIdAndUpdate(id, {
        userName,
    });
    res.status(200).json({
        status: "success",
        success: true,
        message: "User updated successfully",
        data: user,
    });
}));
//?Find User by id
exports.findUserById = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_model_1.User.findById(id).populate("userName");
    if (!user) {
        throw new errorHandler_middleware_1.customError("user not found", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        message: "User fetched successfully",
        data: user,
    });
}));
//?Find all users
exports.findAllUsers = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find();
    res.status(200).json({
        status: "success",
        success: true,
        data: user,
        message: "All users fetched successfully",
    });
}));
//?Delete Users
exports.deleteUser = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_model_1.User.findByIdAndDelete(id);
    if (!user) {
        throw new errorHandler_middleware_1.customError("User not found", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        message: "User deleted successfully",
    });
}));

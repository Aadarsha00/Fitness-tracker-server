import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { customError } from "../middleware/errorHandler.middleware";
import { comparePassword, hash } from "../utils/bcrypt.utils";
import { User } from "../models/user.model";
import { IPayload } from "../@types/jwt.interface";
import { generateToken } from "../utils/jwt.utils";

//?Sign-up user
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.password) {
      throw new customError("Password is required", 404);
    }
    const hashedPassword = await hash(body.password);
    console.log("🚀 ~ hashedPassword:", hashedPassword);
    body.password = hashedPassword;
    const user = await User.create(body);
    res.status(201).json({
      status: "Success",
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

//?Login User
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    throw new customError("Email is required", 404);
  }
  if (!password) {
    throw new customError("Password is required", 404);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError("user not found", 404);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new customError("Password is required", 404);
  }
  const payload: IPayload = {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    role: user.role,
  };
  const token = generateToken(payload);
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
});

//?Update User
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName } = req.body;
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, {
    userName,
  });
  res.status(200).json({
    status: "success",
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

//?Find User by id
export const findUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await User.findById(id).populate("userName");
    if (!user) {
      throw new customError("user not found", 404);
    }
    res.status(200).json({
      status: "success",
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  }
);

//?Find all users
export const findAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.find();
    res.status(200).json({
      status: "success",
      success: true,
      data: user,
      message: "All users fetched successfully",
    });
  }
);

//?Delete Users
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new customError("User not found", 404);
  }
  res.status(200).json({
    status: "success",
    success: true,
    message: "User deleted successfully",
  });
});

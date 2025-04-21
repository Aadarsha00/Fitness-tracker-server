import express from "express";
import {
  deleteUser,
  findAllUsers,
  findUserById,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { allUser, onlyAdmin } from "../@types/global.types";
const router = express.Router();

//Registering the user
router.post("/", registerUser);

//Login User
router.post("/login", loginUser);

//Get user by id
router.get("/:id", authenticate(allUser), findUserById);

//Get all user
router.get("/", authenticate(onlyAdmin), findAllUsers);

//Delete user
router.delete("/delete/:id", authenticate(onlyAdmin), deleteUser);

export default router;

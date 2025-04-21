"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//Registering the user
router.post("/", user_controller_1.registerUser);
//Login User
router.post("/login", user_controller_1.loginUser);
//Get user by id
router.get("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), user_controller_1.findUserById);
//Get all user
router.get("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), user_controller_1.findAllUsers);
//Delete user
router.delete("/delete/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), user_controller_1.deleteUser);
exports.default = router;

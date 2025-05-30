"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workout_controller_1 = require("../controllers/workout.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//?Create workout
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), workout_controller_1.createWorkout);
//?Get workout by id
router.get("/id/:id", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), workout_controller_1.getWorkOutById);
//?Get users workout
router.get("/user", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), workout_controller_1.getUserWorkOut);
//?Update workout
router.patch("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), workout_controller_1.updateWorkout);
//?DElete workout
router.delete("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), workout_controller_1.deleteWorkout);
exports.default = router;

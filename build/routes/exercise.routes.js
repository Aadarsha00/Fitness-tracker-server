"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exercise_controller_1 = require("../controllers/exercise.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//?Create Exercise
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), exercise_controller_1.createExercise);
//?Get all exercise
router.get("/", exercise_controller_1.getAllExercise);
//?get all bodyparts
router.get("/bodyParts", exercise_controller_1.getAllBodyParts);
//?get exercise by id
router.get("/:id", exercise_controller_1.getExerciseById);
//?Update exercise
router.patch("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), exercise_controller_1.updateExercise);
//?delete exercise
router.delete("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.allUser), exercise_controller_1.deleteExercise);
exports.default = router;

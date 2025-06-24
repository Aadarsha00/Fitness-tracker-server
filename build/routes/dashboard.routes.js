"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
router.use((0, authentication_middleware_1.authenticate)(global_types_1.allUser));
router.get("/workout-summary", dashboard_controller_1.getWorkoutSummary);
router.get("/workout-analytics", dashboard_controller_1.getWorkoutAnalytics);
router.get("/body-part-distribution", dashboard_controller_1.getBodyPartDistribution);
router.get("/body-weight-progress", dashboard_controller_1.getBodyWeightProgress);
router.get("/exercise-performance", dashboard_controller_1.getExercisePerformance);
router.get("/personal-records", dashboard_controller_1.getPersonalRecords);
exports.default = router;

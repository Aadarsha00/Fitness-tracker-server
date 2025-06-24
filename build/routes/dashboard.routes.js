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
// All dashboard routes require authentication
router.use((0, authentication_middleware_1.authenticate)(global_types_1.allUser));
//?Get workout analytics (frequency over time)
router.get("/workout-analytics", dashboard_controller_1.getWorkoutAnalytics);
//?Get body weight progress
router.get("/body-weight-progress", dashboard_controller_1.getBodyWeightProgress);
//?Get exercise performance (strength progression for specific exercise)
router.get("/exercise-performance", dashboard_controller_1.getExercisePerformance);
//?Get body part distribution (pie chart data)
router.get("/body-part-distribution", dashboard_controller_1.getBodyPartDistribution);
//?Get workout summary stats
router.get("/workout-summary", dashboard_controller_1.getWorkoutSummary);
//?Get personal records
router.get("/personal-records", dashboard_controller_1.getPersonalRecords);
exports.default = router;

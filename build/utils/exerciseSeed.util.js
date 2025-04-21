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
const exercise_model_1 = require("../models/exercise.model");
const global_types_1 = require("../@types/global.types");
const connectDatabase_1 = require("../config/connectDatabase");
require("dotenv/config");
// Define seed data
const exercises = [
    // Chest exercises (5)
    {
        name: "Bench Press",
        bodyPart: global_types_1.BodyPart.chest,
        instruction: "Lie on bench, grip bar shoulder-width apart, lower to chest and press up until arms are extended.",
        isCustom: false,
    },
    {
        name: "Push-ups",
        bodyPart: global_types_1.BodyPart.chest,
        instruction: "Start in plank position with hands shoulder-width apart, lower body until chest nearly touches floor, then push back up.",
        isCustom: false,
    },
    {
        name: "Incline Dumbbell Press",
        bodyPart: global_types_1.BodyPart.chest,
        instruction: "Lie on incline bench holding dumbbells at shoulder level, press weights up until arms are extended.",
        isCustom: false,
    },
    {
        name: "Chest Fly",
        bodyPart: global_types_1.BodyPart.chest,
        instruction: "Lie on bench with dumbbells extended above chest, lower weights in arc motion until slight stretch in chest, then return to starting position.",
        isCustom: false,
    },
    {
        name: "Dips",
        bodyPart: global_types_1.BodyPart.chest,
        instruction: "Support body between parallel bars, lower body by bending elbows until shoulders are below elbows, then push back up.",
        isCustom: false,
    },
    // Back exercises (5)
    {
        name: "Pull-ups",
        bodyPart: global_types_1.BodyPart.back,
        instruction: "Hang from bar with hands shoulder-width apart, pull body up until chin is above bar, then lower back down.",
        isCustom: false,
    },
    {
        name: "Bent-over Rows",
        bodyPart: global_types_1.BodyPart.back,
        instruction: "Bend at hips with back straight, pull weight to lower chest, then lower back down with controlled movement.",
        isCustom: false,
    },
    {
        name: "Lat Pulldowns",
        bodyPart: global_types_1.BodyPart.back,
        instruction: "Sit at machine, grip bar wider than shoulder width, pull bar down to chest level, then control movement back up.",
        isCustom: false,
    },
    {
        name: "Deadlift",
        bodyPart: global_types_1.BodyPart.back,
        instruction: "Stand with feet shoulder-width apart, bend at hips and knees to grip bar, drive through heels to stand up straight.",
        isCustom: false,
    },
    {
        name: "Seated Cable Row",
        bodyPart: global_types_1.BodyPart.back,
        instruction: "Sit at cable machine with feet braced, pull handle to waist while keeping back straight, then extend arms to return.",
        isCustom: false,
    },
    // Legs exercises (5)
    {
        name: "Squats",
        bodyPart: global_types_1.BodyPart.legs,
        instruction: "Stand with feet shoulder-width apart, lower body by bending knees and hips as if sitting, then return to standing.",
        isCustom: false,
    },
    {
        name: "Lunges",
        bodyPart: global_types_1.BodyPart.legs,
        instruction: "Step forward with one leg, lower body until both knees form 90° angles, push back to starting position.",
        isCustom: false,
    },
    {
        name: "Leg Press",
        bodyPart: global_types_1.BodyPart.legs,
        instruction: "Sit at machine with feet on platform, push platform away by extending knees, then return to starting position.",
        isCustom: false,
    },
    {
        name: "Leg Curls",
        bodyPart: global_types_1.BodyPart.legs,
        instruction: "Lie face down on machine, hook heels under pad, curl legs toward buttocks, then lower with control.",
        isCustom: false,
    },
    {
        name: "Calf Raises",
        bodyPart: global_types_1.BodyPart.legs,
        instruction: "Stand with balls of feet on edge of step, raise heels as high as possible, then lower below step level.",
        isCustom: false,
    },
    // Arms exercises (5)
    {
        name: "Bicep Curls",
        bodyPart: global_types_1.BodyPart.arms,
        instruction: "Stand with dumbbells at sides, palms facing forward, curl weights toward shoulders, then lower back down.",
        isCustom: false,
    },
    {
        name: "Tricep Dips",
        bodyPart: global_types_1.BodyPart.arms,
        instruction: "Support body between parallel bars, lower body by bending elbows until upper arms are parallel to floor, then push back up.",
        isCustom: false,
    },
    {
        name: "Hammer Curls",
        bodyPart: global_types_1.BodyPart.arms,
        instruction: "Stand with dumbbells at sides, palms facing each other, curl weights toward shoulders without rotating wrists.",
        isCustom: false,
    },
    {
        name: "Tricep Pushdowns",
        bodyPart: global_types_1.BodyPart.arms,
        instruction: "Stand at cable machine, grip bar with hands shoulder-width apart, push bar down until arms are fully extended.",
        isCustom: false,
    },
    {
        name: "Preacher Curls",
        bodyPart: global_types_1.BodyPart.arms,
        instruction: "Sit at preacher bench, rest arms on pad, curl weight up while keeping elbows stationary, then lower with control.",
        isCustom: false,
    },
    // Shoulders exercises (5)
    {
        name: "Overhead Press",
        bodyPart: global_types_1.BodyPart.shoulders,
        instruction: "Stand or sit with weights at shoulder level, press weights overhead until arms are fully extended.",
        isCustom: false,
    },
    {
        name: "Lateral Raises",
        bodyPart: global_types_1.BodyPart.shoulders,
        instruction: "Stand with dumbbells at sides, raise arms out to sides until parallel with floor, then lower with control.",
        isCustom: false,
    },
    {
        name: "Front Raises",
        bodyPart: global_types_1.BodyPart.shoulders,
        instruction: "Stand with dumbbells in front of thighs, raise arms forward until parallel with floor, then lower with control.",
        isCustom: false,
    },
    {
        name: "Shrugs",
        bodyPart: global_types_1.BodyPart.shoulders,
        instruction: "Stand with weights at sides, elevate shoulders toward ears as high as possible, then lower with control.",
        isCustom: false,
    },
    {
        name: "Arnold Press",
        bodyPart: global_types_1.BodyPart.shoulders,
        instruction: "Start with dumbbells at shoulder height with palms facing you, rotate wrists as you press up until palms face forward.",
        isCustom: false,
    },
    // Core exercises (5)
    {
        name: "Crunches",
        bodyPart: global_types_1.BodyPart.core,
        instruction: "Lie on back with knees bent, hands behind head, lift shoulders off floor toward knees, then lower back down.",
        isCustom: false,
    },
    {
        name: "Plank",
        bodyPart: global_types_1.BodyPart.core,
        instruction: "Hold position similar to top of push-up, keeping body in straight line from head to heels.",
        isCustom: false,
    },
    {
        name: "Russian Twists",
        bodyPart: global_types_1.BodyPart.core,
        instruction: "Sit with knees bent and feet off floor, twist torso to tap floor on each side with hands or weight.",
        isCustom: false,
    },
    {
        name: "Leg Raises",
        bodyPart: global_types_1.BodyPart.core,
        instruction: "Lie on back with hands under lower back, raise straight legs until perpendicular to floor, then lower with control.",
        isCustom: false,
    },
    {
        name: "Hanging Knee Raises",
        bodyPart: global_types_1.BodyPart.core,
        instruction: "Hang from pull-up bar, raise knees toward chest while keeping torso stable, then lower with control.",
        isCustom: false,
    },
    // Cardio exercises (5)
    {
        name: "Running",
        bodyPart: global_types_1.BodyPart.cardio,
        instruction: "Move at a steady pace faster than walking, with a moment where both feet are off the ground.",
        isCustom: false,
    },
    {
        name: "Cycling",
        bodyPart: global_types_1.BodyPart.cardio,
        instruction: "Pedal at a consistent pace, adjusting resistance as needed for desired intensity.",
        isCustom: false,
    },
    {
        name: "Jump Rope",
        bodyPart: global_types_1.BodyPart.cardio,
        instruction: "Swing rope over head and under feet, jumping to allow rope to pass beneath feet.",
        isCustom: false,
    },
    {
        name: "Burpees",
        bodyPart: global_types_1.BodyPart.cardio,
        instruction: "Begin standing, drop to squat position, kick feet back to plank, return to squat, then jump up with hands overhead.",
        isCustom: false,
    },
    {
        name: "Rowing Machine",
        bodyPart: global_types_1.BodyPart.cardio,
        instruction: "Push with legs while pulling handle toward waist, then return to starting position with controlled motion.",
        isCustom: false,
    },
];
// Connect to database and seed data
const seedExercises = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDatabase_1.connectDataBase)();
        // Clear existing exercises that aren't custom
        yield exercise_model_1.Exercise.deleteMany({ isCustom: false });
        // Insert seed data
        yield exercise_model_1.Exercise.insertMany(exercises);
        console.log("Database seeded with exercise data!");
        process.exit(0);
    }
    catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
});
seedExercises();

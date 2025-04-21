import { Exercise } from "../models/exercise.model";
import { BodyPart } from "../@types/global.types";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// 1. Load environment variables from correct path
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// 2. Get DB_URL with fallback
const DB_URL =
  process.env.DB_URL || "mongodb://127.0.0.1:27017/Fitness-Tracker";

// 3. Database connection function
const connectDataBase = async () => {
  try {
    await mongoose.connect(DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected for seeding");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
// Define seed data
const exercises = [
  // Chest exercises (5)
  {
    name: "Bench Press",
    bodyPart: BodyPart.chest,
    instruction:
      "Lie on bench, grip bar shoulder-width apart, lower to chest and press up until arms are extended.",
    isCustom: false,
  },
  {
    name: "Push-ups",
    bodyPart: BodyPart.chest,
    instruction:
      "Start in plank position with hands shoulder-width apart, lower body until chest nearly touches floor, then push back up.",
    isCustom: false,
  },
  {
    name: "Incline Dumbbell Press",
    bodyPart: BodyPart.chest,
    instruction:
      "Lie on incline bench holding dumbbells at shoulder level, press weights up until arms are extended.",
    isCustom: false,
  },
  {
    name: "Chest Fly",
    bodyPart: BodyPart.chest,
    instruction:
      "Lie on bench with dumbbells extended above chest, lower weights in arc motion until slight stretch in chest, then return to starting position.",
    isCustom: false,
  },
  {
    name: "Dips",
    bodyPart: BodyPart.chest,
    instruction:
      "Support body between parallel bars, lower body by bending elbows until shoulders are below elbows, then push back up.",
    isCustom: false,
  },

  // Back exercises (5)
  {
    name: "Pull-ups",
    bodyPart: BodyPart.back,
    instruction:
      "Hang from bar with hands shoulder-width apart, pull body up until chin is above bar, then lower back down.",
    isCustom: false,
  },
  {
    name: "Bent-over Rows",
    bodyPart: BodyPart.back,
    instruction:
      "Bend at hips with back straight, pull weight to lower chest, then lower back down with controlled movement.",
    isCustom: false,
  },
  {
    name: "Lat Pulldowns",
    bodyPart: BodyPart.back,
    instruction:
      "Sit at machine, grip bar wider than shoulder width, pull bar down to chest level, then control movement back up.",
    isCustom: false,
  },
  {
    name: "Deadlift",
    bodyPart: BodyPart.back,
    instruction:
      "Stand with feet shoulder-width apart, bend at hips and knees to grip bar, drive through heels to stand up straight.",
    isCustom: false,
  },
  {
    name: "Seated Cable Row",
    bodyPart: BodyPart.back,
    instruction:
      "Sit at cable machine with feet braced, pull handle to waist while keeping back straight, then extend arms to return.",
    isCustom: false,
  },

  // Legs exercises (5)
  {
    name: "Squats",
    bodyPart: BodyPart.legs,
    instruction:
      "Stand with feet shoulder-width apart, lower body by bending knees and hips as if sitting, then return to standing.",
    isCustom: false,
  },
  {
    name: "Lunges",
    bodyPart: BodyPart.legs,
    instruction:
      "Step forward with one leg, lower body until both knees form 90° angles, push back to starting position.",
    isCustom: false,
  },
  {
    name: "Leg Press",
    bodyPart: BodyPart.legs,
    instruction:
      "Sit at machine with feet on platform, push platform away by extending knees, then return to starting position.",
    isCustom: false,
  },
  {
    name: "Leg Curls",
    bodyPart: BodyPart.legs,
    instruction:
      "Lie face down on machine, hook heels under pad, curl legs toward buttocks, then lower with control.",
    isCustom: false,
  },
  {
    name: "Calf Raises",
    bodyPart: BodyPart.legs,
    instruction:
      "Stand with balls of feet on edge of step, raise heels as high as possible, then lower below step level.",
    isCustom: false,
  },

  // Arms exercises (5)
  {
    name: "Bicep Curls",
    bodyPart: BodyPart.arms,
    instruction:
      "Stand with dumbbells at sides, palms facing forward, curl weights toward shoulders, then lower back down.",
    isCustom: false,
  },
  {
    name: "Tricep Dips",
    bodyPart: BodyPart.arms,
    instruction:
      "Support body between parallel bars, lower body by bending elbows until upper arms are parallel to floor, then push back up.",
    isCustom: false,
  },
  {
    name: "Hammer Curls",
    bodyPart: BodyPart.arms,
    instruction:
      "Stand with dumbbells at sides, palms facing each other, curl weights toward shoulders without rotating wrists.",
    isCustom: false,
  },
  {
    name: "Tricep Pushdowns",
    bodyPart: BodyPart.arms,
    instruction:
      "Stand at cable machine, grip bar with hands shoulder-width apart, push bar down until arms are fully extended.",
    isCustom: false,
  },
  {
    name: "Preacher Curls",
    bodyPart: BodyPart.arms,
    instruction:
      "Sit at preacher bench, rest arms on pad, curl weight up while keeping elbows stationary, then lower with control.",
    isCustom: false,
  },

  // Shoulders exercises (5)
  {
    name: "Overhead Press",
    bodyPart: BodyPart.shoulders,
    instruction:
      "Stand or sit with weights at shoulder level, press weights overhead until arms are fully extended.",
    isCustom: false,
  },
  {
    name: "Lateral Raises",
    bodyPart: BodyPart.shoulders,
    instruction:
      "Stand with dumbbells at sides, raise arms out to sides until parallel with floor, then lower with control.",
    isCustom: false,
  },
  {
    name: "Front Raises",
    bodyPart: BodyPart.shoulders,
    instruction:
      "Stand with dumbbells in front of thighs, raise arms forward until parallel with floor, then lower with control.",
    isCustom: false,
  },
  {
    name: "Shrugs",
    bodyPart: BodyPart.shoulders,
    instruction:
      "Stand with weights at sides, elevate shoulders toward ears as high as possible, then lower with control.",
    isCustom: false,
  },
  {
    name: "Arnold Press",
    bodyPart: BodyPart.shoulders,
    instruction:
      "Start with dumbbells at shoulder height with palms facing you, rotate wrists as you press up until palms face forward.",
    isCustom: false,
  },

  // Core exercises (5)
  {
    name: "Crunches",
    bodyPart: BodyPart.core,
    instruction:
      "Lie on back with knees bent, hands behind head, lift shoulders off floor toward knees, then lower back down.",
    isCustom: false,
  },
  {
    name: "Plank",
    bodyPart: BodyPart.core,
    instruction:
      "Hold position similar to top of push-up, keeping body in straight line from head to heels.",
    isCustom: false,
  },
  {
    name: "Russian Twists",
    bodyPart: BodyPart.core,
    instruction:
      "Sit with knees bent and feet off floor, twist torso to tap floor on each side with hands or weight.",
    isCustom: false,
  },
  {
    name: "Leg Raises",
    bodyPart: BodyPart.core,
    instruction:
      "Lie on back with hands under lower back, raise straight legs until perpendicular to floor, then lower with control.",
    isCustom: false,
  },
  {
    name: "Hanging Knee Raises",
    bodyPart: BodyPart.core,
    instruction:
      "Hang from pull-up bar, raise knees toward chest while keeping torso stable, then lower with control.",
    isCustom: false,
  },

  // Cardio exercises (5)
  {
    name: "Running",
    bodyPart: BodyPart.cardio,
    instruction:
      "Move at a steady pace faster than walking, with a moment where both feet are off the ground.",
    isCustom: false,
  },
  {
    name: "Cycling",
    bodyPart: BodyPart.cardio,
    instruction:
      "Pedal at a consistent pace, adjusting resistance as needed for desired intensity.",
    isCustom: false,
  },
  {
    name: "Jump Rope",
    bodyPart: BodyPart.cardio,
    instruction:
      "Swing rope over head and under feet, jumping to allow rope to pass beneath feet.",
    isCustom: false,
  },
  {
    name: "Burpees",
    bodyPart: BodyPart.cardio,
    instruction:
      "Begin standing, drop to squat position, kick feet back to plank, return to squat, then jump up with hands overhead.",
    isCustom: false,
  },
  {
    name: "Rowing Machine",
    bodyPart: BodyPart.cardio,
    instruction:
      "Push with legs while pulling handle toward waist, then return to starting position with controlled motion.",
    isCustom: false,
  },
];

// 4. Seeding function
const seedExercises = async () => {
  try {
    await connectDataBase();

    // Clear existing non-custom exercises
    await Exercise.deleteMany({ isCustom: false });

    // Insert new exercises
    await Exercise.insertMany(exercises);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // Close connection
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the seed
seedExercises();

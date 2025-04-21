import mongoose from "mongoose";
const DB_URL = process.env.DB_URL || "";
export const connectDataBase = () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err: any) => {
      console.log("Error", err);
    });
};

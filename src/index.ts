import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { connectDataBase } from "./config/connectDatabase";
import { customError } from "./middleware/errorHandler.middleware";
import userRoutes from "./routes/user.routes";
import workoutRoutes from "./routes/workout.routes";
import exerciseRoutes from "./routes/exercise.routes";
import dashboardRoutes from "./routes/dashboard.routes";
const PORT = process.env.PORT || "";
import cors from "cors";
const app = express();
//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//? Connecting Mongoose
connectDataBase();

//?Routes
app.use("/api/user", userRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/dashboard", dashboardRoutes);

//? root api
app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});

//?Handler Path not found
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const message = `Can not ${req.method} on ${req.originalUrl}`;
  const error = new customError(message, 404);
  next(error);
});

//?Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || "500";
  const status = error.status || "error";
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({
    status,
    success: false,
    message: message,
  });
});

//? PORT
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

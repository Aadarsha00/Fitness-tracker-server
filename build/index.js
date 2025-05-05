"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const connectDatabase_1 = require("./config/connectDatabase");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const workout_routes_1 = __importDefault(require("./routes/workout.routes"));
const exercise_routes_1 = __importDefault(require("./routes/exercise.routes"));
const PORT = process.env.PORT || "";
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
//middleware
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
//? Connecting Mongoose
(0, connectDatabase_1.connectDataBase)();
//?Routes
app.use("/api/user", user_routes_1.default);
app.use("/api/workout", workout_routes_1.default);
app.use("/api/exercise", exercise_routes_1.default);
//? root api
app.use("/", (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});
//?Handler Path not found
app.all("*", (req, res, next) => {
    const message = `Can not ${req.method} on ${req.originalUrl}`;
    const error = new errorHandler_middleware_1.customError(message, 404);
    next(error);
});
//?Error handler
app.use((error, req, res, next) => {
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

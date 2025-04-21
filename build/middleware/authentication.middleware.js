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
exports.authenticate = void 0;
const errorHandler_middleware_1 = require("./errorHandler.middleware");
const jwt_utils_1 = require("../utils/jwt.utils");
const user_model_1 = require("../models/user.model");
const authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //AuthHeader
            const authHeader = req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("BEARER")) {
                throw new errorHandler_middleware_1.customError("Unauthorized, Authorization header is missing", 404);
            }
            //Access Token
            const accessToken = authHeader.split(" ")[1];
            if (!accessToken) {
                throw new errorHandler_middleware_1.customError("Unauthorized, Access Token is missing", 404);
            }
            //DEcoded
            const decoded = (0, jwt_utils_1.verifyToken)(accessToken);
            console.log("🚀 ~ return ~ decoded:", decoded);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                throw new errorHandler_middleware_1.customError("Unauthorized, Token Expired", 401);
            }
            if (!decoded) {
                throw new errorHandler_middleware_1.customError("Unauthorized, Invalid token", 401);
            }
            const user = yield user_model_1.User.findById(decoded._id);
            if (!user) {
                throw new errorHandler_middleware_1.customError("User not found", 404);
            }
            if (roles && !roles.includes(user.role)) {
                throw new errorHandler_middleware_1.customError(`Forbidden, ${user.role} can not access this resource`, 401);
            }
            req.user = {
                _id: decoded._id,
                userName: decoded.userName,
                email: decoded.email,
                role: decoded.role,
            };
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.authenticate = authenticate;

import { NextFunction, Request, Response } from "express";
import { Role } from "../@types/global.types";
import { customError } from "./errorHandler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import { User } from "../models/user.model";

export const authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //AuthHeader
      const authHeader = req.headers["authorization"] as string;
      if (!authHeader || !authHeader.startsWith("BEARER")) {
        throw new customError(
          "Unauthorized, Authorization header is missing",
          404
        );
      }

      //Access Token
      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        throw new customError("Unauthorized, Access Token is missing", 404);
      }

      //DEcoded
      const decoded = verifyToken(accessToken);
      console.log("🚀 ~ return ~ decoded:", decoded);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new customError("Unauthorized, Token Expired", 401);
      }
      if (!decoded) {
        throw new customError("Unauthorized, Invalid token", 401);
      }
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new customError("User not found", 404);
      }
      if (roles && !roles.includes(user.role)) {
        throw new customError(
          `Forbidden, ${user.role} can not access this resource`,
          401
        );
      }
      req.user = {
        _id: decoded._id,
        userName: decoded.userName,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } catch (err: any) {
      next(err);
    }
  };
};

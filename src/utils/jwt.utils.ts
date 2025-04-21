import jwt, { JwtPayload } from "jsonwebtoken";
import { IPayload } from "../@types/jwt.interface";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN || "1 day";
export const generateToken = (payload: IPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

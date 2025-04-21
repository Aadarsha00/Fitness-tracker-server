import mongoose from "mongoose";
import { Role } from "./global.types";

export interface IPayload {
  _id: mongoose.Types.ObjectId;
  userName: string;
  email: string;
  role: Role;
}

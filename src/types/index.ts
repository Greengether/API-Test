import type { Types } from "mongoose";

export interface JwtPayload {
    userId?: Types.ObjectId;
}

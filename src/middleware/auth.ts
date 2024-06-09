import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index";

dotenv.config();

export type AuthenticatedRequest = Request & JwtPayload

export default function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { accessToken } = req.cookies;
    if (!accessToken)
        return res
            .status(401)
            .json({ message: "No token, authorization denied." });

    const privateKey = process.env.JWT_PRIVATE_KEY;
    if (!privateKey)
        return res.status(500).json({ message: "No JWT private key provided." });
    
    try {
        const decoded = jwt.verify(accessToken, privateKey) as JwtPayload;
        req.userId = decoded.userId;
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
}

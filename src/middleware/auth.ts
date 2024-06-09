import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

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
        const decodedUserId = jwt.verify(accessToken, privateKey) as string;
        req.userId = decodedUserId;
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
}

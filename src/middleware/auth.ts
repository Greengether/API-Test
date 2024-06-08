import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface AuthenticatedRequest extends Request {
    user?: JwtPayload["user"];
}

export default function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header("x-auth-token");
    if (!token)
        return res
            .status(401)
            .json({ message: "No token, authorization denied." });

    const jwtSecret = process.env.JWT_PRIVATE_KEY;
    if (!jwtSecret)
        return res.status(500).json({ message: "No JWT secret key provided." });
    
    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        req.user = decoded.user;
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
}

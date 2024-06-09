import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import { Response } from "express";

const generateAccessToken = (payload: string | object) => {
    const privateKey = process.env.JWT_PRIVATE_KEY;
    if (!privateKey) throw new Error("JWT private key missing.");
    return jwt.sign(payload, privateKey, { expiresIn: "1h" });
};

const generateRefreshToken = (payload: string | object) => {
    const refreshKey = process.env.JWT_REFRESH_KEY;
    if (!refreshKey) throw new Error("JWT refresh key missing.");
    return jwt.sign(payload, refreshKey, { expiresIn: "7d" });
};

export const setJwtCookies = (payload: JwtPayload, res:Response) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
 
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 3600000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 604800000,
    });
} 

export const verifyToken = (token: string, key: string) => jwt.verify(token, key) 
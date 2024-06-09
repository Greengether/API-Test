import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Types } from "mongoose";

dotenv.config();

const router = express.Router();
router.use(cookieParser());

function generateAccessToken(payload: string | object) {
    const privateKey = process.env.JWT_PRIVATE_KEY
    if (!privateKey) throw new Error("JWT private key missing.");
    return jwt.sign(payload, privateKey, { expiresIn: "1h" })
}

function generateRefreshToken(payload: string | object) {
    const refreshKey = process.env.JWT_REFRESH_KEY;
    if (!refreshKey) throw new Error("JWT refresh key missing.");
    return jwt.sign(payload, refreshKey, { expiresIn: "7d"});
}

export interface JwtPayload {
    userId?: Types.ObjectId
}

router.get("/register", async (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ message: "User already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        const payload: JwtPayload = { userId: user._id }
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

        res.redirect('/');
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials." });

        const matchingPasswords = await bcrypt.compare(password, user.password);
        if (!matchingPasswords)
            return res.status(400).json({ message: "Wrong password." });
        
        const payload: JwtPayload = {userId: user._id}
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

        res.redirect('/');
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token provided." });

    try {
        const refreshKey = process.env.JWT_REFRESH_KEY;
        if (!refreshKey) throw new Error("JWT refresh key missing.");
        const decoded = jwt.verify(refreshToken, refreshKey) as JwtPayload;
        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(401).json({ message: "Invalid refresh token." });

        const payload: JwtPayload = {userId: user._id}
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 3600000,
        });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: 604800000,
        });

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

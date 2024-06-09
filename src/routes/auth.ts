import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

dotenv.config();

const router = express.Router();
router.use(cookieParser());

function generateToken(
    payload: string | object,
    key: string,
    expiresIn: string
) {
    return jwt.sign(payload, key, { expiresIn });
}

function generateAccessToken(payload: string | object) {
    const privateKey = process.env.JWT_PRIVATE_KEY
    if (!privateKey) throw new Error("JWT private key missing.");
    return generateToken(payload, privateKey, "1h")
}

function generateRefreshToken(payload: string | object) {
    const refreshKey = process.env.JWT_REFRESH_KEY;
    if (!refreshKey) throw new Error("JWT refresh key missing.");
    return generateToken(payload, refreshKey, "7d");
}
    

router.get("/register", async (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword });
        await user.save();

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 3600000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 604800000,
        });

        res.status(201).json({ accessToken, refreshToken });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials." });

        const matchingPasswords = await bcrypt.compare(password, user.password);
        if (!matchingPasswords)
            return res.status(400).json({ message: "Wrong password." });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 3600000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 604800000,
        });

        res.json({ accessToken, refreshToken });
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
        const decodedUserId = jwt.verify(refreshToken, refreshKey);
        const user = await User.findById(decodedUserId);
        if (!user)
            return res.status(401).json({ message: "Invalid refresh token." });

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

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

import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

dotenv.config();

const router = express.Router();

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
        res.status(201).json(user);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error?.message });
    }
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

        const payload = {
            user: {
                id: user._id,
            },
        };

        const jwtSecret = process.env.JWT_PRIVATE_KEY;
        if (!jwtSecret) throw new Error("No JWT secret provided.");

        jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (error, token) => {
            if (error) throw error;
            res.json(token);
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error?.message });
    }
});

export default router
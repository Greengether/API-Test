import { Request, Response } from "express";
import { setJwtCookies, verifyToken } from "../utils/token";
import { JwtPayload } from "../types";
import { createUser, findUserById, findUserByUsername } from "../services/user";
import { matchingPasswords } from "../services/auth";

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser)
            return res.status(400).json({ message: "User already exists." });

        const user = await createUser(username, password)

        setJwtCookies({userId: user._id}, res)

        res.redirect("/");
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user)
            return res.status(400).json({ message: "Invalid credentials." });

        if (!(await matchingPasswords(password, user.password)))
            return res.status(400).json({ message: "Wrong password." });

        setJwtCookies({userId: user._id}, res)

        res.redirect("/");
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req:Request, res: Response) => {
    
}

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token provided." });

    try {
        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_KEY!) as JwtPayload
        const user = await findUserById(decoded.userId!);
        if (!user)
            return res.status(401).json({ message: "Invalid refresh token." });

        setJwtCookies({ userId: user._id }, res);
        
        res.json({message: "Tokens refreshed."});
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

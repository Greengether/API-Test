import express from "express";
import { register, login, logout, refreshToken } from "../controllers/authController";

const router = express.Router();

router.get("/register", (req, res) => res.render("register"));
router.post("/register", register);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", login);
router.post("/logout", logout)
router.post("/refresh-token", refreshToken);

export default router;

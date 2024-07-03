import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";

const router = express.Router();

router.use("", authRoutes);
router.use("", userRoutes);

export default router;

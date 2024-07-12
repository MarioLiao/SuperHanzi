import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import paymentRoutes from "./payment.js";

const router = express.Router();

router.use("", authRoutes);
router.use("", userRoutes);
router.use("/stripe", paymentRoutes);

export default router;

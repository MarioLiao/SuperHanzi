import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { models } from "../db/models/index.js";

const { User } = models;
const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    await req.user.update({ firstName, lastName });
    res.json({ user: req.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

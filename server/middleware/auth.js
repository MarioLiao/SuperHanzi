import jwt from "jsonwebtoken";
import { models } from "../db/models/index.js";

const { User } = models;

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.sendStatus(403);

    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

import express from "express";
import db from "./db/models/index.js";
const { sequelize } = db;

const app = express();
const port = process.env.PORT || 3000;

const connectDB = async () => {
  console.log("Connecting to database...");
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.get("/", (req, res) => {
  res.send("testing");
});

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();

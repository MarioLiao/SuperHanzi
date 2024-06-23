import express from "express";
// import configure from "./routers";

const app = express();
const port = process.env.PORT || 3000;

// configure(app);

app.get("/", (req, res) => {
  res.send("testing");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

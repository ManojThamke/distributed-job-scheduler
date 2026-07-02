import express from "express";
import pool from "./config/db.postgres.js";
import jobsRouter from "./routes/jobs.routes.js";

const app = express();

app.use(express.json());

app.get("/health", async (req, res) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    status: "ok",
    databaseTime: result.rows[0].now,
  });
});

app.use("/jobs", jobsRouter);

app.listen(3000, () => {
  console.log("API running on port 3000");
});
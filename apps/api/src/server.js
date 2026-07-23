import express from "express";
import pool from "./config/db.postgres.js";
import jobsRouter from "./routes/jobs.routes.js";
import dotenv from "dotenv";
import { connectMongo} from "./config/db.mongo.js";

dotenv.config();

const app = express();
await connectMongo();

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
  console.log(`Server is running on http://localhost:3000`);
});
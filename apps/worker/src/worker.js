import "dotenv/config";
import { connectMongo } from "./config/db.mongo.js";

await connectMongo();

import "./queue/jobs.worker.js";
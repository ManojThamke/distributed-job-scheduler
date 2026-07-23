import { Worker } from "bullmq";
import pool from "../config/db.postgres.js";
import JobPayload from "../models/jobPayload.model.js";
import { emailHandler } from "../handlers/email.handler.js";

const worker = new Worker(
  "jobs",
  async (job) => {
    console.log("\n==================================");
    console.log("📥 Received Job:", job.id);
    console.log(`🔁 Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`);

    try {
      // STEP 1 - Update status to RUNNING
      await pool.query(
        `
        UPDATE jobs
        SET status = 'RUNNING',
            updated_at = NOW()
        WHERE id = $1
        `,
        [job.data.jobId]
      );

      console.log("🟡 Status -> RUNNING");

      // STEP 2 - Get payload_ref from PostgreSQL
      const result = await pool.query(
        `
        SELECT payload_ref
        FROM jobs
        WHERE id = $1
        `,
        [job.data.jobId]
      );

      if (result.rows.length === 0) {
        throw new Error("Job not found in PostgreSQL");
      }

      const payloadRef = result.rows[0].payload_ref;

      console.log("📌 Payload Ref:", payloadRef);

      // STEP 3 - Fetch payload from MongoDB
      const payloadDoc = await JobPayload.findById(payloadRef);

      if (!payloadDoc) {
        throw new Error("Payload not found in MongoDB");
      }

      console.log("📦 Payload Loaded:");
      console.log(payloadDoc.payload);

      // STEP 4 - Route to correct handler
      switch (payloadDoc.jobType) {
        case "SEND_EMAIL":
          await emailHandler(payloadDoc.payload);
          break;

        default:
          throw new Error(`Unknown Job Type: ${payloadDoc.jobType}`);
      }

      // STEP 5 - Update status to COMPLETED
      await pool.query(
        `
        UPDATE jobs
        SET status = 'COMPLETED',
            error_message = NULL,
            updated_at = NOW()
        WHERE id = $1
        `,
        [job.data.jobId]
      );

      console.log("🟢 Status -> COMPLETED");
    } catch (error) {
      console.error("❌ Worker Error:", error.message);

      // If retries are still left
      if (job.attemptsMade + 1 < job.opts.attempts) {
        console.log(
          `🔄 Retrying in a few seconds... (${job.attemptsMade + 1}/${job.opts.attempts})`
        );

        await pool.query(
          `
          UPDATE jobs
          SET status = 'RETRYING',
              error_message = $2,
              updated_at = NOW()
          WHERE id = $1
          `,
          [job.data.jobId, error.message]
        );
      } else {
        // Last retry failed
        await pool.query(
          `
          UPDATE jobs
          SET status = 'FAILED',
              error_message = $2,
              updated_at = NOW()
          WHERE id = $1
          `,
          [job.data.jobId, error.message]
        );

        console.log("🔴 Status -> FAILED");
      }

      // IMPORTANT: Throw the error so BullMQ retries the job
      throw error;
    } finally {
      console.log("==================================\n");
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`✅ BullMQ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(
    `❌ BullMQ Job ${job.id} failed (Attempt ${job.attemptsMade}/${job.opts.attempts})`
  );
});

console.log("🚀 Worker Started");
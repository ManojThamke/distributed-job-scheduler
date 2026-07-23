import {
  createJobRepository,
  getJobByIdRepository,
} from "../repositories/jobs.repository.js";

import jobsQueue from "../queue/bullmq.js";
import JobPayload from "../models/jobPayload.model.js";

export async function createJobService(jobType, priority, payload) {
  console.log("========== CREATE JOB ==========");

  // Step 1: Save payload in MongoDB
  const payloadDoc = await JobPayload.create({
    jobType,
    payload,
  });

  console.log("✅ Payload saved to MongoDB");
  console.log("Payload ID:", payloadDoc._id);

  // Step 2: Save metadata in PostgreSQL
  const job = await createJobRepository(
    jobType,
    priority,
    payloadDoc._id.toString()
  );

  console.log("✅ PostgreSQL Insert Successful");
  console.log("Job ID:", job.id);

  // Step 3: Push job to BullMQ
  const queueJob = await jobsQueue.add(
    "process-job",
    {
      jobId: job.id,
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 3000,
      },

      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log("✅ Added to BullMQ");
  console.log("BullMQ Job ID:", queueJob.id);

  console.log("========== DONE ==========");

  return job;
}

export async function getJobByIdService(id) {
  return await getJobByIdRepository(id);
}
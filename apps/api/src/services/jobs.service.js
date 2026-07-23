import {
  createJobRepository,
  getJobByIdRepository,
} from "../repositories/jobs.repository.js";

import jobsQueue from "../queue/bullmq.js";

export async function createJobService(jobType) {
  try {
    console.log("========== CREATE JOB ==========");

    // Step 1: Save Job in PostgreSQL
    const job = await createJobRepository(jobType);
    console.log("✅ PostgreSQL Insert Successful");
    console.log("Job ID:", job.id);

    // Step 2: Add Job to BullMQ Queue
    console.log("Adding job to BullMQ...");

    const queueJob = await jobsQueue.add(
      "process-job",
      {
        jobId: job.id,
        jobType: job.job_type,
      },
      {
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    console.log("✅ Added to BullMQ");
    console.log("BullMQ Job ID:", queueJob.id);

    console.log("========== DONE ==========");

    return job;
  } catch (error) {
    console.error("❌ Error in createJobService:");
    console.error(error);
    throw error;
  }
}

export async function getJobByIdService(id) {
  return await getJobByIdRepository(id);
}
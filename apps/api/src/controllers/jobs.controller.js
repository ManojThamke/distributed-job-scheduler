import { createJobService, getJobByIdService } from "../services/jobs.service.js";

export async function createJob(req, res) {
  try {
    const { jobType } = req.body;

    if (!jobType) {
      return res.status(400).json({
        error: "jobType is required",
      });
    }

    const job = await createJobService(jobType);

    return res.status(201).json(job);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

export async function getJobById(req, res) {
  try {
    const { id } = req.params;

    const job = await getJobByIdService(id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    return res.json (job);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
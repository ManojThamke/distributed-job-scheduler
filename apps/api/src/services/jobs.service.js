import { createJobRepository, getJobByIdRepository } from '../repositories/jobs.repository.js';

export async function createJobService(jobType) {
    return await createJobRepository(jobType);
}

export async function getJobByIdService(id) {
    return await getJobByIdRepository(id);
}
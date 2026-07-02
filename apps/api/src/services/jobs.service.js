import pool from '../config/db.postgres.js';

export async function createJobService(jobType) {
    const result = await pool.query(
        `INSERT INTO jobs (job_type) 
        VALUES ($1) 
        RETURNING *`,
        [jobType]
    )
    return result.rows[0];
}
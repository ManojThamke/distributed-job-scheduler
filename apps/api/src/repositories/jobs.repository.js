import pool from "../config/db.postgres.js";

export async function createJobRepository(jobType) {
    const result = await pool.query(
        `INSERT INTO jobs (job_type)
        VALUES ($1)
        RETURNING *`,
        [jobType]
    );

    return result.rows[0];
}

export async function getJobByIdRepository(id) {
    const result = await pool.query(
        `SELECT * FROM jobs WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}
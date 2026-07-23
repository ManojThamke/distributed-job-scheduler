import pool from "../config/db.postgres.js";

export async function createJobRepository(jobType, priority, payloadRef) {
    const result = await pool.query(
        `INSERT INTO jobs (job_type, priority, payload_ref)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [jobType, priority, payloadRef]
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
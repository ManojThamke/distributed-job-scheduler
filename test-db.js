import pool from "./apps/api/src/config/db.postgres.js";

const result = await pool.query("SELECT NOW()");

console.log(result.rows);

await pool.end();
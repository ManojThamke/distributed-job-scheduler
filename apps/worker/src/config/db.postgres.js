import {Pool} from 'pg';

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "scheduler_db",
    max: 10,
});

export default pool;
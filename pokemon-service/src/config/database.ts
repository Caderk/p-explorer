import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost', // Change if using a different hostname in Docker
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.PGPORT),
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected database error', err);
    process.exit(-1);
});

export default pool;

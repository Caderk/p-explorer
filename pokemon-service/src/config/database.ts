import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || 'localhost', // Use the env variable; in Docker set POSTGRES_HOST to "pokemon-db"
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.PGPORT) || 5432, // Use 5432 unless you’ve explicitly changed it
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected database error', err);
    process.exit(-1);
});

export default pool;

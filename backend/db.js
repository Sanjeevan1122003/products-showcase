const { Pool } = require('pg');
require('dotenv').config();

class DatabaseConnection {
    constructor() {
        try {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false },
            });
            console.log('Connected to PostgreSQL database');
        } catch (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
    }

    async run(sql, params = []) {
        try {
            const client = await this.pool.connect();
            try {
                const result = await client.query(sql, params);
                return {
                    id: result.rows[0]?.id || result.insertId || null,
                    changes: result.rowCount
                };
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Error executing query:', err.message);
            throw err;
        }
    }

    async get(sql, params = []) {
        try {
            const client = await this.pool.connect();
            try {
                const result = await client.query(sql, params);
                return result.rows[0] || null;
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Error executing query:', err.message);
            throw err;
        }
    }

    async all(sql, params = []) {
        try {
            const client = await this.pool.connect();
            try {
                const result = await client.query(sql, params);
                return result.rows;
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Error executing query:', err.message);
            throw err;
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = new DatabaseConnection();
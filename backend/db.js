const Database = require('better-sqlite3');
const path = require('path');

class DatabaseConnection {
    constructor() {
        try {
            const dbPath = process.env.VERCEL 
                ? '/tmp/products.db' 
                : path.join(__dirname, process.env.DB_NAME || 'products.db');
            
            this.db = new Database(dbPath);
            console.log('Connected to SQLite database at:', dbPath);
        } catch (err) {
            console.error('Error opening database:', err.message);
            throw err;
        }
    }

    async run(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const result = stmt.run(...params);
            return { id: result.lastInsertRowid, changes: result.changes };
        } catch (err) {
            throw err;
        }
    }

    async get(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.get(...params);
        } catch (err) {
            throw err;
        }
    }

    async all(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.all(...params);
        } catch (err) {
            throw err;
        }
    }

    close() {
        this.db.close();
    }
}

module.exports = new DatabaseConnection();
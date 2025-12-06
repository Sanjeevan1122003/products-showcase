require('dotenv').config();
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function executeSQLScript(sql) {
    const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
        await db.run(statement + ';');
    }
}

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        
        const schema = fs.readFileSync(path.join(__dirname, './schema.sql'), 'utf8');
        await executeSQLScript(schema);
        console.log('Schema created successfully.');

        const seed = fs.readFileSync(path.join(__dirname, './seed.sql'), 'utf8');
        await executeSQLScript(seed);
        console.log('Seed data inserted successfully.');

        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
        if (!process.env.VERCEL) {
            throw error;
        }
    } finally {
        if (!process.env.VERCEL) {
            db.close();
        }
    }
}

if (!process.env.VERCEL || process.env.RUN_SEEDING) {
    seedDatabase();
}
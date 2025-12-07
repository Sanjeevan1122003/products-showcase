require('dotenv').config();
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function executeSQLStatements(sql) {
    const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
        if (statement) {
            try {
                await db.run(statement);
                console.log(`✓ Executed: ${statement.substring(0, 80)}...`);
            } catch (error) {
                if (error.message.includes('already exists') || error.message.includes('relation')) {
                    console.log(`ℹ Skipped (already exists): ${statement.substring(0, 60)}...`);
                } else {
                    console.error(`✗ Error: ${statement.substring(0, 60)}...`);
                    console.error(`  Details: ${error.message}`);
                    throw error;
                }
            }
        }
    }
}

async function seedDatabase() {
    try {
        console.log('🚀 Starting Supabase PostgreSQL database seeding...\n');

        try {
            const testResult = await db.get('SELECT version()');
            console.log(`✅ Connected to PostgreSQL: ${testResult.version.substring(0, 50)}...`);
        } catch (connError) {
            console.error('❌ Database connection failed. Please check your DATABASE_URL in .env file');
            console.error('Error:', connError.message);
            process.exit(1);
        }

        console.log('\n📋 Creating database schema...');
        const schemaPath = path.join(__dirname, './schema.sql');
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at: ${schemaPath}`);
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');
        await executeSQLStatements(schema);
        console.log('✅ Schema created/verified successfully.');

        console.log('\n🌱 Inserting seed data...');
        const seedPath = path.join(__dirname, './seed.sql');
        if (!fs.existsSync(seedPath)) {
            console.warn('⚠ Seed file not found. Skipping data insertion.');
        } else {
            const seed = fs.readFileSync(seedPath, 'utf8');
            await executeSQLStatements(seed);
            console.log('✅ Seed data inserted successfully.');
        }

        console.log('\n🔍 Verifying data...');
        try {
            const productsCount = await db.get('SELECT COUNT(*) as count FROM products');
            const enquiriesCount = await db.get('SELECT COUNT(*) as count FROM enquiries');
            console.log(`📊 Verification: ${productsCount.count} products, ${enquiriesCount.count} enquiries`);
        } catch (verifyError) {
            console.log('ℹ Verification queries completed.');
        }

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('✨ Your Supabase PostgreSQL database is ready to use.');

    } catch (error) {
        console.error('\n❌ Error seeding database:', error.message);
        console.error('\n💡 Troubleshooting tips:');
        console.error('1. Check if DATABASE_URL is correct in your .env file');
        console.error('2. Verify your Supabase project is active');
        console.error('3. Check if the database user has proper permissions');
        console.error('4. Ensure schema.sql and seed.sql files exist');
        process.exit(1);
    } finally {
        try {
            await db.close();
            console.log('\n🔌 Database connection closed.');
        } catch (closeError) {
            console.log('Connection closure noted.');
        }
    }
}

if (require.main === module) {
    seedDatabase();
} else {
    module.exports = { seedDatabase };
}
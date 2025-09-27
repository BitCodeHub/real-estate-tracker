const db = require('./db');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
    try {
        console.log('Applying RentCast data migration...');
        
        // Read the migration SQL
        const migrationSQL = fs.readFileSync(path.join(__dirname, 'migration-add-rentcast-data.sql'), 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                await db.pool.query(statement);
            }
        }
        
        console.log('✅ Migration applied successfully!');
        console.log('The rentcast_data column has been added to store comprehensive property data.');
        
    } catch (error) {
        console.error('❌ Error applying migration:', error);
        console.error('You may need to apply the migration manually.');
    } finally {
        // Close the connection pool
        await db.pool.end();
        process.exit(0);
    }
}

// Run the migration
applyMigration();
const db = require('./db');

async function applyMigration() {
    console.log('Applying database migration to add rentcast_data column...');
    
    try {
        // Check if the column already exists
        const columnCheck = await db.pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'properties' 
            AND column_name = 'rentcast_data'
        `);
        
        if (columnCheck.rows.length > 0) {
            console.log('✅ rentcast_data column already exists');
        } else {
            console.log('Adding rentcast_data column...');
            
            // Add the column
            await db.pool.query(`
                ALTER TABLE properties 
                ADD COLUMN rentcast_data JSONB
            `);
            
            console.log('✅ rentcast_data column added successfully');
            
            // Add the GIN index
            await db.pool.query(`
                CREATE INDEX IF NOT EXISTS idx_properties_rentcast_data 
                ON properties USING GIN (rentcast_data)
            `);
            
            console.log('✅ JSONB index created successfully');
        }
        
        // Test the column by trying to insert a test property
        console.log('\nTesting database with a sample insert...');
        const testResult = await db.pool.query(`
            INSERT INTO properties (
                address, city, state, zip, 
                purchase_price, monthly_rent,
                rentcast_data
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) ON CONFLICT (address) DO UPDATE 
            SET city = EXCLUDED.city
            RETURNING id, address
        `, [
            'TEST_PROPERTY_' + Date.now(),
            'Test City',
            'NV',
            '89101',
            100000,
            1000,
            JSON.stringify({test: true})
        ]);
        
        console.log('✅ Test insert successful, property ID:', testResult.rows[0].id);
        
        // Clean up test property
        await db.pool.query('DELETE FROM properties WHERE id = $1', [testResult.rows[0].id]);
        console.log('✅ Test property cleaned up');
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('The database is now ready to save new properties.');
        
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.error('Full error:', error);
        
        if (error.code === '42703') {
            console.log('\nThis error suggests the column might already exist or there\'s a syntax issue.');
        } else if (error.code === '42P01') {
            console.log('\nThe properties table does not exist. Running full schema initialization...');
            await db.initialize();
        }
    } finally {
        process.exit(0);
    }
}

// Run the migration
applyMigration();
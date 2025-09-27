// Script to fix existing properties that might have incorrect field names
const db = require('./db');

async function fixExistingProperties() {
    try {
        console.log('Fixing existing properties with RentCast data...');
        
        // Get all properties
        const result = await db.pool.query('SELECT id, rentcast_data FROM properties WHERE rentcast_data IS NOT NULL');
        const properties = result.rows;
        
        console.log(`Found ${properties.length} properties with RentCast data`);
        
        for (const property of properties) {
            if (property.rentcast_data) {
                const data = property.rentcast_data;
                
                // Check if we need to update the main columns
                if (data.bedrooms || data.bathrooms || data.squareFootage) {
                    console.log(`Updating property ${property.id}`);
                    
                    await db.pool.query(`
                        UPDATE properties 
                        SET 
                            bedrooms = COALESCE($1, bedrooms),
                            bathrooms = COALESCE($2, bathrooms),
                            square_footage = COALESCE($3, square_footage)
                        WHERE id = $4
                    `, [
                        data.bedrooms,
                        data.bathrooms,
                        data.squareFootage,
                        property.id
                    ]);
                }
            }
        }
        
        console.log('✅ Properties fixed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing properties:', error);
    } finally {
        await db.pool.end();
        process.exit(0);
    }
}

// Run the fix
fixExistingProperties();
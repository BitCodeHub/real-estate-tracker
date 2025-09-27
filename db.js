const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const connectionString = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'realestate'}`;

// Create connection pool
const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('render.com') ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
    // Don't exit in production if no database
    if (process.env.NODE_ENV !== 'production') {
        process.exit(-1);
    }
});

// Initialize database schema
async function initializeDatabase() {
    try {
        // Check if properties table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'properties'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.log('Creating database schema...');
            const fs = require('fs');
            const path = require('path');
            const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
            
            // Split by semicolon and execute each statement
            const statements = schema.split(';').filter(stmt => stmt.trim());
            for (const statement of statements) {
                if (statement.trim()) {
                    await pool.query(statement);
                }
            }
            console.log('Database schema created successfully');
        } else {
            console.log('Database schema already exists');
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

// Property CRUD operations
const db = {
    // Get all properties
    async getAllProperties(filters = {}) {
        try {
            let query = 'SELECT * FROM properties WHERE status != $1';
            const params = ['deleted'];
            let paramCount = 1;

            // Add filters
            if (filters.city) {
                paramCount++;
                query += ` AND LOWER(city) = LOWER($${paramCount})`;
                params.push(filters.city);
            }

            if (filters.state) {
                paramCount++;
                query += ` AND LOWER(state) = LOWER($${paramCount})`;
                params.push(filters.state);
            }

            if (filters.minCashFlow) {
                paramCount++;
                query += ` AND cash_flow >= $${paramCount}`;
                params.push(filters.minCashFlow);
            }

            if (filters.maxPrice) {
                paramCount++;
                query += ` AND purchase_price <= $${paramCount}`;
                params.push(filters.maxPrice);
            }

            query += ' ORDER BY created_at DESC';

            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    },

    // Get single property by ID
    async getPropertyById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM properties WHERE id = $1 AND status != $2',
                [id, 'deleted']
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching property:', error);
            throw error;
        }
    },

    // Create new property
    async createProperty(propertyData) {
        try {
            const {
                address, city, state, zip, purchasePrice, monthlyRent,
                hoa, propertyTax, insurance, managementFees, repairs,
                vacancy, capex, mortgage, cocReturn, rentToValue, capRate,
                crimeScore, floodRisk, marketRisk, bedrooms, bathrooms,
                squareFootage, yearBuilt, lotSize, propertyType, county,
                rentEstimate, valueEstimate, status, notes, lastUpdated, dataSource,
                // Extract all other data for JSONB storage
                ...otherData
            } = propertyData;

            // Prepare comprehensive RentCast data for JSONB storage
            const rentcastData = {
                // Property features
                stories: otherData.stories,
                garage: otherData.garage,
                pool: otherData.pool,
                fireplace: otherData.fireplace,
                basement: otherData.basement,
                airConditioning: otherData.airConditioning,
                heating: otherData.heating,
                // Construction details
                foundation: otherData.foundation,
                roofType: otherData.roofType,
                exteriorWall: otherData.exteriorWall,
                architecturalStyle: otherData.architecturalStyle,
                // Owner info
                ownerName: otherData.ownerName,
                ownerType: otherData.ownerType,
                ownerOccupied: otherData.ownerOccupied,
                // Tax data
                taxAssessedValue: otherData.taxAssessedValue,
                taxAssessedYear: otherData.taxAssessedYear,
                // Market data
                marketData: otherData.marketData,
                // Any other real-time data
                realTimeData: otherData.realTimeData,
                lastUpdated: lastUpdated || new Date().toISOString(),
                dataSource: dataSource || 'manual',
                // Store any additional fields not explicitly defined in schema
                ...Object.keys(otherData).reduce((acc, key) => {
                    if (!['stories', 'garage', 'pool', 'fireplace', 'basement', 'airConditioning', 
                          'heating', 'foundation', 'roofType', 'exteriorWall', 'architecturalStyle',
                          'ownerName', 'ownerType', 'ownerOccupied', 'taxAssessedValue', 
                          'taxAssessedYear', 'marketData', 'realTimeData'].includes(key)) {
                        acc[key] = otherData[key];
                    }
                    return acc;
                }, {})
            };

            const result = await pool.query(`
                INSERT INTO properties (
                    address, city, state, zip, purchase_price, monthly_rent,
                    hoa, property_tax, insurance, management_fees, repairs,
                    vacancy, capex, mortgage, coc_return, rent_to_value, cap_rate,
                    crime_score, flood_risk, market_risk, bedrooms, bathrooms,
                    square_footage, year_built, lot_size, property_type, county,
                    rent_estimate, value_estimate, status, notes, last_updated, data_source,
                    rentcast_data
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
                    $27, $28, $29, $30, $31, $32, $33
                ) RETURNING *`,
                [
                    address, city, state, zip, purchasePrice, monthlyRent,
                    hoa || 0, propertyTax || 0, insurance || 0, managementFees || 0,
                    repairs || 0, vacancy || 0, capex || 0, mortgage || 0,
                    cocReturn, rentToValue, capRate, crimeScore, floodRisk,
                    marketRisk, bedrooms, bathrooms, squareFootage, yearBuilt,
                    lotSize, propertyType, county, rentEstimate, valueEstimate,
                    status || 'active', notes, lastUpdated, dataSource,
                    JSON.stringify(rentcastData) // PostgreSQL will convert to JSONB
                ]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error creating property:', error);
            throw error;
        }
    },

    // Update property
    async updateProperty(id, propertyData) {
        try {
            const updateFields = [];
            const values = [];
            let paramCount = 1;
            
            // Separate RentCast-specific data
            const rentcastFields = ['stories', 'garage', 'pool', 'fireplace', 'basement', 
                                  'airConditioning', 'heating', 'foundation', 'roofType', 
                                  'exteriorWall', 'architecturalStyle', 'ownerName', 'ownerType', 
                                  'ownerOccupied', 'taxAssessedValue', 'taxAssessedYear', 
                                  'marketData', 'realTimeData'];
            
            const rentcastData = {};
            const regularFields = {};

            // Separate fields
            Object.keys(propertyData).forEach(key => {
                if (rentcastFields.includes(key)) {
                    rentcastData[key] = propertyData[key];
                } else if (!['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'].includes(key)) {
                    regularFields[key] = propertyData[key];
                }
            });

            // Build dynamic update query for regular fields
            Object.keys(regularFields).forEach(key => {
                // Convert camelCase to snake_case
                const dbField = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                updateFields.push(`${dbField} = $${paramCount}`);
                values.push(regularFields[key]);
                paramCount++;
            });
            
            // Add rentcast_data if there's any RentCast-specific data
            if (Object.keys(rentcastData).length > 0) {
                // Merge with existing rentcast_data
                updateFields.push(`rentcast_data = 
                    CASE 
                        WHEN rentcast_data IS NULL THEN $${paramCount}::jsonb
                        ELSE rentcast_data || $${paramCount}::jsonb
                    END`);
                values.push(JSON.stringify(rentcastData));
                paramCount++;
            }

            values.push(id); // Add id as last parameter

            const query = `
                UPDATE properties 
                SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = $${paramCount}
                RETURNING *
            `;

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    },

    // Delete property (soft delete)
    async deleteProperty(id) {
        try {
            const result = await pool.query(
                'UPDATE properties SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
                ['deleted', id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting property:', error);
            throw error;
        }
    },

    // Get property statistics
    async getPropertyStats() {
        try {
            const result = await pool.query(`
                SELECT 
                    COUNT(*) as total_properties,
                    SUM(purchase_price) as total_investment,
                    AVG(cash_flow) as avg_cash_flow,
                    SUM(cash_flow) as total_cash_flow,
                    AVG(coc_return) as avg_coc_return,
                    COUNT(CASE WHEN cash_flow > 0 THEN 1 END) as profitable_properties,
                    COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_properties
                FROM properties
                WHERE status != 'deleted'
            `);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    // Test connection
    async testConnection() {
        try {
            const result = await pool.query('SELECT 1');
            return true;
        } catch (error) {
            console.error('Database connection test failed:', error.message);
            return false;
        }
    },

    // Initialize database on startup
    initialize: initializeDatabase,

    // Export pool for raw queries if needed
    pool
};

module.exports = db;
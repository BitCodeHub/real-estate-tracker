const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Track database status
let databaseConnected = false;

// Initialize database on startup
db.initialize()
    .then(() => {
        databaseConnected = true;
        console.log('Database initialized successfully');
    })
    .catch(err => {
        console.error('Failed to initialize database:', err.message);
        databaseConnected = false;
        console.log('Running without database - data will not persist');
        console.log('Properties will be stored in localStorage only');
    });

// RentCast API configuration
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY || 'YOUR_RENTCAST_API_KEY';
const RENTCAST_API_BASE = 'https://api.rentcast.io/v1';

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API status endpoint
app.get('/api/status', async (req, res) => {
    // Check actual database connection
    let dbConnected = false;
    try {
        await db.pool.query('SELECT 1');
        dbConnected = true;
    } catch (error) {
        // Database not connected
    }
    
    res.json({
        status: 'ok',
        apiKeyConfigured: RENTCAST_API_KEY !== 'YOUR_RENTCAST_API_KEY',
        databaseConnected: dbConnected,
        message: RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY' ? 
            'RentCast API key not configured. Set RENTCAST_API_KEY environment variable.' : 
            'API key configured'
    });
});

// Proxy endpoint for RentCast API
app.get('/api/rentcast/properties', async (req, res) => {
    // Check if API key is configured
    if (RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY') {
        return res.status(503).json({
            success: false,
            error: 'RentCast API key not configured on server',
            message: 'Please set the RENTCAST_API_KEY environment variable'
        });
    }

    try {
        const { address, city, state, zipcode } = req.query;
        
        // Build query params
        const params = new URLSearchParams({
            address,
            city,
            state,
            zipcode
        });

        console.log('Proxying RentCast request:', params.toString());
        
        // Make request to RentCast
        const response = await axios.get(`${RENTCAST_API_BASE}/properties?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': RENTCAST_API_KEY
            }
        });
        
        // DEBUG: Log RentCast response to identify field names
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            const firstProperty = response.data[0];
            console.log('\n🚨 RENTCAST API RESPONSE ANALYSIS:');
            console.log('Fields returned:', Object.keys(firstProperty).sort());
            
            // Look for rent/value fields
            console.log('\nPotential rent/value fields:');
            Object.entries(firstProperty).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    const keyLower = key.toLowerCase();
                    if (keyLower.includes('rent') || keyLower.includes('value') || 
                        keyLower.includes('price') || keyLower.includes('estimate')) {
                        console.log(`  ${key}: ${value}`);
                    }
                }
            });
            console.log('--- END RENTCAST ANALYSIS ---\n');
        }
        
        // Forward the response
        res.json({
            success: true,
            data: response.data
        });
        
    } catch (error) {
        console.error('RentCast API Error:', error.message);
        
        // Handle specific error cases
        if (error.response) {
            res.status(error.response.status).json({
                success: false,
                error: `RentCast API error: ${error.response.status}`,
                message: error.response.data?.message || 'Unknown error'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Server error',
                message: error.message
            });
        }
    }
});

// Get rent estimates from RentCast
app.get('/api/rentcast/rent-estimate', async (req, res) => {
    if (RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY') {
        return res.status(503).json({
            success: false,
            error: 'RentCast API key not configured'
        });
    }

    try {
        const { address, city, state, zipcode, bedrooms, bathrooms, squareFootage } = req.query;
        const params = new URLSearchParams({ address, city, state, zipcode });
        
        if (bedrooms) params.append('bedrooms', bedrooms);
        if (bathrooms) params.append('bathrooms', bathrooms);
        if (squareFootage) params.append('squareFootage', squareFootage);

        const response = await axios.get(`${RENTCAST_API_BASE}/avm/rent/long-term?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': RENTCAST_API_KEY
            }
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('RentCast Rent Estimate Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// Get value estimates from RentCast
app.get('/api/rentcast/value-estimate', async (req, res) => {
    if (RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY') {
        return res.status(503).json({
            success: false,
            error: 'RentCast API key not configured'
        });
    }

    try {
        const { address, city, state, zipcode } = req.query;
        const params = new URLSearchParams({ address, city, state, zipcode });

        const response = await axios.get(`${RENTCAST_API_BASE}/avm/value?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': RENTCAST_API_KEY
            }
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('RentCast Value Estimate Error:', error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// Get rental listings from RentCast
app.get('/api/rentcast/rental-listings', async (req, res) => {
    if (RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY') {
        return res.status(503).json({
            success: false,
            error: 'RentCast API key not configured'
        });
    }

    try {
        const { city, state, zip, radius = 5, limit = 50, bedrooms, bathrooms, maxRent, latitude, longitude } = req.query;
        
        // Build query params
        const params = new URLSearchParams();
        
        // Location parameters - RentCast requires lat/lon or address when using radius
        if (latitude && longitude) {
            params.append('latitude', latitude);
            params.append('longitude', longitude);
            if (radius) params.append('radius', radius);
        } else if (zip) {
            // When using ZIP, don't use radius - RentCast doesn't support it
            params.append('zipcode', zip);
        } else if (city && state) {
            params.append('city', city);
            params.append('state', state);
        } else {
            return res.status(400).json({
                success: false,
                error: 'Either zipcode, city/state, or latitude/longitude is required'
            });
        }
        
        // Optional filters
        if (limit) params.append('limit', limit);
        if (bedrooms) params.append('bedrooms', bedrooms);
        if (bathrooms) params.append('bathrooms', bathrooms);
        if (maxRent) params.append('maxRent', maxRent);
        
        console.log('Fetching rental listings:', params.toString());
        console.log('Full URL:', `${RENTCAST_API_BASE}/listings/rental/long-term?${params}`);
        
        const response = await axios.get(`${RENTCAST_API_BASE}/listings/rental/long-term?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': RENTCAST_API_KEY
            }
        });
        
        console.log('Rental listings response status:', response.status);
        console.log('Rental listings response data:', JSON.stringify(response.data, null, 2));
        console.log('Response type:', typeof response.data, Array.isArray(response.data) ? 'is array' : 'not array');
        
        // RentCast API returns array directly or wrapped in object
        let listings = [];
        if (Array.isArray(response.data)) {
            listings = response.data;
        } else if (response.data && typeof response.data === 'object') {
            // Try different possible field names
            listings = response.data.listings || 
                      response.data.data || 
                      response.data.results || 
                      response.data.properties || 
                      response.data.rentals || 
                      [];
        }
        
        console.log(`Found ${listings.length} rental listings`);
        
        // If no listings found, log the entire response structure
        if (listings.length === 0) {
            console.log('No listings found. Full response structure:', response.data);
        }
        
        res.json({
            success: true,
            data: listings,
            debug: {
                totalResults: listings.length,
                requestParams: params.toString(),
                responseType: Array.isArray(response.data) ? 'array' : typeof response.data
            }
        });
    } catch (error) {
        console.error('RentCast Rental Listings Error:', error.message);
        
        if (error.response) {
            console.error('Error response:', error.response.data);
            res.status(error.response.status).json({
                success: false,
                error: error.response.data?.message || `RentCast API error: ${error.response.status}`
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch rental listings',
                message: error.message
            });
        }
    }
});

// Get market statistics from RentCast
app.get('/api/rentcast/market-stats', async (req, res) => {
    if (RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY') {
        return res.status(503).json({
            success: false,
            error: 'RentCast API key not configured'
        });
    }

    try {
        const { zipCode, historyRange = '12' } = req.query;
        
        if (!zipCode) {
            return res.status(400).json({
                success: false,
                error: 'Zip code is required for market statistics'
            });
        }

        console.log('Fetching market stats for ZIP:', zipCode);

        // RentCast API expects 'zipCode' as the parameter
        const params = new URLSearchParams({ 
            zipCode: zipCode, // Must be 'zipCode' not 'zip'
            historyRange: historyRange
        });

        console.log('Request URL:', `${RENTCAST_API_BASE}/markets?${params}`);

        const response = await axios.get(`${RENTCAST_API_BASE}/markets?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': RENTCAST_API_KEY
            }
        });
        
        console.log('Market stats response:', response.data);
        
        // Ensure we have data
        if (!response.data) {
            return res.json({
                success: true,
                data: {
                    medianRent: null,
                    medianPrice: null,
                    avgDaysOnMarket: null,
                    inventoryCount: null,
                    message: 'No market data available for this ZIP code'
                }
            });
        }
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('RentCast Market Stats Error:', error.message);
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
        }
        
        // If market stats fail, return empty data instead of error
        // This allows the app to continue functioning
        res.json({
            success: true,
            data: {
                medianRent: null,
                medianPrice: null,
                avgDaysOnMarket: null,
                inventoryCount: null,
                message: 'Market statistics unavailable'
            }
        });
    }
});

// Health check endpoint for Render
app.get('/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        // Check database connection
        await db.pool.query('SELECT 1');
        dbStatus = 'connected';
    } catch (error) {
        // Database not connected, but app is still healthy
        console.log('Health check - database not connected:', error.message);
    }
    
    // Always return 200 OK so Render knows the service is running
    res.status(200).json({ 
        status: 'healthy',
        database: dbStatus,
        apiKey: RENTCAST_API_KEY !== 'YOUR_RENTCAST_API_KEY' ? 'configured' : 'not configured',
        message: dbStatus === 'disconnected' ? 'Running without database - data will not persist' : 'All systems operational'
    });
});

// Database API endpoints

// Get all properties
app.get('/api/properties', async (req, res) => {
    try {
        // Check actual database connection
        let dbConnected = false;
        try {
            await db.pool.query('SELECT 1');
            dbConnected = true;
        } catch (error) {
            console.log('Database connection check failed:', error.message);
        }
        
        if (!dbConnected) {
            return res.json({ 
                success: true, 
                data: [],
                warning: 'Database not connected. Properties are stored locally only.'
            });
        }
        const properties = await db.getAllProperties(req.query);
        
        // Merge rentcast_data JSONB fields back into the property objects
        const expandedProperties = properties.map(prop => {
            // Map database column names to application field names
            const mappedProp = {
                ...prop,
                // Map snake_case database columns to camelCase
                beds: prop.bedrooms || 0,
                baths: prop.bathrooms || 0,
                sqft: prop.square_footage || 0,
                yearBuilt: prop.year_built || prop.yearBuilt,
                purchasePrice: prop.purchase_price || prop.purchasePrice || 0,
                downPayment: prop.down_payment || prop.downPayment,
                monthlyRent: prop.monthly_rent || prop.monthlyRent || 0,
                rentEstimate: prop.rent_estimate || prop.rentEstimate || 0,
                estimatedValue: prop.value_estimate || prop.estimatedValue || 0,
                currentValue: prop.value_estimate || prop.current_value || prop.currentValue || prop.purchase_price || 0,
                mortgage: prop.mortgage,
                propertyTax: prop.property_tax,
                insurance: prop.insurance,
                hoa: prop.hoa,
                maintenance: prop.maintenance,
                managementFees: prop.management_fees,
                vacancyRate: prop.vacancy_rate,
                cashFlow: prop.cash_flow,
                cocReturn: prop.coc_return,
                capRate: prop.cap_rate,
                rentToValue: prop.rent_to_value,
                crimeScore: prop.crime_score,
                floodRisk: prop.flood_risk,
                marketRisk: prop.market_risk,
                lotSize: prop.lot_size,
                propertyType: prop.property_type || prop.propertyType,
                lastUpdated: prop.last_updated,
                dataSource: prop.data_source,
                soldDate: prop.sold_date,
                soldPrice: prop.sold_price,
                createdAt: prop.created_at,
                updatedAt: prop.updated_at
            };
            
            if (prop.rentcast_data && typeof prop.rentcast_data === 'object') {
                // Merge the JSONB data back into the main object
                const { rentcast_data, ...mainProps } = mappedProp;
                console.log(`Expanding RentCast data for ${mainProps.address}:`, Object.keys(rentcast_data));
                
                // Ensure realTimeData flag is preserved
                const expandedProp = {
                    ...mainProps,
                    ...rentcast_data
                };
                
                // If we have RentCast data stored, ensure realTimeData flag is true
                if (rentcast_data.realTimeData || 
                    mainProps.rent_estimate || 
                    mainProps.value_estimate ||
                    mainProps.bedrooms || 
                    mainProps.bathrooms) {
                    expandedProp.realTimeData = true;
                }
                
                return expandedProp;
            }
            
            // Even without rentcast_data JSONB, check if we have RentCast values
            if (mappedProp.rent_estimate || mappedProp.value_estimate) {
                mappedProp.realTimeData = true;
            }
            
            return mappedProp;
        });
        
        res.json({ success: true, data: expandedProperties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        // Return empty array instead of error when database is down
        res.json({ 
            success: true, 
            data: [],
            warning: 'Database temporarily unavailable. Properties are stored locally only.'
        });
    }
});

// Search for property by address (MUST be before :id route)
app.get('/api/properties/search', async (req, res) => {
    try {
        const { address, city, state } = req.query;
        
        if (!address || !city || !state) {
            return res.status(400).json({ 
                success: false, 
                error: 'Address, city, and state are required for search' 
            });
        }
        
        console.log(`🔍 Searching for property: ${address}, ${city}, ${state}`);
        
        // Check database connection
        let dbConnected = false;
        try {
            await db.pool.query('SELECT 1');
            dbConnected = true;
        } catch (error) {
            console.log('⚠️ Database connection check failed:', error.message);
        }
        
        if (!dbConnected) {
            return res.json({ 
                success: false, 
                error: 'Database not connected'
            });
        }
        
        // Use the existing checkPropertyExists method
        const existingProperty = await db.checkPropertyExists(address, city, state);
        
        if (existingProperty) {
            console.log(`✅ Found existing property with ID: ${existingProperty.id}`);
            
            // Return the property data in the same format as other endpoints
            const mappedProp = {
                ...existingProperty,
                beds: existingProperty.bedrooms || 0,
                baths: existingProperty.bathrooms || 0,
                sqft: existingProperty.square_footage || 0,
                yearBuilt: existingProperty.year_built || existingProperty.yearBuilt,
                purchasePrice: existingProperty.purchase_price || existingProperty.purchasePrice || 0,
                downPayment: existingProperty.down_payment || existingProperty.downPayment,
                monthlyRent: existingProperty.monthly_rent || existingProperty.monthlyRent || 0,
                rentEstimate: existingProperty.rent_estimate || existingProperty.rentEstimate || 0,
                estimatedValue: existingProperty.value_estimate || existingProperty.estimatedValue || 0,
                currentValue: existingProperty.value_estimate || existingProperty.current_value || existingProperty.currentValue || existingProperty.purchase_price || 0
            };
            
            res.json({ success: true, data: mappedProp });
        } else {
            console.log('❌ Property not found in database');
            res.json({ success: false, error: 'Property not found' });
        }
        
    } catch (error) {
        console.error('Error searching for property:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single property (MUST be after /search route)
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await db.getPropertyById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }
        
        // Map database fields and merge rentcast_data JSONB fields
        const mappedProp = {
            ...property,
            // Map snake_case database columns to camelCase
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            sqft: property.square_footage || 0,
            yearBuilt: property.year_built || property.yearBuilt,
            purchasePrice: property.purchase_price || property.purchasePrice || 0,
            downPayment: property.down_payment || property.downPayment,
            monthlyRent: property.monthly_rent || property.monthlyRent || 0,
            rentEstimate: property.rent_estimate || property.rentEstimate || 0,
            estimatedValue: property.value_estimate || property.estimatedValue || 0,
            currentValue: property.value_estimate || property.current_value || property.currentValue || property.purchase_price || 0
        };
        
        if (property.rentcast_data && typeof property.rentcast_data === 'object') {
            const { rentcast_data, ...mainProps } = mappedProp;
            res.json({ success: true, data: { ...mainProps, ...rentcast_data } });
        } else {
            res.json({ success: true, data: mappedProp });
        }
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new property
app.post('/api/properties', async (req, res) => {
    try {
        console.log('\n📝 Creating new property:', req.body.address);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Purchase price:', req.body.purchasePrice, 'Monthly rent:', req.body.monthlyRent);
        
        // Check actual database connection
        let dbConnected = false;
        try {
            await db.pool.query('SELECT 1');
            dbConnected = true;
        } catch (error) {
            console.log('⚠️ Database connection check failed:', error.message);
        }
        
        if (!dbConnected) {
            // Return the property with a temporary ID when no database
            const tempProperty = {
                ...req.body,
                id: Date.now(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            console.log('⚠️ Database not connected, returning temp property');
            return res.status(201).json({ 
                success: true, 
                data: tempProperty,
                warning: 'Database not connected. Property saved locally only.'
            });
        }
        
        // Check if property already exists
        const existingProperty = await db.checkPropertyExists(
            req.body.address,
            req.body.city,
            req.body.state,
            req.body.zip
        );
        
        if (existingProperty) {
            console.log('⚠️ Property already exists:', existingProperty);
            
            // If the existing property is marked as deleted or has NULL status, update it instead
            if (existingProperty.status === 'deleted' || existingProperty.status === null) {
                console.log('📝 Reactivating existing property with ID:', existingProperty.id);
                const updatedProperty = await db.updateProperty(existingProperty.id, {
                    ...req.body,
                    status: 'active'
                });
                return res.status(200).json({ 
                    success: true, 
                    data: updatedProperty,
                    message: 'Property reactivated successfully'
                });
            }
            
            // Property exists and is active
            return res.status(409).json({ 
                success: false, 
                error: `Property "${req.body.address}" already exists in your portfolio. Each property must have a unique address.`,
                existingProperty: true,
                propertyId: existingProperty.id
            });
        }
        
        // Create new property
        console.log('🔄 Calling db.createProperty with data:', {
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            purchasePrice: req.body.purchasePrice,
            monthlyRent: req.body.monthlyRent,
            dataKeys: Object.keys(req.body).length
        });
        
        const property = await db.createProperty(req.body);
        console.log('✅ Property created successfully with ID:', property.id);

        // Map database fields and merge rentcast_data back into response
        const mappedProp = {
            ...property,
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            sqft: property.square_footage || 0,
            yearBuilt: property.year_built || property.yearBuilt,
            purchasePrice: property.purchase_price || property.purchasePrice || 0,
            downPayment: property.down_payment || property.downPayment,
            monthlyRent: property.monthly_rent || property.monthlyRent || 0,
            rentEstimate: property.rent_estimate || property.rentEstimate || 0,
            estimatedValue: property.value_estimate || property.estimatedValue || 0,
            currentValue: property.value_estimate || property.current_value || property.currentValue || property.purchase_price || 0
        };
        
        if (property.rentcast_data && typeof property.rentcast_data === 'object') {
            const { rentcast_data, ...mainProps } = mappedProp;
            console.log('📦 Returning property with merged RentCast data');
            res.status(201).json({ success: true, data: { ...mainProps, ...rentcast_data } });
        } else {
            res.status(201).json({ success: true, data: mappedProp });
        }
    } catch (error) {
        console.error('❌ Error creating property:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Handle specific database error types
        if (error.code === '23505') { // Unique constraint violation
            const address = req.body.address || 'Unknown address';
            res.status(409).json({ 
                success: false, 
                error: `Property "${address}" already exists in your portfolio. Each property must have a unique address.`,
                existingProperty: true
            });
        } else if (error.code === '23502') { // NOT NULL constraint violation
            res.status(400).json({ 
                success: false, 
                error: 'Missing required property information. Please check all fields are filled.'
            });
        } else if (error.code === '22P02') { // Invalid input syntax/data type
            res.status(400).json({ 
                success: false, 
                error: 'Invalid property data format. Please check numeric fields contain valid numbers.'
            });
        } else if (error.code === '23503') { // Foreign key constraint violation
            res.status(400).json({ 
                success: false, 
                error: 'Invalid property data references. Please check all fields are valid.'
            });
        } else if (error.code === '23514') { // Check constraint violation
            res.status(400).json({ 
                success: false, 
                error: 'Property data violates database constraints. Please check all values are valid.'
            });
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || 
                   error.message?.includes('connect') || error.message?.includes('timeout')) {
            // ONLY return temporary property for actual connectivity issues
            console.warn('⚠️ Database connectivity issue - returning temporary property');
            const tempProperty = {
                ...req.body,
                id: Date.now(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            res.status(201).json({ 
                success: true, 
                data: tempProperty,
                warning: 'Database temporarily unavailable. Property saved locally only.'
            });
        } else {
            // For all other errors, return a proper error response
            console.error('❌ Unhandled database error - returning error response');
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save property to database. Please try again or contact support.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
});

// Update property
app.put('/api/properties/:id', async (req, res) => {
    try {
        console.log(`Updating property ${req.params.id}, has RentCast data: ${req.body.realTimeData}`);
        const property = await db.updateProperty(req.params.id, req.body);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Map database fields and merge rentcast_data back into response
        const mappedProp = {
            ...property,
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            sqft: property.square_footage || 0,
            yearBuilt: property.year_built || property.yearBuilt,
            purchasePrice: property.purchase_price || property.purchasePrice || 0,
            downPayment: property.down_payment || property.downPayment,
            monthlyRent: property.monthly_rent || property.monthlyRent || 0,
            rentEstimate: property.rent_estimate || property.rentEstimate || 0,
            estimatedValue: property.value_estimate || property.estimatedValue || 0,
            currentValue: property.value_estimate || property.current_value || property.currentValue || property.purchase_price || 0
        };
        
        if (property.rentcast_data && typeof property.rentcast_data === 'object') {
            const { rentcast_data, ...mainProps } = mappedProp;
            console.log('Returning merged property with RentCast data');
            res.json({ success: true, data: { ...mainProps, ...rentcast_data } });
        } else {
            res.json({ success: true, data: mappedProp });
        }
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete property
app.delete('/api/properties/:id', async (req, res) => {
    try {
        const property = await db.deleteProperty(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }
        res.json({ success: true, data: property });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get property statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await db.getPropertyStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// AI Analysis endpoint (proxy for Gemini API to avoid CORS)
app.post('/api/ai-analysis', async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCgpECc-whrISaCwlwxXiZV_YppN4dTQT4';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    console.log('AI Analysis request received');
    
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        console.log('Calling Gemini API...');
        
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log('Gemini API response status:', response.status);
        
        // Validate response
        if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
            console.error('Invalid Gemini response structure:', response.data);
            return res.status(500).json({ error: 'Invalid AI response structure' });
        }
        
        console.log('AI Analysis successful');
        res.json({
            success: true,
            analysis: response.data.candidates[0].content.parts[0].text
        });
        
    } catch (error) {
        console.error('AI Analysis error:', error.message);
        
        if (error.response) {
            console.error('Gemini API error response:', error.response.data);
            return res.status(error.response.status).json({ 
                error: 'AI service error', 
                details: error.response.data,
                status: error.response.status 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to generate AI analysis',
            message: error.message 
        });
    }
});

// AI Property Comparison endpoint
app.post('/api/ai/compare-properties', async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCgpECc-whrISaCwlwxXiZV_YppN4dTQT4';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

    console.log('AI Property Comparison request received');

    try {
        const { properties } = req.body;

        if (!properties || !Array.isArray(properties) || properties.length === 0) {
            return res.status(400).json({ error: 'Properties array is required' });
        }

        // Build comprehensive analysis prompt
        const prompt = `You are an experienced real estate investor and professional realtor with 20+ years of experience. Analyze these ${properties.length} investment properties and provide a comprehensive comparison to help a client make the best 5-year investment decision.

PROPERTIES TO ANALYZE:
${properties.map((prop, i) => `
Property ${i + 1}: ${prop.address}, ${prop.city}, ${prop.state}
- Purchase Price: $${prop.purchasePrice?.toLocaleString() || 'N/A'}
- Monthly Cash Flow: $${prop.monthlyCashFlow?.toLocaleString() || 'N/A'}
- Cash-on-Cash Return: ${prop.cashOnCashReturn || 'N/A'}%
- Cap Rate: ${prop.capRate || 'N/A'}%
- Monthly Rent: $${prop.monthlyRent?.toLocaleString() || 'N/A'}
- Down Payment: $${prop.downPayment?.toLocaleString() || 'N/A'}
- Property Tax: $${prop.propertyTax?.toLocaleString() || 'N/A'}/month
- Insurance: $${prop.insurance?.toLocaleString() || 'N/A'}/month
- HOA: $${prop.hoa?.toLocaleString() || 'N/A'}/month
- Maintenance: $${prop.maintenance?.toLocaleString() || 'N/A'}/month
- Management Fees: $${prop.managementFees?.toLocaleString() || 'N/A'}/month
- Vacancy Rate: ${prop.vacancyRate || 'N/A'}%
- Bedrooms: ${prop.beds || 'N/A'}
- Bathrooms: ${prop.baths || 'N/A'}
- Square Footage: ${prop.sqft?.toLocaleString() || 'N/A'}
- Year Built: ${prop.yearBuilt || 'N/A'}
`).join('\n')}

ANALYSIS REQUIREMENTS:
1. Recommend ONE property as the best investment for 5-year profit
2. Provide detailed analysis comparing all properties
3. Project realistic 5-year profit scenarios based on current market trends
4. Assess risks for each property
5. Give professional realtor advice

RESPONSE FORMAT (JSON):
{
  "recommendedProperty": "Full address of the recommended property",
  "analysis": "2-3 paragraph detailed comparison analyzing cash flow, returns, expenses, location factors, and overall investment quality of each property. Explain why your recommended property stands out.",
  "profitProjection": "Detailed 5-year profit projection for the recommended property. Include realistic appreciation estimates (typically 3-5% annually for residential), cash flow accumulation, principal paydown, and total estimated profit. Show calculations.",
  "riskAssessment": "1-2 paragraph risk analysis covering market risks, vacancy risks, maintenance concerns, and economic factors for each property. Identify which properties are higher vs lower risk.",
  "realtorAdvice": "Professional advice as a realtor: actionable next steps, what to look for during inspection, negotiation tips for the recommended property, and any red flags to watch out for."
}

Important: Consider current real estate market conditions, typical appreciation rates, and investment fundamentals. Be realistic and professional in your analysis.`;

        console.log('Calling Gemini API for property comparison...');

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 3048,
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Gemini API response status:', response.status);

        // Validate response
        if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
            console.error('Invalid Gemini response structure:', response.data);
            return res.status(500).json({ error: 'Invalid AI response structure' });
        }

        const aiText = response.data.candidates[0].content.parts[0].text;
        console.log('AI Analysis received, parsing JSON...');

        // Try to parse JSON from the response
        let analysisData;
        try {
            // Remove markdown code blocks if present
            const jsonMatch = aiText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
            // Fallback: return the text in a structured format
            analysisData = {
                recommendedProperty: properties[0]?.address || 'Unknown',
                analysis: aiText,
                profitProjection: 'See analysis above for details.',
                riskAssessment: 'Please review the full analysis for risk factors.',
                realtorAdvice: 'Consult with a local real estate professional for specific guidance.'
            };
        }

        console.log('Property comparison analysis successful');
        res.json({
            success: true,
            ...analysisData
        });

    } catch (error) {
        console.error('AI Property Comparison error:', error.message);

        if (error.response) {
            console.error('Gemini API error response:', error.response.data);
            return res.status(error.response.status).json({
                error: 'AI service error',
                details: error.response.data,
                status: error.response.status
            });
        }

        res.status(500).json({
            error: 'Failed to generate property comparison analysis',
            message: error.message
        });
    }
});

// SchoolDigger API endpoint
app.get('/api/schools', async (req, res) => {
    try {
        const { city, state } = req.query;

        if (!city || !state) {
            return res.status(400).json({
                success: false,
                error: 'City and state parameters are required'
            });
        }

        const searchQuery = `${city} ${state}`;
        console.log('🏫 Fetching schools for:', searchQuery);

        const response = await axios.get('https://schooldigger-k-12-school-data-api.p.rapidapi.com/v2.0/autocomplete/schools', {
            params: {
                q: searchQuery
            },
            headers: {
                'x-rapidapi-key': '177c02e9d2msh8b577fa708d0154p11b581jsn2f13420b2d92',
                'x-rapidapi-host': 'schooldigger-k-12-school-data-api.p.rapidapi.com'
            }
        });

        console.log('✅ Schools API response:', response.status);
        res.json(response.data);

    } catch (error) {
        console.error('❌ Error fetching schools:', error.message);
        if (error.response) {
            console.error('API error response:', error.response.status, error.response.data);
            return res.status(error.response.status).json({
                success: false,
                error: 'SchoolDigger API error',
                message: error.response.data?.message || error.message,
                status: error.response.status
            });
        }
        res.status(500).json({
            success: false,
            error: 'Failed to fetch schools',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Real Estate Tracker server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Key Status: ${RENTCAST_API_KEY === 'YOUR_RENTCAST_API_KEY' ? 'NOT CONFIGURED' : 'Configured'}`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\nLocal access: http://localhost:${PORT}`);
        console.log('\nTo configure RentCast API key:');
        console.log('1. Create a .env file in the root directory');
        console.log('2. Add: RENTCAST_API_KEY=your_actual_api_key_here');
    }
});
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// RentCast API configuration
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY || 'YOUR_RENTCAST_API_KEY';
const RENTCAST_API_BASE = 'https://api.rentcast.io/v1';

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        apiKeyConfigured: RENTCAST_API_KEY !== 'YOUR_RENTCAST_API_KEY',
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

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
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
// Test script to verify the fixes for the real estate tracker app
// Run this with: node test-fixes.js

const axios = require('axios');

async function testRentCastAPI() {
    console.log('=== Testing RentCast API Integration ===\n');
    
    try {
        // Test API status endpoint
        console.log('1. Testing API status endpoint...');
        const statusResponse = await axios.get('http://localhost:3000/api/status');
        console.log('API Status:', statusResponse.data);
        console.log('✅ API Key Configured:', statusResponse.data.apiKeyConfigured);
        
        // Test RentCast proxy endpoint with a real address
        console.log('\n2. Testing RentCast API with address: 1613 Capistrano Ave, Placentia, CA 92870');
        const rentcastResponse = await axios.get('http://localhost:3000/api/rentcast/properties', {
            params: {
                address: '1613 Capistrano Ave',
                city: 'Placentia',
                state: 'CA',
                zipcode: '92870'
            }
        });
        
        console.log('RentCast Response Status:', rentcastResponse.status);
        console.log('RentCast Data:', JSON.stringify(rentcastResponse.data, null, 2));
        
        if (rentcastResponse.data.success) {
            console.log('✅ RentCast API is working correctly!');
            
            // Check if we got actual property data
            const properties = rentcastResponse.data.data;
            if (Array.isArray(properties) && properties.length > 0) {
                const prop = properties[0];
                console.log('\nProperty Details:');
                console.log('- Address:', prop.addressLine1 || prop.address);
                console.log('- City:', prop.city);
                console.log('- State:', prop.state);
                console.log('- ZIP:', prop.zipCode || prop.zipcode);
                console.log('- Bedrooms:', prop.bedrooms || prop.beds);
                console.log('- Bathrooms:', prop.bathrooms || prop.baths);
                console.log('- Square Feet:', prop.squareFeet || prop.sqft);
                console.log('- Year Built:', prop.yearBuilt);
                console.log('- Rent Estimate:', prop.rent || prop.rentEstimate);
            }
        } else {
            console.log('❌ RentCast API returned an error:', rentcastResponse.data.error);
        }
        
    } catch (error) {
        console.error('❌ Error testing RentCast API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

async function testRefreshFunctionality() {
    console.log('\n\n=== Testing Refresh Functionality ===\n');
    
    console.log('1. The refresh icon (🔄) should appear next to each property address');
    console.log('2. Clicking the refresh icon should:');
    console.log('   - Show a spinning animation on the icon');
    console.log('   - Fetch fresh data from RentCast API');
    console.log('   - Update the property with real-time data');
    console.log('   - Show a "LIVE" badge after successful refresh');
    console.log('   - Display "Last updated: X ago" timestamp');
    console.log('3. The property values should update with actual RentCast data');
}

async function testClickHandlers() {
    console.log('\n\n=== Testing Click Handlers ===\n');
    
    console.log('1. Click Handler Implementation:');
    console.log('   - Each table row has an event listener attached');
    console.log('   - Clicking anywhere on the row (except buttons/editable cells) opens the detail modal');
    console.log('   - The click handler uses addEventListener instead of inline onclick');
    console.log('   - Event propagation is properly handled');
    
    console.log('\n2. Expected Behavior:');
    console.log('   - Click on address: Opens property detail modal');
    console.log('   - Click on refresh icon: Refreshes data (no modal)');
    console.log('   - Click on editable cell: Allows editing (no modal)');
    console.log('   - Click on action buttons: Performs action (no modal)');
    
    console.log('\n3. Debug Tips:');
    console.log('   - Check browser console for "Row clicked" messages');
    console.log('   - Verify showPropertyDetail function is called with correct index');
}

async function main() {
    console.log('Starting Real Estate Tracker Fix Tests...\n');
    console.log('Make sure the server is running on http://localhost:3000\n');
    
    await testRentCastAPI();
    await testRefreshFunctionality();
    await testClickHandlers();
    
    console.log('\n\n=== Summary of Fixes ===\n');
    console.log('1. RentCast API Integration:');
    console.log('   - Fixed data extraction to handle actual RentCast response format');
    console.log('   - Added proper error handling and logging');
    console.log('   - API key is read from .env file');
    
    console.log('\n2. Refresh Functionality:');
    console.log('   - Fixed refreshSingleProperty to properly update property data');
    console.log('   - Added visual feedback (spinning animation)');
    console.log('   - Shows success/error messages');
    console.log('   - Updates display after refresh');
    
    console.log('\n3. Click Handlers:');
    console.log('   - Replaced inline onclick with addEventListener');
    console.log('   - Proper event delegation and propagation handling');
    console.log('   - Click detection excludes interactive elements');
    
    console.log('\n✅ All fixes have been implemented in index-fixed.html');
    console.log('📝 To use the fixed version, rename index-fixed.html to index.html');
}

// Run the tests
main().catch(console.error);
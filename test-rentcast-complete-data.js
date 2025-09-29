// Test script to show what RentCast data fields are available
// Run this in browser console to see all the data captured

console.log('🧪 Testing RentCast Complete Data Extraction\n');

// Find a property with RentCast data
const propertyWithData = properties.find(p => p.realTimeData && p.rentcastCache);

if (propertyWithData) {
    console.log('✅ Found property with RentCast data:', propertyWithData.address);
    console.log('\n📊 ALL AVAILABLE RENTCAST FIELDS:\n');
    
    // Group fields by category for better visualization
    const categories = {
        'Basic Info': ['beds', 'baths', 'sqft', 'yearBuilt', 'propertyType', 'county'],
        'Pricing': ['rentEstimate', 'rentRangeLow', 'rentRangeHigh', 'estimatedValue', 'priceRangeLow', 'priceRangeHigh'],
        'Property Features': ['pool', 'garage', 'basement', 'fireplace', 'stories', 'lotSize', 'airConditioning', 'heating'],
        'Construction': ['foundation', 'roofType', 'exteriorWall', 'architecturalStyle'],
        'Tax & Assessment': ['taxAssessedValue', 'taxAssessedYear', 'propertyTaxes'],
        'Owner Info': ['ownerName', 'ownerType', 'ownerOccupied'],
        'Sale History': ['lastSaleDate', 'lastSalePrice'],
        'Market Data': ['daysOnMarket', 'listingDate']
    };
    
    // Display each category
    Object.entries(categories).forEach(([category, fields]) => {
        console.log(`\n🏷️ ${category}:`);
        fields.forEach(field => {
            const value = propertyWithData[field];
            if (value !== undefined && value !== null) {
                console.log(`  • ${field}: ${value}`);
            }
        });
    });
    
    // Show all fields not in categories
    console.log('\n📦 Additional Fields:');
    const categorizedFields = Object.values(categories).flat();
    Object.keys(propertyWithData).forEach(key => {
        if (!categorizedFields.includes(key) && 
            !['id', 'address', 'city', 'state', 'zip', 'purchasePrice', 'monthlyRent'].includes(key) &&
            propertyWithData[key] !== undefined && 
            propertyWithData[key] !== null &&
            !key.startsWith('_')) {
            console.log(`  • ${key}: ${JSON.stringify(propertyWithData[key])}`);
        }
    });
    
    // Show cache info
    if (propertyWithData.rentcastCache) {
        console.log('\n⏱️ Cache Information:');
        console.log(`  • Cached at: ${new Date(propertyWithData.rentcastCache.timestamp).toLocaleString()}`);
        console.log(`  • API calls made: ${propertyWithData.apiCallCount || 1}`);
    }
    
} else {
    console.log('❌ No properties with RentCast data found.');
    console.log('💡 Click the refresh icon (🔄) on any property to fetch complete data from RentCast.');
}

// Instructions for manual testing
console.log('\n📝 TESTING INSTRUCTIONS:');
console.log('1. Click the refresh icon (🔄) on any property in the table');
console.log('2. Watch the browser console for extraction logs');
console.log('3. Click on the property row to see all data in the modal');
console.log('4. Look for new sections: Property Features, Tax & Sales History, Owner Info, etc.');
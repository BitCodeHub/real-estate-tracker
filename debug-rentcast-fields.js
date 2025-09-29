// Debug script to identify all RentCast API fields
// Run this in the browser console after clicking refresh on a property

console.log('\n🔍 RENTCAST API FIELD DEBUGGER\n');
console.log('Instructions: Click the refresh icon on any property, then check the console output\n');

// Override the fetchRentCastData function to capture raw API response
const originalFetch = window.fetchRentCastData;
window.fetchRentCastData = async function(...args) {
    const result = await originalFetch.apply(this, args);
    
    if (result && result.success && result.data) {
        console.log('\n📡 RAW RENTCAST API RESPONSE CAPTURED!\n');
        console.log('🔑 All field names:', Object.keys(result.data).sort());
        
        // Group fields by category for easier analysis
        const fields = result.data;
        const categories = {
            'Value/Price Fields': [],
            'Rent Fields': [],
            'Property Details': [],
            'Tax Fields': [],
            'Owner Fields': [],
            'Other Fields': []
        };
        
        Object.entries(fields).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            
            const keyLower = key.toLowerCase();
            const entry = `${key}: ${JSON.stringify(value)}`;
            
            if (keyLower.includes('value') || keyLower.includes('price') || keyLower.includes('estimate')) {
                categories['Value/Price Fields'].push(entry);
            } else if (keyLower.includes('rent')) {
                categories['Rent Fields'].push(entry);
            } else if (keyLower.includes('tax') || keyLower.includes('assess')) {
                categories['Tax Fields'].push(entry);
            } else if (keyLower.includes('owner')) {
                categories['Owner Fields'].push(entry);
            } else if (['beds', 'baths', 'sqft', 'bedrooms', 'bathrooms', 'squareFootage', 
                        'yearBuilt', 'propertyType', 'lotSize'].includes(key)) {
                categories['Property Details'].push(entry);
            } else {
                categories['Other Fields'].push(entry);
            }
        });
        
        // Display categorized fields
        Object.entries(categories).forEach(([category, fields]) => {
            if (fields.length > 0) {
                console.log(`\n📂 ${category}:`);
                fields.forEach(field => console.log(`  • ${field}`));
            }
        });
        
        // Check for the specific missing fields
        console.log('\n🎯 CRITICAL FIELD CHECK:');
        const criticalFields = {
            'estimatedValue': ['estimatedValue', 'value', 'price', 'valueEstimate', 'priceEstimate', 
                              'marketValue', 'currentValue', 'assessedValue'],
            'rentEstimate': ['rentEstimate', 'rent', 'monthlyRent', 'estimatedRent', 
                           'rentValue', 'rentEst', 'estimatedMonthlyRent']
        };
        
        Object.entries(criticalFields).forEach(([targetField, possibleNames]) => {
            console.log(`\n🔍 Looking for ${targetField}:`);
            let found = false;
            possibleNames.forEach(name => {
                if (fields[name] !== undefined && fields[name] !== null) {
                    console.log(`  ✅ Found as "${name}": ${fields[name]}`);
                    found = true;
                }
            });
            if (!found) {
                console.log('  ❌ Not found in any expected field name');
            }
        });
        
        console.log('\n💾 Full raw data structure:');
        console.log(JSON.stringify(result.data, null, 2));
    }
    
    return result;
};

console.log('✅ Debug mode activated! Now click the refresh icon on any property.');
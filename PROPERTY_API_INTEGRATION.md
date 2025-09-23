# Real Estate Property API Integration Guide

## Overview
This guide explains how to integrate real property data APIs to automatically fetch accurate property information including beds, baths, square feet, and listing prices when adding properties to your portfolio tracker.

## Current Implementation
The tracker currently uses:
- **OpenStreetMap Nominatim API** for geocoding addresses (free, no API key required)
- **Location-based estimates** for property details based on city/state

## Recommended Real Estate APIs

### 1. **Zillow API** (Most Comprehensive)
- **Data Available**: Property details, Zestimate, rental Zestimate, comparables, tax history
- **Cost**: Requires approval, limited free tier
- **Integration Example**:
```javascript
async function fetchZillowData(address) {
    const ZWSID = 'YOUR_ZILLOW_API_KEY';
    const url = `https://www.zillow.com/webservice/GetSearchResults.htm?zws-id=${ZWSID}&address=${encodeURIComponent(address)}`;
    // Note: Zillow API requires XML parsing
    const response = await fetch(url);
    const xmlText = await response.text();
    // Parse XML to extract property data
}
```

### 2. **RentBerry API**
- **Data Available**: Rental estimates, neighborhood data, property characteristics
- **Cost**: Free tier available (100 requests/month)
- **Best For**: Rental property analysis
- **Sign Up**: https://rentberry.com/api

### 3. **Realty Mole API**
- **Data Available**: Property details, rental estimates, comparables, sale listings
- **Cost**: $29/month for 1,000 requests
- **Best For**: Comprehensive property data
- **Documentation**: https://realtymole.com/api

### 4. **Estated API**
- **Data Available**: Property characteristics, ownership, tax assessments, deed history
- **Cost**: $0.01 per property lookup
- **Best For**: Detailed property characteristics
- **Sign Up**: https://estated.com/api

### 5. **Rentometer API**
- **Data Available**: Rental comparables and market analysis
- **Cost**: Starting at $39/month
- **Best For**: Accurate rental estimates
- **Documentation**: https://www.rentometer.com/api

## Implementation Steps

### Step 1: Choose and Sign Up for an API
1. Evaluate your needs (rental focus vs. property details)
2. Consider your budget and usage volume
3. Sign up and obtain API credentials

### Step 2: Update the fetch functions
Replace the estimation logic in `fetchPropertyDetails()` with actual API calls:

```javascript
async function fetchPropertyDetails(locationData) {
    // Example with Realty Mole API
    const API_KEY = 'YOUR_API_KEY';
    const address = `${locationData.streetNumber} ${locationData.streetName}, ${locationData.city}, ${locationData.state} ${locationData.zip}`;
    
    try {
        const response = await fetch(`https://api.realtymole.com/properties`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY
            },
            body: JSON.stringify({ address: address })
        });
        
        const data = await response.json();
        
        return {
            beds: data.bedrooms || 3,
            baths: data.bathrooms || 2,
            sqft: data.squareFootage || 1500,
            year: data.yearBuilt || 2000,
            price: data.price || data.estimatedValue || 400000,
            rentEstimate: data.rentEstimate || 2500,
            propertyType: data.propertyType || 'Single Family',
            taxRate: (data.taxAssessment / data.price * 100) || 1.2,
            lastSoldPrice: data.lastSoldPrice,
            lastSoldDate: data.lastSoldDate
        };
    } catch (error) {
        console.error('API Error:', error);
        // Return default estimates as fallback
        return getDefaultEstimates(locationData);
    }
}
```

### Step 3: Handle API Keys Securely
For production use, never expose API keys in client-side code:

1. **Option A**: Use a backend proxy
```javascript
// Instead of calling API directly, call your backend
const response = await fetch('/api/property-lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: address })
});
```

2. **Option B**: Use environment variables with a build process
```javascript
const API_KEY = process.env.REACT_APP_REALTY_API_KEY;
```

### Step 4: Add Error Handling and Fallbacks
Always include fallback logic when APIs fail:

```javascript
async function getPropertyData(address) {
    try {
        // Try primary API
        const data = await fetchPrimaryAPI(address);
        if (data.success) return data;
    } catch (error) {
        console.log('Primary API failed, trying backup...');
    }
    
    try {
        // Try backup API
        const data = await fetchBackupAPI(address);
        if (data.success) return data;
    } catch (error) {
        console.log('Backup API failed, using estimates...');
    }
    
    // Fall back to estimates
    return generateEstimates(address);
}
```

## API Response Mapping

Most APIs return different field names. Here's a mapping guide:

| Your Field | Zillow | Realty Mole | Estated |
|------------|---------|-------------|---------|
| beds | bedrooms | bedrooms | total_bath_count |
| baths | bathrooms | bathrooms | total_bath_count |
| sqft | finishedSqFt | squareFootage | total_area_sq_ft |
| year | yearBuilt | yearBuilt | year_built |
| price | zestimate | price | market_value |

## Testing Your Integration

1. Test with known addresses to verify accuracy
2. Monitor API usage to stay within limits
3. Cache results to minimize API calls
4. Log failed requests for debugging

## Example: Full Integration with Estated API

```javascript
async function fetchEstatedData(address) {
    const API_KEY = 'YOUR_ESTATED_API_KEY';
    
    try {
        const response = await fetch(
            `https://api.estated.com/v4/property?token=${API_KEY}&combined_address=${encodeURIComponent(address)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            }
        );
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        if (data.data && data.data.structure) {
            return {
                beds: data.data.structure.beds_count || 3,
                baths: data.data.structure.baths || 2,
                sqft: data.data.structure.total_area_sq_ft || 1500,
                year: data.data.structure.year_built || 2000,
                price: data.data.valuation?.value || 400000,
                propertyType: data.data.structure.type || 'Single Family',
                stories: data.data.structure.stories_count,
                garage: data.data.structure.parking_garage,
                pool: data.data.structure.pool_type,
                // Additional fields available
                roof_type: data.data.structure.roof_type,
                heating: data.data.structure.heating_type,
                cooling: data.data.structure.air_conditioning_type
            };
        }
    } catch (error) {
        console.error('Estated API Error:', error);
        return null;
    }
}
```

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Use a backend proxy or CORS-enabled endpoints
2. **Rate Limiting**: Implement caching and request throttling
3. **Incomplete Data**: Not all properties have full data; provide defaults
4. **Address Parsing**: Some APIs require specific address formats

### Debug Mode
Add a debug mode to see what data is being returned:

```javascript
const DEBUG_MODE = true;

if (DEBUG_MODE) {
    console.log('API Response:', data);
    console.log('Parsed Address:', parsedAddress);
    console.log('Final Property Data:', propertyData);
}
```

## Next Steps

1. Choose an API based on your needs and budget
2. Sign up and get API credentials
3. Update the `fetchPropertyDetails()` function
4. Test with real addresses
5. Implement proper error handling
6. Consider adding a backend proxy for production

## Additional Resources

- [Zillow API Documentation](https://www.zillow.com/howto/api/APIOverview.htm)
- [MLS Grid API](https://www.mlsgrid.com/) - Direct MLS access
- [Real Estate API Comparison](https://geekflare.com/real-estate-apis/)
- [Property Data APIs Overview](https://blog.estated.com/real-estate-apis/)

Remember: Always respect API rate limits and terms of service. Consider caching responses to minimize API calls and reduce costs.
# RentCast API Debug Guide

## How to Test RentCast API Integration

### 1. First, make sure your API key is set:

Open your browser console (F12) and check if your API key is configured:
```javascript
// Check current API key
localStorage.getItem('RENTCAST_API_KEY')

// If it returns null or 'YOUR_RENTCAST_API_KEY', set your actual key:
localStorage.setItem('RENTCAST_API_KEY', 'your-actual-api-key-here')
```

### 2. Test a Single Address

To test if RentCast is returning data for a specific address, run this in the console:

```javascript
// Test with a real address
await testRentCastAPI('123 Main St, Las Vegas, NV 89101')
```

This will show:
- Whether your API key is configured
- How the address is parsed
- The full API response
- What data fields are available

### 3. Check the Console Output

When you click "Refresh Real-Time Data", watch the console for:

1. **API URL being called:**
   ```
   RentCast API URL: https://api.rentcast.io/v1/properties?address=123+Main+St&city=Las+Vegas&state=NV&zipcode=89101
   ```

2. **Full API Response:**
   ```
   RentCast API Response: {...}
   ```

3. **Property Updates:**
   ```
   Updating property 1: 123 Main St, Las Vegas, NV 89101
   RentCast data received: {...}
   Updating beds: 3 -> 4
   Updating sqft: 1500 -> 1850
   ```

### 4. Common Issues and Solutions

#### Issue: No data returned
- **Check:** Is the address format correct? (Street, City, State ZIP)
- **Try:** Different address formats
- **Verify:** API key is valid and has remaining requests

#### Issue: Data fields don't match
- The console will show the raw API response
- Look for the actual field names RentCast uses
- Common field mappings:
  - `bedrooms` or `beds` → beds
  - `bathrooms` or `baths` → baths  
  - `squareFeet` or `building_size` → sqft
  - `yearBuilt` or `year_built` → year

#### Issue: 401 Unauthorized
- Your API key is invalid or not set correctly
- Check your RentCast dashboard for the correct key

#### Issue: 429 Too Many Requests
- You've exceeded your API limit
- Free tier: 50 requests/month

### 5. Manual API Test

You can also test the API directly:

```javascript
// Direct API test
const testAddress = {
    streetAddress: '123 Main St',
    city: 'Las Vegas', 
    state: 'NV',
    zip: '89101'
};

const result = await fetchRentCastData(testAddress);
console.log('API Result:', result);
```

### 6. View Raw Response Data

After refreshing, you can inspect the raw RentCast data:

```javascript
// View raw data for first property
console.log(properties[0]._rawRentCastData);
```

### 7. What Data Should Update?

When RentCast data is successfully fetched, these fields should update:
- Bedrooms (beds)
- Bathrooms (baths)
- Square Feet (sqft)
- Year Built (year)
- Property Type
- Last Sale Date/Price (for sold detection)

### Need Help?

1. Check RentCast API status: https://status.rentcast.io
2. Verify your API key is active in your RentCast dashboard
3. Make sure addresses are complete and properly formatted
4. Check the browser console for detailed error messages
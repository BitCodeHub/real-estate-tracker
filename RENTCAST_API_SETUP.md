# RentCast API Setup Guide

## Overview
This guide will help you set up the RentCast API to get accurate property data including beds, baths, square feet, listing prices, and more.

## Step 1: Get Your RentCast API Key

1. **Sign Up**: Go to [RentCast API Dashboard](https://app.rentcast.io/app/api)
2. **Create Account**: Register for a free account
3. **Get API Key**: After login, you'll see your API key in the dashboard
4. **Free Tier**: 50 API requests per month (perfect for testing)

## Step 2: Add Your API Key to the Code

1. Open `public/index.html` in your text editor
2. Find this line (around line 2190):
   ```javascript
   const RENTCAST_API_KEY = 'YOUR_RENTCAST_API_KEY'; // Replace with your actual API key
   ```
3. Replace `'YOUR_RENTCAST_API_KEY'` with your actual API key:
   ```javascript
   const RENTCAST_API_KEY = 'rc_api_abc123...'; // Your actual key
   ```

## Step 3: Understanding the Integration

The tracker now automatically calls RentCast API when you add a property:

### Data Retrieved:
- **Property Details**: Beds, baths, square feet, year built
- **Financial Info**: Last sale price, sale date, tax assessment
- **Owner Information**: Property owner name
- **Location Data**: GPS coordinates, verified address
- **Estimates**: Rental income estimates

### How It Works:
1. You enter an address (e.g., "123 Main St, Las Vegas, NV 89101")
2. The app parses the address into components
3. Calls RentCast API to get real property data
4. If API fails or no key, falls back to estimates

## Step 4: Testing Your Integration

1. **Save** the file after adding your API key
2. **Refresh** your browser (or reopen the file)
3. **Add a property** with a real address
4. **Look for** the green "Live data from RentCast API" indicator

### Test Addresses:
Try these real addresses to test:
- "1234 S Jones Blvd, Las Vegas, NV 89146"
- "5678 W Sahara Ave, Las Vegas, NV 89146"
- "910 E Tropicana Ave, Las Vegas, NV 89119"

## API Response Fields

RentCast provides these fields (when available):

```javascript
{
  "addressLine1": "123 Main St",
  "city": "Las Vegas",
  "state": "NV",
  "zipCode": "89101",
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1500,
  "yearBuilt": 2005,
  "propertyType": "Single Family",
  "lotSize": 6500,
  "lastSalePrice": 350000,
  "lastSaleDate": "2021-06-15",
  "taxAssessment": 280000,
  "ownerName": "John Doe",
  "latitude": 36.1699,
  "longitude": -115.1398,
  "rentEstimate": 2200
}
```

## Troubleshooting

### "Using estimated data" message still shows:
- **Check**: Is your API key correctly added?
- **Verify**: No quotes or spaces around the key
- **Test**: Open browser console (F12) to see any errors

### No property data returned:
- **Address Format**: Use full address with city, state, ZIP
- **Coverage**: RentCast may not have data for all properties
- **API Limit**: Check if you've exceeded 50 requests/month

### Console Errors:
- **401 Error**: Invalid API key
- **404 Error**: Property not found in RentCast database
- **429 Error**: Rate limit exceeded

## Advanced Configuration

### Increase API Limits:
- Upgrade to paid plan at [RentCast Pricing](https://www.rentcast.io/pricing)
- Plans start at $39/month for 1,000 requests

### Add Caching (Optional):
To reduce API calls, you can add caching:

```javascript
// Add this after the API configuration
const propertyCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// In fetchRentCastData function, check cache first:
const cacheKey = `${streetAddress}_${city}_${state}_${zip}`;
const cached = propertyCache.get(cacheKey);
if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { success: true, data: cached.data };
}
```

### Use Environment Variables (Production):
For production, don't hardcode the API key:

1. Create a backend proxy endpoint
2. Store API key in environment variables
3. Make requests through your backend

## API Endpoints Used

1. **Property Search**: `/v1/properties`
   - Search by address components
   - Returns array of matching properties

2. **Property Details**: Included in search results
   - No separate detail endpoint needed

3. **Market Data**: Available but not currently used
   - Could add rental comparables
   - Market trends and statistics

## Next Steps

1. **Test** with real addresses in your area
2. **Monitor** API usage in RentCast dashboard
3. **Upgrade** if you need more than 50 requests/month
4. **Add** additional features like:
   - Rental comparables
   - Market trends
   - Property history

## Support

- **RentCast Support**: support@rentcast.io
- **Documentation**: [developers.rentcast.io](https://developers.rentcast.io)
- **API Status**: Check [status.rentcast.io](https://status.rentcast.io)

Remember: Keep your API key secret and never commit it to public repositories!
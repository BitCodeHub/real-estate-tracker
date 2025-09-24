# 🔧 RentCast API Setup Guide

## Why Property Data Shows as 0/N/A

Your properties are showing 0 values because the RentCast API key is not configured on your Render deployment. Without this API, the app cannot fetch real property data like beds, baths, square footage, and estimated values.

## Quick Fix (Temporary)

While you set up the API, run this in your browser console to fix existing properties:
```javascript
fixZeroValues()
```

This will populate your properties with reasonable estimated values.

## Setting Up RentCast API

### 1. Get Your Free API Key
1. Go to https://app.rentcast.io/
2. Sign up for a free account
3. Navigate to the API section
4. Copy your API key (starts with `rc_`)

### 2. Add API Key to Render

1. Go to your Render dashboard
2. Select your `real-estate-tracker` service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - Key: `RENTCAST_API_KEY`
   - Value: `your_actual_api_key_here`
6. Click "Save Changes"

Your service will automatically redeploy with the API key.

### 3. Test the API

After deployment, test if it's working:
1. Click "AI Analyze Property" 
2. Enter a real address like: `5317 Lytton Ave, Las Vegas, NV 89146`
3. You should see real property data (beds, baths, sqft, etc.)

## Free Tier Limits

RentCast's free tier includes:
- 50 API calls per month
- Property details endpoint
- Rent estimates

This is enough for personal use with ~1-2 properties analyzed per day.

## What the API Provides

When configured, RentCast provides:
- Accurate beds/baths count
- Square footage
- Year built
- Last sale price and date
- Rent estimates
- Property type
- Tax assessments
- Owner information

## Fallback Mode

When the API is not configured, the app:
- Uses estimated values based on location
- Shows "Estimated" as data source
- Still calculates all financial metrics
- Works fully offline

## Troubleshooting

### Still showing zeros after API setup?
1. Check Render logs for API errors
2. Verify API key is correct (no extra spaces)
3. Make sure you're not exceeding rate limits
4. Run `fixZeroValues()` in console to fix existing properties

### API Key Not Working?
- Make sure it starts with `rc_`
- Check if you've activated your RentCast account
- Verify you're within the free tier limits

## Alternative: Manual Entry

You can always:
1. Click "Add Property" 
2. Manually enter all property details
3. The app will calculate all metrics without needing the API

The app is designed to work with or without the RentCast API\!

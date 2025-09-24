# 🔑 RentCast API Key Setup for Your Deployment

## Your API Key
```
42e42e7a08204cba9a397326d9d05415
```

## Step 1: Add to Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your `real-estate-tracker` service
3. Navigate to the "Environment" tab on the left sidebar
4. Click "Add Environment Variable"
5. Add the following:
   - **Key**: `RENTCAST_API_KEY`
   - **Value**: `42e42e7a08204cba9a397326d9d05415`
6. Click "Save Changes"

Your service will automatically redeploy with the API key configured.

## Step 2: Verify It's Working

After deployment (takes 2-3 minutes), test the API:

1. Go to your app: https://real-estate-tracker-tzsb.onrender.com
2. Click "AI Analyze Property"
3. Enter a test address like: `123 Main St, Las Vegas, NV 89101`
4. You should see real property data (beds, baths, sqft, etc.)

## Step 3: Fix Existing Properties with Zero Values

If you have properties showing 0/N/A values:

1. Open your app
2. Open browser console (F12)
3. Run: `fixZeroValues()`
4. This will populate missing data with estimates

## Important Notes

- This is a free tier API key with 50 calls/month
- Each property analysis uses 1 API call
- The app works offline with estimated values when API limit is reached
- Keep this API key secure - don't share it publicly

## Troubleshooting

If the API isn't working after setup:
1. Check Render logs for any errors
2. Make sure there are no extra spaces in the API key
3. Verify the service has redeployed (check deployment status)
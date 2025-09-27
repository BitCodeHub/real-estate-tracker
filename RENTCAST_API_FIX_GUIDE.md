# RentCast API & Click Handler Fix Guide

## Issues Fixed

### 1. Property Address Click Handler
- **Issue**: Clicking on property addresses in the Address column wasn't opening the property detail modal
- **Fix**: Added direct `onclick` attributes to address spans as a failsafe
- **Code**: `onclick="showPropertyDetail(${index})"`

### 2. RentCast API Not Fetching Data
- **Issue**: New properties showing 0 values for beds, baths, sqft
- **Fix**: Enhanced error handling and debugging for API calls

## RentCast API Configuration

The RentCast API requires proper server-side configuration. Based on the debugging, your server is checking for the API key but it might not be set correctly.

### Check API Status
1. Open browser console (F12)
2. Navigate to your app
3. Click "Add Property" 
4. Enter an address
5. Check console for messages like:
   - "API Key Status: Configured" ✅
   - "API Key Status: Not configured" ❌

### If API Key is Not Configured

The server needs the `RENTCAST_API_KEY` environment variable set. You have two options:

#### Option 1: Local Development (.env file)
```bash
# In your project root, create/update .env file:
RENTCAST_API_KEY=42e42e7a08204cba9a397326d9d05415
```

#### Option 2: Production (Render.com)
1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add environment variable:
   - Key: `RENTCAST_API_KEY`
   - Value: `42e42e7a08204cba9a397326d9d05415`
5. Save and let the service redeploy

### Testing the Fixes

#### Test Click Handler:
1. Refresh the app
2. Click on any property address (e.g., "62 Smith Square Ct")
3. The property detail modal should open with AI analysis

#### Test RentCast API:
1. Click "Add Property"
2. Enter a real address (e.g., "123 Main St, Las Vegas, NV 89101")
3. Open console to see debug messages
4. If API is working, you'll see:
   - "✅ RentCast data fetched successfully"
   - Property will show real beds, baths, sqft values

#### Debug Helper Page:
Open `/public/fix-click-and-api.html` in your browser for a comprehensive debugging tool that can:
- Inspect table structure
- Check API status
- Apply fixes
- Test both features

## Console Messages to Look For

### Success Messages:
- `✅ RentCast data fetched successfully for new property`
- `Property address clicked, index: 0`
- `Modal opened successfully`

### Error Messages:
- `❌ RentCast API key not configured on server!`
- `⚠️ RentCast data not available, using estimates`

## Troubleshooting

### If clicks still don't work:
1. Check browser console for errors
2. Verify `showPropertyDetail` function exists: 
   ```javascript
   console.log(typeof showPropertyDetail)  // should output: "function"
   ```

### If API doesn't work:
1. Check server logs for API key configuration
2. Verify the API endpoint is accessible:
   ```bash
   curl http://localhost:3000/api/status
   ```
3. Check if API key is valid at [RentCast Dashboard](https://app.rentcast.io)

## Files Modified
- `/public/index.html` - Added onclick handlers and enhanced API debugging
- `/public/fix-click-and-api.html` - Comprehensive debugging tool

Both issues should now be resolved. The click handlers will work immediately, and the RentCast API will work once the API key is properly configured on your server.
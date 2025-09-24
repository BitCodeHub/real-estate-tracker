# 🐛 Debug: "Failed to save property" Error

## Quick Diagnosis

1. **Open Browser Console** (F12 or right-click → Inspect → Console)
2. **Try to add a property again**
3. **Look for these messages in the console:**
   - `API URL: ...` - Shows what URL it's trying to connect to
   - `Saving property: {...}` - Shows the property data being sent
   - `Response status: ...` - Shows the server response
   - `API Health Check: ...` - Shows if server is running

## Common Issues & Solutions

### 1. Server Not Running on Render
**Symptoms:** 
- Console shows: `Failed to fetch` or `NetworkError`
- API Health Check fails

**Solution:**
1. Check Render dashboard - is your service running?
2. Check Render logs for any errors
3. Make sure environment variables are set

### 2. CORS Error
**Symptoms:**
- Console shows CORS policy errors

**Solution:**
- The server already has CORS enabled, but check if Render is blocking requests

### 3. Database Not Connected
**Symptoms:**
- Properties save but show warning about database

**Solution:**
- This is OK! The app works without a database
- Properties are saved in browser storage
- To enable database, add DATABASE_URL in Render environment

## Test Your API

Visit these URLs in your browser:

1. **Health Check**: `https://real-estate-tracker.onrender.com/health`
   - Should show: `{"status":"healthy","database":"connected/disconnected"}`

2. **API Test Page**: `https://real-estate-tracker.onrender.com/test-api.html`
   - Click buttons to test each endpoint
   - Shows detailed responses

3. **Properties List**: `https://real-estate-tracker.onrender.com/api/properties`
   - Should show: `{"success":true,"data":[]}`

## What the Fixed Code Does

1. **Better Error Messages**: Shows exactly what went wrong
2. **Offline Mode**: If server is down, saves properties locally
3. **API Health Check**: Checks server status on page load
4. **Console Logging**: Detailed debugging information

## If Still Not Working

1. **Check Render Logs**:
   ```
   - Go to Render dashboard
   - Click on your service
   - Click "Logs" tab
   - Look for errors
   ```

2. **Verify Environment Variables**:
   - RENTCAST_API_KEY (optional but recommended)
   - DATABASE_URL (optional)

3. **Try Local Storage Mode**:
   - The app will automatically fall back to browser storage
   - Properties will be saved locally
   - You'll see: "Property saved locally (database not connected)"

## Expected Console Output

When working correctly:
```
API Health Check: {status: "healthy", database: "disconnected", apiKey: "not configured"}
App initialized. API status: healthy Properties loaded: 0
Saving property: {address: "123 Main St", city: "Las Vegas", ...}
API URL: https://real-estate-tracker.onrender.com/api/properties
Response status: 201
Response text: {"success":true,"data":{...},"warning":"Database not connected..."}
Database status: Database not connected. Properties are stored locally only.
```

## Need More Help?

1. Share the console error messages
2. Check if the test API page works
3. Look at Render deployment logs
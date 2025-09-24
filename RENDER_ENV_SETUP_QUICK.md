# 🚀 Quick Environment Setup for Render

Your app is deployed and running! Just add these environment variables:

## Step 1: Open Render Dashboard
1. Go to https://dashboard.render.com
2. Click on your `real-estate-tracker` service

## Step 2: Add Environment Variables
1. Click on the **Environment** tab
2. Add these variables:

### Required Variables:

#### RENTCAST_API_KEY
- **Value**: Your RentCast API key
- Get one free at: https://app.rentcast.io

#### DATABASE_URL (Choose one option)

**Option A - Use Neon (Recommended for free tier):**
1. Go to https://neon.tech
2. Sign up for free account
3. Create new project
4. Copy the connection string
5. Use as DATABASE_URL value

**Option B - Use existing Render database:**
- If you have one, get URL from your database dashboard
- Go to Connect tab → Copy External Database URL

**Option C - Skip database (demo mode):**
- Skip adding DATABASE_URL
- App will work but won't save properties between sessions

## Step 3: Save & Deploy
- Click "Save Changes"
- Render will automatically redeploy

## That's it! 🎉

Your app will be live at:
```
https://real-estate-tracker.onrender.com
```

## Testing Your Deployment

1. Visit your app URL
2. Check the health status: `https://your-app.onrender.com/health`
3. Add a test property
4. If using database, properties will persist!

## Troubleshooting

If the app shows "Database not connected":
- This is normal if you skipped DATABASE_URL
- Properties will still work using browser storage
- Add DATABASE_URL later to enable persistence

## API Key Not Working?
Make sure you:
1. Created a free account at rentcast.io
2. Copied the API key correctly
3. Didn't include quotes in the environment variable
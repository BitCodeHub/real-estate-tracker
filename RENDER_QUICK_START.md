# 🚀 Quick Start: Deploy to Render in 5 Minutes

## Step 1: Create Render Account
Go to [render.com](https://render.com) and sign up (it's free)

## Step 2: Deploy from GitHub
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub account
3. Select `BitCodeHub/real-estate-tracker` repository
4. Render will detect the `render.yaml` file

## Step 3: Add Your API Key
When prompted for environment variables:
- **RENTCAST_API_KEY**: Enter your RentCast API key
- Get a free key at: https://app.rentcast.io/app/api

## Step 4: Deploy!
Click **"Apply"** and wait 2-3 minutes

## Your App is Live! 🎉
Your URL will be: `https://[your-app-name].onrender.com`

## Test Your Deployment
Run this command (replace with your URL):
```bash
./test-production.sh https://your-app-name.onrender.com
```

## Share with Others
Anyone with the link can now use your Real Estate Tracker!

---

**Note**: Free Render apps sleep after 15 min of inactivity. First visit may take 30-60 seconds to wake up.
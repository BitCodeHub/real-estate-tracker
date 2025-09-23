# Deploy Real Estate Tracker to Render.com

This guide will walk you through deploying the Real Estate Investment Tracker to Render.com for free hosting.

## Prerequisites

1. A [Render.com](https://render.com) account (free)
2. A [GitHub](https://github.com) account
3. A [RentCast API key](https://app.rentcast.io/app/api) (optional, for real-time data)

## Deployment Steps

### 1. Push Code to GitHub

First, ensure your code is on GitHub:

```bash
git add -A
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your `real-estate-tracker` repository

### 3. Configure the Service

Fill in the deployment settings:

- **Name**: `real-estate-tracker` (or your preferred name)
- **Region**: Choose the closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Set Environment Variables

In the **Environment** section, add:

1. **RENTCAST_API_KEY** (Required for real-time data)
   - Click **"Add Environment Variable"**
   - Key: `RENTCAST_API_KEY`
   - Value: Your actual RentCast API key
   - Get one free at: https://app.rentcast.io/app/api

2. **NODE_ENV** (Optional)
   - Key: `NODE_ENV`
   - Value: `production`

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your app
3. Wait for the build to complete (usually 2-5 minutes)
4. Your app will be live at: `https://your-app-name.onrender.com`

## Alternative: Deploy with render.yaml

If you have the `render.yaml` file in your repo:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will detect the `render.yaml` and configure automatically
5. Add your `RENTCAST_API_KEY` when prompted
6. Click **"Apply"**

## Post-Deployment

### Test Your Deployment

1. Visit your app URL: `https://your-app-name.onrender.com`
2. Check browser console for any errors
3. Test the refresh functionality on a property

### Monitor Your App

- Check logs: Dashboard → Your Service → **Logs**
- View metrics: Dashboard → Your Service → **Metrics**
- Health status: Your app includes a `/health` endpoint

## Troubleshooting

### App Not Loading

1. Check the build logs for errors
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly

### API Not Working

1. Verify `RENTCAST_API_KEY` is set in environment variables
2. Check browser console for error messages
3. Visit `/api/status` to check API configuration

### Slow Initial Load

Free Render services may sleep after 15 minutes of inactivity. The first request will take 30-60 seconds to wake up the service.

## Security Notes

- API keys are stored securely on the server
- Never commit API keys to your repository
- The server proxies all RentCast API requests to protect your key

## Updating Your App

To deploy updates:

```bash
git add -A
git commit -m "Update description"
git push origin main
```

Render will automatically redeploy when you push to the main branch.

## Cost

- **Free Tier**: Includes 750 hours/month (enough for one app running 24/7)
- **Limitations**: App may sleep after 15 minutes of inactivity
- **Upgrade**: For always-on service, upgrade to paid tier ($7/month)

## Need Help?

- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com)
- Check the app logs in your Render dashboard
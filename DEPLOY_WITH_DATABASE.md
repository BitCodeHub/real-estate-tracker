# 🚀 Deploy Real Estate Tracker with Database to Render

## Prerequisites
- GitHub account
- Render.com account (free)
- RentCast API key (free at https://app.rentcast.io/app/api)

## Step-by-Step Deployment

### 1. Fork/Push to GitHub
If you haven't already, push your code to GitHub:
```bash
git add .
git commit -m "Add database support for property persistence"
git push origin main
```

### 2. Deploy on Render

1. **Login to Render**: Go to [render.com](https://render.com) and sign in

2. **Create New Blueprint Instance**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub account if not already connected
   - Select your `real-estate-tracker` repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**:
   When prompted, you'll need to set:
   - **RENTCAST_API_KEY**: Your RentCast API key
   - Leave other fields as default

4. **Deploy**:
   - Click **"Apply"**
   - Render will automatically:
     - Create a PostgreSQL database (free tier)
     - Set up your web service
     - Link them together
     - Run the deployment

### 3. Database Initialization

The database schema will be automatically created on first startup. The app includes:
- Automatic schema creation
- Database connection pooling
- Error handling and retries

### 4. Access Your App

After deployment (takes 3-5 minutes):
- Your app URL: `https://[your-app-name].onrender.com`
- Database is automatically configured
- All property data will persist between sessions

## Features with Database

✅ **Persistent Storage**: Properties are saved to PostgreSQL database
✅ **Multi-User Support**: Multiple users can access the same property data
✅ **Real-time Updates**: Changes are immediately saved
✅ **Data Backup**: Render provides automatic database backups
✅ **Scalable**: Can handle thousands of properties

## Testing Your Deployment

1. **Add a Property**:
   - Click "Add Property"
   - Enter property details
   - Verify it appears in the table

2. **Refresh the Page**:
   - Properties should still be there (not lost like localStorage)

3. **Edit a Property**:
   - Click on any cell to edit
   - Changes save automatically

4. **Delete a Property**:
   - Click on property address to open details
   - Click "Delete Property" button
   - Confirm deletion

## Database Management

### View Database Data
1. In Render dashboard, click on your database
2. Go to "Connect" tab
3. Use the connection string with a tool like:
   - pgAdmin
   - TablePlus
   - DBeaver
   - psql command line

### Database Schema
The `properties` table includes:
- Property details (address, city, state, etc.)
- Financial metrics (price, rent, expenses)
- Investment calculations (cash flow, ROI, etc.)
- Risk assessments
- Timestamps

### Backup & Restore
Render provides automatic daily backups on paid plans. For manual backups:
```bash
pg_dump $DATABASE_URL > backup.sql
```

## Troubleshooting

### App Won't Start
- Check Render logs for errors
- Verify RENTCAST_API_KEY is set
- Ensure database is created

### Database Connection Failed
- Database URL is automatically configured
- Check if database service is running
- Review server logs for connection errors

### Properties Not Saving
- Check browser console for errors
- Verify API endpoints are working
- Check network tab for failed requests

## Monitoring

### Health Check
Visit: `https://[your-app-name].onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### View Logs
In Render dashboard:
1. Click on your web service
2. Go to "Logs" tab
3. Monitor for errors or issues

## Free Tier Limitations

- **Database**: 256MB storage (thousands of properties)
- **Web Service**: Spins down after 15 min inactivity
- **First Request**: May take 30-60 seconds to wake up

## Next Steps

1. **Custom Domain**: Add your own domain in Render settings
2. **Upgrade Database**: For production use, consider paid plan
3. **Add Authentication**: Secure your app with user accounts
4. **API Rate Limiting**: Protect your RentCast API quota

## Support

- **Render Docs**: https://render.com/docs
- **Database Issues**: Check Render status page
- **App Issues**: Review server logs in Render dashboard
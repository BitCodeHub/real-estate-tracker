# RentCast API Optimization Guide

## What Changed?

To preserve your RentCast API quota (50 calls/month on free tier), I've optimized how the app uses the API:

### 1. **Removed Bulk Refresh**
- The "Refresh Real-Time Data" button no longer calls the API for all properties
- Instead, it now shows an info message explaining the new approach

### 2. **Individual Property Refresh**
- Each property row now has a small 🔄 icon next to the address
- Click this icon to refresh data for just that property
- This uses only 1 API call instead of 17+

### 3. **Property Detail Refresh**
- When viewing a property detail modal, there's a green "Refresh Real-Time Data" button
- This refreshes data for just the property you're viewing
- Shows when the property was last updated

### 4. **Automatic API Calls**
- RentCast API is still called automatically when adding new properties
- This ensures accurate data from the start
- Uses 1 API call per new property

## How to Use

### Refresh a Single Property:
1. **From the Table**: Click the 🔄 icon next to any property address
2. **From Details**: Click on a property row, then use the "Refresh Real-Time Data" button

### Check API Usage:
- Each refresh shows a success/failure message
- Console logs show detailed API responses
- Monitor your usage at [RentCast Dashboard](https://app.rentcast.io/app/api)

### API Quota Management:
- Free tier: 50 calls/month
- With 17 properties: You can refresh each ~3 times per month
- Focus on properties you're actively analyzing

## Visual Indicators

- **LIVE badge**: Property has real-time data from RentCast
- **Time ago**: Shows when property was last updated
- **SOLD badge**: Property detected as recently sold
- **🔄 icon**: Click to refresh this property's data

## Benefits

1. **Preserve API Calls**: Only refresh what you need
2. **Faster Updates**: Single property refresh is quicker
3. **Better Control**: Choose which properties to update
4. **Clear Feedback**: Know exactly what's being refreshed

## Troubleshooting

If a property won't refresh:
1. Check your API key is configured: `localStorage.getItem('RENTCAST_API_KEY')`
2. Verify the address format is complete
3. Check console for detailed error messages
4. Some properties may not be in RentCast's database

## API Conservation Tips

1. Refresh properties only when needed (before making decisions)
2. Use the detail view to verify data before refreshing
3. Focus on properties you're actively buying/selling
4. Consider upgrading if you need more API calls

Remember: Each property refresh uses 1 API call. Plan accordingly!
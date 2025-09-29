# RentCast API Optimization Guide

## Current Behavior

The app now properly fetches both Rent Est. and Est. Value, but may require up to 3 API calls:
1. `/properties` - Always called first
2. `/rent-estimate` - Called if rent data missing
3. `/value-estimate` - Called if value data missing

## Why Multiple Calls?

RentCast's API structure separates different data types:
- **Properties endpoint**: Basic property info (beds, baths, sqft, sometimes includes estimates)
- **Rent estimate endpoint**: Specialized rental market analysis
- **Value estimate endpoint**: Property valuation data

## Optimization Strategies

### 1. Check Your RentCast API Tier
Some RentCast API tiers include more data in the properties endpoint. Check if upgrading would provide complete data in a single call.

### 2. Implement Caching
The app already caches data. Properties with `realTimeData: true` have been fetched from RentCast. Avoid refreshing unless data is stale.

### 3. Batch Processing
When importing multiple properties, consider implementing a queue system to respect API rate limits.

### 4. Monitor API Usage
Track your API calls in the console:
- Look for "📊 Total API calls: X"
- Aim for 1 call when possible
- Accept 2-3 calls when necessary for complete data

## Best Practices

1. **Only refresh when needed** - Data doesn't change frequently
2. **Use bulk import wisely** - Import all properties at once rather than one by one
3. **Check cached data first** - Properties showing bed/bath/sqft already have RentCast data

## Future Improvements

Consider implementing:
- Server-side caching with Redis
- Webhook updates from RentCast (if available)
- Daily batch updates instead of on-demand refreshes
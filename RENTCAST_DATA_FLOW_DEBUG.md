# RentCast Data Flow Debug

## Current Issue
Properties are showing 0 for bed/bath/sqft even though RentCast API returns data.

## Data Flow Analysis

1. **RentCast API Returns:**
   - `bedrooms: 3`
   - `bathrooms: 2`
   - `squareFootage: 1378`
   - Value estimate: `price: 411000`

2. **Our fetchRentCastData Maps To:**
   - `beds: property.bedrooms`
   - `baths: property.bathrooms`
   - `sqft: property.squareFootage`
   - `estimatedValue: valueData?.price`

3. **refreshProperty Does:**
   ```javascript
   Object.assign(property, rentcastData.data);
   ```
   This overwrites our mapped fields with ALL fields from RentCast, so the property object ends up with BOTH:
   - `beds: 3` AND `bedrooms: 3`
   - `baths: 2` AND `bathrooms: 2`
   - `sqft: 1378` AND `squareFootage: 1378`

4. **Database Expects:**
   - `bedrooms` (column name)
   - `bathrooms` (column name)
   - `square_footage` (column name)

5. **UI Modal Looks For:**
   - `property.beds`
   - `property.baths`
   - `property.sqft`

## The Problem
The field names are inconsistent across the application. The database saves `bedrooms` but the UI reads `beds`.

## Solution
Need to ensure consistent field naming and proper mapping at every step of the data flow.
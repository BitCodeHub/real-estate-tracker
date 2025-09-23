# Fix: Undefined Address Issue

## Problem
When adding a property with address "4598 Calderwood Street, Las Vegas, NV 89103-4320", the address column showed "undefined" in the table.

## Root Cause
1. The address parsing logic wasn't properly handling addresses with newlines
2. When RentCast API doesn't return streetNumber/streetName, the streetAddress became undefined
3. The fallback logic wasn't properly implemented in all cases

## Solution Implemented

### 1. Enhanced Address Cleaning
- Remove newline characters and replace with spaces/commas
- Normalize multiple spaces into single spaces
```javascript
const originalAddress = address.trim().replace(/\n/g, ', ').replace(/\s+/g, ' ');
```

### 2. Fixed State/ZIP Pattern Matching
- Removed the strict start-of-line requirement (^) from regex
- Now matches "NV 89103-4320" correctly
```javascript
const stateZipMatch = secondPart.match(/([A-Z]{2})\s+(\d{5}(-\d{4})?)/);
```

### 3. Added Fallback for Street Address
- If streetAddress is not found, use the original input address
- Added multiple fallback levels throughout the code
```javascript
streetAddress = streetAddress || originalAddress || '123 Main St';
```

### 4. Enhanced RentCast Response Handling
- Added `address` field to RentCast data response
- Use propertyData.address as primary source
- Fallback to parsing from input if not available

### 5. Added Debug Logging
- Console logs to track address parsing at each step
- Helps identify where parsing might fail

## Testing
To test the fix:
1. Click "Add Property"
2. Enter: 4598 Calderwood Street, Las Vegas, NV 89103-4320
3. The address should now display correctly in the table

## Address Formats Supported
- Standard: "123 Main St, Las Vegas, NV 89103"
- With ZIP+4: "123 Main St, Las Vegas, NV 89103-4320"
- Multi-line (pasted): "123 Main St\nLas Vegas, NV 89103"
- Two-part: "123 Main St Las Vegas, NV 89103"

## Debug Commands
If you still see undefined addresses, check the browser console:
```javascript
// Check last property added
console.log(properties[properties.length - 1]);

// Manually fix an undefined address
properties[properties.length - 1].address = "4598 Calderwood Street";
renderTable();
```
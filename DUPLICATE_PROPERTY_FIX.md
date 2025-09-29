# Fix for "Property Already Exists" Error When Property Not Visible

## Issue Identified
Users were getting "Property already exists in your portfolio" errors when importing properties from Excel, even though these properties weren't visible in the app. The error occurred because:

1. Properties existed in the database but weren't being returned by the API
2. The database query was filtering out properties with NULL status values
3. Some properties may have been marked as 'deleted' or had no status set

## Root Cause
The SQL query `WHERE status != 'deleted'` was excluding properties with NULL status because in SQL:
- `NULL != 'deleted'` evaluates to NULL (not TRUE)
- Only rows where the condition evaluates to TRUE are returned
- This caused properties with NULL status to be hidden

## Solution Implemented

### 1. Database Query Fix
Updated `getAllProperties` and `getPropertyById` to explicitly handle NULL status:
```sql
-- Before:
WHERE status != 'deleted'

-- After:
WHERE (status IS NULL OR status != 'deleted')
```

### 2. Duplicate Detection
Added `checkPropertyExists` function to check if a property already exists before creating:
```javascript
async checkPropertyExists(address, city, state, zip) {
    // Check by address, city, and state (case-insensitive)
}
```

### 3. Smart Property Creation
Updated the create endpoint to:
- Check if property exists before creating
- If it exists with 'deleted' or NULL status, reactivate it instead
- Provide better error messages with property ID

### 4. Improved Bulk Import
Enhanced bulk import to:
- Create properties individually to handle duplicates properly
- Show which properties already exist
- Provide detailed feedback about imports, duplicates, and failures
- Continue importing other properties even if some already exist

## Code Changes

### db.js
```javascript
// Fixed query to include NULL status properties
'SELECT * FROM properties WHERE (status IS NULL OR status != $1)'

// Added duplicate check method
async checkPropertyExists(address, city, state, zip) { ... }
```

### server.js
```javascript
// Check for existing property before creating
const existingProperty = await db.checkPropertyExists(...)
if (existingProperty) {
    if (existingProperty.status === 'deleted' || existingProperty.status === null) {
        // Reactivate the property
    }
}
```

### index.html (Bulk Import)
```javascript
// Import each property individually
for (const property of propertiesToCreate) {
    try {
        const response = await fetch('/api/properties', ...)
        if (response.status === 409) {
            // Handle existing property
            existingProperties.push(property.address)
        }
    } catch (error) { ... }
}
// Show detailed results including existing properties
```

## Benefits
1. **Visibility**: All properties (except explicitly deleted ones) now show in the app
2. **Better Error Handling**: Clear messages about which properties already exist
3. **Reactivation**: Deleted properties can be reactivated instead of causing errors
4. **Bulk Import Resilience**: Import continues even if some properties exist
5. **User Feedback**: Detailed information about import results

## Testing
1. Import an Excel file with properties
2. Try to import the same file again
3. You should see a message like "3 properties already exist" instead of errors
4. All properties should be visible in the app
5. Check console for detailed information about existing properties
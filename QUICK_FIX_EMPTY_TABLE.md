# 🔧 Quick Fix: Properties Not Showing

## The Issue
You have 17 properties in localStorage but they're not displaying in the table.

## Quick Fix (Run in Browser Console)

Open the browser console (F12) on your real estate tracker page and paste this:

```javascript
// Force load properties from localStorage
const localData = localStorage.getItem('properties');
if (localData) {
    const localProperties = JSON.parse(localData);
    console.log(`Found ${localProperties.length} properties in localStorage`);
    
    // Load them into the app
    properties = localProperties.map(prop => {
        // Ensure all properties have required fields
        return {
            ...prop,
            monthlyCF: prop.monthlyCF || 0,
            annualCF: prop.annualCF || 0,
            coc: prop.coc || 0,
            capRate: prop.capRate || 0,
            dscr: prop.dscr || 0,
            crimeRisk: prop.crimeRisk || 'LOW',
            floodRisk: prop.floodRisk || 'LOW',
            marketRisk: prop.marketRisk || 'LOW'
        };
    });
    
    // Recalculate metrics
    properties = properties.map(prop => calculateMetrics(prop));
    
    // Render the table
    renderTable();
    updatePortfolioStats();
    document.getElementById('propertyCount').textContent = properties.length;
    
    console.log('✅ Properties loaded and displayed!');
} else {
    console.error('No properties found in localStorage');
}
```

## Alternative: Use the Fix Page

1. Open: `/fix-properties.html`
2. Click "Check LocalStorage Properties"
3. Click "Force Load from LocalStorage"
4. Click "Open Main App with Properties Loaded"

## What Was Fixed

1. **Fixed the renderTable function** - Removed `.outerHTML` calls that were causing errors
2. **Added null checks** - Handle missing property values gracefully
3. **Added forceLoadFromLocalStorage function** - Manually load properties when needed
4. **Added auto-recovery** - App now checks localStorage if database returns no properties
5. **Created fix utilities** - Tools to diagnose and fix the issue

## To Prevent This in the Future

Always ensure properties are saved both to:
- Database (when online)
- localStorage (as backup)

The app now does this automatically when you save or update properties.
# Debug: Refresh Button in Property Modal

## Steps to Debug

1. **Open the app** in your browser: `public/index.html`

2. **Open Browser Console** (F12 or right-click → Inspect → Console)

3. **Click any property row** in the table

4. **Check Console Output**:
   - You should see: "showPropertyDetail called for property index: X"
   - You should see: "Modal opened. Checking for refresh button..."
   - You should see: "Refresh button present: true"

5. **In the Modal**, look for:
   - A green button labeled "🔄 Refresh Real-Time Data for This Property"
   - It should appear right after the tip about editing values
   - Shows "Last updated: Never updated" or the actual time

## Quick Test

Run this in the browser console:
```javascript
// Test the modal with first property
debugTestModal()
```

This will open the first property and log debug info.

## What the Refresh Button Looks Like

The button appears in a centered section with:
```
┌─────────────────────────────────────────────────┐
│  💡 Tip: Click on any blue-highlighted value... │
│                                                 │
│     [🔄 Refresh Real-Time Data for This Property] │
│            Last updated: Never updated          │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Alternative Ways to Refresh

If the modal button isn't working, you can still refresh individual properties:
1. **From Table**: Click the 🔄 icon next to any property address
2. This triggers the same `refreshSingleProperty()` function

## Common Issues

1. **Modal not opening**: Make sure you click on a table row, not an editable cell
2. **Button not visible**: Check if CSS is loading properly
3. **Console errors**: Look for any JavaScript errors when opening modal

## Manual Test

If the button still doesn't appear, try this in console:
```javascript
// Manually add refresh button to check if it works
const testButton = '<button onclick="refreshSingleProperty(0)" style="background: #10b981; color: white; padding: 10px 20px; border-radius: 6px;">Test Refresh</button>';
document.getElementById('modalBody').insertAdjacentHTML('afterbegin', testButton);
```

This will add a test button at the top of the modal.
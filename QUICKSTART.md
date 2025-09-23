# Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and go to:
```
http://localhost:3000
```

## Debugging the Display Issue

If properties aren't showing in the table:

1. Open browser console (F12)
2. Look for console logs that show:
   - Properties count
   - Initialization status
   - Number of table rows

3. In the console, type:
```javascript
properties.length  // Should show 17
document.getElementById('propertyTableBody').children.length  // Should show 17
```

## Features Working

- ✅ 17 properties pre-loaded with Las Vegas & Austin data
- ✅ Click any cell to edit values (blue highlighted cells)
- ✅ Automatic calculation of metrics (Cash Flow, CoC, DSCR, etc.)
- ✅ AI Portfolio Analysis with scoring and recommendations
- ✅ Export to Excel/CSV functionality
- ✅ Property detail view (click any row)
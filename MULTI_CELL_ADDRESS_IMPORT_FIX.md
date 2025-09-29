# Multi-Cell Address Import Fix

## Issue Fixed
The Excel/CSV import feature was incorrectly parsing addresses when they were split across multiple cells/columns. For example:
- Cell 1: `2312 Beverly Way`
- Cell 2: `Las Vegas, NV 89104-2760`

The app was treating these as two separate properties instead of one complete address.

## Solution Implemented

### Smart Address Detection
The parser now:
1. Detects when a cell contains only a street address (e.g., "2312 Beverly Way")
2. Checks if the next cell contains city/state/zip (e.g., "Las Vegas, NV 89104-2760")
3. Automatically combines them into one complete address
4. Handles both Excel and CSV files with this format

### Pattern Recognition
- **Street-only pattern**: `^\d+\s+[A-Za-z\s]+$` (number + street name, no state/zip)
- **City/State/Zip pattern**: `[A-Za-z\s]+,?\s+[A-Z]{2}\s+\d{5}(-\d{4})?`

## Supported Formats

### Format 1: Multi-Cell (Now Fixed)
```
| Street Address      | City, State ZIP        |
|-------------------|------------------------|
| 2312 Beverly Way   | Las Vegas, NV 89104    |
| 1615 Palora Avenue | Las Vegas, NV 89169    |
```

### Format 2: Single Cell (Already Supported)
```
| Full Address                           |
|---------------------------------------|
| 2312 Beverly Way, Las Vegas, NV 89104 |
| 1615 Palora Avenue, Las Vegas, NV 89169 |
```

### Format 3: Mixed Format (Also Supported)
The parser can handle files with both formats mixed together.

## Example Files

### Excel Format (Multi-Cell)
Create an Excel file with addresses split across columns:
```
A                    B
2312 Beverly Way     Las Vegas, NV 89104-2760
1615 Palora Avenue   Las Vegas, NV 89169-2575
2313 Van Patten Pl   Las Vegas, NV 89104-2757
```

### CSV Format (Multi-Cell)
```csv
2312 Beverly Way,Las Vegas, NV 89104-2760
1615 Palora Avenue,Las Vegas, NV 89169-2575
2313 Van Patten Place,Las Vegas, NV 89104-2757
```

## Benefits
- Correctly imports 3 properties instead of 6
- Handles various Excel/CSV export formats
- More flexible and user-friendly
- Prevents duplicate or incomplete property imports
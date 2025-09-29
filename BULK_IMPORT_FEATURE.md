# Bulk Import Feature - Excel/CSV Upload

## Overview
The Real Estate Investment Tracker now supports bulk property import through Excel and CSV file uploads. This feature allows users to quickly add multiple properties at once.

## How to Use

1. Click the "Add Property" button in the header
2. In the modal, you'll see two options:
   - **Quick Add**: Paste a single full address (existing feature)
   - **Bulk Import**: Upload Excel/CSV file with multiple properties

3. Click "Choose Excel/CSV File" button
4. Select your file containing property addresses
5. Review the preview of properties to be imported
6. Click "Import All Properties" to confirm or "Cancel" to abort

## File Format Requirements

### CSV Format
- One property address per line
- Can include a header row with "Address" (will be automatically detected and skipped)
- Example:
```
Address
123 Main St, Las Vegas, NV 89101
456 Oak Avenue, Henderson, NV 89052
789 Pine Road, North Las Vegas, NV 89084
```

### Excel Format (.xlsx, .xls)
- First column should contain addresses
- Can include a header row with "Address" (will be automatically detected)
- Other columns will be ignored
- Example:
```
| Address                            | Notes |
|------------------------------------|-------|
| 123 Main St, Las Vegas, NV 89101   | ...   |
| 456 Oak Ave, Henderson, NV 89052   | ...   |
```

## Features

1. **Smart Address Parsing**: Automatically parses full addresses into components (street, city, state, zip)

2. **RentCast Integration**: For each property, the system attempts to fetch:
   - Purchase price
   - Monthly rent estimate
   - Number of bedrooms
   - Number of bathrooms
   - Square footage

3. **Progress Tracking**: Shows real-time progress during import

4. **Error Handling**: 
   - Invalid addresses are skipped
   - Shows summary of successful and failed imports
   - Logs failed addresses in console for review

5. **API Rate Limiting**: Adds 500ms delay between properties to prevent overwhelming the RentCast API

## Technical Details

- Uses SheetJS (XLSX library) for Excel parsing
- Native JavaScript FileReader API for CSV parsing
- Addresses must be in standard US format
- All imports are processed sequentially to manage API rate limits

## Example Address Formats

Valid formats:
- `123 Main St, Las Vegas, NV 89101`
- `456 Oak Avenue, Henderson, Nevada 89052`
- `789 Pine Road, North Las Vegas, NV 89084`

The parser is flexible and can handle various abbreviations and formats.
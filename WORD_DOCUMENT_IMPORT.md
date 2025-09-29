# Word Document Import Feature

## Overview
The Real Estate Investment Tracker now supports importing properties from Word documents (.docx files) in addition to Excel and CSV files.

## Supported Formats

### 1. Single Line Format
Each property on one line with complete address:
```
123 Main St, Las Vegas, NV 89101
456 Oak Avenue, Henderson, NV 89052
```

### 2. Multi-Line Format
Street address on one line, city/state/zip on the next:
```
123 Main St
Las Vegas, NV 89101

456 Oak Avenue
Henderson, NV 89052
```

### 3. Table/Label Format
Properties with labels like "Address:", "Property:", or "Location:":
```
Address: 123 Main St, Las Vegas, NV 89101
Property: 456 Oak Avenue, Henderson, NV 89052
Location: 789 Pine Road, North Las Vegas, NV 89084
```

## How to Use

1. Click **"Add Property"** button
2. Click **"Choose Excel/CSV/Word File"** 
3. Select your .docx file
4. Review the parsed addresses in the preview
5. Click **"Import All Properties"** to add them

## Technical Details

- Uses **mammoth.js** library to extract text from Word documents
- Supports .docx format (modern Word documents)
- .doc format (older Word) has limited support
- Automatically detects and combines multi-line addresses
- Removes duplicate addresses
- Provides detailed console logging for debugging

## Example Word Document Content

```
Property List for Import

2312 Beverly Way
Las Vegas, NV 89104-2760

1615 Palora Avenue
Las Vegas, NV 89169-2575

2313 Van Patten Place, Las Vegas, NV 89104-2757

Additional properties:
Address: 1234 Charleston Blvd, Las Vegas, NV 89102-1234
Property: 5678 Desert Inn Road, Las Vegas, NV 89109
```

## Tips

- Use clear formatting with addresses on separate lines
- Include complete city, state, and ZIP information
- Avoid complex tables or formatting that might confuse the parser
- Check browser console for detailed parsing information if issues occur

## Limitations

- Only .docx files are fully supported (not older .doc format)
- Complex Word formatting (tables, text boxes) may not parse correctly
- Best results with simple, cleanly formatted text
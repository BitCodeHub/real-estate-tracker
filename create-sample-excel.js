// Simple script to create a sample Excel file for testing bulk import
// Run with: node create-sample-excel.js

const XLSX = require('xlsx');

// Sample property data
const data = [
    ['Address', 'Notes'],
    ['123 Main St, Las Vegas, NV 89101', 'Downtown property'],
    ['456 Oak Avenue, Henderson, NV 89052', 'Suburban home'],
    ['789 Pine Road, North Las Vegas, NV 89084', 'Near schools'],
    ['321 Elm Street, Las Vegas, NV 89107', 'West side'],
    ['654 Maple Drive, Henderson, NV 89015', 'Gated community'],
    ['987 Cedar Lane, Las Vegas, NV 89148', 'Mountain views'],
    ['147 Birch Way, Las Vegas, NV 89138', 'New development'],
    ['258 Willow Court, Henderson, NV 89074', 'Corner lot'],
    ['369 Aspen Place, Las Vegas, NV 89135', 'Pool home'],
    ['741 Spruce Avenue, North Las Vegas, NV 89031', 'Investment opportunity']
];

// Create a new workbook
const wb = XLSX.utils.book_new();

// Create worksheet from data
const ws = XLSX.utils.aoa_to_sheet(data);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Properties');

// Write the Excel file
XLSX.writeFile(wb, 'sample-properties.xlsx');

console.log('Sample Excel file created: sample-properties.xlsx');
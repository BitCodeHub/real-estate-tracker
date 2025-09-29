// Simple script to create a sample Word document for testing bulk import
// Run with: npm install docx && node create-sample-word.js

const { Document, Paragraph, TextRun, Packer } = require("docx");
const fs = require("fs");

// Create document
const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Property List for Import",
                        bold: true,
                        size: 28
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Here are the properties to import:",
                        size: 24
                    })
                ]
            }),
            new Paragraph({ text: "" }), // Empty line
            
            // Property 1 - single line format
            new Paragraph({
                children: [
                    new TextRun({
                        text: "123 Main St, Las Vegas, NV 89101"
                    })
                ]
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            // Property 2 - two line format
            new Paragraph({
                children: [
                    new TextRun({
                        text: "456 Oak Avenue"
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Henderson, NV 89052"
                    })
                ]
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            // Property 3 - single line format
            new Paragraph({
                children: [
                    new TextRun({
                        text: "789 Pine Road, North Las Vegas, NV 89084"
                    })
                ]
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            // Property 4 - two line format  
            new Paragraph({
                children: [
                    new TextRun({
                        text: "321 Elm Street"
                    })
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Las Vegas, NV 89107"
                    })
                ]
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            // Property 5 - single line format
            new Paragraph({
                children: [
                    new TextRun({
                        text: "654 Maple Drive, Henderson, NV 89015"
                    })
                ]
            })
        ]
    }]
});

// Write to file
Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("sample-properties.docx", buffer);
    console.log("Sample Word document created: sample-properties.docx");
});
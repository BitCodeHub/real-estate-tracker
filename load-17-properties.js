// Quick script to load 17 properties
// Copy and paste this into your browser console

// If the app functions are available, use them
if (typeof load17SampleProperties === 'function') {
    load17SampleProperties();
} else {
    // Fallback: create properties directly
    const sample17Properties = [
        { address: "5317 Lytton Ave", city: "Las Vegas", state: "NV", zip: "89146", beds: 4, baths: 2.5, sqft: 2200, year: 1998, price: 485000, rent: 2800 },
        { address: "3452 Desert Inn Rd", city: "Las Vegas", state: "NV", zip: "89121", beds: 3, baths: 2, sqft: 1650, year: 2005, price: 375000, rent: 2200 },
        { address: "8923 Sahara Ave", city: "Las Vegas", state: "NV", zip: "89117", beds: 3, baths: 2, sqft: 1800, year: 2002, price: 425000, rent: 2400 },
        { address: "1256 Rainbow Blvd", city: "Las Vegas", state: "NV", zip: "89146", beds: 4, baths: 3, sqft: 2500, year: 2010, price: 550000, rent: 3200 },
        { address: "7634 Charleston Blvd", city: "Las Vegas", state: "NV", zip: "89117", beds: 3, baths: 2, sqft: 1700, year: 1995, price: 365000, rent: 2100 },
        { address: "4521 Spring Mountain Rd", city: "Las Vegas", state: "NV", zip: "89102", beds: 2, baths: 2, sqft: 1200, year: 2008, price: 285000, rent: 1800 },
        { address: "9012 Tropicana Ave", city: "Las Vegas", state: "NV", zip: "89147", beds: 4, baths: 2, sqft: 2100, year: 2000, price: 465000, rent: 2700 },
        { address: "2345 Flamingo Rd", city: "Las Vegas", state: "NV", zip: "89119", beds: 3, baths: 2.5, sqft: 1900, year: 2007, price: 415000, rent: 2500 },
        { address: "6789 Lake Mead Blvd", city: "Las Vegas", state: "NV", zip: "89156", beds: 5, baths: 3, sqft: 2800, year: 2015, price: 625000, rent: 3500 },
        { address: "1122 Summerlin Pkwy", city: "Las Vegas", state: "NV", zip: "89144", beds: 4, baths: 3, sqft: 2400, year: 2012, price: 575000, rent: 3300 },
        { address: "3344 Craig Rd", city: "Las Vegas", state: "NV", zip: "89032", beds: 3, baths: 2, sqft: 1550, year: 1998, price: 335000, rent: 2000 },
        { address: "5566 Jones Blvd", city: "Las Vegas", state: "NV", zip: "89146", beds: 3, baths: 2, sqft: 1750, year: 2003, price: 395000, rent: 2300 },
        { address: "7788 Eastern Ave", city: "Las Vegas", state: "NV", zip: "89123", beds: 4, baths: 2.5, sqft: 2300, year: 2009, price: 495000, rent: 2900 },
        { address: "9900 Blue Diamond Rd", city: "Las Vegas", state: "NV", zip: "89178", beds: 5, baths: 4, sqft: 3200, year: 2018, price: 725000, rent: 4200 },
        { address: "2211 Durango Dr", city: "Las Vegas", state: "NV", zip: "89117", beds: 3, baths: 2, sqft: 1600, year: 1996, price: 355000, rent: 2150 },
        { address: "4433 Buffalo Dr", city: "Las Vegas", state: "NV", zip: "89147", beds: 4, baths: 3, sqft: 2600, year: 2014, price: 595000, rent: 3400 },
        { address: "6655 Cheyenne Ave", city: "Las Vegas", state: "NV", zip: "89108", beds: 3, baths: 2, sqft: 1700, year: 2001, price: 385000, rent: 2250 }
    ];

    // Add defaults
    const fullProperties = sample17Properties.map((prop, index) => ({
        ...prop,
        downPercent: 20,
        taxRate: 0.75,
        insuranceRate: 0.35,
        hoaMonthly: index % 3 === 0 ? 75 : 0,
        managementPercent: 8,
        maintenancePercent: 5,
        capexPercent: 4,
        vacancyPercent: 8,
        interestRate: 6.75,
        crimeRisk: ["LOW", "MED", "HIGH"][index % 3],
        floodRisk: "LOW",
        marketRisk: index % 2 === 0 ? "LOW" : "MED"
    }));

    // Save to localStorage
    localStorage.setItem('properties', JSON.stringify(fullProperties));
    
    console.log('✅ Loaded 17 properties to localStorage!');
    console.log('Refresh the page to see them.');
    alert('17 properties loaded! Please refresh the page.');
}
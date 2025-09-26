// Script to populate empty properties with sample data
const db = require('./db');

const propertyData = [
    {
        id: 5,
        address: '5209 Del Monte Ave',
        purchase_price: 325000,
        monthly_rent: 2800,
        bedrooms: 3,
        bathrooms: 2,
        square_footage: 1500,
        year_built: 1962,
        property_tax: 3900,
        insurance: 1200,
        hoa: 0,
        management_fees: 280,
        repairs: 140,
        vacancy: 140,
        capex: 140
    },
    {
        id: 4,
        address: '2053 Palora Ave',
        purchase_price: 310000,
        monthly_rent: 2600,
        bedrooms: 3,
        bathrooms: 1,
        square_footage: 1500,
        year_built: 1963,
        property_tax: 3720,
        insurance: 1100,
        hoa: 0,
        management_fees: 260,
        repairs: 130,
        vacancy: 130,
        capex: 130
    },
    {
        id: 6,
        address: '62 Smith Squire Ct',
        purchase_price: 405000,
        monthly_rent: 3200,
        bedrooms: 3,
        bathrooms: 2.5,
        square_footage: 1500,
        year_built: 2022,
        property_tax: 4860,
        insurance: 1400,
        hoa: 150,
        management_fees: 320,
        repairs: 160,
        vacancy: 160,
        capex: 160
    }
];

async function populateProperties() {
    try {
        for (const prop of propertyData) {
            console.log(`Updating property ${prop.id}: ${prop.address}...`);
            await db.updateProperty(prop.id, prop);
            console.log(`✓ Updated ${prop.address}`);
        }
        console.log('\n✓ All properties populated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error populating properties:', error);
        process.exit(1);
    }
}

// Run the population
populateProperties();
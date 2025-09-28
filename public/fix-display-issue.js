// Fix for property display issue

console.log('🔧 Debugging property display issue...');

// 1. Check properties array
console.log(`Properties array has ${properties.length} items`);
console.log('First 3 properties:', properties.slice(0, 3));

// 2. Check for invalid properties
const invalidProps = properties.filter(p => !p.address || !p.city);
if (invalidProps.length > 0) {
    console.error(`Found ${invalidProps.length} properties with missing address or city:`, invalidProps);
}

// 3. Check current filter values
const filters = {
    city: document.getElementById('filterCity')?.value,
    status: document.getElementById('filterStatus')?.value,
    minCashFlow: document.getElementById('filterMinCashFlow')?.value,
    search: document.getElementById('searchInput')?.value
};
console.log('Current filters:', filters);

// 4. Test getFilteredProperties
const filtered = getFilteredProperties();
console.log(`getFilteredProperties returns ${filtered.length} items`);

// 5. Check if minCashFlow filter is the issue
if (filters.minCashFlow) {
    console.log('Min cash flow filter is set to:', filters.minCashFlow);
    const minCashFlowNum = parseFloat(filters.minCashFlow);
    if (!isNaN(minCashFlowNum)) {
        const passingProps = properties.filter(p => {
            const cashFlow = p.monthlyCashFlow || 0;
            console.log(`Property ${p.address}: cashFlow = ${cashFlow}, passes filter = ${cashFlow >= minCashFlowNum}`);
            return cashFlow >= minCashFlowNum;
        });
        console.log(`Properties passing cash flow filter: ${passingProps.length}`);
    }
}

// 6. Check for calculation issues
properties.forEach((prop, index) => {
    if (!prop.monthlyCashFlow && prop.monthlyRent) {
        console.warn(`Property ${index + 1} (${prop.address}) missing monthlyCashFlow calculation`);
        // Recalculate metrics
        calculatePropertyMetrics(prop);
    }
});

// 7. Apply fix: Reset filters and update display
console.log('🔧 Applying fix: Resetting filters and updating display...');

// Clear all filters
document.getElementById('filterCity').value = '';
document.getElementById('filterStatus').value = '';
document.getElementById('filterMinCashFlow').value = '';
document.getElementById('searchInput').value = '';

// Ensure all properties have metrics calculated
properties.forEach(prop => {
    if (!prop.monthlyCashFlow) {
        calculatePropertyMetrics(prop);
    }
});

// Update display
updateDisplay();

console.log('✅ Fix applied. Properties should now be visible.');

// Check final state
const finalFiltered = getFilteredProperties();
console.log(`After fix: ${finalFiltered.length} properties visible in table`);
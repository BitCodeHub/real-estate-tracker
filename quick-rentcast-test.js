// Quick test to check what fields RentCast returns
// Copy and paste this into the browser console

console.clear();
console.log('🧪 QUICK RENTCAST FIELD TEST\n');

// Pick the first property in the table
const firstRow = document.querySelector('#propertyTableBody tr');
if (!firstRow) {
    console.error('❌ No properties found in table');
} else {
    console.log('📍 Testing with first property in table...');
    
    // Override console.log temporarily to capture the field analysis
    const originalLog = console.log;
    let capturedFields = [];
    
    console.log = function(...args) {
        const message = args.join(' ');
        if (message.includes('FIELD ANALYSIS') || 
            message.includes('Possible RENT field') || 
            message.includes('Possible VALUE field') ||
            message.includes('Data from properties endpoint')) {
            capturedFields.push(message);
        }
        originalLog.apply(console, args);
    };
    
    // Click the refresh button
    const refreshBtn = firstRow.querySelector('.icon-refresh');
    if (refreshBtn) {
        console.log('🔄 Clicking refresh button...\n');
        refreshBtn.click();
        
        // Wait a bit and show summary
        setTimeout(() => {
            console.log = originalLog; // Restore original console.log
            
            console.log('\n📊 SUMMARY OF RENTCAST FIELDS:');
            console.log('================================');
            capturedFields.forEach(field => {
                if (field.includes('💰') || field.includes('🏠')) {
                    console.log(field);
                }
            });
            
            console.log('\n💡 WHAT TO DO NEXT:');
            console.log('1. Look at the fields above');
            console.log('2. Identify which field contains the rent estimate');
            console.log('3. Identify which field contains the value estimate');
            console.log('4. Share these field names so we can update the code');
        }, 3000);
    } else {
        console.error('❌ No refresh button found');
    }
}

console.log('\n✅ Test started - wait 3 seconds for results...');
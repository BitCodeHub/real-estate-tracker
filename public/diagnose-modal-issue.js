// Comprehensive Modal Diagnostic Script
console.log('🔍 MODAL DIAGNOSTIC SCRIPT STARTED');
console.log('='.repeat(50));

// 1. Check if modal functions exist
console.log('1. CHECKING MODAL FUNCTIONS:');
const modalFunctions = ['openAddPropertyModal', 'openAnalyzeModal', 'generateMarketInsights', 'openModal', 'closeModal'];
modalFunctions.forEach(func => {
    const exists = typeof window[func] === 'function';
    console.log(`   ${func}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});

// 2. Check if modal elements exist in DOM
console.log('\n2. CHECKING MODAL ELEMENTS:');
const modalIds = ['addPropertyModal', 'analyzeModal', 'marketInsightsModal', 'propertyModal'];
modalIds.forEach(id => {
    const element = document.getElementById(id);
    console.log(`   ${id}: ${element ? '✅ EXISTS' : '❌ MISSING'}`);
});

// 3. Check for emergency script
console.log('\n3. CHECKING FOR EMERGENCY SCRIPT:');
const htmlContent = document.documentElement.innerHTML;
const hasEmergencyScript = htmlContent.includes('🚨 EMERGENCY FIX: Redefining modal functions');
console.log(`   Emergency script active: ${hasEmergencyScript ? '❌ YES (THIS IS THE PROBLEM!)' : '✅ NO'}`);

// 4. Test each modal function
console.log('\n4. TESTING MODAL FUNCTIONS:');

// Helper to capture console output
function testModalFunction(funcName, modalId) {
    console.log(`\n   Testing ${funcName}:`);
    
    if (typeof window[funcName] !== 'function') {
        console.log(`   ❌ ${funcName} is not defined`);
        return;
    }
    
    try {
        // Store original display value
        const modal = document.getElementById(modalId);
        const originalDisplay = modal ? modal.style.display : null;
        
        // Call the function
        window[funcName]();
        
        // Check if modal opened
        setTimeout(() => {
            if (modal) {
                const isOpen = modal.style.display === 'block' || modal.style.display === 'flex';
                console.log(`   ${isOpen ? '✅' : '❌'} Modal ${modalId} ${isOpen ? 'opened' : 'did not open'}`);
                
                // Close it if it opened
                if (isOpen) {
                    modal.style.display = originalDisplay || 'none';
                }
            }
        }, 100);
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }
}

// Test each function
setTimeout(() => {
    testModalFunction('openAddPropertyModal', 'addPropertyModal');
}, 500);

setTimeout(() => {
    testModalFunction('openAnalyzeModal', 'analyzeModal');
}, 1000);

setTimeout(() => {
    testModalFunction('generateMarketInsights', 'marketInsightsModal');
}, 1500);

// 5. Check for multiple function definitions
console.log('\n5. CHECKING FOR MULTIPLE DEFINITIONS:');
const scriptTags = document.querySelectorAll('script');
let definitionCount = {
    openAnalyzeModal: 0,
    generateMarketInsights: 0
};

scriptTags.forEach((script, index) => {
    const content = script.innerHTML;
    if (content.includes('window.openAnalyzeModal')) {
        definitionCount.openAnalyzeModal++;
        console.log(`   Found openAnalyzeModal definition in script #${index + 1}`);
    }
    if (content.includes('window.generateMarketInsights')) {
        definitionCount.generateMarketInsights++;
        console.log(`   Found generateMarketInsights definition in script #${index + 1}`);
    }
});

Object.entries(definitionCount).forEach(([func, count]) => {
    if (count > 1) {
        console.log(`   ⚠️  WARNING: ${func} is defined ${count} times!`);
    }
});

// 6. Final diagnosis
setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📋 DIAGNOSIS SUMMARY:');
    
    if (hasEmergencyScript) {
        console.log('\n❌ PROBLEM FOUND: Emergency script is overriding working functions!');
        console.log('   The emergency script at line ~4719 is replacing the original working');
        console.log('   functions with broken versions that look for non-existent elements.');
        console.log('\n💡 SOLUTION: Comment out or remove the emergency script section');
        console.log('   (lines 4719-4897 in index.html)');
    } else {
        console.log('\n✅ Emergency script is properly disabled.');
        console.log('   Modal functions should be working correctly.');
    }
    
    console.log('\n' + '='.repeat(50));
}, 2000);
// Mobile Debug Helper - Paste this in browser console to debug mobile issues

console.log('🔍 MOBILE DEBUG HELPER');
console.log('===================');

// Check viewport
console.log(`📱 Viewport Width: ${window.innerWidth}px`);
console.log(`📱 Is Mobile: ${window.innerWidth <= 768 ? 'YES' : 'NO'}`);

// Check mobile elements
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobilePropertyCards = document.getElementById('mobilePropertyCards');
const mobileFilterPanel = document.getElementById('mobileFilterPanel');

console.log('\n📋 MOBILE ELEMENTS:');
console.log('Mobile Nav:', mobileNav ? '✅ Found' : '❌ Not found');
console.log('Mobile Nav Classes:', mobileNav?.className || 'N/A');
console.log('Mobile Cards Container:', mobilePropertyCards ? '✅ Found' : '❌ Not found');
console.log('Mobile Cards Display:', mobilePropertyCards?.style.display || 'N/A');

// Check properties
console.log('\n🏠 PROPERTIES:');
console.log('Total Properties:', window.properties?.length || 0);
console.log('Properties Array:', window.properties ? '✅ Exists' : '❌ Not found');

// Check stats
console.log('\n💰 STATISTICS:');
const statsElements = {
    totalProperties: document.getElementById('totalProperties'),
    totalValue: document.getElementById('totalValue'),
    totalEquity: document.getElementById('totalEquity'),
    monthlyCashFlow: document.getElementById('monthlyCashFlow'),
    avgCashOnCash: document.getElementById('avgCashOnCash')
};

for (const [key, element] of Object.entries(statsElements)) {
    console.log(`${key}: ${element?.textContent || 'Not found'}`);
}

// Try to force mobile view
console.log('\n🔧 FORCING MOBILE VIEW UPDATE...');
if (typeof updateMobilePropertyCards === 'function') {
    updateMobilePropertyCards();
    console.log('✅ Mobile cards updated');
} else {
    console.log('❌ updateMobilePropertyCards function not found');
}

// Check filter elements
console.log('\n🔍 FILTER ELEMENTS:');
const filterElements = ['filterCity', 'filterStatus', 'filterMinCashFlow', 'searchInput'];
filterElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`${id}: ${element ? '✅ Found' : '❌ Not found'}`);
});

// Test mobile nav
console.log('\n🧪 TESTING MOBILE NAV...');
if (typeof openMobileNav === 'function') {
    console.log('Opening mobile nav in 2 seconds...');
    setTimeout(() => {
        openMobileNav();
        console.log('✅ Mobile nav should be open');
        setTimeout(() => {
            closeMobileNav();
            console.log('✅ Mobile nav closed');
        }, 2000);
    }, 2000);
} else {
    console.log('❌ Mobile nav functions not found');
}
// Paste this in browser console to debug mobile property display

console.log('🔍 MOBILE DISPLAY DEBUG');
console.log('===================');

// Check if properties are loaded
console.log(`📊 Properties loaded: ${window.properties?.length || 0}`);
if (window.properties && window.properties.length > 0) {
    console.log('✅ Properties array exists with data');
} else {
    console.log('❌ No properties loaded - this is the issue!');
}

// Check mobile container
const container = document.getElementById('mobilePropertyCards');
console.log(`📱 Mobile container: ${container ? '✅ Found' : '❌ Not found'}`);
if (container) {
    console.log(`   Display: ${container.style.display || 'default'}`);
    console.log(`   Children: ${container.children.length}`);
}

// Check if on mobile
console.log(`📱 Is mobile view: ${window.innerWidth <= 768 ? 'YES' : 'NO'} (width: ${window.innerWidth}px)`);

// Try to reload properties
console.log('\n🔄 Attempting to reload properties...');
if (typeof loadProperties === 'function') {
    loadProperties().then(() => {
        console.log(`✅ Properties reloaded: ${window.properties?.length || 0} properties`);
        if (typeof updateMobilePropertyCards === 'function') {
            updateMobilePropertyCards();
            console.log('✅ Mobile cards updated');
        }
    }).catch(err => {
        console.error('❌ Error loading properties:', err);
    });
} else {
    console.log('❌ loadProperties function not found');
}
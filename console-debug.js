// Debug script to run in the browser console on the main app

console.log('=== Starting Real Estate App Debug ===');

// Check 1: Are properties loaded?
console.log('\n📊 Properties array:', typeof properties !== 'undefined' ? properties : 'NOT DEFINED');
if (typeof properties !== 'undefined') {
    console.log('Number of properties:', properties.length);
}

// Check 2: Are key functions defined?
console.log('\n🔧 Function checks:');
const functionsToCheck = [
    'openAddPropertyModal',
    'openAnalyzeModal',
    'generateMarketInsights',
    'generateAIInsights',
    'addTestProperty',
    'openModal',
    'loadProperties',
    'updateDisplay',
    'setupEventListeners',
    'fetchRentCastData'
];

functionsToCheck.forEach(fn => {
    const exists = typeof window[fn] === 'function';
    console.log(`${exists ? '✅' : '❌'} ${fn}: ${exists ? 'defined' : 'NOT DEFINED'}`);
});

// Check 3: Look for syntax errors
console.log('\n🐛 Checking for syntax errors...');
try {
    // Try to call a simple function
    if (typeof updateDisplay === 'function') {
        console.log('Attempting to call updateDisplay()...');
        updateDisplay();
        console.log('✅ updateDisplay() executed successfully');
    }
} catch (error) {
    console.error('❌ Error calling updateDisplay():', error);
}

// Check 4: DOM elements
console.log('\n📱 DOM element checks:');
const elementsToCheck = [
    'totalProperties',
    'portfolioValue',
    'totalEquity',
    'monthlyCashFlow',
    'avgCocReturn',
    'propertyTableBody',
    'addPropertyForm',
    'filterCity',
    'filterStatus'
];

elementsToCheck.forEach(id => {
    const elem = document.getElementById(id);
    console.log(`${elem ? '✅' : '❌'} #${id}: ${elem ? 'found' : 'NOT FOUND'}`);
});

// Check 5: Event listeners on buttons
console.log('\n🖱️ Button click handler checks:');
const buttons = document.querySelectorAll('button[onclick]');
console.log(`Found ${buttons.length} buttons with onclick handlers`);
buttons.forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    const text = btn.textContent.trim();
    console.log(`- "${text}": ${onclick}`);
});

// Check 6: Try to manually attach event listeners
console.log('\n🔧 Attempting to fix button handlers...');
try {
    // Fix header button handlers
    const addPropertyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add Property') && b.className.includes('btn-primary'));
    if (addPropertyBtn && typeof openAddPropertyModal === 'function') {
        addPropertyBtn.onclick = openAddPropertyModal;
        console.log('✅ Fixed "Add Property" button');
    }
    
    const analyzeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze Property'));
    if (analyzeBtn && typeof openAnalyzeModal === 'function') {
        analyzeBtn.onclick = openAnalyzeModal;
        console.log('✅ Fixed "Analyze Property" button');
    }
    
} catch (error) {
    console.error('❌ Error fixing button handlers:', error);
}

// Check 7: localStorage data
console.log('\n💾 localStorage check:');
const savedProps = localStorage.getItem('properties');
if (savedProps) {
    try {
        const parsed = JSON.parse(savedProps);
        console.log(`✅ Found ${parsed.length} properties in localStorage`);
    } catch (e) {
        console.error('❌ Error parsing localStorage properties:', e);
    }
} else {
    console.log('⚠️ No properties found in localStorage');
}

// Check 8: Try to load properties manually
console.log('\n📥 Attempting manual property load...');
if (typeof loadProperties === 'function') {
    try {
        console.log('Calling loadProperties()...');
        loadProperties().then(() => {
            console.log('✅ loadProperties() completed');
            console.log('Properties after load:', properties);
        }).catch(err => {
            console.error('❌ loadProperties() error:', err);
        });
    } catch (error) {
        console.error('❌ Error calling loadProperties():', error);
    }
}

// Final diagnostic
console.log('\n🏁 Diagnostic Summary:');
console.log('1. Check the console above for any red error messages');
console.log('2. If functions are "NOT DEFINED", there might be a syntax error in the JavaScript');
console.log('3. If DOM elements are "NOT FOUND", the HTML might be malformed');
console.log('4. Try clicking buttons now to see if they work');
console.log('\n=== Debug Complete ===');
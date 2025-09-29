// Quick test to verify you have the latest code version
// Copy and paste this into your browser console

console.clear();
console.log('🔍 Checking code version...\n');

// Find the fetchRentCastData function
const funcString = window.fetchRentCastData ? window.fetchRentCastData.toString() : 'Not found';

// Check for the new code markers
const hasNewCode = funcString.includes('fetching additional data');
const hasValueEndpoint = funcString.includes('value-estimate');
const hasParallelCalls = funcString.includes('Promise.all');

console.log('✅ Code Version Check Results:');
console.log('================================');
console.log(`New logging message: ${hasNewCode ? '✅ FOUND' : '❌ NOT FOUND'}`);
console.log(`Value endpoint call: ${hasValueEndpoint ? '✅ FOUND' : '❌ NOT FOUND'}`);
console.log(`Parallel API calls: ${hasParallelCalls ? '✅ FOUND' : '❌ NOT FOUND'}`);

if (hasNewCode && hasValueEndpoint && hasParallelCalls) {
    console.log('\n🎉 SUCCESS! You have the latest code version.');
    console.log('Try refreshing a property now - it should fetch BOTH rent and value estimates.');
} else {
    console.log('\n❌ OLD CODE DETECTED!');
    console.log('\n📋 To fix:');
    console.log('1. Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) for hard refresh');
    console.log('2. Or right-click refresh button → "Empty Cache and Hard Reload"');
    console.log('3. Then run this test again');
}

// Show a sample of the function to verify
console.log('\n📄 Function snippet:');
const snippet = funcString.substring(funcString.indexOf('Missing estimates'), funcString.indexOf('Missing estimates') + 200);
console.log(snippet || 'Could not extract snippet');
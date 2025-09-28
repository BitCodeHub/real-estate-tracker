// Script to help identify and remove duplicate modal functions
// The duplicate functions are inside DOMContentLoaded and need to be removed

console.log('Duplicate modal functions to remove:');
console.log('1. window.analyzeNewProperty at line 3219 (ends at line 3251)');
console.log('2. window.generateMarketInsights at line 3828');  
console.log('3. window.generateAIInsights at line 4344');

// These functions are already defined outside DOMContentLoaded at:
// - window.analyzeNewProperty at line 1363
// - window.generateMarketInsights at line 1398
// - window.generateAIInsights at line 1425

console.log('\nThe duplicates need to be removed to fix the scope issue.');
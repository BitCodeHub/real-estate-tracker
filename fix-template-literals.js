const fs = require('fs');
const path = require('path');

// Read the index.html file
const filePath = path.join(__dirname, 'public', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Fix escaped backticks
content = content.replace(/\\\`/g, '`');

// Fix escaped dollar signs within template literals
content = content.replace(/\\\$/g, '$');

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed template literal syntax errors in index.html');
console.log('   - Replaced escaped backticks (\\`) with regular backticks (`)');
console.log('   - Replaced escaped dollar signs (\\$) with regular dollar signs ($)');
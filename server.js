const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Real Estate Tracker server running on http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT}`);
    console.log('\nDebug tips:');
    console.log('1. Open browser console (F12) to see debug logs');
    console.log('2. Check if "Properties: 17" shows in the top right');
    console.log('3. In console, type: properties.length');
});
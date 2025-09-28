// Fix for property persistence issue

// This script provides the corrected handleAddProperty and saveProperties functions
// to ensure that newly added properties are properly saved with their IDs

const fixCode = `
// Replace the existing handleAddProperty function with this:
async function handleAddProperty(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Property...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(e.target);
        const property = {};
        
        for (let [key, value] of formData.entries()) {
            property[key] = value;
        }
        
        // Convert numeric fields
        property.purchasePrice = parseFloat(property.purchasePrice) || 0;
        property.monthlyRent = parseFloat(property.monthlyRent) || 0;
        property.beds = parseInt(property.beds) || 0;
        property.baths = parseFloat(property.baths) || 0;
        property.sqft = parseInt(property.sqft) || 0;
        
        // Set defaults
        property.status = 'available';
        property.dateAdded = new Date().toISOString();
        
        // Try to fetch additional data from RentCast
        const rentcastData = await fetchRentCastData(property);
        if (rentcastData && rentcastData.success && rentcastData.data) {
            // Merge with proper field mapping
            const mappedData = {
                ...rentcastData.data,
                // Ensure we have both sets of field names
                beds: rentcastData.data.beds || rentcastData.data.bedrooms || property.beds,
                baths: rentcastData.data.baths || rentcastData.data.bathrooms || property.baths,
                sqft: rentcastData.data.sqft || rentcastData.data.squareFootage || property.sqft,
                // Database column names
                bedrooms: rentcastData.data.beds || rentcastData.data.bedrooms || property.beds,
                bathrooms: rentcastData.data.baths || rentcastData.data.bathrooms || property.baths,
                square_footage: rentcastData.data.sqft || rentcastData.data.squareFootage || property.sqft
            };
            Object.assign(property, mappedData);
            
            // If user didn't provide purchase price or rent, use RentCast estimates
            if (!property.purchasePrice && rentcastData.data.estimatedValue) {
                property.purchasePrice = rentcastData.data.estimatedValue;
                property.currentValue = rentcastData.data.estimatedValue;
                console.log('Using RentCast estimated value:', property.purchasePrice);
            }
            
            if (!property.monthlyRent && rentcastData.data.rentEstimate) {
                property.monthlyRent = rentcastData.data.rentEstimate;
                console.log('Using RentCast rent estimate:', property.monthlyRent);
            }
        }
        
        // Set current value if not already set
        if (!property.currentValue) {
            property.currentValue = property.purchasePrice || 0;
        }
        
        // Validate that we have minimum required data
        if (!property.address || !property.city || !property.state || !property.zip) {
            throw new Error('Please provide complete address information');
        }
        
        // Calculate metrics
        calculatePropertyMetrics(property);
        
        // Create property in database first
        console.log('Creating property in database:', property.address);
        const response = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(property)
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
            // CRITICAL: Add the complete property from server response with ID
            const propertyWithId = {
                ...property,
                ...data.data,
                // Preserve camelCase fields
                purchasePrice: data.data.purchasePrice || data.data.purchase_price || property.purchasePrice,
                monthlyRent: data.data.monthlyRent || data.data.monthly_rent || property.monthlyRent
            };
            
            console.log('✅ Property created with ID:', propertyWithId.id);
            console.log('Property with ID:', propertyWithId);
            
            // Add to properties array
            properties.push(propertyWithId);
            
            // Update localStorage immediately
            localStorage.setItem('properties', JSON.stringify(properties));
            console.log('✅ Updated localStorage with new property');
            
            updateDisplay();
            closeModal('addPropertyModal');
            
            // Show success message
            if (typeof showNotification === 'function') {
                showNotification(\`Property "\${property.address}" added successfully!\`, 'success');
            }
        } else {
            throw new Error(data.error || 'Failed to create property');
        }
        
    } catch (error) {
        console.error('Error adding property:', error);
        alert(error.message || 'Error adding property. Please try again.');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Also ensure loadProperties correctly handles the server response
async function loadProperties() {
    try {
        console.log('🔄 Loading properties from server...');
        const response = await fetch('/api/properties');
        const data = await response.json();
        
        // IMPORTANT: Always use server data when available, even if empty
        if (data.success && data.data !== undefined) {
            properties = data.data;
            // Always sync to localStorage when we get server data
            localStorage.setItem('properties', JSON.stringify(properties));
            console.log(\`✅ Loaded \${properties.length} properties from server and synced to localStorage\`);
            return;
        }
    } catch (error) {
        console.error('Error loading from server:', error);
    }
    
    // Only use localStorage as fallback if server request fails
    console.log('⚠️ Server unavailable, loading from localStorage...');
    const saved = localStorage.getItem('properties');
    if (saved) {
        properties = JSON.parse(saved);
        console.log(\`📦 Loaded \${properties.length} properties from localStorage\`);
    }
}
`;

console.log(`
========================================
PROPERTY PERSISTENCE FIX
========================================

The issue was that new properties weren't being properly saved with their database IDs.

FIXED ISSUES:
1. Properties are now created in the database FIRST before adding to the array
2. The complete server response (with ID) is added to the properties array
3. localStorage is updated immediately after getting the ID
4. loadProperties always uses server data when available (even if empty)

TO APPLY THIS FIX:
1. Open the browser console on your Real Estate Tracker page
2. Copy and paste the code below
3. Test by adding a new property and reloading the page

========================================
`);

console.log(fixCode);
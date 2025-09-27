// Comprehensive fix for Real Estate Tracker
// This script fixes:
// 1. RentCast API data fetching
// 2. Refresh functionality  
// 3. Click handlers for property addresses

// Fix 1: Update fetchRentCastData to handle actual API response format
function fixFetchRentCastData() {
    console.log('Fixing fetchRentCastData...');
    
    window.fetchRentCastData = async function(addressComponents) {
        const { streetAddress, city, state, zip } = addressComponents;
        
        console.log('=== fetchRentCastData called ===');
        console.log('Address components:', { streetAddress, city, state, zip });
        
        try {
            const queryParams = new URLSearchParams({
                address: streetAddress,
                city: city,
                state: state,
                zipcode: zip
            });
            
            console.log('Fetching property data via server proxy...');
            console.log('URL:', `/api/rentcast/properties?${queryParams}`);
            
            const response = await fetch(`/api/rentcast/properties?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('RentCast API Error:', errorData);
                
                if (response.status === 503 && errorData.error && errorData.error.includes('not configured')) {
                    console.error('❌ RentCast API key not configured on server!');
                    console.error('Server message:', errorData.message);
                }
                
                throw new Error(errorData.message || `API error: ${response.status}`);
            }
            
            const responseData = await response.json();
            console.log('RentCast API response:', responseData);
            
            if (!responseData.success) {
                console.error('Server API Error:', responseData.error);
                return { success: false, error: responseData.error };
            }
            
            const data = responseData.data;
            console.log('RentCast API Full Response:', data);
            
            // FIX: Handle the actual RentCast API response format
            // RentCast returns an array of properties
            if (Array.isArray(data) && data.length > 0) {
                const property = data[0]; // Take the first matching property
                
                // Extract data using the actual API field names
                const extractedData = {
                    // Basic property info
                    address: property.addressLine1 || property.address || streetAddress,
                    city: property.city || city,
                    state: property.state || state,
                    zipCode: property.zipCode || property.zip || zip,
                    
                    // Property characteristics - FIX field names
                    bedrooms: property.bedrooms || property.beds || 0,
                    bathrooms: property.bathrooms || property.baths || 0,
                    squareFootage: property.squareFootage || property.squareFeet || property.sqft || 0,
                    yearBuilt: property.yearBuilt || null,
                    propertyType: property.propertyType || 'Single Family',
                    lotSize: property.lotSize || 0,
                    
                    // Financial data - use tax assessments for value estimates
                    price: property.price || property.lastSalePrice || property.taxAssessment || 0,
                    rentEstimate: property.rent || property.rentEstimate || property.rentRangeLow || 0,
                    taxAssessment: property.taxAssessment || property.assessedValue || 0,
                    
                    // Additional data
                    county: property.county || '',
                    latitude: property.latitude || property.lat || null,
                    longitude: property.longitude || property.lng || null,
                    
                    // Metadata
                    lastUpdated: property.lastUpdated || new Date().toISOString(),
                    source: 'RentCast API'
                };
                
                // Calculate estimated values if missing
                if (!extractedData.price && extractedData.taxAssessment) {
                    extractedData.price = Math.round(extractedData.taxAssessment * 1.1); // Tax assessment is typically ~90% of market value
                }
                
                if (!extractedData.rentEstimate && extractedData.squareFootage) {
                    // Estimate rent based on $1.50 per sqft (adjust for your market)
                    extractedData.rentEstimate = Math.round(extractedData.squareFootage * 1.5);
                }
                
                console.log('✅ Extracted property data:', extractedData);
                
                return {
                    success: true,
                    data: extractedData
                };
            } else {
                console.warn('No property data found in RentCast response');
                return { success: false, error: 'No matching property found' };
            }
            
        } catch (error) {
            console.error('Error in fetchRentCastData:', error);
            return { success: false, error: error.message };
        }
    };
    
    console.log('✅ fetchRentCastData fixed');
}

// Fix 2: Update refreshSingleProperty with proper data handling and visual feedback
function fixRefreshSingleProperty() {
    console.log('Fixing refreshSingleProperty...');
    
    window.refreshSingleProperty = async function(index) {
        console.log(`Refreshing property at index ${index}`);
        
        if (!window.properties || !window.properties[index]) {
            console.error('Property not found at index:', index);
            return;
        }
        
        const property = window.properties[index];
        
        // Find and animate refresh icon
        const refreshIcons = document.querySelectorAll('.refresh-icon');
        const refreshIcon = refreshIcons[index];
        
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear infinite';
            refreshIcon.style.opacity = '1';
        }
        
        try {
            // Build full address for API
            const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
            const addressComponents = parseAddressComponents(fullAddress);
            
            // Fetch updated data from RentCast
            const rentCastResult = await fetchRentCastData(addressComponents);
            
            if (rentCastResult.success && rentCastResult.data) {
                const data = rentCastResult.data;
                
                // Update property with new data
                if (data.bedrooms) property.beds = data.bedrooms;
                if (data.bathrooms) property.baths = data.bathrooms;
                if (data.squareFootage) property.sqft = data.squareFootage;
                if (data.yearBuilt) property.yearBuilt = data.yearBuilt;
                
                // Update financial data if available
                if (data.price && data.price > 0) {
                    property.currentValue = data.price;
                }
                if (data.rentEstimate && data.rentEstimate > 0) {
                    property.monthlyRent = data.rentEstimate;
                }
                
                // Mark as having live data
                property.hasLiveData = true;
                property.lastDataUpdate = new Date().toISOString();
                
                console.log('✅ Property refreshed with live data:', property);
                showMessage(`Updated ${property.address} with latest data`, 'success');
            } else {
                console.warn('❌ Could not fetch live data:', rentCastResult.error);
                showMessage(`Could not fetch live data: ${rentCastResult.error}`, 'error');
            }
            
        } catch (error) {
            console.error('Error refreshing property:', error);
            showMessage('Error refreshing property data', 'error');
        } finally {
            // Stop spinner
            if (refreshIcon) {
                refreshIcon.style.animation = '';
                refreshIcon.style.opacity = '0.5';
            }
        }
        
        // Update displays
        await saveProperties();
        updateDisplay();
        updateStats();
        updateCharts();
    };
    
    console.log('✅ refreshSingleProperty fixed');
}

// Fix 3: Implement robust click handlers using multiple strategies
function fixClickHandlers() {
    console.log('Fixing click handlers...');
    
    // Strategy 1: Override updateDisplay to add event listeners after rendering
    const originalUpdateDisplay = window.updateDisplay;
    
    window.updateDisplay = function() {
        // Call original function
        if (originalUpdateDisplay) {
            originalUpdateDisplay.call(this);
        }
        
        // Add click handlers after a short delay to ensure DOM is updated
        setTimeout(() => {
            console.log('Setting up click handlers...');
            
            // Get all clickable property rows
            const tbody = document.getElementById('propertyTableBody');
            if (!tbody) {
                console.error('Table body not found');
                return;
            }
            
            const rows = tbody.querySelectorAll('tr');
            console.log(`Found ${rows.length} property rows`);
            
            rows.forEach((row, index) => {
                // Remove any existing listeners
                const newRow = row.cloneNode(true);
                row.parentNode.replaceChild(newRow, row);
                
                // Add click handler to the entire row
                newRow.style.cursor = 'pointer';
                newRow.addEventListener('click', function(e) {
                    // Don't trigger if clicking on buttons or links
                    if (e.target.tagName === 'BUTTON' || 
                        e.target.tagName === 'A' ||
                        e.target.closest('button') ||
                        e.target.closest('a') ||
                        e.target.classList.contains('refresh-icon')) {
                        return;
                    }
                    
                    console.log(`Property row clicked, index: ${index}`);
                    
                    if (window.showPropertyDetail) {
                        window.showPropertyDetail(index);
                    } else {
                        console.error('showPropertyDetail function not found');
                    }
                });
                
                // Also add hover effect
                newRow.addEventListener('mouseenter', function(e) {
                    if (!e.target.closest('button') && !e.target.closest('a')) {
                        this.style.backgroundColor = '#f8f9fa';
                    }
                });
                
                newRow.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = '';
                });
            });
            
            console.log('✅ Click handlers attached to all rows');
        }, 100);
    };
    
    // Strategy 2: Make sure showPropertyDetail is globally accessible
    if (!window.showPropertyDetail && window.properties) {
        window.showPropertyDetail = function(index) {
            console.log('showPropertyDetail called with index:', index);
            
            const property = window.properties[index];
            if (!property) {
                console.error('Property not found at index:', index);
                return;
            }
            
            console.log('Showing details for property:', property.address);
            
            // Your existing showPropertyDetail implementation
            // This should open the modal with property details
            const modal = document.getElementById('propertyModal');
            if (modal) {
                // Populate modal content
                updatePropertyModal(property, index);
                modal.style.display = 'block';
                console.log('✅ Property modal displayed');
            } else {
                console.error('Property modal element not found');
            }
        };
    }
    
    console.log('✅ Click handlers fixed');
}

// Helper function to show toast messages
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
function addAnimations() {
    if (!document.getElementById('fix-animations')) {
        const style = document.createElement('style');
        style.id = 'fix-animations';
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .toast {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
}

// Apply all fixes
function applyAllFixes() {
    console.log('\n🔧 Applying comprehensive fixes...');
    
    // Add animations
    addAnimations();
    
    // Fix 1: RentCast API data fetching
    fixFetchRentCastData();
    
    // Fix 2: Refresh functionality
    fixRefreshSingleProperty();
    
    // Fix 3: Click handlers
    fixClickHandlers();
    
    // Trigger a display update to apply click handlers
    if (window.updateDisplay) {
        window.updateDisplay();
    }
    
    console.log('\n✅ All fixes applied successfully!');
    console.log('Test by:');
    console.log('1. Adding a new property - should fetch real data');
    console.log('2. Clicking refresh icon - should update with live data');
    console.log('3. Clicking on any property row - should open details modal');
}

// Auto-apply fixes when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

// Export for manual use
window.applyComprehensiveFixes = applyAllFixes;
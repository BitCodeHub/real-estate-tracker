// Mobile Property Display Debug & Fix Script
// This script diagnoses and fixes mobile property display issues

console.log('🔍 Mobile Property Display Debug & Fix Starting...');

// 1. Check if properties variable exists and has data
function checkPropertiesData() {
    console.log('\n📊 Checking Properties Data:');
    if (typeof properties === 'undefined') {
        console.error('❌ ERROR: properties variable is undefined!');
        return false;
    }
    console.log('✅ properties variable exists');
    console.log(`📦 Number of properties: ${properties.length}`);
    
    if (properties.length === 0) {
        console.warn('⚠️ Properties array is empty');
        
        // Check localStorage
        const localData = localStorage.getItem('properties');
        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                console.log(`💾 Found ${parsedData.length} properties in localStorage`);
                if (parsedData.length > 0) {
                    console.log('🔄 Attempting to restore from localStorage...');
                    window.properties = parsedData;
                    return true;
                }
            } catch (e) {
                console.error('❌ Error parsing localStorage data:', e);
            }
        } else {
            console.log('💾 No properties in localStorage either');
        }
        return false;
    }
    
    // Show sample property data
    if (properties.length > 0) {
        console.log('📋 First property:', properties[0]);
    }
    
    return true;
}

// 2. Check DOM elements
function checkDOMElements() {
    console.log('\n🏗️ Checking DOM Elements:');
    
    const container = document.getElementById('mobilePropertyCards');
    if (!container) {
        console.error('❌ ERROR: mobilePropertyCards container not found!');
        return false;
    }
    console.log('✅ mobilePropertyCards container found');
    console.log(`📐 Container display style: ${container.style.display}`);
    console.log(`📏 Container computed display: ${getComputedStyle(container).display}`);
    
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        console.log(`📊 Table container display: ${getComputedStyle(tableContainer).display}`);
    }
    
    return true;
}

// 3. Check if functions exist
function checkFunctions() {
    console.log('\n🔧 Checking Required Functions:');
    
    const requiredFunctions = [
        'updateMobilePropertyCards',
        'createMobilePropertyCard',
        'getFilteredProperties',
        'loadProperties',
        'updateDisplay',
        'formatCurrency'
    ];
    
    let allExist = true;
    requiredFunctions.forEach(func => {
        if (typeof window[func] === 'function') {
            console.log(`✅ ${func} exists`);
        } else {
            console.error(`❌ ERROR: ${func} is not defined!`);
            allExist = false;
        }
    });
    
    return allExist;
}

// 4. Force update mobile display
function forceUpdateMobileDisplay() {
    console.log('\n🔄 Forcing Mobile Display Update...');
    
    const container = document.getElementById('mobilePropertyCards');
    if (!container) {
        console.error('❌ Cannot update: container not found');
        return;
    }
    
    const isMobile = window.innerWidth <= 768;
    console.log(`📱 Is mobile view: ${isMobile}`);
    console.log(`🖥️ Window width: ${window.innerWidth}px`);
    
    if (!isMobile) {
        console.log('ℹ️ Not in mobile view, skipping update');
        return;
    }
    
    // Ensure container is visible
    container.style.display = 'block';
    console.log('✅ Set container display to block');
    
    // Hide table on mobile
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.style.display = 'none';
        console.log('✅ Hidden table container');
    }
    
    // Check if we have properties
    if (!properties || properties.length === 0) {
        console.log('📭 No properties to display');
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-home" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No Properties Yet</h3>
                <p style="margin-bottom: 20px;">Start building your real estate portfolio!</p>
                <button class="btn btn-primary" onclick="openAddPropertyModal()" style="margin-top: 20px;">
                    <i class="fas fa-plus"></i> Add Your First Property
                </button>
                <div style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
                    <p style="font-size: 14px; color: #666;">
                        <strong>Debug Info:</strong><br>
                        Properties loaded: ${properties ? properties.length : 'undefined'}<br>
                        LocalStorage has data: ${localStorage.getItem('properties') ? 'Yes' : 'No'}
                    </p>
                </div>
            </div>
        `;
        return;
    }
    
    // Get filtered properties
    let filteredProperties = properties;
    if (typeof getFilteredProperties === 'function') {
        filteredProperties = getFilteredProperties();
        console.log(`🔍 Filtered properties: ${filteredProperties.length} of ${properties.length}`);
    }
    
    if (filteredProperties.length === 0) {
        console.log('🔍 All properties filtered out');
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-filter" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No Properties Match Filters</h3>
                <p>Try adjusting your search criteria</p>
                <button class="btn btn-secondary" onclick="resetFilters()" style="margin-top: 20px;">
                    <i class="fas fa-times"></i> Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    // Create mobile cards
    console.log(`📱 Creating ${filteredProperties.length} mobile cards...`);
    let cardsHtml = '';
    
    filteredProperties.forEach((property, index) => {
        const globalIndex = properties.indexOf(property);
        if (typeof createMobilePropertyCard === 'function') {
            cardsHtml += createMobilePropertyCard(property, globalIndex);
        } else {
            // Fallback card creation
            cardsHtml += `
                <div class="mobile-property-card" style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0;">${property.address || 'No Address'}</h4>
                    <p style="margin: 5px 0; color: #666;">${property.city || 'Unknown'}, ${property.state || 'XX'} ${property.zip || ''}</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                        <div>
                            <small style="color: #999;">Purchase Price</small>
                            <div style="font-weight: bold;">$${(property.purchasePrice || 0).toLocaleString()}</div>
                        </div>
                        <div>
                            <small style="color: #999;">Monthly Rent</small>
                            <div style="font-weight: bold;">$${(property.monthlyRent || 0).toLocaleString()}</div>
                        </div>
                        <div>
                            <small style="color: #999;">Cash Flow</small>
                            <div style="font-weight: bold; color: ${(property.cashFlow || 0) >= 0 ? 'green' : 'red'}">
                                $${(property.cashFlow || property.monthlyCashFlow || 0).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <small style="color: #999;">CoC Return</small>
                            <div style="font-weight: bold;">
                                ${property.cocReturn || property.cashOnCashReturn ? 
                                    (property.cocReturn || property.cashOnCashReturn).toFixed(1) + '%' : 
                                    'N/A'}
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="showPropertyDetails(${globalIndex})" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px;">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        <button onclick="refreshProperty(${globalIndex})" style="padding: 8px 15px; background: #6c757d; color: white; border: none; border-radius: 4px;">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button onclick="deleteProperty(${globalIndex})" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 4px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = cardsHtml;
    console.log(`✅ Updated container with ${filteredProperties.length} cards`);
}

// 5. Comprehensive fix function
async function applyComprehensiveFix() {
    console.log('\n🛠️ Applying Comprehensive Fix...');
    
    // Step 1: Ensure properties are loaded
    if (!window.properties || window.properties.length === 0) {
        console.log('📥 Attempting to load properties...');
        
        if (typeof loadProperties === 'function') {
            try {
                await loadProperties();
                console.log('✅ Properties loaded successfully');
            } catch (e) {
                console.error('❌ Error loading properties:', e);
            }
        } else {
            // Try to restore from localStorage as fallback
            const localData = localStorage.getItem('properties');
            if (localData) {
                try {
                    window.properties = JSON.parse(localData);
                    console.log('✅ Restored properties from localStorage');
                } catch (e) {
                    console.error('❌ Error parsing localStorage:', e);
                    window.properties = [];
                }
            }
        }
    }
    
    // Step 2: Force update display
    forceUpdateMobileDisplay();
    
    // Step 3: Set up proper event listeners
    if (!window._mobileFixApplied) {
        console.log('📱 Setting up mobile event listeners...');
        
        // Override updateMobilePropertyCards if needed
        const original = window.updateMobilePropertyCards;
        window.updateMobilePropertyCards = function() {
            console.log('🔄 updateMobilePropertyCards called (fixed version)');
            if (original && typeof original === 'function') {
                original.call(this);
            } else {
                forceUpdateMobileDisplay();
            }
        };
        
        // Ensure updates on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const isMobile = window.innerWidth <= 768;
                console.log(`🖥️ Window resized to ${window.innerWidth}px (mobile: ${isMobile})`);
                if (isMobile) {
                    forceUpdateMobileDisplay();
                }
            }, 250);
        });
        
        window._mobileFixApplied = true;
        console.log('✅ Mobile fix applied successfully');
    }
}

// 6. Run all checks and fixes
async function runDebugAndFix() {
    console.log('=====================================');
    console.log('🚀 MOBILE PROPERTY DISPLAY DEBUG & FIX');
    console.log('=====================================');
    
    const hasData = checkPropertiesData();
    const hasDOM = checkDOMElements();
    const hasFunctions = checkFunctions();
    
    console.log('\n📊 Summary:');
    console.log(`- Has property data: ${hasData ? '✅' : '❌'}`);
    console.log(`- DOM elements exist: ${hasDOM ? '✅' : '❌'}`);
    console.log(`- Required functions exist: ${hasFunctions ? '✅' : '❌'}`);
    
    if (!hasData || !hasDOM) {
        console.log('\n⚠️ Critical issues detected, applying fix...');
        await applyComprehensiveFix();
    } else {
        console.log('\n🔄 Forcing display update...');
        forceUpdateMobileDisplay();
    }
    
    console.log('\n✅ Debug & fix complete!');
    console.log('=====================================\n');
}

// Run the debug and fix
runDebugAndFix();

// Export for manual use
window.mobileDebugFix = {
    checkPropertiesData,
    checkDOMElements,
    checkFunctions,
    forceUpdateMobileDisplay,
    applyComprehensiveFix,
    runDebugAndFix
};
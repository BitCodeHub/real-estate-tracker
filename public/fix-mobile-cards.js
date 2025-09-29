// Fix Mobile Property Cards Display
(function() {
    console.log('🔧 Applying mobile property cards fix...');
    
    // Store the original updateMobilePropertyCards function
    const originalUpdateMobilePropertyCards = window.updateMobilePropertyCards;
    
    // Enhanced updateMobilePropertyCards function
    window.updateMobilePropertyCards = function() {
        console.log('📱 updateMobilePropertyCards called');
        const container = document.getElementById('mobilePropertyCards');
        if (!container) {
            console.error('❌ mobilePropertyCards container not found');
            return;
        }
        
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;
        console.log(`📏 Window width: ${window.innerWidth}px, isMobile: ${isMobile}`);
        
        // Get the table container
        const tableContainer = document.querySelector('.table-container');
        
        if (isMobile) {
            // Show mobile cards, hide table
            container.style.display = 'block';
            if (tableContainer) tableContainer.style.display = 'none';
            
            console.log(`📦 Properties count: ${properties.length}`);
            
            // Use the same filter function as the table for consistency
            const filteredProperties = typeof getFilteredProperties === 'function' 
                ? getFilteredProperties() 
                : properties;
            
            console.log(`🔍 Filtered properties: ${filteredProperties.length}`);
            
            if (properties.length === 0) {
                // No properties at all
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                        <i class="fas fa-home" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                        <h3>No Properties Yet</h3>
                        <p style="margin-bottom: 20px;">Start building your real estate portfolio!</p>
                        <button class="btn btn-primary" onclick="openAddPropertyModal()" style="margin-top: 20px;">
                            <i class="fas fa-plus"></i> Add Your First Property
                        </button>
                    </div>
                `;
            } else if (filteredProperties.length === 0) {
                // Properties exist but filtered out
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                        <i class="fas fa-filter" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                        <h3>No Properties Match Filters</h3>
                        <p>Try adjusting your search criteria</p>
                        <button class="btn btn-secondary" onclick="resetFilters()" style="margin-top: 20px;">
                            <i class="fas fa-times"></i> Clear Filters
                        </button>
                    </div>
                `;
            } else {
                // Show property cards
                const cardsHtml = filteredProperties.map((property, index) => {
                    const originalIndex = properties.indexOf(property);
                    return createMobilePropertyCard(property, originalIndex);
                }).join('');
                
                container.innerHTML = cardsHtml;
                console.log(`✅ Created ${filteredProperties.length} mobile property cards`);
            }
        } else {
            // Hide mobile cards, show table
            container.style.display = 'none';
            if (tableContainer) tableContainer.style.display = 'block';
        }
    };
    
    // Also fix the filter panel visibility on mobile
    window.toggleMobileFilters = function() {
        const panel = document.getElementById('mobileFilterPanel');
        const toggle = document.querySelector('.mobile-filter-toggle');
        
        if (panel && toggle) {
            const isActive = panel.classList.contains('active');
            
            if (isActive) {
                panel.classList.remove('active');
                toggle.innerHTML = '<i class="fas fa-filter"></i> Filters & Search';
            } else {
                panel.classList.add('active');
                toggle.innerHTML = '<i class="fas fa-times"></i> Close Filters';
                // Scroll to top of filters
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };
    
    // Ensure mobile cards are updated after data changes
    const originalUpdateDisplay = window.updateDisplay;
    window.updateDisplay = function() {
        if (originalUpdateDisplay) {
            originalUpdateDisplay.call(this);
        }
        // Ensure mobile cards are updated
        updateMobilePropertyCards();
    };
    
    // Force an initial update
    setTimeout(() => {
        console.log('🔄 Forcing initial mobile cards update...');
        updateMobilePropertyCards();
    }, 100);
    
    // Add responsive handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('📐 Window resized, updating mobile cards...');
            updateMobilePropertyCards();
        }, 250);
    });
    
    console.log('✅ Mobile property cards fix applied');
})();
// Fix for modal button lag and delayed response
// The issue: Modal display changes aren't triggering immediate repaints

console.log('🔧 Applying modal lag fix...');

// Function to force browser repaint
function forceRepaint(element) {
    // Force the browser to recalculate styles and repaint
    element.style.display = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.display = 'block';
    
    // Alternative method: toggle a class
    element.classList.add('modal-opening');
    setTimeout(() => element.classList.remove('modal-opening'), 10);
}

// Override the modal functions with immediate repaint
window.openModal = function(modalId) {
    console.log(`Opening modal (with repaint fix): ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        // Set display to block
        modal.style.display = 'block';
        
        // Force immediate repaint
        void modal.offsetWidth; // Force reflow
        
        // Ensure it's visible
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        console.log(`✅ Modal opened with forced repaint: ${modalId}`);
    } else {
        console.error(`Modal not found: ${modalId}`);
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    }
};

// Fix analyze modal with immediate response
window.openAnalyzeModal = function() {
    console.log('Opening Analyze Modal (lag fix)');
    
    // Clear form immediately
    const input = document.getElementById('propertyAddressInput');
    const results = document.getElementById('analysisResults');
    const loading = document.getElementById('analysisLoading');
    
    if (input) input.value = '';
    if (results) results.innerHTML = '';
    if (loading) loading.style.display = 'none';
    
    // Open modal with forced repaint
    const modal = document.getElementById('analyzeModal');
    if (modal) {
        // Remove any animations temporarily
        const originalAnimation = modal.style.animation;
        modal.style.animation = 'none';
        
        // Show modal
        modal.style.display = 'block';
        
        // Force repaint
        void modal.offsetWidth;
        
        // Restore animation after a frame
        requestAnimationFrame(() => {
            modal.style.animation = originalAnimation || '';
        });
    }
};

// Fix market insights with immediate response
window.generateMarketInsights = function() {
    console.log('Opening Market Insights (lag fix)');
    
    const modal = document.getElementById('marketInsightsModal');
    const loading = document.getElementById('marketInsightsLoading');
    const content = document.getElementById('marketInsightsContent');
    
    if (modal) {
        // Remove any animations temporarily
        const originalAnimation = modal.style.animation;
        modal.style.animation = 'none';
        
        // Show modal immediately
        modal.style.display = 'block';
        
        // Force repaint
        void modal.offsetWidth;
        
        // Set loading states
        if (loading) loading.style.display = 'block';
        if (content) content.style.display = 'none';
        
        // Restore animation and load content
        requestAnimationFrame(() => {
            modal.style.animation = originalAnimation || '';
            
            // Load market insights asynchronously
            if (typeof fetchMarketData === 'function') {
                fetchMarketData().then(data => {
                    if (typeof generateMarketInsightsContent === 'function') {
                        const html = generateMarketInsightsContent(data);
                        if (content) content.innerHTML = html;
                    }
                    if (loading) loading.style.display = 'none';
                    if (content) content.style.display = 'block';
                }).catch(error => {
                    console.error('Error loading market insights:', error);
                    if (loading) loading.style.display = 'none';
                    if (content) {
                        content.innerHTML = '<p>Error loading market insights.</p>';
                        content.style.display = 'block';
                    }
                });
            } else {
                // Fallback
                if (loading) loading.style.display = 'none';
                if (content) {
                    content.innerHTML = '<p>Market insights loading...</p>';
                    content.style.display = 'block';
                }
            }
        });
    }
};

console.log('✅ Modal lag fix applied');
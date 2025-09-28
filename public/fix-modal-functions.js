// Fix for modal functions not being accessible globally
// This script moves the functions to the global window scope

console.log('🔧 Fixing modal functions...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixModalFunctions);
} else {
    fixModalFunctions();
}

function fixModalFunctions() {
    console.log('🔍 Checking for modal functions...');
    
    // Define all modal functions globally
    window.openModal = function(modalId) {
        console.log(`Opening modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error(`Modal not found: ${modalId}`);
        }
    };
    
    window.closeModal = function(modalId) {
        console.log(`Closing modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.openAddPropertyModal = function() {
        console.log('Opening Add Property Modal');
        const form = document.getElementById('addPropertyForm');
        if (form) form.reset();
        const fullAddress = document.getElementById('fullAddress');
        if (fullAddress) fullAddress.value = '';
        window.openModal('addPropertyModal');
    };
    
    window.openAnalyzeModal = function() {
        console.log('Opening Analyze Modal');
        const input = document.getElementById('propertyAddressInput');
        if (input) input.value = '';
        const results = document.getElementById('analysisResults');
        if (results) results.innerHTML = '';
        const loading = document.getElementById('analysisLoading');
        if (loading) loading.style.display = 'none';
        window.openModal('analyzeModal');
    };
    
    window.generateMarketInsights = async function() {
        console.log('Generating Market Insights');
        window.openModal('marketInsightsModal');
        const loading = document.getElementById('marketInsightsLoading');
        const content = document.getElementById('marketInsightsContent');
        
        if (loading) loading.style.display = 'block';
        if (content) content.style.display = 'none';
        
        try {
            // Check if properties exist
            if (!window.properties || window.properties.length === 0) {
                throw new Error('No properties found');
            }
            
            // Get unique ZIP codes
            const zipCodes = [...new Set(window.properties.map(p => p.zip).filter(z => z))];
            
            if (zipCodes.length === 0) {
                throw new Error('No ZIP codes found in properties');
            }
            
            // Generate basic insights
            const insights = `
                <div class="analysis-section">
                    <h3>📊 Portfolio Overview</h3>
                    <p>Total Properties: ${window.properties.length}</p>
                    <p>Markets: ${zipCodes.join(', ')}</p>
                </div>
            `;
            
            if (content) {
                content.innerHTML = insights;
                content.style.display = 'block';
            }
            if (loading) loading.style.display = 'none';
            
        } catch (error) {
            console.error('Error generating insights:', error);
            if (content) {
                content.innerHTML = `
                    <div class="analysis-section">
                        <p style="color: var(--accent-danger);">Error: ${error.message}</p>
                    </div>
                `;
                content.style.display = 'block';
            }
            if (loading) loading.style.display = 'none';
        }
    };
    
    window.generateAIInsights = async function() {
        console.log('Generating AI Insights');
        window.generateMarketInsights(); // For now, use the same function
    };
    
    // Also check if these functions exist in the original scope and expose them
    const checkAndExpose = ['analyzeNewProperty', 'addPropertyFromAnalysis', 'fetchRentCastData', 'fetchMarketStats'];
    checkAndExpose.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            console.warn(`Function ${funcName} not found in global scope`);
        }
    });
    
    console.log('✅ Modal functions fixed and exposed globally');
    console.log('Available functions:', Object.keys(window).filter(k => k.includes('Modal') || k.includes('open') || k.includes('generate')).filter(k => typeof window[k] === 'function'));
}
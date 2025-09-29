// This script fixes the modal button issues by ensuring functions are properly accessible

console.log('🔧 Fixing modal functions...');

// Wait for the page to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixModalFunctions);
} else {
    fixModalFunctions();
}

function fixModalFunctions() {
    console.log('🔍 Checking current state...');
    
    // Check if functions exist
    const functionsToCheck = [
        'openModal',
        'closeModal', 
        'openAnalyzeModal',
        'generateMarketInsights',
        'openAddPropertyModal',
        'generateAIInsights'
    ];
    
    console.log('Function availability:');
    functionsToCheck.forEach(funcName => {
        console.log(`- ${funcName}: ${typeof window[funcName]}`);
    });
    
    // If functions don't exist, define them
    if (typeof window.openAnalyzeModal !== 'function') {
        console.log('⚠️ openAnalyzeModal not found, defining it now...');
        
        window.openAnalyzeModal = function() {
            console.log('Opening Analyze Modal');
            const modal = document.getElementById('analyzeModal');
            if (modal) {
                // Reset form
                const addressInput = document.getElementById('propertyAddressInput');
                if (addressInput) addressInput.value = '';
                
                const resultsDiv = document.getElementById('analysisResults');
                if (resultsDiv) resultsDiv.innerHTML = '';
                
                const loadingDiv = document.getElementById('analysisLoading');
                if (loadingDiv) loadingDiv.style.display = 'none';
                
                // Show modal
                modal.style.display = 'block';
            } else {
                console.error('analyzeModal element not found!');
                alert('Analyze modal not found. Please refresh the page.');
            }
        };
    }
    
    if (typeof window.generateMarketInsights !== 'function') {
        console.log('⚠️ generateMarketInsights not found, defining it now...');
        
        window.generateMarketInsights = async function() {
            console.log('Generating Market Insights');
            const modal = document.getElementById('marketInsightsModal');
            if (modal) {
                modal.style.display = 'block';
                
                const loadingDiv = document.getElementById('marketInsightsLoading');
                const contentDiv = document.getElementById('marketInsightsContent');
                
                if (loadingDiv) loadingDiv.style.display = 'block';
                if (contentDiv) contentDiv.style.display = 'none';
                
                try {
                    // Generate mock insights for now
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    if (contentDiv) {
                        contentDiv.innerHTML = `
                            <div style="padding: 20px;">
                                <h3>Market Overview</h3>
                                <p>Market insights functionality is being set up.</p>
                                <p>This will analyze:</p>
                                <ul>
                                    <li>Current market trends</li>
                                    <li>Property performance metrics</li>
                                    <li>Investment opportunities</li>
                                    <li>Risk assessments</li>
                                </ul>
                            </div>
                        `;
                        contentDiv.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Error generating insights:', error);
                    if (contentDiv) {
                        contentDiv.innerHTML = '<p>Error generating insights. Please try again.</p>';
                        contentDiv.style.display = 'block';
                    }
                } finally {
                    if (loadingDiv) loadingDiv.style.display = 'none';
                }
            } else {
                console.error('marketInsightsModal element not found!');
                alert('Market insights modal not found. Please refresh the page.');
            }
        };
    }
    
    // Also ensure modal helper functions exist
    if (typeof window.openModal !== 'function') {
        window.openModal = function(modalId) {
            console.log(`Opening modal: ${modalId}`);
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
            } else {
                console.error(`Modal not found: ${modalId}`);
            }
        };
    }
    
    if (typeof window.closeModal !== 'function') {
        window.closeModal = function(modalId) {
            console.log(`Closing modal: ${modalId}`);
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        };
    }
    
    // Fix button onclick handlers
    console.log('🔧 Checking button onclick handlers...');
    
    const analyzeButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Analyze Property')
    );
    
    const marketButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Market Overview')
    );
    
    if (analyzeButton) {
        console.log('Found Analyze Property button');
        const currentOnclick = analyzeButton.getAttribute('onclick');
        console.log('Current onclick:', currentOnclick);
        
        // Add event listener as backup
        analyzeButton.addEventListener('click', function(e) {
            console.log('Analyze button clicked (event listener)');
            if (window.openAnalyzeModal) {
                window.openAnalyzeModal();
            } else {
                console.error('openAnalyzeModal still not defined!');
            }
        });
    }
    
    if (marketButton) {
        console.log('Found Market Overview button');
        const currentOnclick = marketButton.getAttribute('onclick');
        console.log('Current onclick:', currentOnclick);
        
        // Add event listener as backup
        marketButton.addEventListener('click', function(e) {
            console.log('Market button clicked (event listener)');
            if (window.generateMarketInsights) {
                window.generateMarketInsights();
            } else {
                console.error('generateMarketInsights still not defined!');
            }
        });
    }
    
    console.log('✅ Modal function fixes applied');
    
    // Final verification
    console.log('\n📋 Final function check:');
    functionsToCheck.forEach(funcName => {
        console.log(`- ${funcName}: ${typeof window[funcName]}`);
    });
}

// Also add a global error handler to catch any issues
window.addEventListener('error', function(e) {
    console.error('Global error:', e.message, e.filename, e.lineno, e.colno);
});
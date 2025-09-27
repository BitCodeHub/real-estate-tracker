// Performance and Chart Display Fix for Real Estate Tracker
// This file contains optimizations to improve loading speed and fix chart rendering issues

// 1. Add explicit height constraints for chart canvases
function fixChartHeights() {
    const style = document.createElement('style');
    style.textContent = `
        /* Fix chart container heights */
        .chart-card {
            height: 400px;
            position: relative;
        }
        
        .chart-card canvas {
            max-height: 350px !important;
            height: 350px !important;
        }
        
        /* Ensure proper responsive behavior */
        @media (max-width: 768px) {
            .chart-card {
                height: 300px;
            }
            
            .chart-card canvas {
                max-height: 250px !important;
                height: 250px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// 2. Optimize chart initialization with debouncing
let chartUpdateTimeout;
function optimizedUpdateCharts() {
    clearTimeout(chartUpdateTimeout);
    chartUpdateTimeout = setTimeout(() => {
        if (typeof updateCharts === 'function') {
            updateCharts();
        }
    }, 100);
}

// 3. Replace the original updateCharts function with an optimized version
function replaceUpdateChartsFunction() {
    if (typeof window.updateCharts === 'function') {
        const originalUpdateCharts = window.updateCharts;
        
        window.updateCharts = function() {
            if (!charts.cashFlow || !charts.roi) return;
            
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                // Limit data points if there are too many properties
                const maxDataPoints = 20;
                let displayProperties = properties;
                
                if (properties.length > maxDataPoints) {
                    // Show top properties by ROI
                    displayProperties = [...properties]
                        .sort((a, b) => calculateROI(b) - calculateROI(a))
                        .slice(0, maxDataPoints);
                }
                
                // Prepare data
                const labels = displayProperties.map(prop => {
                    // Shorter labels for better display
                    const address = prop.address || '';
                    return address.length > 15 ? address.substring(0, 15) + '...' : address;
                });
                
                const cashFlowData = displayProperties.map(prop => calculateCashFlow(prop));
                const roiData = displayProperties.map(prop => calculateROI(prop));
                
                // Update Cash Flow Chart with animation disabled for performance
                charts.cashFlow.options.animation = false;
                charts.cashFlow.data.labels = labels;
                charts.cashFlow.data.datasets[0].data = cashFlowData;
                charts.cashFlow.data.datasets[0].backgroundColor = cashFlowData.map(value => 
                    value >= 0 ? 'rgba(72, 187, 120, 0.8)' : 'rgba(245, 101, 101, 0.8)'
                );
                charts.cashFlow.data.datasets[0].borderColor = cashFlowData.map(value => 
                    value >= 0 ? '#48bb78' : '#f56565'
                );
                charts.cashFlow.update('none');
                
                // Update ROI Chart with animation disabled for performance
                charts.roi.options.animation = false;
                charts.roi.data.labels = labels;
                charts.roi.data.datasets[0].data = roiData;
                charts.roi.update('none');
            });
        };
    }
}

// 4. Optimize the initCharts function
function replaceInitChartsFunction() {
    if (typeof window.initCharts === 'function') {
        window.initCharts = function() {
            // Cash Flow Chart with performance optimizations
            const cashFlowCtx = document.getElementById('cashFlowChart').getContext('2d', { willReadFrequently: false });
            charts.cashFlow = new Chart(cashFlowCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Monthly Cash Flow',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false, // Disable animations for faster rendering
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                },
                                maxTicksLimit: 8 // Limit ticks for performance
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Hide legend for cleaner look
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                                }
                            }
                        }
                    }
                }
            });
            
            // ROI Chart with performance optimizations
            const roiCtx = document.getElementById('roiChart').getContext('2d', { willReadFrequently: false });
            charts.roi = new Chart(roiCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'ROI %',
                        data: [],
                        backgroundColor: '#667eea',
                        borderColor: '#5a67d8',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false, // Disable animations for faster rendering
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                },
                                maxTicksLimit: 8 // Limit ticks for performance
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Hide legend for cleaner look
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                                }
                            }
                        }
                    }
                }
            });
        };
    }
}

// 5. Add lazy loading for property table rows
function addLazyLoadingToTable() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    
    let visibleRows = 20;
    const rowIncrement = 20;
    
    // Create intersection observer for infinite scroll
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const tbody = document.getElementById('propertyTableBody');
            const allRows = tbody.querySelectorAll('tr');
            
            if (visibleRows < allRows.length) {
                // Show more rows
                for (let i = visibleRows; i < Math.min(visibleRows + rowIncrement, allRows.length); i++) {
                    allRows[i].style.display = '';
                }
                visibleRows += rowIncrement;
            }
        }
    }, { threshold: 0.1 });
    
    // Create sentinel element
    const sentinel = document.createElement('div');
    sentinel.id = 'table-sentinel';
    sentinel.style.height = '1px';
    tableContainer.appendChild(sentinel);
    observer.observe(sentinel);
}

// 6. Optimize property loading
function optimizePropertyLoading() {
    if (typeof window.loadProperties === 'function') {
        const originalLoadProperties = window.loadProperties;
        
        window.loadProperties = async function() {
            // Show loading indicator immediately
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-overlay';
            loadingDiv.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading properties...</p>
            `;
            loadingDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            document.body.appendChild(loadingDiv);
            
            try {
                // Load properties
                await originalLoadProperties.call(this);
                
                // Remove loading indicator
                setTimeout(() => {
                    loadingDiv.remove();
                }, 300);
            } catch (error) {
                console.error('Error loading properties:', error);
                loadingDiv.remove();
            }
        };
    }
}

// 7. Apply all fixes when DOM is ready
function applyAllFixes() {
    // Apply CSS fixes
    fixChartHeights();
    
    // Wait a bit for original functions to be defined
    setTimeout(() => {
        // Replace functions with optimized versions
        replaceInitChartsFunction();
        replaceUpdateChartsFunction();
        optimizePropertyLoading();
        
        // Re-initialize charts with new settings
        if (typeof initCharts === 'function') {
            // Destroy existing charts first
            if (window.charts && window.charts.cashFlow) {
                window.charts.cashFlow.destroy();
            }
            if (window.charts && window.charts.roi) {
                window.charts.roi.destroy();
            }
            
            // Re-initialize with optimizations
            initCharts();
            
            // Update charts if properties are already loaded
            if (window.properties && window.properties.length > 0) {
                updateCharts();
            }
        }
        
        // Add lazy loading
        addLazyLoadingToTable();
    }, 100);
}

// Apply fixes when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

// Add loading spinner CSS
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Optimize table rendering */
    #propertyTableBody tr {
        will-change: transform;
    }
    
    /* Optimize chart rendering */
    .chart-card {
        will-change: transform;
    }
`;
document.head.appendChild(spinnerStyle);

console.log('Performance optimizations applied successfully');
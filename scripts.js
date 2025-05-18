document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);

    // Initialize charts
    initializeMarketCharts();
    initializePerformanceCharts();

    // Initialize heatmap
    generateHeatmap();

    // Initialize crypto section
    initializeCryptoSection();

    // Set up event listeners
    setupEventListeners();

    // Set default active section
    setActiveSection('stocks');
    
    // For demo purposes, show the account dashboard instead of login form
    // This ensures all account sections are visible
    showAccountDashboard();

    // Initialize Trading Performance section
    initializeTradingPerformance();
});

// Authentication Functions
function showAuthForm() {
    const authContainer = document.getElementById('auth-container');
    const accountDashboard = document.getElementById('account-dashboard');
    
    if (authContainer && accountDashboard) {
        authContainer.style.display = 'block';
        accountDashboard.style.display = 'none';
    }
}

function showAccountDashboard() {
    const authContainer = document.getElementById('auth-container');
    const accountDashboard = document.getElementById('account-dashboard');
    
    if (authContainer && accountDashboard) {
        authContainer.style.display = 'none';
        accountDashboard.style.display = 'block';
    }
}

// Theme Toggle
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Update any active TradingView charts
    updateTradingViewTheme(newTheme);
    
    // Reinitialize charts with new theme
    initializeMarketCharts();
    initializePerformanceCharts();
}

function updateTradingViewTheme(theme) {
    const chartContainer = document.getElementById('asset-chart-container');
    if (chartContainer && chartContainer.innerHTML !== '' && typeof TradingView !== 'undefined') {
        const symbol = document.getElementById('chart-title').textContent.split(' - ')[0];
        if (symbol) {
            initializeTradingViewChart(symbol);
        }
    }
    
    const cryptoChartContainer = document.getElementById('crypto-chart-container');
    if (cryptoChartContainer && cryptoChartContainer.innerHTML !== '' && typeof TradingView !== 'undefined') {
        const symbol = document.getElementById('crypto-chart-title').textContent.split(' - ')[0];
        if (symbol) {
            initializeTradingViewChart(`BINANCE:${symbol}USD`, 'crypto-chart-container', 'crypto-chart-placeholder');
        }
    }
}

// Navigation
function setActiveSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update nav buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        if (button.dataset.section === sectionId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Special handling for performance section
    if (sectionId === 'performance') {
        // Show market selection instead of performance content
        const performanceContent = document.getElementById('performance-content');
        const marketSelection = document.getElementById('performance-market-selection');
        
        if (performanceContent && marketSelection) {
            performanceContent.style.display = 'none';
            marketSelection.style.display = 'flex';
        }
    }
}

// Show performance based on market type
function showPerformance(marketType) {
    const performanceContent = document.getElementById('performance-content');
    const marketSelection = document.getElementById('performance-market-selection');
    
    if (performanceContent && marketSelection) {
        performanceContent.style.display = 'block';
        marketSelection.style.display = 'none';
        
        // Update title to reflect market type
        const performanceTitle = document.getElementById('performance-title');
        if (performanceTitle) {
            performanceTitle.textContent = `${marketType} Trading Performance`;
        }
        
        // Update charts based on market type
        initializePerformanceCharts(marketType);
        
        // Update trading analysis data based on market type
        updateTradingAnalysis(marketType);
    }
}

// Asset Type Toggle
function setActiveAssetType(assetType) {
    document.querySelectorAll('.asset-button').forEach(button => {
        if (button.dataset.assetType === assetType) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Switch to the corresponding section
    if (assetType === 'crypto') {
        setActiveSection('crypto');
    } else if (assetType === 'stocks') {
        setActiveSection('stocks');
    }
}

// Tab Switching
function setActiveTab(tabContainer, tabId) {
    // Hide all tab contents in this container
    tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected tab content
    const tabContent = tabContainer.querySelector(`#${tabId}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Update tab buttons
    tabContainer.querySelectorAll('.tab-button').forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Chart Initialization
function initializeMarketCharts() {
    // Sample data for charts
    const labels = Array.from({ length: 30 }, (_, i) => i + 1);
    
    const dowData = {
        labels: labels,
        datasets: [{
            label: 'DOW',
            data: generateChartData(40000, 500, 30),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    const nasdaqData = {
        labels: labels,
        datasets: [{
            label: 'NASDAQ',
            data: generateChartData(17500, 300, 30),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    const spData = {
        labels: labels,
        datasets: [{
            label: 'S&P 500',
            data: generateChartData(5200, 100, 30),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    const russellData = {
        labels: labels,
        datasets: [{
            label: 'RUSSELL 2000',
            data: generateChartData(2000, 50, 30),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 5,
                hitRadius: 30
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'index',
            intersect: false
        }
    };
    
    // Create charts
    try {
        const dowChart = document.getElementById('dow-chart');
        if (dowChart) {
            // Destroy existing chart if it exists
            if (dowChart.chart) {
                dowChart.chart.destroy();
            }
            
            dowChart.chart = new Chart(dowChart, {
                type: 'line',
                data: dowData,
                options: chartOptions
            });
        }
        
        const nasdaqChart = document.getElementById('nasdaq-chart');
        if (nasdaqChart) {
            if (nasdaqChart.chart) {
                nasdaqChart.chart.destroy();
            }
            
            nasdaqChart.chart = new Chart(nasdaqChart, {
                type: 'line',
                data: nasdaqData,
                options: chartOptions
            });
        }
        
        const spChart = document.getElementById('sp-chart');
        if (spChart) {
            if (spChart.chart) {
                spChart.chart.destroy();
            }
            
            spChart.chart = new Chart(spChart, {
                type: 'line',
                data: spData,
                options: chartOptions
            });
        }
        
        const russellChart = document.getElementById('russell-chart');
        if (russellChart) {
            if (russellChart.chart) {
                russellChart.chart.destroy();
            }
            
            russellChart.chart = new Chart(russellChart, {
                type: 'line',
                data: russellData,
                options: chartOptions
            });
        }
    } catch (error) {
        console.error('Error initializing market charts:', error);
    }
}

function initializePerformanceCharts(marketType = 'Stocks') {
    try {
        // Generate different data based on market type
        const baseValue = marketType === 'Crypto' ? 5000 : 10000;
        const volatility = marketType === 'Crypto' ? 800 : 500;
        const winRate = marketType === 'Crypto' ? 62 : 68;
        
        // Equity Curve Chart
        const equityCurveData = {
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Equity',
                data: generateChartData(baseValue, volatility, 30, true),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };
        
        const equityCurveOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `$${value.toLocaleString()}`;
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        };
        
        const equityCurveChart = document.getElementById('equity-curve-chart');
        if (equityCurveChart) {
            // Destroy existing chart if it exists
            if (equityCurveChart.chart) {
                equityCurveChart.chart.destroy();
            }
            
            equityCurveChart.chart = new Chart(equityCurveChart, {
                type: 'line',
                data: equityCurveData,
                options: equityCurveOptions
            });
        }
        
        // Win/Loss Distribution Chart
        const winLossData = {
            labels: ['Wins', 'Losses'],
            datasets: [{
                data: [winRate, 100 - winRate],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0
            }]
        };
        
        const winLossOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };
        
        const winLossChart = document.getElementById('win-loss-chart');
        if (winLossChart) {
            // Destroy existing chart if it exists
            if (winLossChart.chart) {
                winLossChart.chart.destroy();
            }
            
            winLossChart.chart = new Chart(winLossChart, {
                type: 'doughnut',
                data: winLossData,
                options: winLossOptions
            });
        }
        
        // Setup Type Strategy Chart
        const setupData = {
            labels: marketType === 'Crypto' ? 
                ['Moving Avg', 'RSI', 'MACD', 'Bollinger', 'Support/Resistance'] : 
                ['Moving Avg', 'VWAP', 'Aroon', 'Fibonacci', 'Price Action'],
            datasets: [{
                data: marketType === 'Crypto' ? [35, 25, 15, 15, 10] : [30, 20, 20, 15, 15],
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'
                ],
                borderWidth: 0
            }]
        };
        
        const setupOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };
        
        const setupChart = document.getElementById('setup-chart');
        if (setupChart) {
            // Destroy existing chart if it exists
            if (setupChart.chart) {
                setupChart.chart.destroy();
            }
            
            setupChart.chart = new Chart(setupChart, {
                type: 'pie',
                data: setupData,
                options: setupOptions
            });
        }
        
        // Market Condition Chart
        const marketConditionData = {
            labels: ['Volatile', 'Regular', 'Range-bound'],
            datasets: [{
                data: marketType === 'Crypto' ? [45, 30, 25] : [25, 40, 35],
                backgroundColor: [
                    '#ef4444', '#f59e0b', '#3b82f6'
                ],
                borderWidth: 0
            }]
        };
        
        const marketConditionOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };
        
        const marketConditionChart = document.getElementById('market-condition-chart');
        if (marketConditionChart) {
            // Destroy existing chart if it exists
            if (marketConditionChart.chart) {
                marketConditionChart.chart.destroy();
            }
            
            marketConditionChart.chart = new Chart(marketConditionChart, {
                type: 'doughnut',
                data: marketConditionData,
                options: marketConditionOptions
            });
        }
        
        // Mistakes Made Chart
        const mistakesData = {
            labels: ['Yes', 'No'],
            datasets: [{
                data: marketType === 'Crypto' ? [35, 65] : [28, 72],
                backgroundColor: [
                    '#ef4444', '#10b981'
                ],
                borderWidth: 0
            }]
        };
        
        const mistakesOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };
        
        const mistakesChart = document.getElementById('mistakes-chart');
        if (mistakesChart) {
            // Destroy existing chart if it exists
            if (mistakesChart.chart) {
                mistakesChart.chart.destroy();
            }
            
            mistakesChart.chart = new Chart(mistakesChart, {
                type: 'pie',
                data: mistakesData,
                options: mistakesOptions
            });
        }
    } catch (error) {
        console.error('Error initializing performance charts:', error);
    }
}

// Update trading analysis data
function updateTradingAnalysis(marketType) {
    // Update entry/exit reasons
    const entryExitList = document.getElementById('entry-exit-list');
    if (entryExitList) {
        entryExitList.innerHTML = '';
        
        // Different reasons based on market type
        const reasons = marketType === 'Crypto' ? [
            { type: 'Entry', reason: 'RSI oversold condition on 4h chart', date: '2023-05-01' },
            { type: 'Exit', reason: 'Price target reached at resistance level', date: '2023-05-03' },
            { type: 'Entry', reason: 'MACD crossover on daily chart', date: '2023-05-10' },
            { type: 'Exit', reason: 'Stop loss triggered after news event', date: '2023-05-12' },
            { type: 'Entry', reason: 'Support level bounce with volume confirmation', date: '2023-05-20' }
        ] : [
            { type: 'Entry', reason: 'Breakout above 50-day moving average with volume', date: '2023-05-02' },
            { type: 'Exit', reason: 'Profit target reached at 15% gain', date: '2023-05-08' },
            { type: 'Entry', reason: 'Gap up with strong sector momentum', date: '2023-05-15' },
            { type: 'Exit', reason: 'Bearish divergence on RSI', date: '2023-05-18' },
            { type: 'Entry', reason: 'Aroon oscillator crossover with trend confirmation', date: '2023-05-25' }
        ];
        
        reasons.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.type}</td>
                <td>${item.reason}</td>
                <td>${item.date}</td>
                <td>
                    <button class="icon-button"><i class="fas fa-edit"></i></button>
                    <button class="icon-button"><i class="fas fa-trash"></i></button>
                </td>
            `;
            entryExitList.appendChild(row);
        });
    }
    
    // Update setup types
    const setupList = document.getElementById('setup-list');
    if (setupList) {
        setupList.innerHTML = '';
        
        // Different setups based on market type
        const setups = marketType === 'Crypto' ? [
            { name: 'Moving Average Crossover', success: '78%', trades: 23 },
            { name: 'RSI Divergence', success: '65%', trades: 17 },
            { name: 'MACD Signal', success: '70%', trades: 10 },
            { name: 'Bollinger Band Squeeze', success: '62%', trades: 8 },
            { name: 'Support/Resistance Bounce', success: '75%', trades: 12 }
        ] : [
            { name: 'Moving Average Pullback', success: '72%', trades: 18 },
            { name: 'VWAP Reversal', success: '68%', trades: 15 },
            { name: 'Aroon Oscillator', success: '75%', trades: 12 },
            { name: 'Fibonacci Retracement', success: '70%', trades: 10 },
            { name: 'Price Action Pattern', success: '65%', trades: 14 }
        ];
        
        setups.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.success}</td>
                <td>${item.trades}</td>
                <td>
                    <button class="icon-button"><i class="fas fa-edit"></i></button>
                    <button class="icon-button"><i class="fas fa-trash"></i></button>
                </td>
            `;
            setupList.appendChild(row);
        });
    }
    
    // Update mistakes list
    const mistakesList = document.getElementById('mistakes-list');
    if (mistakesList) {
        mistakesList.innerHTML = '';
        
        // Different mistakes based on market type
        const mistakes = marketType === 'Crypto' ? [
            { trade: 'BTC Long', date: '2023-05-02', mistake: 'Yes', notes: 'Entered too early before confirmation' },
            { trade: 'ETH Short', date: '2023-05-08', mistake: 'No', notes: 'Followed plan exactly' },
            { trade: 'SOL Long', date: '2023-05-15', mistake: 'Yes', notes: 'Position size too large' },
            { trade: 'ADA Long', date: '2023-05-22', mistake: 'No', notes: 'Good entry and management' },
            { trade: 'DOT Short', date: '2023-05-28', mistake: 'Yes', notes: 'Ignored stop loss level' }
        ] : [
            { trade: 'AAPL Long', date: '2023-05-03', mistake: 'No', notes: 'Followed trading plan' },
            { trade: 'MSFT Long', date: '2023-05-10', mistake: 'Yes', notes: 'Chased entry after gap up' },
            { trade: 'TSLA Short', date: '2023-05-17', mistake: 'No', notes: 'Good risk management' },
            { trade: 'AMZN Long', date: '2023-05-24', mistake: 'Yes', notes: 'Moved stop loss too tight' },
            { trade: 'NVDA Long', date: '2023-05-30', mistake: 'No', notes: 'Perfect execution' }
        ];
        
        mistakes.forEach(item => {
            const row = document.createElement('tr');
            const mistakeClass = item.mistake === 'Yes' ? 'negative' : 'positive';
            
            row.innerHTML = `
                <td>${item.trade}</td>
                <td>${item.date}</td>
                <td class="${mistakeClass}">${item.mistake}</td>
                <td>${item.notes}</td>
                <td>
                    <button class="icon-button"><i class="fas fa-edit"></i></button>
                    <button class="icon-button"><i class="fas fa-trash"></i></button>
                </td>
            `;
            mistakesList.appendChild(row);
        });
    }
}

// Initialize Crypto Section
function initializeCryptoSection() {
    const cryptoResults = document.getElementById('crypto-results');
    if (!cryptoResults) return;
    
    // Create results tabs structure similar to stocks section
    cryptoResults.innerHTML = `
        <div class="results-tabs">
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="results">Results</button>
                <button class="tab-button" data-tab="charts">Charts</button>
                <button class="tab-button" data-tab="heatmap">Heatmap</button>
            </div>
            <div class="tab-content active" id="results-tab">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticker <i class="fas fa-sort"></i></th>
                                <th>Name <i class="fas fa-sort"></i></th>
                                <th>Category <i class="fas fa-sort"></i></th>
                                <th>Exchange <i class="fas fa-sort"></i></th>
                                <th class="text-right">Market Cap <i class="fas fa-sort"></i></th>
                                <th>Price <i class="fas fa-sort"></i></th>
                                <th>Change <i class="fas fa-sort"></i></th>
                                <th class="text-right">Volume <i class="fas fa-sort"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="clickable-row" data-asset-id="crypto-1">
                                <td><a href="#" class="asset-link">BTC</a></td>
                                <td>Bitcoin</td>
                                <td>Currency</td>
                                <td>Multiple</td>
                                <td class="text-right">$1,250.00B</td>
                                <td class="text-right">$64,325.78</td>
                                <td class="text-right positive">+2.35%</td>
                                <td class="text-right">$45.2B</td>
                            </tr>
                            <tr class="clickable-row" data-asset-id="crypto-2">
                                <td><a href="#" class="asset-link">ETH</a></td>
                                <td>Ethereum</td>
                                <td>Smart Contract Platform</td>
                                <td>Multiple</td>
                                <td class="text-right">$420.00B</td>
                                <td class="text-right">$3,487.92</td>
                                <td class="text-right positive">+1.87%</td>
                                <td class="text-right">$18.5B</td>
                            </tr>
                            <tr class="clickable-row" data-asset-id="crypto-3">
                                <td><a href="#" class="asset-link">SOL</a></td>
                                <td>Solana</td>
                                <td>Smart Contract Platform</td>
                                <td>Multiple</td>
                                <td class="text-right">$78.00B</td>
                                <td class="text-right">$152.34</td>
                                <td class="text-right negative">-0.92%</td>
                                <td class="text-right">$3.2B</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="tab-content" id="charts-tab">
                <div class="chart-view">
                    <div class="chart-header">
                        <h3 id="crypto-chart-title">Select an asset</h3>
                        <div class="chart-controls">
                            <div class="chart-type-toggle">
                                <button class="chart-button active" data-chart-type="candle">Candle</button>
                                <button class="chart-button" data-chart-type="line">Line</button>
                                <button class="chart-button" data-chart-type="bar">Bar</button>
                            </div>
                            <div class="chart-period-toggle">
                                <button class="chart-button">1d</button>
                                <button class="chart-button">1w</button>
                                <button class="chart-button active">1m</button>
                                <button class="chart-button">3m</button>
                                <button class="chart-button">1y</button>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container extra-large-chart" id="crypto-chart-container">
                        <div class="chart-placeholder" id="crypto-chart-placeholder">
                            Select an asset from the results table to view chart
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="heatmap-tab">
                <div class="heatmap-container">
                    <div class="heatmap-header">
                        <h3>Crypto Heatmap</h3>
                        <div class="heatmap-filters">
                            <button class="button-outline active">All</button>
                            <button class="button-outline">Currency</button>
                            <button class="button-outline">Smart Contract</button>
                            <button class="button-outline">DeFi</button>
                            <button class="button-outline">NFT</button>
                            <button class="button-outline">Metaverse</button>
                        </div>
                    </div>
                    <div class="heatmap-grid" id="crypto-heatmap-grid">
                        <!-- Heatmap items will be generated by JavaScript -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Generate crypto heatmap
    generateCryptoHeatmap();
    
    // Add event listeners for crypto section
    setupCryptoEventListeners();
}

// Helper function to generate random chart data
function generateChartData(baseValue, volatility, length, uptrend = false) {
    let value = baseValue;
    const data = [];
    
    for (let i = 0; i < length; i++) {
        const change = (Math.random() - (uptrend ? 0.3 : 0.5)) * volatility;
        value += change;
        data.push(value);
    }
    
    return data;
}

// Generate stock heatmap
function generateHeatmap() {
    const heatmapGrid = document.getElementById('heatmap-grid');
    if (!heatmapGrid) return;
    
    heatmapGrid.innerHTML = '';
    
    // Stock sectors and tickers
    const sectors = [
        { name: 'Technology', tickers: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'] },
        { name: 'Healthcare', tickers: ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK'] },
        { name: 'Financial', tickers: ['JPM', 'BAC', 'WFC', 'C', 'GS'] },
        { name: 'Consumer', tickers: ['AMZN', 'TSLA', 'HD', 'MCD', 'NKE'] },
        { name: 'Energy', tickers: ['XOM', 'CVX', 'COP', 'SLB', 'EOG'] }
    ];
    
    // Generate heatmap items
    sectors.forEach(sector => {
        sector.tickers.forEach(ticker => {
            const isPositive = Math.random() > 0.4;
            const intensity = Math.min(0.4 + Math.random() * 0.6, 1);
            const size = Math.random() > 0.8 ? 2 : 1;
            const changePercent = (Math.random() * 5).toFixed(2);
            
            const item = document.createElement('div');
            item.className = 'heatmap-item';
            
            if (size > 1) {
                item.style.gridColumn = `span ${size}`;
                item.style.gridRow = `span ${size}`;
            }
            
            item.style.backgroundColor = isPositive 
                ? `rgba(16, 185, 129, ${intensity})`
                : `rgba(239, 68, 68, ${intensity})`;
            
            item.innerHTML = `
                <div style="font-weight: bold;">${ticker}</div>
                <div style="font-size: 0.75rem;">${sector.name}</div>
                <div style="font-size: 0.875rem; font-weight: 600;">${isPositive ? '+' : '-'}${changePercent}%</div>
            `;
            
            item.addEventListener('click', function() {
                document.getElementById('chart-title').textContent = `${ticker} - ${sector.name}`;
                
                // Switch to charts tab
                const tabContainer = document.querySelector('.results-tabs');
                setActiveTab(tabContainer, 'charts');
                
                // Initialize chart
                initializeTradingViewChart(`NASDAQ:${ticker}`);
            });
            
            heatmapGrid.appendChild(item);
        });
    });
}

// Generate crypto heatmap
function generateCryptoHeatmap() {
    const heatmapGrid = document.getElementById('crypto-heatmap-grid');
    if (!heatmapGrid) return;
    
    heatmapGrid.innerHTML = '';
    
    // Crypto categories and tickers
    const categories = [
        { name: 'Currency', tickers: ['BTC', 'LTC', 'BCH', 'XMR', 'DASH'] },
        { name: 'Smart Contract', tickers: ['ETH', 'SOL', 'ADA', 'AVAX', 'DOT'] },
        { name: 'DeFi', tickers: ['UNI', 'AAVE', 'MKR', 'COMP', 'CAKE'] },
        { name: 'NFT', tickers: ['APE', 'SAND', 'MANA', 'AXS', 'ENJ'] },
        { name: 'Metaverse', tickers: ['GALA', 'ILV', 'WAXP', 'ATLAS', 'BLOK'] }
    ];
    
    // Generate heatmap items
    categories.forEach(category => {
        category.tickers.forEach(ticker => {
            const isPositive = Math.random() > 0.4;
            const intensity = Math.min(0.4 + Math.random() * 0.6, 1);
            const size = Math.random() > 0.8 ? 2 : 1;
            const changePercent = (Math.random() * 8).toFixed(2);
            
            const item = document.createElement('div');
            item.className = 'heatmap-item';
            
            if (size > 1) {
                item.style.gridColumn = `span ${size}`;
                item.style.gridRow = `span ${size}`;
            }
            
            item.style.backgroundColor = isPositive 
                ? `rgba(16, 185, 129, ${intensity})`
                : `rgba(239, 68, 68, ${intensity})`;
            
            item.innerHTML = `
                <div style="font-weight: bold;">${ticker}</div>
                <div style="font-size: 0.75rem;">${category.name}</div>
                <div style="font-size: 0.875rem; font-weight: 600;">${isPositive ? '+' : '-'}${changePercent}%</div>
            `;
            
            item.addEventListener('click', function() {
                document.getElementById('crypto-chart-title').textContent = `${ticker} - ${category.name}`;
                
                // Switch to charts tab
                const tabContainer = document.querySelector('#crypto .results-tabs');
                setActiveTab(tabContainer, 'charts');
                
                // Initialize chart
                initializeTradingViewChart(`BINANCE:${ticker}USD`, 'crypto-chart-container', 'crypto-chart-placeholder');
            });
            
            heatmapGrid.appendChild(item);
        });
    });
}

// Initialize TradingView chart
let TradingView = window.TradingView;

function initializeTradingViewChart(symbol, containerId = 'asset-chart-container', placeholderId = 'chart-placeholder') {
    const container = document.getElementById(containerId);
    const placeholder = document.getElementById(placeholderId);
    
    if (!container) return;
    
    // Clear previous chart
    container.innerHTML = '';
    
    // Create a new div for the chart
    const chartDiv = document.createElement('div');
    chartDiv.id = containerId + '-widget';
    chartDiv.style.height = '100%';
    container.appendChild(chartDiv);
    
    // Initialize TradingView widget
    if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
            width: '100%',
            height: '100%',
            symbol: symbol,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: containerId + '-widget',
        });
        
        // Hide placeholder
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    } else {
        console.error('TradingView library is not loaded.');
        // Optionally display a message to the user that the chart cannot be loaded.
        if (placeholder) {
            placeholder.textContent = 'TradingView chart could not be loaded. Please check your internet connection or try again later.';
            placeholder.style.display = 'flex';
        }
    }
}

// Set up crypto event listeners
function setupCryptoEventListeners() {
    // Tab switching
    const cryptoTabButtons = document.querySelectorAll('#crypto .tab-buttons .tab-button');
    if (cryptoTabButtons.length > 0) {
        const tabContainer = document.querySelector('#crypto .results-tabs');
        
        cryptoTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                setActiveTab(tabContainer, this.dataset.tab);
            });
        });
    }
    
    // Asset selection for chart
    const cryptoRows = document.querySelectorAll('#crypto .clickable-row');
    cryptoRows.forEach(row => {
        row.addEventListener('click', function() {
            const assetTicker = this.querySelector('.asset-link').textContent;
            const assetName = this.querySelector('td:nth-child(2)').textContent;
            
            // Update chart title
            const chartTitle = document.getElementById('crypto-chart-title');
            if (chartTitle) {
                chartTitle.textContent = `${assetTicker} - ${assetName}`;
            }
            
            // Switch to charts tab
            const tabContainer = document.querySelector('#crypto .results-tabs');
            setActiveTab(tabContainer, 'charts');
            
            // Initialize chart
            initializeTradingViewChart(`BINANCE:${assetTicker}USD`, 'crypto-chart-container', 'crypto-chart-placeholder');
        });
    });
    
    // Chart type toggle
    const chartTypeButtons = document.querySelectorAll('#crypto .chart-type-toggle .chart-button');
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#crypto .chart-type-toggle .chart-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Would update chart type in a real implementation
            const chartType = this.dataset.chartType;
            updateChartType('crypto-chart-container', chartType);
        });
    });
    
    // Chart period toggle
    const chartPeriodButtons = document.querySelectorAll('#crypto .chart-period-toggle .chart-button');
    chartPeriodButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#crypto .chart-period-toggle .chart-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Would update chart period in a real implementation
        });
    });
}

// Update chart type
function updateChartType(containerId, chartType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // In a real implementation, this would update the chart type
    // For TradingView, we would need to reinitialize the widget with the new chart type
    console.log(`Updating chart type to ${chartType} for container ${containerId}`);
    
    // For demonstration purposes, show a toast notification
    showToast(`Chart type changed to ${chartType}`);
}

// Set up all event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            setActiveSection(this.dataset.section);
        });
    });
    
    // Performance market selection
    document.querySelectorAll('.market-selection-button').forEach(button => {
        button.addEventListener('click', function() {
            const marketType = this.dataset.marketType;
            showPerformance(marketType);
        });
    });
    
    // Trading analysis tabs
    document.querySelectorAll('.analysis-tabs .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = document.querySelector('.analysis-tabs');
            setActiveTab(tabContainer, this.dataset.tab);
        });
    });
    
    // Add entry/exit reason
    const addEntryExitButton = document.getElementById('add-entry-exit-button');
    if (addEntryExitButton) {
        addEntryExitButton.addEventListener('click', function() {
            openModal('entry-exit-modal');
        });
    }
    
    // Add setup type
    const addSetupButton = document.getElementById('add-setup-button');
    if (addSetupButton) {
        addSetupButton.addEventListener('click', function() {
            openModal('setup-modal');
        });
    }
    
    // Add mistake
    const addMistakeButton = document.getElementById('add-mistake-button');
    if (addMistakeButton) {
        addMistakeButton.addEventListener('click', function() {
            openModal('mistake-modal');
        });
    }
    
    // Entry/exit form submission
    const entryExitForm = document.getElementById('entry-exit-form');
    if (entryExitForm) {
        entryExitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('entry-exit-type').value;
            const reason = document.getElementById('entry-exit-reason').value;
            const date = document.getElementById('entry-exit-date').value;
            
            // Add to entry/exit list
            addEntryExitReason(type, reason, date);
            
            // Close modal
            closeModal('entry-exit-modal');
            
            // Reset form
            this.reset();
            
            // Show confirmation
            showToast(`${type} reason added`);
        });
    }
    
    // Setup form submission
    const setupForm = document.getElementById('setup-form');
    if (setupForm) {
        setupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('setup-name').value;
            const success = document.getElementById('setup-success').value;
            const trades = document.getElementById('setup-trades').value;
            
            // Add to setup list
            addSetupType(name, success, trades);
            
            // Close modal
            closeModal('setup-modal');
            
            // Reset form
            this.reset();
            
            // Show confirmation
            showToast(`Setup type added`);
        });
    }
    
    // Mistake form submission
    const mistakeForm = document.getElementById('mistake-form');
    if (mistakeForm) {
        mistakeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const trade = document.getElementById('mistake-trade').value;
            const date = document.getElementById('mistake-date').value;
            const mistake = document.getElementById('mistake-made').value;
            const notes = document.getElementById('mistake-notes').value;
            
            // Add to mistakes list
            addMistake(trade, date, mistake, notes);
            
            // Close modal
            closeModal('mistake-modal');
            
            // Reset form
            this.reset();
            
            // Show confirmation
            showToast(`Mistake record added`);
        });
    }
    
    // Asset type toggle
    document.querySelectorAll('.asset-button').forEach(button => {
        button.addEventListener('click', function() {
            setActiveAssetType(this.dataset.assetType);
        });
    });
    
    // Tab switching
    document.querySelectorAll('.tab-buttons').forEach(tabButtons => {
        const tabContainer = tabButtons.closest('.filter-tabs, .results-tabs, .account-tabs, .auth-tabs');
        
        tabButtons.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function() {
                setActiveTab(tabContainer, this.dataset.tab);
            });
        });
    });
    
    // Modal handling
    const notificationsButton = document.getElementById('notifications-button');
    if (notificationsButton) {
        notificationsButton.addEventListener('click', function() {
            openModal('notification-modal');
        });
    }
    
    const brokerSelect = document.getElementById('broker-select');
    if (brokerSelect) {
        brokerSelect.addEventListener('change', function() {
            if (this.value !== 'none') {
                openModal('broker-modal');
                this.value = 'none'; // Reset select
            }
        });
    }
    
    // Close buttons for modals
    document.querySelectorAll('.close-button, #cancel-broker-connect, #cancel-alert, #cancel-trade, #cancel-close-trade, #cancel-entry-exit, #cancel-setup, #cancel-mistake').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // New alert button
    const newAlertButton = document.getElementById('new-alert-button');
    if (newAlertButton) {
        newAlertButton.addEventListener('click', function() {
            openModal('alert-modal');
        });
    }
    
    // Asset selection for chart
    document.querySelectorAll('#stocks .clickable-row').forEach(row => {
        row.addEventListener('click', function() {
            const assetTicker = this.querySelector('.asset-link').textContent;
            const assetName = this.querySelector('td:nth-child(2)').textContent;
            
            // Update chart title
            const chartTitle = document.getElementById('chart-title');
            if (chartTitle) {
                chartTitle.textContent = `${assetTicker} - ${assetName}`;
            }
            
            // Switch to charts tab
            const resultsSection = this.closest('.results-section');
            if (resultsSection) {
                const tabContainer = resultsSection.querySelector('.results-tabs');
                setActiveTab(tabContainer, 'charts');
            }
            
            // Initialize chart
            initializeTradingViewChart(`NASDAQ:${assetTicker}`);
        });
    });
    
    // Filter reset buttons
    const resetCryptoFilters = document.getElementById('reset-crypto-filters');
    if (resetCryptoFilters) {
        resetCryptoFilters.addEventListener('click', function() {
            const cryptoFilterCount = document.getElementById('crypto-filter-count');
            if (cryptoFilterCount) {
                cryptoFilterCount.textContent = '0';
            }
            this.textContent = 'Reset (0)';
            
            // Reset all selects in the crypto section
            document.querySelectorAll('#crypto select').forEach(select => {
                select.value = 'any';
            });
            
            showToast('Crypto filters reset');
        });
    }
    
    const resetStocksFilters = document.getElementById('reset-stocks-filters');
    if (resetStocksFilters) {
        resetStocksFilters.addEventListener('click', function() {
            const stocksFilterCount = document.getElementById('stocks-filter-count');
            if (stocksFilterCount) {
                stocksFilterCount.textContent = '0';
            }
            this.textContent = 'Reset (0)';
            
            // Reset all selects in the stocks section
            document.querySelectorAll('#stocks select').forEach(select => {
                select.value = 'any';
            });
            
            showToast('Stock filters reset');
        });
    }
    
    // Apply filter buttons
    const applyCryptoFilters = document.getElementById('apply-crypto-filters');
    if (applyCryptoFilters) {
        applyCryptoFilters.addEventListener('click', function() {
            const filterCount = countAppliedFilters('crypto');
            const cryptoFilterCount = document.getElementById('crypto-filter-count');
            if (cryptoFilterCount) {
                cryptoFilterCount.textContent = filterCount.toString();
            }
            
            const resetCryptoFilters = document.getElementById('reset-crypto-filters');
            if (resetCryptoFilters) {
                resetCryptoFilters.textContent = `Reset (${filterCount})`;
            }
            
            showToast(`Applied ${filterCount} crypto filters`);
        });
    }
    
    const applyStocksFilters = document.getElementById('apply-stocks-filters');
    if (applyStocksFilters) {
        applyStocksFilters.addEventListener('click', function() {
            const filterCount = countAppliedFilters('stocks');
            const stocksFilterCount = document.getElementById('stocks-filter-count');
            if (stocksFilterCount) {
                stocksFilterCount.textContent = filterCount.toString();
            }
            
            const resetStocksFilters = document.getElementById('reset-stocks-filters');
            if (resetStocksFilters) {
                resetStocksFilters.textContent = `Reset (${filterCount})`;
            }
            
            showToast(`Applied ${filterCount} stock filters`);
        });
    }
    
    // Account button
    const accountButton = document.getElementById('account-button');
    if (accountButton) {
        accountButton.addEventListener('click', function() {
            setActiveSection('account');
        });
    }
    
    // Watchlist actions
    document.querySelectorAll('.watchlist-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent row click
            const action = this.dataset.action;
            const ticker = this.closest('tr').querySelector('td:first-child').textContent;
            
            if (action === 'chart') {
                const name = this.closest('tr').querySelector('td:nth-child(2)').textContent;
                document.getElementById('chart-title').textContent = `${ticker} - ${name}`;
                setActiveSection('stocks');
                const tabContainer = document.querySelector('.results-tabs');
                setActiveTab(tabContainer, 'charts');
                initializeTradingViewChart(`NASDAQ:${ticker}`);
                showToast(`Viewing chart for ${ticker}`);
            } else if (action === 'remove') {
                this.closest('tr').remove();
                showToast(`${ticker} removed from watchlist`);
            }
        });
    });
    
    // Alert form submission
    const alertForm = document.getElementById('alert-form');
    if (alertForm) {
        alertForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ticker = document.getElementById('alert-ticker').value;
            const condition = document.getElementById('alert-condition').value;
            const price = document.getElementById('alert-price').value;
            
            // Add to alerts list
            addAlert(ticker, condition, price);
            
            // Close modal
            closeModal('alert-modal');
            
            // Reset form
            this.reset();
            
            // Show confirmation
            showToast(`Alert created for ${ticker}`);
        });
    }
    
    // Chart type and period toggles for stocks
    document.querySelectorAll('#stocks .chart-type-toggle .chart-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#stocks .chart-type-toggle .chart-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Would update chart type in a real implementation
            const chartType = this.dataset.chartType;
            updateChartType('asset-chart-container', chartType);
        });
    });
    
    document.querySelectorAll('#stocks .chart-period-toggle .chart-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#stocks .chart-period-toggle .chart-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Would update chart period in a real implementation
            showToast(`Chart period changed to ${this.textContent}`);
        });
    });
    
    // Account section tabs
    document.querySelectorAll('.account-tabs .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = document.querySelector('.account-tabs');
            setActiveTab(tabContainer, this.dataset.tab);
        });
    });
    
    // Account settings form
    const accountSettingsForm = document.querySelector('.settings-form');
    if (accountSettingsForm) {
        const saveButton = accountSettingsForm.querySelector('.button-primary');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                showToast('Account settings saved');
            });
        }
    }
    
    // Alert actions
    document.querySelectorAll('.alert-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            const ticker = this.closest('tr').querySelector('td:first-child').textContent;
            
            if (action === 'edit') {
                // Would open edit modal in a real implementation
                showToast(`Editing alert for ${ticker}`);
            } else if (action === 'remove') {
                this.closest('tr').remove();
                showToast(`Alert for ${ticker} removed`);
            }
        });
    });
    
    // Broker connection form
    const brokerConnectForm = document.querySelector('#broker-modal .modal-body');
    if (brokerConnectForm) {
        const connectButton = brokerConnectForm.querySelector('#confirm-broker-connect');
        if (connectButton) {
            connectButton.addEventListener('click', function() {
                closeModal('broker-modal');
                showToast('Broker connected successfully');
            });
        }
    }
    
    // Add trade button
    const addTradeButton = document.querySelector('#current-trades-tab .button-primary');
    if (addTradeButton) {
        addTradeButton.addEventListener('click', function() {
            // Reset form and set title for new trade
            document.getElementById('trade-modal-title').textContent = 'Add New Trade';
            document.getElementById('trade-id').value = '';
            document.getElementById('trade-form').reset();
            document.getElementById('trade-entry-date').valueAsDate = new Date();
            
            // Open modal
            openModal('trade-modal');
        });
    }
    
    // Trade form submission
    const tradeForm = document.getElementById('trade-form');
    if (tradeForm) {
        tradeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tradeId = document.getElementById('trade-id').value;
            const ticker = document.getElementById('trade-ticker').value;
            const type = document.getElementById('trade-type').value;
            const entryDate = document.getElementById('trade-entry-date').value;
            const entryPrice = document.getElementById('trade-entry-price').value;
            const stopLoss = document.getElementById('trade-stop-loss').value;
            const takeProfit = document.getElementById('trade-take-profit').value;
            
            if (tradeId) {
                // Update existing trade
                showToast(`Trade for ${ticker} updated`);
            } else {
                // Add new trade to current trades list
                addTrade(ticker, type, entryDate, entryPrice, stopLoss, takeProfit);
                showToast(`New trade for ${ticker} added`);
            }
            
            // Close modal
            closeModal('trade-modal');
        });
    }
    
    // Trade actions
    document.querySelectorAll('.trade-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            const row = this.closest('tr');
            const ticker = row.querySelector('td:first-child').textContent;
            
            if (action === 'edit') {
                // Would populate form with trade data in a real implementation
                document.getElementById('trade-modal-title').textContent = `Edit Trade: ${ticker}`;
                document.getElementById('trade-id').value = 'trade-' + Date.now(); // Dummy ID
                document.getElementById('trade-ticker').value = ticker;
                document.getElementById('trade-type').value = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                document.getElementById('trade-entry-date').value = '2023-05-01'; // Dummy date
                document.getElementById('trade-entry-price').value = row.querySelector('td:nth-child(4)').textContent.replace('$', '');
                document.getElementById('trade-stop-loss').value = row.querySelector('td:nth-child(7)').textContent.replace('$', '');
                document.getElementById('trade-take-profit').value = row.querySelector('td:nth-child(8)').textContent.replace('$', '');
                
                // Open modal
                openModal('trade-modal');
            } else if (action === 'close') {
                // Populate close trade form
                document.getElementById('close-trade-id').value = 'trade-' + Date.now(); // Dummy ID
                document.getElementById('close-trade-ticker').value = ticker;
                document.getElementById('close-trade-exit-date').valueAsDate = new Date();
                document.getElementById('close-trade-exit-price').value = row.querySelector('td:nth-child(5)').textContent.replace('$', '');
                
                // Open close trade modal
                openModal('close-trade-modal');
            }
        });
    });
    
    // Close trade form submission
    const closeTradeForm = document.getElementById('close-trade-form');
    if (closeTradeForm) {
        closeTradeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ticker = document.getElementById('close-trade-ticker').value;
            const exitDate = document.getElementById('close-trade-exit-date').value;
            const exitPrice = document.getElementById('close-trade-exit-price').value;
            const notes = document.getElementById('close-trade-notes').value;
            
            // Add to trade history
            addTradeHistory(ticker, exitDate, exitPrice, notes);
            
            // Remove from current trades
            document.querySelectorAll('#current-trades-list tr').forEach(row => {
                if (row.querySelector('td:first-child').textContent === ticker) {
                    row.remove();
                }
            });
            
            // Close modal
            closeModal('close-trade-modal');
            
            // Show confirmation
            showToast(`Trade for ${ticker} closed`);
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showAccountDashboard();
            showToast('Login successful');
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showAccountDashboard();
            showToast('Account created successfully');
        });
    }
}

// Count applied filters
function countAppliedFilters(sectionId) {
    let count = 0;
    document.querySelectorAll(`#${sectionId} select`).forEach(select => {
        if (select.value !== 'any') {
            count++;
        }
    });
    return count;
}

// Add alert to the alerts list
function addAlert(ticker, condition, price) {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;
    
    const alertRow = document.createElement('tr');
    
    const conditionText = condition === 'above' ? 'rises above' : 'falls below';
    
    alertRow.innerHTML = `
        <td>${ticker}</td>
        <td>${conditionText} $${price}</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td>
            <div class="action-buttons">
                <button class="icon-button alert-action" data-action="edit"><i class="fas fa-edit"></i></button>
                <button class="icon-button alert-action" data-action="remove"><i class="fas fa-trash"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners to the new buttons
    alertRow.querySelectorAll('.alert-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            
            if (action === 'edit') {
                // Would open edit modal in a real implementation
                showToast(`Editing alert for ${ticker}`);
            } else if (action === 'remove') {
                alertRow.remove();
                showToast(`Alert for ${ticker} removed`);
            }
        });
    });
    
    alertsList.appendChild(alertRow);
}

// Add trade to current trades list
function addTrade(ticker, type, entryDate, entryPrice, stopLoss, takeProfit) {
    const tradesList = document.getElementById('current-trades-list');
    if (!tradesList) return;
    
    // Calculate current price (mock data - in a real app this would be fetched)
    const currentPrice = (parseFloat(entryPrice) * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2);
    
    // Calculate P/L
    const plPercent = type === 'long' 
        ? ((currentPrice - entryPrice) / entryPrice * 100).toFixed(1)
        : ((entryPrice - currentPrice) / entryPrice * 100).toFixed(1);
    
    const plClass = parseFloat(plPercent) >= 0 ? 'positive' : 'negative';
    
    const tradeRow = document.createElement('tr');
    
    tradeRow.innerHTML = `
        <td>${ticker}</td>
        <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
        <td>${entryDate}</td>
        <td>$${entryPrice}</td>
        <td>$${currentPrice}</td>
        <td class="${plClass}">${plPercent}%</td>
        <td>$${stopLoss || 'N/A'}</td>
        <td>$${takeProfit || 'N/A'}</td>
        <td>
            <div class="action-buttons">
                <button class="icon-button trade-action" data-action="edit"><i class="fas fa-edit"></i></button>
                <button class="icon-button trade-action" data-action="close"><i class="fas fa-check-circle"></i></button>
            </div>
        </td>
    `;
    
    // Add event listeners to the new buttons
    tradeRow.querySelectorAll('.trade-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            
            if (action === 'edit') {
                // Would open edit modal in a real implementation
                showToast(`Editing trade for ${ticker}`);
            } else if (action === 'close') {
                // Would open close trade modal in a real implementation
                showToast(`Closing trade for ${ticker}`);
            }
        });
    });
    
    tradesList.appendChild(tradeRow);
}

// Add trade to trade history
function addTradeHistory(ticker, exitDate, exitPrice, notes) {
    const historyList = document.getElementById('trade-history-list');
    if (!historyList) return;
    
    // Mock data for demonstration
    const entryDate = new Date();
    entryDate.setDate(entryDate.getDate() - Math.floor(Math.random() * 10 + 1));
    const entryPrice = (parseFloat(exitPrice) * (1 - (Math.random() * 0.1 - 0.05))).toFixed(2);
    
    // Calculate P/L
    const plPercent = ((exitPrice - entryPrice) / entryPrice * 100).toFixed(1);
    const plClass = parseFloat(plPercent) >= 0 ? 'positive' : 'negative';
    
    // Calculate hold time
    const exitDateObj = new Date(exitDate);
    const entryDateObj = entryDate;
    const diffTime = Math.abs(exitDateObj - entryDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const historyRow = document.createElement('tr');
    
    historyRow.innerHTML = `
        <td>${ticker}</td>
        <td>Long</td>
        <td>${entryDateObj.toLocaleDateString()}</td>
        <td>${exitDate}</td>
        <td>$${entryPrice}</td>
        <td>$${exitPrice}</td>
        <td class="${plClass}">${plPercent}%</td>
        <td>${diffDays} days</td>
        <td>${notes || 'N/A'}</td>
    `;
    
    historyList.appendChild(historyRow);
}

// Toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add entry/exit reason
function addEntryExitReason(type, reason, date) {
    const entryExitList = document.getElementById('entry-exit-list');
    if (!entryExitList) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${type}</td>
        <td>${reason}</td>
        <td>${date}</td>
        <td>
            <button class="icon-button"><i class="fas fa-edit"></i></button>
            <button class="icon-button"><i class="fas fa-trash"></i></button>
        </td>
    `;
    entryExitList.appendChild(row);
}

// Add setup type
function addSetupType(name, success, trades) {
    const setupList = document.getElementById('setup-list');
    if (!setupList) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${success}</td>
        <td>${trades}</td>
        <td>
            <button class="icon-button"><i class="fas fa-edit"></i></button>
            <button class="icon-button"><i class="fas fa-trash"></i></button>
        </td>
    `;
    setupList.appendChild(row);
}

// Add mistake
function addMistake(trade, date, mistake, notes) {
    const mistakesList = document.getElementById('mistakes-list');
    if (!mistakesList) return;
    
    const row = document.createElement('tr');
    const mistakeClass = mistake === 'Yes' ? 'negative' : 'positive';
    
    row.innerHTML = `
        <td>${trade}</td>
        <td>${date}</td>
        <td class="${mistakeClass}">${mistake}</td>
        <td>${notes}</td>
        <td>
            <button class="icon-button"><i class="fas fa-edit"></i></button>
            <button class="icon-button"><i class="fas fa-trash"></i></button>
        </td>
    `;
    mistakesList.appendChild(row);
}

// Initialize Trading Performance Section
function initializeTradingPerformance() {
    const performanceSection = document.getElementById('performance');
    if (!performanceSection) return;
    
    // Create market selection screen
    performanceSection.innerHTML = `
        <div class="market-selection-container">
            <h2>Select Market for Trading Performance</h2>
            <div class="market-selection-buttons">
                <button id="stocks-performance-btn" class="button-primary">Stocks</button>
                <button id="crypto-performance-btn" class="button-primary">Crypto</button>
            </div>
        </div>
        
        <div id="stocks-performance" class="performance-dashboard" style="display: none;">
            <h2>Stocks Trading Performance</h2>
            <div class="performance-grid">
                <div class="performance-card">
                    <h3>Equity Curve</h3>
                    <div class="chart-container">
                        <canvas id="stocks-equity-curve-chart"></canvas>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Win/Loss Distribution</h3>
                    <div class="chart-container">
                        <canvas id="stocks-win-loss-chart"></canvas>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Setup Type/Strategy Analysis</h3>
                    <div class="chart-container">
                        <canvas id="stocks-strategy-chart"></canvas>
                    </div>
                    <div class="strategy-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Strategy</th>
                                    <th>Win Rate</th>
                                    <th>Avg. Profit</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Moving Average Crossover</td>
                                    <td>72%</td>
                                    <td>2.8%</td>
                                    <td>25</td>
                                </tr>
                                <tr>
                                    <td>MACD Divergence</td>
                                    <td>65%</td>
                                    <td>3.2%</td>
                                    <td>18</td>
                                </tr>
                                <tr>
                                    <td>RSI Oversold</td>
                                    <td>78%</td>
                                    <td>2.1%</td>
                                    <td>14</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Entry/Exit Reasons</h3>
                    <div class="reasons-container">
                        <div class="reasons-section">
                            <h4>Top Entry Reasons</h4>
                            <ul>
                                <li>Support level bounce (32%)</li>
                                <li>Trend continuation (28%)</li>
                                <li>Breakout confirmation (22%)</li>
                                <li>Oversold condition (18%)</li>
                            </ul>
                        </div>
                        <div class="reasons-section">
                            <h4>Top Exit Reasons</h4>
                            <ul>
                                <li>Take profit hit (45%)</li>
                                <li>Trend reversal signal (25%)</li>
                                <li>Stop loss hit (20%)</li>
                                <li>Target reached (10%)</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Mistakes Analysis</h3>
                    <div class="chart-container">
                        <canvas id="stocks-mistakes-chart"></canvas>
                    </div>
                    <div class="mistakes-list">
                        <h4>Common Mistakes</h4>
                        <ul>
                            <li>Early exit (35%)</li>
                            <li>Chasing entry (25%)</li>
                            <li>Position sizing too large (20%)</li>
                            <li>Ignoring market conditions (15%)</li>
                            <li>Other (5%)</li>
                        </ul>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Market Conditions</h3>
                    <div class="chart-container">
                        <canvas id="stocks-market-conditions-chart"></canvas>
                    </div>
                    <div class="market-conditions-stats">
                        <div class="stat-item">
                            <span class="stat-label">Volatile Markets:</span>
                            <span class="stat-value">Win Rate: 58%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Trending Markets:</span>
                            <span class="stat-value">Win Rate: 76%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Range-Bound Markets:</span>
                            <span class="stat-value">Win Rate: 62%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="crypto-performance" class="performance-dashboard" style="display: none;">
            <h2>Crypto Trading Performance</h2>
            <div class="performance-grid">
                <div class="performance-card">
                    <h3>Equity Curve</h3>
                    <div class="chart-container">
                        <canvas id="crypto-equity-curve-chart"></canvas>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Win/Loss Distribution</h3>
                    <div class="chart-container">
                        <canvas id="crypto-win-loss-chart"></canvas>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Setup Type/Strategy Analysis</h3>
                    <div class="chart-container">
                        <canvas id="crypto-strategy-chart"></canvas>
                    </div>
                    <div class="strategy-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Strategy</th>
                                    <th>Win Rate</th>
                                    <th>Avg. Profit</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Fibonacci Retracement</td>
                                    <td>68%</td>
                                    <td>4.2%</td>
                                    <td>22</td>
                                </tr>
                                <tr>
                                    <td>Volume Breakout</td>
                                    <td>72%</td>
                                    <td>5.8%</td>
                                    <td>18</td>
                                </tr>
                                <tr>
                                    <td>Bollinger Band Squeeze</td>
                                    <td>65%</td>
                                    <td>7.3%</td>
                                    <td>12</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Entry/Exit Reasons</h3>
                    <div class="reasons-container">
                        <div class="reasons-section">
                            <h4>Top Entry Reasons</h4>
                            <ul>
                                <li>Key level breakout (35%)</li>
                                <li>Momentum confirmation (30%)</li>
                                <li>Pattern completion (20%)</li>
                                <li>News catalyst (15%)</li>
                            </ul>
                        </div>
                        <div class="reasons-section">
                            <h4>Top Exit Reasons</h4>
                            <ul>
                                <li>Take profit hit (40%)</li>
                                <li>Momentum loss (30%)</li>
                                <li>Stop loss hit (25%)</li>
                                <li>News reversal (5%)</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Mistakes Analysis</h3>
                    <div class="chart-container">
                        <canvas id="crypto-mistakes-chart"></canvas>
                    </div>
                    <div class="mistakes-list">
                        <h4>Common Mistakes</h4>
                        <ul>
                            <li>FOMO entry (40%)</li>
                            <li>Holding through negative news (25%)</li>
                            <li>Ignoring technical levels (20%)</li>
                            <li>Overtrading (10%)</li>
                            <li>Other (5%)</li>
                        </ul>
                    </div>
                </div>
                <div class="performance-card">
                    <h3>Market Conditions</h3>
                    <div class="chart-container">
                        <canvas id="crypto-market-conditions-chart"></canvas>
                    </div>
                    <div class="market-conditions-stats">
                        <div class="stat-item">
                            <span class="stat-label">Volatile Markets:</span>
                            <span class="stat-value">Win Rate: 62%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Bull Markets:</span>
                            <span class="stat-value">Win Rate: 82%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Bear Markets:</span>
                            <span class="stat-value">Win Rate: 48%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for market selection
    const stocksBtn = document.getElementById('stocks-performance-btn');
    const cryptoBtn = document.getElementById('crypto-performance-btn');
    
    if (stocksBtn) {
        stocksBtn.addEventListener('click', function() {
            document.querySelector('.market-selection-container').style.display = 'none';
            document.getElementById('stocks-performance').style.display = 'block';
            document.getElementById('crypto-performance').style.display = 'none';
            
            // Initialize stocks performance charts
            initializeStocksPerformanceCharts();
        });
    }
    
    if (cryptoBtn) {
        cryptoBtn.addEventListener('click', function() {
            document.querySelector('.market-selection-container').style.display = 'none';
            document.getElementById('stocks-performance').style.display = 'none';
            document.getElementById('crypto-performance').style.display = 'block';
            
            // Initialize crypto performance charts
            initializeCryptoPerformanceCharts();
        });
    }
}

// Initialize Stocks Performance Charts
function initializeStocksPerformanceCharts() {
    // Equity Curve Chart
    const equityCurveData = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
            label: 'Equity',
            data: generateChartData(10000, 300, 30, true),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    const equityCurveOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `$${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return `$${value.toLocaleString()}`;
                    }
                }
            }
        }
    };
    
    const stocksEquityCurveChart = document.getElementById('stocks-equity-curve-chart');
    if (stocksEquityCurveChart) {
        new Chart(stocksEquityCurveChart, {
            type: 'line',
            data: equityCurveData,
            options: equityCurveOptions
        });
    }
    
    // Win/Loss Distribution Chart
    const winLossData = {
        labels: ['Wins', 'Losses'],
        datasets: [{
            data: [72, 28],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };
    
    const winLossOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };
    
    const stocksWinLossChart = document.getElementById('stocks-win-loss-chart');
    if (stocksWinLossChart) {
        new Chart(stocksWinLossChart, {
            type: 'doughnut',
            data: winLossData,
            options: winLossOptions
        });
    }
    
    // Strategy Chart
    const strategyData = {
        labels: ['Moving Average Crossover', 'MACD Divergence', 'RSI Oversold', 'Support/Resistance', 'Other'],
        datasets: [{
            label: 'Win Rate',
            data: [72, 65, 78, 68, 55],
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            borderWidth: 1
        }]
    };
    
    const strategyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `Win Rate: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return `${value}%`;
                    }
                }
            }
        }
    };
    
    const stocksStrategyChart = document.getElementById('stocks-strategy-chart');
    if (stocksStrategyChart) {
        new Chart(stocksStrategyChart, {
            type: 'bar',
            data: strategyData,
            options: strategyOptions
        });
    }
    
    // Mistakes Chart
    const mistakesData = {
        labels: ['Yes', 'No'],
        datasets: [{
            data: [32, 68],
            backgroundColor: ['#ef4444', '#10b981'],
            borderWidth: 0
        }]
    };
    
    const mistakesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };
    
    const stocksMistakesChart = document.getElementById('stocks-mistakes-chart');
    if (stocksMistakesChart) {
        new Chart(stocksMistakesChart, {
            type: 'pie',
            data: mistakesData,
            options: mistakesOptions
        });
    }
    
    // Market Conditions Chart
    const marketConditionsData = {
        labels: ['Volatile', 'Trending', 'Range-Bound'],
        datasets: [{
            label: 'Win Rate',
            data: [58, 76, 62],
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6'],
            borderWidth: 0
        }]
    };
    
    const marketConditionsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `Win Rate: ${context.raw}%`;
                    }
                }
            }
        }
    };
    
    const stocksMarketConditionsChart = document.getElementById('stocks-market-conditions-chart');
    if (stocksMarketConditionsChart) {
        new Chart(stocksMarketConditionsChart, {
            type: 'pie',
            data: marketConditionsData,
            options: marketConditionsOptions
        });
    }
}

// Initialize Crypto Performance Charts
function initializeCryptoPerformanceCharts() {
    // Equity Curve Chart
    const equityCurveData = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
            label: 'Equity',
            data: generateChartData(5000, 500, 30, true),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    const equityCurveOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `$${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return `$${value.toLocaleString()}`;
                    }
                }
            }
        }
    };
    
    const cryptoEquityCurveChart = document.getElementById('crypto-equity-curve-chart');
    if (cryptoEquityCurveChart) {
        new Chart(cryptoEquityCurveChart, {
            type: 'line',
            data: equityCurveData,
            options: equityCurveOptions
        });
    }
    
    // Win/Loss Distribution Chart
    const winLossData = {
        labels: ['Wins', 'Losses'],
        datasets: [{
            data: [65, 35],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };
    
    const winLossOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };
    
    const cryptoWinLossChart = document.getElementById('crypto-win-loss-chart');
    if (cryptoWinLossChart) {
        new Chart(cryptoWinLossChart, {
            type: 'doughnut',
            data: winLossData,
            options: winLossOptions
        });
    }
    
    // Strategy Chart
    const strategyData = {
        labels: ['Fibonacci Retracement', 'Volume Breakout', 'Bollinger Band Squeeze', 'Support/Resistance', 'Other'],
        datasets: [{
            label: 'Win Rate',
            data: [68, 72, 65, 70, 58],
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            borderWidth: 1
        }]
    };
    
    const strategyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `Win Rate: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return `${value}%`;
                    }
                }
            }
        }
    };
    
    const cryptoStrategyChart = document.getElementById('crypto-strategy-chart');
    if (cryptoStrategyChart) {
        new Chart(cryptoStrategyChart, {
            type: 'bar',
            data: strategyData,
            options: strategyOptions
        });
    }
    
    // Mistakes Chart
    const mistakesData = {
        labels: ['Yes', 'No'],
        datasets: [{
            data: [42, 58],
            backgroundColor: ['#ef4444', '#10b981'],
            borderWidth: 0
        }]
    };
    
    const mistakesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };
    
    const cryptoMistakesChart = document.getElementById('crypto-mistakes-chart');
    if (cryptoMistakesChart) {
        new Chart(cryptoMistakesChart, {
            type: 'pie',
            data: mistakesData,
            options: mistakesOptions
        });
    }
    
    // Market Conditions Chart
    const marketConditionsData = {
        labels: ['Volatile', 'Bull Market', 'Bear Market'],
        datasets: [{
            label: 'Win Rate',
            data: [62, 82, 48],
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };
    
    const marketConditionsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `Win Rate: ${context.raw}%`;
                    }
                }
            }
        }
    };
    
    const cryptoMarketConditionsChart = document.getElementById('crypto-market-conditions-chart');
    if (cryptoMarketConditionsChart) {
        new Chart(cryptoMarketConditionsChart, {
            type: 'pie',
            data: marketConditionsData,
            options: marketConditionsOptions
        });
    }
}

// Initialize Trading Performance section with market selection
function initializeTradingPerformance() {
    const performanceSection = document.getElementById('performance');
    if (!performanceSection) return;
    
    // Create market selection container if it doesn't exist
    if (!document.getElementById('performance-market-selection')) {
        performanceSection.innerHTML = `
            <div id="performance-market-selection" class="market-selection-container">
                <h2>Select Market for Trading Performance</h2>
                <div class="market-selection-buttons">
                    <button class="button-primary market-selection-button" data-market-type="Stocks">Stocks</button>
                    <button class="button-primary market-selection-button" data-market-type="Crypto">Crypto</button>
                </div>
            </div>
            <div id="performance-content" style="display: none;">
                <div class="section-header">
                    <h2 id="performance-title">Trading Performance</h2>
                    <div class="filter-controls">
                        <select id="performance-period">
                            <option value="all">All Time</option>
                            <option value="ytd">Year to Date</option>
                            <option value="1m">Last Month</option>
                            <option value="3m">Last 3 Months</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                    </div>
                </div>
                
                <div class="performance-metrics">
                    <div class="metric-card">
                        <div class="metric-label">P/L ($)</div>
                        <div class="metric-value positive">+$1,245.67</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">P/L (%)</div>
                        <div class="metric-value positive">+12.4%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Win Rate</div>
                        <div class="metric-value">68%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Risk/Reward</div>
                        <div class="metric-value">1:2.5</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Avg Hold Time</div>
                        <div class="metric-value">3.2 days</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Position Size</div>
                        <div class="metric-value">$5,000</div>
                    </div>
                </div>
                
                <div class="charts-container">
                    <div class="chart-card">
                        <h3>Equity Curve</h3>
                        <div class="chart-placeholder large-chart">
                            <canvas id="equity-curve-chart"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Win/Loss Distribution</h3>
                        <div class="chart-placeholder large-chart">
                            <canvas id="win-loss-chart"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- New Analysis Tabs for Trading Performance -->
                <div class="analysis-tabs filter-tabs">
                    <div class="tab-buttons">
                        <button class="tab-button active" data-tab="entry-exit">Entry/Exit Reasons</button>
                        <button class="tab-button" data-tab="setup">Setup Type/Strategy</button>
                        <button class="tab-button" data-tab="mistakes">Mistakes Made</button>
                        <button class="tab-button" data-tab="market-condition">Market Condition</button>
                    </div>
                    
                    <!-- Entry/Exit Reasons Tab -->
                    <div class="tab-content active" id="entry-exit-tab">
                        <div class="section-header">
                            <h3>Entry/Exit Reasons</h3>
                            <button class="button-primary" id="add-entry-exit-button">Add Entry/Exit Reason</button>
                        </div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Reason</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="entry-exit-list">
                                    <!-- Entry/Exit reasons will be populated here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="charts-container">
                            <div class="chart-card">
                                <h3>Entry/Exit Analysis</h3>
                                <div class="chart-placeholder">
                                    <canvas id="entry-exit-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Setup Type/Strategy Tab -->
                    <div class="tab-content" id="setup-tab">
                        <div class="section-header">
                            <h3>Setup Type/Strategy</h3>
                            <button class="button-primary" id="add-setup-button">Add Setup Type</button>
                        </div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Setup Name</th>
                                        <th>Success Rate</th>
                                        <th>Number of Trades</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="setup-list">
                                    <!-- Setup types will be populated here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="charts-container">
                            <div class="chart-card">
                                <h3>Setup Type Analysis</h3>
                                <div class="chart-placeholder">
                                    <canvas id="setup-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mistakes Made Tab -->
                    <div class="tab-content" id="mistakes-tab">
                        <div class="section-header">
                            <h3>Mistakes Made</h3>
                            <button class="button-primary" id="add-mistake-button">Add Mistake Record</button>
                        </div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Trade</th>
                                        <th>Date</th>
                                        <th>Mistake Made</th>
                                        <th>Notes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="mistakes-list">
                                    <!-- Mistakes will be populated here -->
                                </tbody>
                            </table>
                        </div>
                        <div class="charts-container">
                            <div class="chart-card">
                                <h3>Mistakes Analysis</h3>
                                <div class="chart-placeholder">
                                    <canvas id="mistakes-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Market Condition Tab -->
                    <div class="tab-content" id="market-condition-tab">
                        <div class="section-header">
                            <h3>Market Condition</h3>
                            <button class="button-primary" id="add-market-condition-button">Add Market Condition</button>
                        </div>
                        <div class="charts-container">
                            <div class="chart-card">
                                <h3>Performance by Market Condition</h3>
                                <div class="chart-placeholder">
                                    <canvas id="market-condition-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add event listeners for market selection buttons
    document.querySelectorAll('.market-selection-button').forEach(button => {
        button.addEventListener('click', function() {
            const marketType = this.dataset.marketType;
            showPerformance(marketType);
        });
    });
}

// Entry/Exit Reason Modal
function createEntryExitModal() {
    const modal = document.createElement('div');
    modal.id = 'entry-exit-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Entry/Exit Reason</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <form id="entry-exit-form">
                    <div class="form-group">
                        <label for="entry-exit-type">Type</label>
                        <select id="entry-exit-type" required>
                            <option value="Entry">Entry</option>
                            <option value="Exit">Exit</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="entry-exit-reason">Reason</label>
                        <textarea id="entry-exit-reason" rows="3" placeholder="Describe your entry or exit reason" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="entry-exit-date">Date</label>
                        <input type="date" id="entry-exit-date" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="button-outline" id="cancel-entry-exit">Cancel</button>
                        <button type="submit" class="button-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-button').addEventListener('click', () => {
        closeModal('entry-exit-modal');
    });
    
    modal.querySelector('#cancel-entry-exit').addEventListener('click', () => {
        closeModal('entry-exit-modal');
    });
    
    modal.querySelector('#entry-exit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('entry-exit-type').value;
        const reason = document.getElementById('entry-exit-reason').value;
        const date = document.getElementById('entry-exit-date').value;
        
        // Add to entry/exit list
        addEntryExitReason(type, reason, date);
        
        // Close modal
        closeModal('entry-exit-modal');
        
        // Reset form
        this.reset();
        
        // Show confirmation
        showToast(`${type} reason added`);
    });
}

// Setup Type Modal
function createSetupModal() {
    const modal = document.createElement('div');
    modal.id = 'setup-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Setup Type/Strategy</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <form id="setup-form">
                    <div class="form-group">
                        <label for="setup-name">Setup Name</label>
                        <input type="text" id="setup-name" placeholder="e.g. Moving Average Crossover" required>
                    </div>
                    <div class="form-group">
                        <label for="setup-success">Success Rate (%)</label>
                        <input type="number" id="setup-success" min="0" max="100" placeholder="e.g. 75" required>
                    </div>
                    <div class="form-group">
                        <label for="setup-trades">Number of Trades</label>
                        <input type="number" id="setup-trades" min="1" placeholder="e.g. 15" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="button-outline" id="cancel-setup">Cancel</button>
                        <button type="submit" class="button-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-button').addEventListener('click', () => {
        closeModal('setup-modal');
    });
    
    modal.querySelector('#cancel-setup').addEventListener('click', () => {
        closeModal('setup-modal');
    });
    
    modal.querySelector('#setup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('setup-name').value;
        const success = document.getElementById('setup-success').value;
        const trades = document.getElementById('setup-trades').value;
        
        // Add to setup list
        addSetupType(name, success, trades);
        
        // Close modal
        closeModal('setup-modal');
        
        // Reset form
        this.reset();
        
        // Show confirmation
        showToast(`Setup type added`);
    });
}

// Mistakes Modal
function createMistakeModal() {
    const modal = document.createElement('div');
    modal.id = 'mistake-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Mistake Record</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <form id="mistake-form">
                    <div class="form-group">
                        <label for="mistake-trade">Trade</label>
                        <input type="text" id="mistake-trade" placeholder="e.g. AAPL Long" required>
                    </div>
                    <div class="form-group">
                        <label for="mistake-date">Date</label>
                        <input type="date" id="mistake-date" required>
                    </div>
                    <div class="form-group">
                        <label for="mistake-made">Mistake Made?</label>
                        <select id="mistake-made" required>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="mistake-notes">Notes</label>
                        <textarea id="mistake-notes" rows="3" placeholder="Describe the mistake or what went well"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="button-outline" id="cancel-mistake">Cancel</button>
                        <button type="submit" class="button-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-button').addEventListener('click', () => {
        closeModal('mistake-modal');
    });
    
    modal.querySelector('#cancel-mistake').addEventListener('click', () => {
        closeModal('mistake-modal');
    });
    
    modal.querySelector('#mistake-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trade = document.getElementById('mistake-trade').value;
        const date = document.getElementById('mistake-date').value;
        const mistake = document.getElementById('mistake-made').value;
        const notes = document.getElementById('mistake-notes').value;
        
        // Add to mistakes list
        addMistake(trade, date, mistake, notes);
        
        // Close modal
        closeModal('mistake-modal');
        
        // Reset form
        this.reset();
        
        // Show confirmation
        showToast(`Mistake record added`);
    });
}

// Create all modals when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create modals for the new features
    createEntryExitModal();
    createSetupModal();
    createMistakeModal();
    
    // Initialize Trading Performance section
    initializeTradingPerformance();
    
    // Add event listeners for the new features
    document.getElementById('add-entry-exit-button')?.addEventListener('click', function() {
        openModal('entry-exit-modal');
    });
    
    document.getElementById('add-setup-button')?.addEventListener('click', function() {
        openModal('setup-modal');
    });
    
    document.getElementById('add-mistake-button')?.addEventListener('click', function() {
        openModal('mistake-modal');
    });
    
    // Add event listeners for the analysis tabs
    document.querySelectorAll('.analysis-tabs .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = document.querySelector('.analysis-tabs');
            setActiveTab(tabContainer, this.dataset.tab);
        });
    });
});

// Add entry/exit reason to the list
function addEntryExitReason(type, reason, date) {
    const entryExitList = document.getElementById('entry-exit-list');
    if (!entryExitList) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${type}</td>
        <td>${reason}</td>
        <td>${date}</td>
        <td>
            <button class="icon-button"><i class="fas fa-edit"></i></button>
            <button class="icon-button"><i class="fas fa-trash"></i></button>
        </td>
    `;
    entryExitList.appendChild(row);
}

// Add setup type to the list
function addSetupType(name, success, trades) {
    const setupList = document.getElementById('setup-list');
    if (!setupList) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${success}%</td>
        <td>${trades}</td>
        <td>
            <button class="icon-button"><i class="fas fa-edit"></i></button>
            <button class="icon-button"><i class="fas fa-trash"></i></button>
        </td>
    `;
    setupList.appendChild(row);
}

// Add mistake to the list
function addMistake(trade, date, mistake, notes) {
    const mistakesList = document.getElementById('mistakes-list');
    if (!mistakesList) return;
    
    const row = document.createElement('tr');
    const mistakeClass = mistake === 'Yes' ? 'negative' : 'positive';
    
    row.innerHTML = `
        <td>${trade}</td>
        <td>${date}</td>
        <td class="${mistakeClass}">${mistake}</td>
        <td>${notes}</td>
        <td>
            <button class="icon-button"><i class="fas fa-edit"></i></button>
            <button class="icon-button"><i class="fas fa-trash"></i></button>
        </td>
    `;
    mistakesList.appendChild(row);
}
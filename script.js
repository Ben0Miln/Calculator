// Industry salary data
const industryData = {
    "Mining": 180000,
    "Hospitality": 60000,
    "Tourism": 75000,
    "Retail": 75000,
    "Corporate": 100000,
    "Technical": 85000,
    "Transport": 90000,
    "Logistics": 100000,
    "Energy": 110000,
    "University and Teaching": 90000,
    "Manufacturing": 65000,
    "Construction": 75000
};

// Time factors for calculations
const timeFactors = {
    "Day": 1/260,
    "Month": 1/12,
    "Quarter": 1/4,
    "Year": 1,
    "10 Years": 10
};

// Chart instance
let impactChart = null;

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    document.getElementById('industry').addEventListener('change', updateSalary);
    document.getElementById('salary').addEventListener('input', calculateAndUpdate);
    document.getElementById('employees').addEventListener('input', calculateAndUpdate);
    document.getElementById('absenteeism').addEventListener('input', updateAbsenteeismDisplay);
    document.getElementById('period').addEventListener('input', calculateAndUpdate);
    
    // Initialize values
    updateSalary();
    updateAbsenteeismDisplay();
    calculateAndUpdate();
});

// Update salary when industry changes
function updateSalary() {
    const industry = document.getElementById('industry').value;
    const salaryInput = document.getElementById('salary');
    salaryInput.value = industryData[industry];
    calculateAndUpdate();
}

// Update absenteeism rate display
function updateAbsenteeismDisplay() {
    const absenteeism = document.getElementById('absenteeism').value;
    document.getElementById('absenteeism-value').textContent = absenteeism + '%';
    calculateAndUpdate();
}

// Main calculation and update function
function calculateAndUpdate() {
    const industry = document.getElementById('industry').value;
    const salary = parseInt(document.getElementById('salary').value);
    const employees = parseInt(document.getElementById('employees').value);
    const absenteeismRate = parseFloat(document.getElementById('absenteeism').value);
    const period = document.getElementById('period').value;
    
    // Calculate financial impact
    const timeFactor = timeFactors[period];
    const financialLoss = employees * salary * (absenteeismRate / 100) * timeFactor;
    
    // Calculate working days lost
    const annualWorkingDays = 260;
    const daysLostPerEmployee = annualWorkingDays * (absenteeismRate / 100);
    const totalDaysLost = daysLostPerEmployee * employees * timeFactor;
    
    // Calculate daily loss
    const dailyLoss = employees * salary * (absenteeismRate / 100) * (1/260);
    
    // Update main metrics
    document.getElementById('main-loss').textContent = formatCurrency(financialLoss);
    document.getElementById('main-period').textContent = period;
    document.getElementById('days-lost').textContent = formatNumber(totalDaysLost, 1) + ' days';
    document.getElementById('daily-loss').textContent = formatCurrency(dailyLoss);
    
    // Update conclusion text
    updateConclusionText(industry, salary, employees, absenteeismRate, period, financialLoss, totalDaysLost);
    
    // Update chart
    updateChart(employees, salary, absenteeismRate);
}

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-AU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format number with decimal places
function formatNumber(number, decimals = 0) {
    return number.toLocaleString('en-AU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Update conclusion text
function updateConclusionText(industry, salary, employees, absenteeismRate, period, financialLoss, totalDaysLost) {
    const annualCostPerEmployee = salary * (absenteeismRate / 100);
    
    const conclusionHTML = `
        <p>Based on an average salary of <strong>${formatCurrency(salary)}</strong> for the <strong>${industry}</strong> industry and an absenteeism rate of <strong>${absenteeismRate}%</strong>:</p>
        
        <ul>
            <li>Your company with <strong>${employees}</strong> employees is losing approximately <strong>${formatCurrency(financialLoss)}</strong> over <strong>${period.toLowerCase()}</strong></li>
            <li>This equates to <strong>${formatNumber(totalDaysLost, 1)}</strong> working days lost during this period</li>
            <li>On average, each employee costs your company <strong>${formatCurrency(annualCostPerEmployee)}</strong> per year in absenteeism</li>
        </ul>
    `;
    
    document.getElementById('conclusion-text').innerHTML = conclusionHTML;
}

// Update chart
function updateChart(employees, salary, absenteeismRate) {
    const ctx = document.getElementById('impactChart').getContext('2d');
    
    const periods = ['Day', 'Month', 'Quarter', 'Year', '10 Years'];
    const values = periods.map(period => {
        return employees * salary * (absenteeismRate / 100) * timeFactors[period];
    });
    
    // Destroy existing chart if it exists
    if (impactChart) {
        impactChart.destroy();
    }
    
    // Create new chart
    impactChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: periods,
            datasets: [{
                label: 'Financial Loss ($)',
                data: values,
                backgroundColor: [
                    '#E3F2FD',
                    '#BBDEFB',
                    '#90CAF9',
                    '#0066CC',
                    '#003D7A'
                ],
                borderColor: '#0066CC',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Financial Impact of Absenteeism Over Different Time Periods',
                    font: {
                        family: 'Open Sans',
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#0066CC'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-AU');
                        },
                        font: {
                            family: 'Open Sans'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Financial Loss ($)',
                        font: {
                            family: 'Open Sans',
                            weight: 'bold'
                        },
                        color: '#0066CC'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Open Sans'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Time Period',
                        font: {
                            family: 'Open Sans',
                            weight: 'bold'
                        },
                        color: '#0066CC'
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 4
                }
            }
        }
    });
}
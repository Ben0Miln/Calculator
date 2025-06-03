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
    "Day": 1 / 260,
    "Month": 1 / 12,
    "Quarter": 1 / 4,
    "Year": 1,
    "10 Years": 10
};

let impactChart = null;

// Debounce helper to prevent excessive updates
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('industry').addEventListener('change', updateSalary);
    document.getElementById('salary').addEventListener('input', debounce(calculateAndUpdate, 300));
    document.getElementById('employees').addEventListener('input', debounce(calculateAndUpdate, 300));
    document.getElementById('absenteeism').addEventListener('input', debounce(updateAbsenteeismDisplay, 300));
    document.getElementById('period').addEventListener('input', debounce(calculateAndUpdate, 300));

    updateSalary();
    updateAbsenteeismDisplay();
    calculateAndUpdate();
});

function updateSalary() {
    const industry = document.getElementById('industry').value;
    document.getElementById('salary').value = industryData[industry];
    calculateAndUpdate();
}

function updateAbsenteeismDisplay() {
    const absenteeism = document.getElementById('absenteeism').value;
    document.getElementById('absenteeism-value').textContent = absenteeism + '%';
    calculateAndUpdate();
}

function calculateAndUpdate() {
    const industry = document.getElementById('industry').value;
    const salary = parseInt(document.getElementById('salary').value);
    const employees = parseInt(document.getElementById('employees').value);
    const absenteeismRate = parseFloat(document.getElementById('absenteeism').value);
    const period = document.getElementById('period').value;

    const timeFactor = timeFactors[period];
    const financialLoss = employees * salary * (absenteeismRate / 100) * timeFactor;

    const annualWorkingDays = 260;
    const daysLostPerEmployee = annualWorkingDays * (absenteeismRate / 100);
    const totalDaysLost = daysLostPerEmployee * employees * timeFactor;

    const dailyLoss = employees * salary * (absenteeismRate / 100) * (1 / 260);

    document.getElementById('main-loss').textContent = formatCurrency(financialLoss);
    document.getElementById('main-period').textContent = period;
    document.getElementById('days-lost').textContent = formatNumber(totalDaysLost, 1) + ' days';
    document.getElementById('daily-loss').textContent = formatCurrency(dailyLoss);

    updateConclusionText(industry, salary, employees, absenteeismRate, period, financialLoss, totalDaysLost);
    updateChart(employees, salary, absenteeismRate);
}

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-AU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatNumber(number, decimals = 0) {
    return number.toLocaleString('en-AU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function updateConclusionText(industry, salary, employees, absenteeismRate, period, financialLoss, totalDaysLost) {
    const annualCostPerEmployee = salary * (absenteeismRate / 100);
    document.getElementById('conclusion-text').innerHTML = `
        <p>Based on an average salary of <strong>${formatCurrency(salary)}</strong> for the <strong>${industry}</strong> industry and an absenteeism rate of <strong>${absenteeismRate}%</strong>:</p>
        <ul>
            <li>Your company with <strong>${employees}</strong> employees is losing approximately <strong>${formatCurrency(financialLoss)}</strong> over <strong>${period.toLowerCase()}</strong></li>
            <li>This equates to <strong>${formatNumber(totalDaysLost, 1)}</strong> working days lost during this period</li>
            <li>On average, each employee costs your company <strong>${formatCurrency(annualCostPerEmployee)}</strong> per year in absenteeism</li>
        </ul>
    `;
}

function updateChart(employees, salary, absenteeismRate) {
    const values = ['Day', 'Month', 'Quarter', 'Year', '10 Years'].map(period => {
        return employees * salary * (absenteeismRate / 100) * timeFactors[period];
    });

    if (impactChart) {
        impactChart.data.datasets[0].data = values;
        impactChart.update();
        return;
    }

    const ctx = document.getElementById('impactChart').getContext('2d');
    impactChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Day', 'Month', 'Quarter', 'Year', '10 Years'],
            datasets: [{
                label: 'Financial Loss ($)',
                data: values,
                backgroundColor: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#0066CC', '#003D7A'],
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
                        callback: value => '$' + value.toLocaleString('en-AU'),
                        font: { family: 'Open Sans' }
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
                        font: { family: 'Open Sans' }
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

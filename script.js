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

const timeFactors = {
    "Day": 1 / 260,
    "Month": 1 / 12,
    "Quarter": 1 / 4,
    "Year": 1,
    "10 Years": 10
};

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

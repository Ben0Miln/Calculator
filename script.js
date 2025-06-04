
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
    document.getElementById('salary').addEventListener('input', debounce(calculateAndUpdate, 300));
    document.getElementById('employees').addEventListener('input', debounce(calculateAndUpdate, 300));
    document.getElementById('absenteeism').addEventListener('input', debounce(updateAbsenteeismDisplay, 300));
    document.getElementById('period').addEventListener('input', debounce(calculateAndUpdate, 300));
    document.getElementById('custom-investment').addEventListener('input', debounce(updateCustomROI, 300));

    updateAbsenteeismDisplay();
    calculateAndUpdate();
});

function updateAbsenteeismDisplay() {
    const absenteeism = document.getElementById('absenteeism').value;
    document.getElementById('absenteeism-value').textContent = absenteeism + '%';
    calculateAndUpdate();
}

function calculateAndUpdate() {
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

    const reducedRate = absenteeismRate * 0.75;
    const reducedLoss = employees * salary * (reducedRate / 100) * timeFactor;
    const absenteeismSavings = financialLoss - reducedLoss;
    const productivityGain = reducedLoss * 0.12;

    document.getElementById('savings-absenteeism').textContent = formatCurrency(absenteeismSavings);
    document.getElementById('productivity-gain').textContent = formatCurrency(productivityGain);
    document.getElementById('roi-gain').textContent = formatCurrency(10000 * 2.3);

    updateConclusionText(salary, employees, absenteeismRate, period, financialLoss, totalDaysLost);
    updateCustomROI();
}

function updateCustomROI() {
    const investment = parseFloat(document.getElementById('custom-investment').value);
    const roiValue = investment * 2.3;
    document.getElementById('roi-potential-custom').textContent = formatCurrency(roiValue);
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

function updateConclusionText(salary, employees, absenteeismRate, period, financialLoss, totalDaysLost) {
    const annualCostPerEmployee = salary * (absenteeismRate / 100);
    document.getElementById('conclusion-text').innerHTML = `
        <p>Based on an average salary of <strong>${formatCurrency(salary)}</strong> and an absenteeism rate of <strong>${absenteeismRate}%</strong>:</p>
        <ul>
            <li>Your company with <strong>${employees}</strong> employees is losing approximately <strong>${formatCurrency(financialLoss)}</strong> over <strong>${period.toLowerCase()}</strong></li>
            <li>This equates to <strong>${formatNumber(totalDaysLost, 1)}</strong> working days lost during this period</li>
            <li>On average, each employee costs your company <strong>${formatCurrency(annualCostPerEmployee)}</strong> per year in absenteeism</li>
        </ul>
    `;
}

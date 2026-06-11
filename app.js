document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const nameInput = document.getElementById("name");
    const lastNameInput = document.getElementById("last_name");
    const departmentInput = document.getElementById("department");
    const salaryInput = document.getElementById("salary");
    const salaryMonthInput = document.getElementById("salary_month");

    // Action buttons
    const resetBtn = document.getElementById("resetBtn");
    const printBtn = document.getElementById("print");
    const generateBtn = document.getElementById("generateBtn");

    // Output containers
    const emptyState = document.getElementById("emptyState");
    const payslipSheet = document.getElementById("payslipSheet");

    // Output fields
    const payslipPeriod = document.getElementById("payslipPeriod");
    const fullNameOutput = document.getElementById("fullName");
    const employeeIdOutput = document.getElementById("employeeId");
    const departmentOutput = document.getElementById("depart");
    const payslipDateOutput = document.getElementById("payslipDate");
    const basicSalaryOutput = document.getElementById("basicSalary");
    const bonusRateDesc = document.getElementById("bonusRateDesc");
    const bonusOutput = document.getElementById("bonus");
    const totalSalaryOutput = document.getElementById("totalSalary");
    
    // Bonus Alert
    const bonusHighlightBox = document.getElementById("bonusHighlightBox");
    const bonusHighlightRate = document.getElementById("bonusHighlightRate");

    // Set default month to current month
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    salaryMonthInput.value = `${currentYear}-${currentMonth}`;

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Helper to generate a random employee ID
    const generateEmployeeId = (firstName, lastName) => {
        const f = firstName ? firstName.charAt(0).toUpperCase() : 'E';
        const l = lastName ? lastName.charAt(0).toUpperCase() : 'P';
        const rand = Math.floor(10000 + Math.random() * 90000); // 5-digit number
        return `${f}${l}-${rand}`;
    };

    // Helper to get month name and year from YYYY-MM
    const formatPeriod = (monthVal) => {
        if (!monthVal) return "-";
        const [year, month] = monthVal.split('-');
        const date = new Date(year, parseInt(month) - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Clear validation borders
    const clearErrors = () => {
        [nameInput, lastNameInput, departmentInput, salaryInput].forEach(el => {
            el.classList.remove('input-error');
            el.style.borderColor = '';
        });
    };

    // Calculate Bonus logic
    const calculateBonus = (basicSalary) => {
        let rate = 0;
        let bonusAmount = 0;

        if (basicSalary >= 50000 && basicSalary <= 60000) {
            rate = 0.10;
        } else if (basicSalary > 60000 && basicSalary <= 70000) {
            rate = 0.15;
        } else if (basicSalary > 70000 && basicSalary <= 80000) {
            rate = 0.20;
        } else if (basicSalary > 80000 && basicSalary <= 90000) {
            rate = 0.25;
        } else if (basicSalary > 90000 && basicSalary <= 100000) {
            rate = 0.30;
        }

        bonusAmount = basicSalary * rate;
        return { rate, bonusAmount };
    };

    // Stable employee ID generated on load and reset
    let currentEmployeeId = generateEmployeeId("", "");

    // Update function
    const updatePayslipLive = () => {
        const firstName = nameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const department = departmentInput.value;
        const salaryVal = parseFloat(salaryInput.value);
        const salaryMonth = salaryMonthInput.value;

        // Check if all fields are empty
        const isAllEmpty = !firstName && !lastName && !department && isNaN(salaryVal);

        if (isAllEmpty) {
            payslipSheet.classList.add("hidden");
            emptyState.classList.remove("hidden");
            printBtn.disabled = true;
            return;
        }

        // Show sheet, hide empty state
        emptyState.classList.add("hidden");
        payslipSheet.classList.remove("hidden");

        // Set printable text values
        fullNameOutput.textContent = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : "-";
        departmentOutput.textContent = department || "-";
        
        // Maintain stable employee ID
        if (firstName || lastName) {
            // Update prefix initials dynamically if name details are changed
            const initials = (firstName ? firstName.charAt(0).toUpperCase() : 'E') + 
                             (lastName ? lastName.charAt(0).toUpperCase() : 'P');
            const numericPart = currentEmployeeId.split('-')[1] || "00000";
            currentEmployeeId = `${initials}-${numericPart}`;
        }
        employeeIdOutput.textContent = currentEmployeeId;

        // Formatted dates
        payslipPeriod.textContent = formatPeriod(salaryMonth);
        payslipDateOutput.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Perform calculation if salary is a valid non-negative number
        const basicSalary = (!isNaN(salaryVal) && salaryVal >= 0) ? salaryVal : 0;
        const { rate, bonusAmount } = calculateBonus(basicSalary);
        const totalSalary = basicSalary + bonusAmount;

        basicSalaryOutput.textContent = formatCurrency(basicSalary);
        bonusOutput.textContent = formatCurrency(bonusAmount);
        totalSalaryOutput.textContent = formatCurrency(totalSalary);

        // Update bonus description and highlights
        if (rate > 0) {
            bonusRateDesc.textContent = `Performance Tier Bonus (${rate * 100}%)`;
            bonusHighlightRate.textContent = `${rate * 100}%`;
            bonusHighlightBox.classList.remove("hidden");
        } else {
            bonusRateDesc.textContent = "Bonus (0%)";
            bonusOutput.textContent = "$0.00";
            bonusHighlightBox.classList.add("hidden");
        }

        printBtn.disabled = false;
    };

    // Bind event listeners to input elements for live update
    generateBtn.addEventListener("click", () => {
        updatePayslipLive();
    });

    // Reset Form
    resetBtn.addEventListener("click", () => {
        // Clear all inputs
        nameInput.value = "";
        lastNameInput.value = "";
        departmentInput.value = "";
        salaryInput.value = "";
        
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        salaryMonthInput.value = `${currentYear}-${currentMonth}`;

        clearErrors();

        // Generate a new base ID for the next payslip
        currentEmployeeId = generateEmployeeId("", "");

        // Reset output displays and switch back to empty state
        updatePayslipLive();
    });

    // Print handler
    printBtn.addEventListener("click", () => {
        if (!printBtn.disabled) {
            window.print();
        }
    });
});
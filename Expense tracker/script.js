document.addEventListener("DOMContentLoaded", () => {
    loadData();

    // Attach event listeners after DOM loads
    document.getElementById("setBudgetBtn").addEventListener("click", addBudget);
    document.getElementById("addExpenseBtn").addEventListener("click", addExpense);
    document.getElementById("clearAllBtn").addEventListener("click", clearAllExpenses);
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let totalBudget = 0;
let remainingAmount = 0;
let expenseChart = null;

// Add Budget
function addBudget() {
    const amount = parseFloat(document.getElementById("budgetAmount").value);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid budget!");

    totalBudget = amount;
    remainingAmount = totalBudget;

    document.getElementById("totalBudget").innerText = `$${totalBudget.toFixed(2)}`;
    document.getElementById("remainingAmount").innerText = `$${remainingAmount.toFixed(2)}`;
    saveData();
}

// Add Expense
function addExpense() {
    if (totalBudget === 0) return alert("Set a budget first!");

    const description = document.getElementById("expenseCategory").value.trim();
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!description || isNaN(amount) || amount <= 0) return alert("Invalid input!");
    if (remainingAmount < amount) return alert("Not enough funds.");

    remainingAmount -= amount;

    expenses.push({ description, amount, paymentMethod });

    updateExpenseTable();
    updateTotalExpenses();
    updateChart();
    saveData();
}

// Update Expense Table
function updateExpenseTable() {
    const tableBody = document.getElementById("expenseTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = expense.description;
        row.insertCell(1).innerText = `$${expense.amount.toFixed(2)}`;
        row.insertCell(2).innerText = expense.paymentMethod;
        row.insertCell(3).innerHTML = `<button onclick="deleteExpense(${index})">Delete</button>`;
    });

    document.getElementById("remainingAmount").innerText = `$${remainingAmount.toFixed(2)}`;
}

// Update Total Expenses
function updateTotalExpenses() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById("totalExpenses").innerText = `$${total.toFixed(2)}`;
}

// Delete Expense
function deleteExpense(index) {
    remainingAmount += expenses[index].amount;
    expenses.splice(index, 1);
    
    updateExpenseTable();
    updateTotalExpenses();
    updateChart();
    saveData();
}

// Clear All Expenses
function clearAllExpenses() {
    expenses = [];
    remainingAmount = totalBudget;
    document.getElementById("expenseTable").getElementsByTagName("tbody")[0].innerHTML = "";
    document.getElementById("remainingAmount").innerText = `$${remainingAmount.toFixed(2)}`;
    document.getElementById("totalExpenses").innerText = "$0";
    updateChart();
    saveData();
}

// Update Chart
function updateChart() {
    const descriptions = expenses.map(expense => expense.description);
    const amounts = expenses.map(expense => expense.amount);

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document.getElementById("expenseChart").getContext("2d");
    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: descriptions,
            datasets: [{
                label: "Expense Breakdown",
                data: amounts,
                backgroundColor: ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99", "#c2c2f0", "#ffb3e6"],
                borderColor: "#fff",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
}

// Save Data
function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("totalBudget", totalBudget);
    localStorage.setItem("remainingAmount", remainingAmount);
}

// Load Data When Page Refreshes
function loadData() {
    document.getElementById("totalBudget").innerText = `$${totalBudget.toFixed(2)}`;
    document.getElementById("remainingAmount").innerText = `$${remainingAmount.toFixed(2)}`;
    updateExpenseTable();
    updateTotalExpenses();
    updateChart();
}

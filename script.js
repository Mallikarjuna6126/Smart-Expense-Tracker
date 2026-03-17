// Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const monthly_total = document.getElementById('monthly-total');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const dateInput = document.getElementById('date');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const exportBtn = document.getElementById('export-btn');
const exportJsonBtn = document.getElementById('export-json-btn');
const clearDataBtn = document.getElementById('clear-data-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Edit Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeEditModal = document.getElementById('close-modal');
const editText = document.getElementById('edit-text');
const editAmount = document.getElementById('edit-amount');
const editCategory = document.getElementById('edit-category');
const editDate = document.getElementById('edit-date');
const editId = document.getElementById('edit-id');

// State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';
let distributionChart = null;
let trendChart = null;

// Set default date to today
dateInput.valueAsDate = new Date();

// --- Core Logic ---

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: Number(Number(amount.value).toFixed(2)),
    category: category.value,
    date: dateInput.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();
  
  form.reset();
  dateInput.valueAsDate = new Date();
  lucide.createIcons();
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Edit Transaction Logic
function openEditModal(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  editId.value = transaction.id;
  editText.value = transaction.text;
  editAmount.value = transaction.amount;
  editCategory.value = transaction.category;
  editDate.value = transaction.date;

  editModal.classList.add('show');
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = Number(editId.value);
  
  transactions = transactions.map(t => {
    if (t.id === id) {
      return {
        ...t,
        text: editText.value,
        amount: Number(Number(editAmount.value).toFixed(2)),
        category: editCategory.value,
        date: editDate.value
      };
    }
    return t;
  });

  updateLocalStorage();
  editModal.classList.remove('show');
  init();
});

closeEditModal.addEventListener('click', () => editModal.classList.remove('show'));

// --- UI Updates ---

function init() {
  renderList();
  updateValues();
  updateChart();
  lucide.createIcons();
}

function renderList() {
  list.innerHTML = '';
  
  const filtered = transactions.filter(t => {
    if (currentFilter === 'income') return t.amount > 0;
    if (currentFilter === 'expense') return t.amount < 0;
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty-state">No transactions found</li>`;
    return;
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
    const item = document.createElement('li');
    item.classList.add(t.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
      <div class="list-info">
        <h4>${t.text}</h4>
        <small>
          <span><i data-lucide="tag" size="12"></i> ${t.category}</span>
          <span><i data-lucide="calendar" size="12"></i> ${t.date}</span>
        </small>
      </div>
      <div class="list-amount">
        <p>${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</p>
        <div class="list-actions">
           <i data-lucide="edit-3" class="action-icon" onclick="openEditModal(${t.id})"></i>
           <i data-lucide="trash-2" class="action-icon delete" onclick="deleteTransaction(${t.id})"></i>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;

  // Monthly Summary
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyTotalVal = monthlyTransactions.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
  monthly_total.innerText = `$${monthlyTotalVal}`;
}

// --- Charting ---

function updateChart() {
  updateDistributionChart();
  updateTrendChart();
}

function updateDistributionChart() {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  
  const expensesOnly = transactions.filter(t => t.amount < 0);
  const categories = [...new Set(expensesOnly.map(t => t.category))];
  const data = categories.map(cat => {
     return expensesOnly
      .filter(t => t.category === cat)
      .reduce((acc, item) => acc + Math.abs(item.amount), 0);
  });

  if (distributionChart) distributionChart.destroy();

  if (expensesOnly.length === 0) return;

  distributionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: data,
        backgroundColor: [
          '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: getTextColor(), font: { family: 'Outfit' } } }
      },
      cutout: '70%',
      animation: { duration: 1500, easing: 'easeOutQuart' }
    }
  });
}

function updateTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // Group totals by date (last 7 entries or unique dates)
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = [...new Set(sorted.map(t => t.date))].slice(-7);
    
    const incomeData = dates.map(date => {
        return sorted.filter(t => t.date === date && t.amount > 0)
            .reduce((acc, item) => acc + item.amount, 0);
    });

    const expenseData = dates.map(date => {
        return Math.abs(sorted.filter(t => t.date === date && t.amount < 0)
            .reduce((acc, item) => acc + item.amount, 0));
    });

    if (trendChart) trendChart.destroy();

    if (dates.length === 0) return;

    trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#10b981',
                    borderRadius: 5
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: '#f43f5e',
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: getTextColor(), font: { family: 'Outfit' } } }
            },
            scales: {
                x: { ticks: { color: getTextColor() }, grid: { display: false } },
                y: { ticks: { color: getTextColor() }, grid: { color: 'rgba(0,0,0,0.05)' } }
            },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });
}

function getTextColor() {
    return document.body.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b';
}

// --- Extras ---

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    lucide.createIcons();
    init(); // Refresh chart colors
});

// Load Theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.setAttribute('data-lucide', 'moon');
}

// Export CSV
exportBtn.addEventListener('click', () => {
  if (transactions.length === 0) return alert('No data to export');
  
  const headers = ['Description', 'Amount', 'Category', 'Date'];
  const rows = transactions.map(t => [t.text, t.amount, t.category, t.date]);
  
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "expenses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Export JSON
exportJsonBtn.addEventListener('click', () => {
    if (transactions.length === 0) return alert('No data to export');
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "expenses.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Clear All Data
clearDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        transactions = [];
        updateLocalStorage();
        init();
        alert('All data cleared.');
    }
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderList();
    lucide.createIcons();
  });
});

// Start
init();
form.addEventListener('submit', addTransaction);

# 💰 Smart Expense Tracker Pro

A professional, feature-rich web application built with vanilla JavaScript, CSS, and HTML to help you manage your finances with ease and elegance.

![Expense Tracker Screenshot](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/wallet.svg) <!-- Placeholder for image if available -->

## ✨ Features

- **📊 Comprehensive Dashboard**: Real-time updates of your total balance, monthly totals, and income/expense breakdown.
- **📈 Dynamic Visualizations**:
  - **Expense Distribution**: Beautiful doughnut chart showing where your money goes.
  - **Monthly Trends**: Bar chart comparing income vs. expenses over time.
- **🌗 Dark Mode Support**: Sleek UI that adapts to your preference with a dedicated theme toggle.
- **📁 Data Management**:
  - **Local Persistence**: All your data is saved securely in your browser's LocalStorage.
  - **CSV/JSON Export**: Take your data with you in standard formats for further analysis.
  - **Filtering**: Easily filter your transaction history by type (All, Income, Expense).
- **🎨 Premium Design**:
  - **Glassmorphism**: Modern aesthetic with frosted glass effects and subtle blurs.
  - **Responsive Layout**: Works perfectly on desktops, tablets, and smartphones.
  - **Micro-animations**: Smooth transitions and status updates for a premium feel.
- **🏗️ Built with Best Practices**: Semantic HTML5, CSS Variables, and modular JavaScript.

## 🚀 Getting Started

### Prerequisites

You only need a modern web browser to run this project.

### Installation

1. Clone or download this repository.
2. Open `index.html` directly in your browser.
3. Alternatively, use a local server like `npx serve` or `Python's http.server`:

```bash
# Using npx (Node.js)
npx serve .

# Using Python
python -m http.server 8000
```

## 🛠️ Tech Stack

- **HTML5**: Structured with semantic elements for better accessibility and SEO.
- **CSS3**: Custom vanilla CSS using variables, flexbox, and grid layouts.
- **JavaScript (ES6+)**: Pure JS for state management and calculations.
- **[Chart.js](https://www.chartjs.org/)**: Powering the interactive financial graphs.
- **[Lucide Icons](https://lucide.dev/)**: For clean, professional iconography.
- **Google Fonts**: Uses the "Outfit" font family for a modern look.

## 📂 File Structure

```text
/
├── index.html   # Main application structure and SEO metadata
├── style.css    # Core design system, glassmorphism, and dark mode tokens
├── script.js    # Business logic, LocalStorage handling, and Chart.js integration
└── README.md    # Project documentation
```

## 📝 Usage

1. **Add Transaction**: Enter a description, amount, select a category and date, then click "Add Transaction".
2. **Edit/Delete**: Hover over any item in the history to find edit and delete icons.
3. **Filter**: Use the filters above the history list to view specific types of transactions.
4. **Theme**: Click the sun/moon icon in the header to toggle dark mode.
5. **Export**: Use the download icons in the header to export your data as CSV or JSON.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Made with ❤️ for better financial management.*

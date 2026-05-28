import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const FinanceCharts = ({ transactions, theme }) => {
  const isDark = theme === 'dark';
  
  // Font Colors based on current theme
  const textColor = isDark ? '#9ca3af' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.08)';

  // Chart Global Default Options
  const chartFont = {
    family: "'Inter', sans-serif",
    size: 11
  };

  // --- 1. PIE CHART: Expense Category Distribution ---
  const getPieData = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenses.forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + Number(tx.amount);
    });

    const categories = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const backgroundColors = [
      '#6366f1', // Indigo
      '#06b6d4', // Cyan
      '#10b981', // Emerald Green
      '#f59e0b', // Amber/Orange
      '#ef4444', // Red
      '#ec4899', // Pink
      '#8b5cf6', // Violet
      '#f43f5e', // Rose
      '#14b8a6', // Teal
      '#a855f7'  // Purple
    ];

    return {
      labels: categories,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, categories.length),
          borderWidth: isDark ? 2 : 1,
          borderColor: isDark ? '#0f111a' : '#fff',
          hoverOffset: 6
        }
      ]
    };
  };

  // --- 2. BAR CHART: Monthly Income vs Expenses (Jan -> Dec) ---
  const getBarData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthIndex = date.getMonth(); // 0 - 11
      const amount = Number(tx.amount);

      if (tx.type === 'income') {
        incomeData[monthIndex] += amount;
      } else {
        expenseData[monthIndex] += amount;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.75)',
          borderRadius: 4,
          maxBarThickness: 16
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.75)',
          borderRadius: 4,
          maxBarThickness: 16
        }
      ]
    };
  };

  // --- 3. LINE CHART: Savings Trend Over Time ---
  const getLineData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const netSavings = Array(12).fill(0);

    // Calculate net for each month
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthIndex = date.getMonth();
      const amount = Number(tx.amount);

      if (tx.type === 'income') {
        netSavings[monthIndex] += amount;
      } else {
        netSavings[monthIndex] -= amount;
      }
    });

    // Generate cumulative savings
    let cumulative = 0;
    const cumulativeSavings = netSavings.map((net) => {
      cumulative += net;
      return cumulative;
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Net Balance Progress',
          data: cumulativeSavings,
          borderColor: '#6366f1',
          borderWidth: 3,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: isDark ? '#0f111a' : '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: textColor,
          font: chartFont,
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ₹${context.raw.toLocaleString()}`
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: chartFont,
          boxWidth: 12
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: chartFont }
      },
      y: {
        grid: { color: gridColor },
        ticks: { 
          color: textColor, 
          font: chartFont,
          callback: (value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: chartFont }
      },
      y: {
        grid: { color: gridColor },
        ticks: { 
          color: textColor, 
          font: chartFont,
          callback: (value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`
        }
      }
    }
  };

  const expensesExist = transactions.some(t => t.type === 'expense');

  return {
    PieChart: () => (
      <div className="chart-container-wrapper">
        {expensesExist ? (
          <Pie data={getPieData()} options={pieOptions} />
        ) : (
          <div className="flex-between" style={{ height: '100%', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No expense data available
          </div>
        )}
      </div>
    ),
    BarChart: () => (
      <div className="chart-container-wrapper">
        <Bar data={getBarData()} options={barOptions} />
      </div>
    ),
    LineChart: () => (
      <div className="chart-container-wrapper">
        <Line data={getLineData()} options={lineOptions} />
      </div>
    )
  };
};
export default FinanceCharts;

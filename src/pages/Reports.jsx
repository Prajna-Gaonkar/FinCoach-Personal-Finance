import React, { useState } from 'react';
import { FileText, Download, Calendar, ArrowRight, Table } from 'lucide-react';
import { 
  getTransactionsByMonth, 
  calculateSummaryMetrics, 
  getCategorySpending,
  calculateBudgetComparison 
} from '../utils/calculations';

const Reports = ({ transactions, budgets, settings }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  
  // Calculate metrics for selected month
  const monthTx = getTransactionsByMonth(transactions, selectedMonth);
  const metrics = calculateSummaryMetrics(monthTx);

  const categorySpend = getCategorySpending(transactions, selectedMonth);
  const budgetComparisons = calculateBudgetComparison(categorySpend, budgets);

  // Generates CSV download file
  const handleExportCSV = () => {
    // CSV Header row
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Transaction ID,Date,Title,Type,Category,Amount\r\n";

    // Add each transaction row
    monthTx.forEach((tx) => {
      const row = `"${tx.id}","${tx.date}","${tx.title.replace(/"/g, '""')}","${tx.type}","${tx.category}",${tx.amount}`;
      csvContent += row + "\r\n";
    });

    // Add Summary details at footer
    csvContent += "\r\n";
    csvContent += `Summary for Month: ${selectedMonth}\r\n`;
    csvContent += `Total Income,${metrics.totalIncome}\r\n`;
    csvContent += `Total Expenses,${metrics.totalExpenses}\r\n`;
    csvContent += `Net Savings,${metrics.totalSavings}\r\n`;

    // Trigger Client-side download trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinCoach_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get available months in dataset to fill select options
  const getAvailableMonths = () => {
    const dates = transactions.map(t => t.date.substring(0, 7)); // 'YYYY-MM'
    const unique = [...new Set(dates)].sort((a, b) => b.localeCompare(a));
    return unique;
  };

  const months = getAvailableMonths();

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Reports</h1>
          <p>Monthly summary and CSV export</p>
        </div>
      </div>

      {/* Selector and Download Panel */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-control"
              style={{ fontWeight: '600' }}
            >
              {months.map(m => (
                <option key={m} value={m}>{new Date(m + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}</option>
              ))}
            </select>
          </div>

          <button onClick={handleExportCSV} className="btn btn-primary flex-gap-8" disabled={monthTx.length === 0}>
            <Download size={16} />
            <span>Download CSV</span>
          </button>

        </div>
      </div>

      {/* Main Report Visual layout */}
      <div className="dashboard-grid">
        
        {/* Left Side: Category Budgets and Spend comparison tables */}
        <div className="card">
          <div className="widget-header" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Table size={18} style={{ color: 'var(--secondary)' }} />
              <h2 className="widget-title">Spending vs budget</h2>
            </div>
          </div>

          <div className="table-container">
            <table className="table report-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget Limit</th>
                  <th>Actual spent</th>
                  <th>Over / Under</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {budgetComparisons.map((b) => {
                  const isOver = b.alertLevel === 'exceeded';
                  return (
                    <tr key={b.category}>
                      <td data-label="Category" style={{ fontWeight: '600' }}>{b.category}</td>
                      <td data-label="Budget Limit">{settings.currency}{b.limit.toLocaleString()}</td>
                      <td data-label="Actual spent">{settings.currency}{b.spent.toLocaleString()}</td>
                      <td
                        data-label="Over / Under"
                        style={{ 
                          fontWeight: '700',
                          color: isOver ? 'var(--danger)' : 'var(--success)'
                        }}
                      >
                        {isOver ? '+' : '-'}{settings.currency}{Math.abs(b.diff).toLocaleString()}
                      </td>
                      <td data-label="Status">
                        <span className={`badge ${b.alertLevel === 'exceeded' ? 'badge-danger' : b.alertLevel === 'warning' ? 'badge-warning' : 'badge-success'}`}>
                          {b.alertLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {budgetComparisons.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No category budget caps configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Executive summary checklist */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="widget-header" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} />
              <h2 className="widget-title">Month summary</h2>
            </div>
          </div>

          <div className="report-summary-block">
            <div className="flex-between" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>Total Transactions:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{monthTx.length} items</strong>
            </div>
            <div className="flex-between" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Monthly Inflow (Income):</span>
              <strong style={{ color: 'var(--success)' }}>{settings.currency}{metrics.totalIncome.toLocaleString()}</strong>
            </div>
            <div className="flex-between" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Monthly Outflow (Expense):</span>
              <strong style={{ color: 'var(--danger)' }}>{settings.currency}{metrics.totalExpenses.toLocaleString()}</strong>
            </div>
            <div className="flex-between" style={{ fontSize: '13.5px', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', marginTop: '12px', paddingTop: '12px' }}>
              <span>Net Monthly Savings:</span>
              <strong style={{ color: 'var(--secondary)', fontSize: '16px' }}>{settings.currency}{metrics.totalSavings.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <p>
              The CSV includes this month&apos;s transactions plus income and expense totals.
            </p>
            <p style={{ marginTop: '8px' }}>
              You can open it in Excel, Google Sheets, or similar.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;

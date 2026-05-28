import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  PiggyBank, 
  Wallet,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  calculateSummaryMetrics, 
  getTransactionsByMonth, 
  getCategorySpending,
  calculateBudgetComparison,
  calculateGoalMetrics 
} from '../utils/calculations';

const Dashboard = ({ transactions, budgets, goals, subscriptions, settings, setCurrentPage }) => {
  const currentMonthStr = '2026-05';
  const currentMonthTx = getTransactionsByMonth(transactions, currentMonthStr);
  
  // Calculate stats for current month
  const currentMonthStats = calculateSummaryMetrics(currentMonthTx);
  
  // Overall Balance calculation
  const overallStats = calculateSummaryMetrics(transactions);

  // Get active budget warnings
  const categorySpend = getCategorySpending(transactions, currentMonthStr);
  const budgetComparisons = calculateBudgetComparison(categorySpend, budgets);
  const warnings = budgetComparisons.filter(b => b.alertLevel !== 'safe');

  // Next due subscriptions
  const upcomingSubscriptions = [...subscriptions]
    .sort((a, b) => new Date(a.billingDate) - new Date(b.billingDate))
    .slice(0, 3);

  // Get latest 5 transactions
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Welcome Back, {settings.userName || 'Prajna Gaonkar'}</h1>
          <p>Here is your financial status overview for May 2026</p>
        </div>
        <div className="navbar-actions">
          <div className="badge badge-income" style={{ padding: '8px 12px', fontSize: '13px' }}>
            <Calendar size={14} style={{ marginRight: '6px' }} />
            Active Month: May 2026
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-container grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '32px' }}>
        
        <div className="card kpi-card">
          <div className="kpi-details">
            <h3>Monthly Income</h3>
            <div className="kpi-value" style={{ color: 'var(--success)' }}>
              {settings.currency}{currentMonthStats.totalIncome.toLocaleString()}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Overall: {settings.currency}{overallStats.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="kpi-icon-wrapper income">
            <ArrowUpRight size={24} />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-details">
            <h3>Monthly Expenses</h3>
            <div className="kpi-value" style={{ color: 'var(--danger)' }}>
              {settings.currency}{currentMonthStats.totalExpenses.toLocaleString()}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Overall: {settings.currency}{overallStats.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="kpi-icon-wrapper expense">
            <ArrowDownRight size={24} />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-details">
            <h3>Net Savings</h3>
            <div className="kpi-value" style={{ color: 'var(--secondary)' }}>
              {settings.currency}{currentMonthStats.totalSavings.toLocaleString()}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Savings Rate: {currentMonthStats.totalIncome > 0 ? Math.round((currentMonthStats.totalSavings / currentMonthStats.totalIncome) * 100) : 0}%
            </p>
          </div>
          <div className="kpi-icon-wrapper savings">
            <PiggyBank size={24} />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-details">
            <h3>Total Balance</h3>
            <div className="kpi-value" style={{ color: 'var(--primary)' }}>
              {settings.currency}{overallStats.remainingBalance.toLocaleString()}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All-time income minus expenses
            </p>
          </div>
          <div className="kpi-icon-wrapper balance">
            <Wallet size={24} />
          </div>
        </div>

      </div>

      {/* Split dashboard grid */}
      <div className="dashboard-grid">
        
        {/* Left Side: Recent Transactions & Budgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick budgets overview */}
          <div className="card">
            <div className="widget-header">
              <h2 className="widget-title">Active Category Budgets</h2>
              <span onClick={() => setCurrentPage('budgets')} className="widget-action">Budgets <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} /></span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {budgets.slice(0, 3).map((b) => {
                const spent = categorySpend[b.category] || 0;
                const percent = b.limit > 0 ? Math.min(Math.round((spent / b.limit) * 100), 100) : 0;
                const isOver = spent > b.limit;
                
                return (
                  <div key={b.category} className="progress-container">
                    <div className="progress-header">
                      <span style={{ fontWeight: '600' }}>{b.category}</span>
                      <span>
                        {settings.currency}{spent.toLocaleString()} / <span style={{ color: 'var(--text-muted)' }}>{settings.currency}{b.limit.toLocaleString()}</span> ({percent}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${percent}%`, 
                          backgroundColor: isOver ? 'var(--danger)' : percent >= 85 ? 'var(--warning)' : 'var(--primary)' 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  No budget trackers added yet. Set monthly caps on the Budgets page.
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="widget-header">
              <h2 className="widget-title">Recent Transactions</h2>
              <span onClick={() => setCurrentPage('transactions')} className="widget-action">View all <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} /></span>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style={{ textAlignment: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: '500' }}>{tx.title}</td>
                      <td>
                        <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                      <td style={{ 
                        fontWeight: '700', 
                        color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                        textAlign: 'right'
                      }}>
                        {tx.type === 'income' ? '+' : '-'}{settings.currency}{Number(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {recentTx.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                        No transactions yet. Add one from the Transactions page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side: Goals & Subscriptions & Warnings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Smart Budget Warning Monitor */}
          {warnings.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <div className="widget-header" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                  <h2 className="widget-title" style={{ fontSize: '16px' }}>Budget Limit Warnings</h2>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {warnings.map(w => (
                  <div key={w.category} style={{ fontSize: '13px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: '600' }}>{w.category}</span>
                      <span className={`badge ${w.alertLevel === 'exceeded' ? 'badge-danger' : 'badge-warning'}`}>
                        {w.alertLevel}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{w.alertMessage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Goal widget */}
          <div className="card">
            <div className="widget-header">
              <h2 className="widget-title">Savings Goals Progress</h2>
              <span onClick={() => setCurrentPage('goals')} className="widget-action">Goals <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} /></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {goals.slice(0, 2).map((g) => {
                const metrics = calculateGoalMetrics(g);
                return (
                  <div key={g.id}>
                    <div className="flex-between" style={{ fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>{g.name}</span>
                      <span style={{ fontWeight: '600' }}>{metrics.progress}%</span>
                    </div>
                    <div className="progress-track" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ width: `${metrics.progress}%`, backgroundColor: 'var(--secondary)' }} />
                    </div>
                    <div className="flex-between" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      <span>Saved: {settings.currency}{Number(g.currentSaved).toLocaleString()}</span>
                      <span>Target: {settings.currency}{Number(g.targetAmount).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No goals yet. Add one on the Goals page.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Subscriptions Widget */}
          <div className="card">
            <div className="widget-header">
              <h2 className="widget-title">Recurring Subscriptions</h2>
              <span onClick={() => setCurrentPage('subscriptions')} className="widget-action">Bills <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} /></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingSubscriptions.map((s) => (
                <div key={s.id} className="flex-between" style={{ padding: '10px 12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Next Bill: {s.billingDate}
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--primary)' }}>
                    {settings.currency}{Number(s.amount).toLocaleString()}/mo
                  </div>
                </div>
              ))}
              {upcomingSubscriptions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No subscriptions yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Sparkles } from 'lucide-react';
import FinanceCharts from '../components/Analytics/FinanceCharts';
import InsightCard from '../components/Insights/InsightCard';
import { generateInsights } from '../utils/calculations';

const Analytics = ({ transactions, budgets, settings, theme }) => {
  const currentMonthStr = '2026-05';
  
  // Initialize Chart components
  const { PieChart, BarChart, LineChart } = FinanceCharts({ transactions, theme });

  const spendingTips = generateInsights(transactions, budgets, currentMonthStr);

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Analytics</h1>
          <p>Charts and spending tips based on your transactions</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="dashboard-grid layout-split analytics-split">
        
        {/* Left Side: Charts Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Bar Chart: Income vs Expense comparison */}
          <div className="card">
            <div className="widget-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                <h2 className="widget-title">Income vs expenses (2026)</h2>
              </div>
            </div>
            <BarChart />
          </div>

          <div className="settings-grid">
            
            {/* Pie Chart: Expenses Category Distribution */}
            <div className="card">
              <div className="widget-header" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieIcon size={18} style={{ color: 'var(--secondary)' }} />
                  <h2 className="widget-title" style={{ fontSize: '16px' }}>Category Distribution (May)</h2>
                </div>
              </div>
              <PieChart />
            </div>

            {/* Line Chart: Savings Accumulation over time */}
            <div className="card">
              <div className="widget-header" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LineIcon size={18} style={{ color: 'var(--primary)' }} />
                  <h2 className="widget-title" style={{ fontSize: '16px' }}>Balance over time</h2>
                </div>
              </div>
              <LineChart />
            </div>

          </div>

        </div>

        {/* Spending tips */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
          <div className="widget-header" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
              <h2 className="widget-title">Spending tips</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {spendingTips.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;

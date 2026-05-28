import React, { useState } from 'react';
import { Plus, Edit2, AlertTriangle, CheckCircle, Flame, Wallet } from 'lucide-react';
import { getTransactionsByMonth, getCategorySpending, calculateBudgetComparison } from '../utils/calculations';
import Modal from '../components/Common/Modal';

const Budgets = ({ transactions, budgets, setBudgets, categories, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [budgetCategory, setBudgetCategory] = useState(categories[0] || 'Food');
  const [budgetLimit, setBudgetLimit] = useState('');

  const currentMonthStr = '2026-05';
  const categorySpend = getCategorySpending(transactions, currentMonthStr);
  const budgetData = calculateBudgetComparison(categorySpend, budgets);

  // Totals calculations
  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const totalSpentInBudgeted = budgetData.reduce((sum, b) => sum + b.spent, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!budgetLimit || Number(budgetLimit) <= 0) return;

    // Check if category already has a budget
    const existsIndex = budgets.findIndex(b => b.category === budgetCategory);
    if (existsIndex > -1) {
      const updated = [...budgets];
      updated[existsIndex].limit = Number(budgetLimit);
      setBudgets(updated);
    } else {
      setBudgets([...budgets, { category: budgetCategory, limit: Number(budgetLimit) }]);
    }

    setBudgetLimit('');
    setIsModalOpen(false);
  };

  const handleEdit = (category, limit) => {
    setBudgetCategory(category);
    setBudgetLimit(limit);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    if (window.confirm(`Delete budget cap for ${category}?`)) {
      setBudgets(budgets.filter(b => b.category !== category));
    }
  };

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Category Budgets</h1>
          <p>Set monthly spending limits by category</p>
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Add budget</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Monthly Limit Caps</span>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
              {settings.currency}{totalBudgeted.toLocaleString()}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spent in Budgeted Categories (May)</span>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: totalSpentInBudgeted > totalBudgeted ? 'var(--danger)' : 'var(--success)',
              marginTop: '4px',
              fontFamily: 'var(--font-heading)'
            }}>
              {settings.currency}{totalSpentInBudgeted.toLocaleString()}
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div className="progress-header" style={{ fontSize: '12px' }}>
              <span>Total Cap Used</span>
              <span>{totalBudgeted > 0 ? Math.round((totalSpentInBudgeted / totalBudgeted) * 100) : 0}%</span>
            </div>
            <div className="progress-track" style={{ height: '8px' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${totalBudgeted > 0 ? Math.min((totalSpentInBudgeted / totalBudgeted) * 100, 100) : 0}%`,
                  backgroundColor: totalSpentInBudgeted > totalBudgeted ? 'var(--danger)' : 'var(--primary)'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid List */}
      <div className="grid-container grid-2">
        {budgetData.map((b) => {
          const isOver = b.alertLevel === 'exceeded';
          const isWarning = b.alertLevel === 'warning';
          
          return (
            <div key={b.category} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wallet size={16} style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{b.category}</h3>
                  </div>
                  <span className={`badge ${isOver ? 'badge-danger' : isWarning ? 'badge-warning' : 'badge-success'}`}>
                    {b.alertLevel}
                  </span>
                </div>

                <div className="flex-between" style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <span>Spent: <strong style={{ color: 'var(--text-primary)' }}>{settings.currency}{b.spent.toLocaleString()}</strong></span>
                  <span>Cap Limit: <strong>{settings.currency}{b.limit.toLocaleString()}</strong></span>
                </div>

                {/* Progress bar container */}
                <div className="progress-track" style={{ height: '10px', marginBottom: '16px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(b.percent, 100)}%`, 
                      backgroundColor: isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)' 
                    }} 
                  />
                </div>

                {/* Visual Alert Message Box */}
                <div style={{ 
                  padding: '10px 12px', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: isOver ? 'var(--danger-bg)' : isWarning ? 'var(--warning-bg)' : 'var(--success-bg)',
                  color: isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  marginBottom: '16px'
                }}>
                  {isOver ? <Flame size={16} /> : isWarning ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                  <span>{b.alertMessage}</span>
                </div>
              </div>

              <div className="flex-gap-8" style={{ alignSelf: 'flex-end' }}>
                <button 
                  onClick={() => handleEdit(b.category, b.limit)} 
                  className="btn btn-secondary btn-sm flex-gap-8"
                >
                  <Edit2 size={12} />
                  <span>Adjust Cap</span>
                </button>
                <button 
                  onClick={() => handleDelete(b.category)} 
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        {budgetData.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No budgets yet. Use the button above to add one.
          </div>
        )}
      </div>

      {/* Modal configuration form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set budget">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="budget-category">Select Category</label>
            <select 
              id="budget-category"
              value={budgetCategory}
              onChange={(e) => setBudgetCategory(e.target.value)}
              className="form-control"
            >
              {categories.map(c => (
                // Hide Income categories like salary in budgeting caps
                c.toLowerCase() !== 'salary' && (
                  <option key={c} value={c}>{c}</option>
                )
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="budget-limit">Monthly Limit Amount ({settings.currency})</label>
            <input 
              id="budget-limit"
              type="number"
              required
              min="1"
              placeholder="e.g. 5000"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="flex-gap-12" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>

        </form>
      </Modal>
    </div>
  );
};

export default Budgets;

import React, { useState } from 'react';
import { Plus, Target, Calendar, ArrowRight, TrendingUp, Edit2 } from 'lucide-react';
import { calculateGoalMetrics } from '../utils/calculations';
import Modal from '../components/Common/Modal';

const Goals = ({ goals, setGoals, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState(null);

  // New Goal Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSaved, setCurrentSaved] = useState('');
  const [targetDate, setTargetDate] = useState('');

  // Quick Save State
  const [saveAmount, setSaveAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || Number(targetAmount) <= 0) return;

    const newGoal = {
      id: 'goal-' + Date.now(),
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentSaved: Number(currentSaved) || 0,
      targetDate: targetDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0] // default 1 year from now
    };

    setGoals([...goals, newGoal]);

    // Reset Form
    setName('');
    setTargetAmount('');
    setCurrentSaved('');
    setTargetDate('');
    setIsModalOpen(false);
  };

  const handleQuickSaveSubmit = (e) => {
    e.preventDefault();
    const amt = Number(saveAmount);
    if (!amt || amt <= 0 || !activeGoalId) return;

    const updated = goals.map((g) => {
      if (g.id === activeGoalId) {
        return {
          ...g,
          currentSaved: Math.min(g.currentSaved + amt, g.targetAmount)
        };
      }
      return g;
    });

    setGoals(updated);
    setSaveAmount('');
    setIsSaveModalOpen(false);
  };

  const triggerSaveModal = (id) => {
    setActiveGoalId(id);
    setIsSaveModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this savings goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Goals</h1>
          <p>Track savings targets and how much to put aside each month</p>
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Grid of Goals */}
      <div className="grid-container grid-2">
        {goals.map((g) => {
          const metrics = calculateGoalMetrics(g);
          const activeGoal = g;
          
          return (
            <div key={g.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Title Section */}
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="kpi-icon-wrapper savings" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{g.name}</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={12} />
                        Target: {g.targetDate}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '20px' }}>
                    {metrics.progress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="progress-container" style={{ marginBottom: '20px' }}>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${metrics.progress}%`, backgroundColor: 'var(--secondary)' }} />
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="settings-grid" style={{ gap: '12px', marginBottom: '20px' }}>
                  
                  <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Saved Already</span>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px', color: 'var(--success)' }}>
                      {settings.currency}{Number(g.currentSaved).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Remaining Target</span>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>
                      {settings.currency}{metrics.remaining.toLocaleString()}
                    </div>
                  </div>

                </div>

                <div style={{ 
                  backgroundColor: 'rgba(6, 182, 212, 0.06)',
                  borderLeft: '4px solid var(--secondary)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13.5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  lineHeight: '1.4'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Save per month to hit goal:</span>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {settings.currency}{metrics.monthlyNeeded.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-secondary)' }}>/ month</span>
                    </div>
                  </div>
                  <TrendingUp size={24} style={{ color: 'var(--secondary)', opacity: 0.8 }} />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex-between">
                <button 
                  onClick={() => triggerSaveModal(g.id)} 
                  className="btn btn-primary btn-sm flex-gap-8"
                  style={{ padding: '8px 14px' }}
                >
                  <Plus size={14} />
                  <span>Add savings</span>
                </button>
                
                <button 
                  onClick={() => handleDelete(g.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                >
                  Delete Goal
                </button>
              </div>

            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No goals yet. Click Create Goal to add one.
          </div>
        )}
      </div>

      {/* Modal to Create Goal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New goal">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="goal-name">Goal name</label>
            <input 
              id="goal-name"
              type="text"
              required
              placeholder="e.g. Higher Studies or New Phone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="settings-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="goal-target">Target Amount ({settings.currency})</label>
              <input 
                id="goal-target"
                type="number"
                required
                min="100"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="goal-saved">Current Saved ({settings.currency})</label>
              <input 
                id="goal-saved"
                type="number"
                min="0"
                placeholder="0"
                value={currentSaved}
                onChange={(e) => setCurrentSaved(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="goal-date">Target date</label>
            <input 
              id="goal-date"
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="flex-gap-12" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create goal
            </button>
          </div>

        </form>
      </Modal>

      {/* Modal to Contribute to Goal (Quick Save) */}
      <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title="Add to savings">
        <form onSubmit={handleQuickSaveSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="save-amt">Amount ({settings.currency})</label>
            <input 
              id="save-amt"
              type="number"
              required
              min="1"
              placeholder="e.g. 5000"
              value={saveAmount}
              onChange={(e) => setSaveAmount(e.target.value)}
              className="form-control"
              autoFocus
            />
          </div>

          <div className="flex-gap-12" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsSaveModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>

        </form>
      </Modal>
    </div>
  );
};

export default Goals;

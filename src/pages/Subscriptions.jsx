import React, { useState } from 'react';
import { Plus, CreditCard, Calendar, RefreshCw, Trash2 } from 'lucide-react';
import Modal from '../components/Common/Modal';

const Subscriptions = ({ 
  subscriptions, 
  setSubscriptions, 
  settings,
  transactions,
  setTransactions
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Subscription Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  // Calculates total monthly subscription cost sum
  const totalMonthlyCost = subscriptions.reduce((sum, sub) => {
    const amt = Number(sub.amount) || 0;
    if (sub.frequency === 'yearly') {
      return sum + Math.round(amt / 12);
    }
    return sum + amt;
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0 || !billingDate) return;

    const newSub = {
      id: 'sub-' + Date.now(),
      name: name.trim(),
      amount: Number(amount),
      billingDate: billingDate,
      frequency: frequency
    };

    setSubscriptions([...subscriptions, newSub]);

    // Reset Form
    setName('');
    setAmount('');
    setBillingDate('');
    setFrequency('monthly');
    setIsModalOpen(false);
  };

  const handleLogPayment = (sub) => {
    // Add matching expense to transactions
    const newTx = {
      id: 'tx-sub-' + Date.now(),
      title: `${sub.name} (Recurring Payment)`,
      amount: Number(sub.amount),
      date: new Date().toISOString().split('T')[0], // today's date
      category: 'Bills',
      type: 'expense'
    };

    setTransactions([newTx, ...transactions]);

    // 2. Bump next billing date forward by 1 cycle
    const currentBilling = new Date(sub.billingDate);
    if (sub.frequency === 'yearly') {
      currentBilling.setFullYear(currentBilling.getFullYear() + 1);
    } else {
      currentBilling.setMonth(currentBilling.getMonth() + 1);
    }
    const nextDateStr = currentBilling.toISOString().split('T')[0];

    const updatedSubs = subscriptions.map((s) => {
      if (s.id === sub.id) {
        return {
          ...s,
          billingDate: nextDateStr
        };
      }
      return s;
    });

    setSubscriptions(updatedSubs);
    alert(`Added ${settings.currency}${sub.amount} to transactions. Next bill date for ${sub.name}: ${nextDateStr}.`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Stop tracking this recurring subscription?')) {
      setSubscriptions(subscriptions.filter(s => s.id !== id));
    }
  };

  // Calculates due status
  const getDueStatus = (dateStr) => {
    const today = new Date();
    const billing = new Date(dateStr);
    
    // Set hours to 0 to compare dates
    today.setHours(0, 0, 0, 0);
    billing.setHours(0, 0, 0, 0);

    const diffTime = billing - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Past Due', badge: 'badge-danger' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', badge: 'badge-danger' };
    } else if (diffDays <= 5) {
      return { text: `Due in ${diffDays} days`, badge: 'badge-warning' };
    } else {
      return { text: `Due in ${diffDays} days`, badge: 'badge-success' };
    }
  };

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Subscriptions</h1>
          <p>Keep track of monthly and yearly bills</p>
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Add subscription</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Dashboard */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated monthly total</span>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
              {settings.currency}{totalMonthlyCost.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-secondary)' }}>/ month</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active</span>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '2px' }}>{subscriptions.length}</div>
            </div>
            <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Per year (est.)</span>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '2px', color: 'var(--secondary)' }}>
                {settings.currency}{(totalMonthlyCost * 12).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid List */}
      <div className="grid-container grid-3">
        {subscriptions.map((s) => {
          const dueStatus = getDueStatus(s.billingDate);
          
          return (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}>
              <div>
                {/* Header */}
                <div className="flex-between" style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>{s.name}</span>
                  </div>
                  <span className={`badge ${s.frequency === 'yearly' ? 'badge-warning' : 'badge-income'}`}>
                    {s.frequency}
                  </span>
                </div>

                {/* Amount */}
                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>
                  {settings.currency}{Number(s.amount).toLocaleString()}
                  <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                    {s.frequency === 'yearly' ? '/ year' : '/ month'}
                  </span>
                </div>

                {/* Billing Status */}
                <div className="flex-between" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    {s.billingDate}
                  </span>
                  <span className={`badge ${dueStatus.badge}`} style={{ fontSize: '11px' }}>
                    {dueStatus.text}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', gap: '8px' }}>
                <button 
                  onClick={() => handleLogPayment(s)}
                  className="btn btn-primary btn-sm flex-gap-8"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                  title="Add expense and move next bill date forward"
                >
                  <RefreshCw size={12} />
                  <span>Log Paid</span>
                </button>

                <button 
                  onClick={() => handleDelete(s.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', gap: '4px', padding: '6px 10px', fontSize: '12px' }}
                  title="Remove subscription"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          );
        })}
        {subscriptions.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No subscriptions yet. Add things like streaming, gym, or internet bills.
          </div>
        )}
      </div>

      {/* Modal configuration form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add subscription">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="sub-name">Service / Sub name</label>
            <input 
              id="sub-name"
              type="text"
              required
              placeholder="e.g. Netflix Premium or Wifi Broadband"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="settings-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="sub-amount">Billing Amount ({settings.currency})</label>
              <input 
                id="sub-amount"
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sub-frequency">Frequency Type</label>
              <select 
                id="sub-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="form-control"
              >
                <option value="monthly">Monthly Cycle</option>
                <option value="yearly">Yearly Cycle</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sub-date">Next Billing Date</label>
            <input 
              id="sub-date"
              type="date"
              required
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
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

export default Subscriptions;

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  ArrowUpDown, 
  Filter, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import Modal from '../components/Common/Modal';

const Transactions = ({ 
  transactions, 
  setTransactions, 
  categories, 
  setCategories, 
  settings 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // New Transaction Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(categories[0] || 'Food');
  const [type, setType] = useState('expense');
  
  // Custom Category Add State (within transaction creation)
  const [customCat, setCustomCat] = useState('');
  const [showCustomCatInput, setShowCustomCatInput] = useState(false);

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    let finalCategory = category;
    if (showCustomCatInput && customCat.trim()) {
      const formattedCat = customCat.trim();
      if (!categories.includes(formattedCat)) {
        setCategories([...categories, formattedCat]);
      }
      finalCategory = formattedCat;
    }

    const newTx = {
      id: 'tx-' + Date.now(),
      title: title.trim(),
      amount: Number(amount),
      date: date,
      category: finalCategory,
      type: type
    };

    setTransactions([newTx, ...transactions]);
    
    // Reset Form
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory(categories[0] || 'Food');
    setType('expense');
    setCustomCat('');
    setShowCustomCatInput(false);
    setIsModalOpen(false);
  };

  // Delete transaction
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Filter & Sort Logic
  const filteredTx = transactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedTx = [...filteredTx].sort((a, b) => {
    let fieldA = sortField === 'amount' ? Number(a.amount) : new Date(a.date);
    let fieldB = sortField === 'amount' ? Number(b.amount) : new Date(b.date);

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedTx.length / itemsPerPage);
  const paginatedTx = sortedTx.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Transactions</h1>
          <p>Add, search, and manage income and expenses</p>
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sort Controls Panel */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
              className="form-control"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Category Filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
            <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={categoryFilter} 
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
              className="form-control"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex-gap-8" style={{ flexWrap: 'wrap' }}>
            <button 
              onClick={() => toggleSort('date')} 
              className={`btn btn-secondary btn-sm flex-gap-8 ${sortField === 'date' ? 'active' : ''}`}
              style={{ padding: '10px 14px' }}
            >
              <ArrowUpDown size={14} />
              <span>Sort by Date ({sortField === 'date' && sortOrder === 'desc' ? 'Newest' : 'Oldest'})</span>
            </button>
            
            <button 
              onClick={() => toggleSort('amount')} 
              className={`btn btn-secondary btn-sm flex-gap-8 ${sortField === 'amount' ? 'active' : ''}`}
              style={{ padding: '10px 14px' }}
            >
              <ArrowUpDown size={14} />
              <span>Sort by Amount ({sortField === 'amount' && sortOrder === 'desc' ? 'High' : 'Low'})</span>
            </button>
          </div>

        </div>
      </div>

      {/* Transaction table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTx.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    {tx.type === 'income' ? (
                      <span className="kpi-icon-wrapper income" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>
                        <ArrowUpRight size={14} />
                      </span>
                    ) : (
                      <span className="kpi-icon-wrapper expense" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>
                        <ArrowDownRight size={14} />
                      </span>
                    )}
                  </td>
                  <td style={{ fontWeight: '600' }}>{tx.title}</td>
                  <td>
                    <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                  <td style={{ 
                    fontWeight: '700', 
                    color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)'
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{settings.currency}{Number(tx.amount).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(tx.id)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '6px 8px' }}
                      title="Delete Transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedTx.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination buttons */}
        {totalPages > 1 && (
          <div className="flex-between" style={{ marginTop: '20px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedTx.length)} of {sortedTx.length} items
            </span>
            <div className="flex-gap-8">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '32px', padding: '6px' }}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal form to add transaction */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add transaction">
        <form onSubmit={handleSubmit}>
          
          {/* Type Toggle */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setType('income'); setCategory(categories.find(c => c.toLowerCase() === 'salary') || categories[0]); }}
                className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`btn ${type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-title">Title / Vendor</label>
            <input 
              id="tx-title"
              type="text" 
              required 
              placeholder="e.g. D-Mart Grocery" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-control"
            />
          </div>

          {/* Amount and Date */}
          <div className="settings-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="tx-amount">Amount ({settings.currency})</label>
              <input 
                id="tx-amount"
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
              <label className="form-label" htmlFor="tx-date">Date</label>
              <input 
                id="tx-date"
                type="date" 
                required 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="form-control"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="form-group">
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label className="form-label" htmlFor="tx-category" style={{ margin: '0' }}>Category</label>
              <button 
                type="button" 
                onClick={() => setShowCustomCatInput(!showCustomCatInput)}
                className="widget-action"
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <PlusCircle size={14} />
                <span>{showCustomCatInput ? 'Choose Standard' : 'Create Custom'}</span>
              </button>
            </div>

            {showCustomCatInput ? (
              <input 
                type="text"
                required
                placeholder="Name of custom category..."
                value={customCat}
                onChange={(e) => setCustomCat(e.target.value)}
                className="form-control"
              />
            ) : (
              <select 
                id="tx-category"
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-control"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex-gap-12" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Record
            </button>
          </div>

        </form>
      </Modal>
    </div>
  );
};

export default Transactions;

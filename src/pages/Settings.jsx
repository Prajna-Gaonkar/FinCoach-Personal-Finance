import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Plus, Trash2, ShieldAlert, Download, Upload } from 'lucide-react';
import { resetAllData } from '../utils/localStorage';

const Settings = ({ 
  settings, 
  setSettings, 
  categories, 
  setCategories,
  transactions,
  setTransactions,
  budgets,
  setBudgets,
  goals,
  setGoals,
  subscriptions,
  setSubscriptions
}) => {
  // Input states
  const [userName, setUserName] = useState(settings.userName || '');
  const [currency, setCurrency] = useState(settings.currency || '₹');
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState(settings.monthlySavingsTarget || 25000);
  
  // Custom Category State
  const [newCategory, setNewCategory] = useState('');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      userName: userName.trim() || 'Prajna Gaonkar',
      currency: currency,
      monthlySavingsTarget: Number(monthlySavingsTarget) || 0
    };
    setSettings(updated);
    alert('General settings saved successfully!');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const formatted = newCategory.trim();
    if (!formatted) return;

    if (categories.includes(formatted)) {
      alert('Category already exists!');
      return;
    }

    setCategories([...categories, formatted]);
    setNewCategory('');
  };

  const handleDeleteCategory = (cat) => {
    if (['Salary', 'Rent', 'Food', 'Bills', 'Travel', 'Shopping'].includes(cat)) {
      alert('This category is built in and cannot be removed.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete category "${cat}"?`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('This will delete all your data and restore the default sample data. Continue?')) {
      resetAllData();
      
      // Force reload state in parent
      window.location.reload();
    }
  };

  // Backup Export
  const handleExportBackup = () => {
    const backupData = {
      transactions,
      budgets,
      goals,
      subscriptions,
      categories,
      settings
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `FinCoach_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Backup Import
  const handleImportBackup = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        
        // Simple schema validation
        if (parsed.transactions && parsed.budgets && parsed.settings) {
          setTransactions(parsed.transactions);
          setBudgets(parsed.budgets);
          if (parsed.goals) setGoals(parsed.goals);
          if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
          if (parsed.categories) setCategories(parsed.categories);
          setSettings(parsed.settings);
          
          alert('Backup imported successfully.');
        } else {
          alert('Invalid backup file. Use a FinCoach JSON export from this app.');
        }
      } catch (err) {
        alert('Error parsing file. Ensure the backup file is clean JSON.');
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div>
      <div className="top-navbar">
        <div className="welcome-section">
          <h1>Settings</h1>
          <p>Profile, categories, and data backup</p>
        </div>
      </div>

      {/* Main Double column grid */}
      <div className="dashboard-grid layout-split settings-split">
        
        {/* Left Side: General Profiles and Category configs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* General Profile Config Card */}
          <div className="card">
            <div className="widget-header" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SettingsIcon size={18} style={{ color: 'var(--primary)' }} />
                <h2 className="widget-title">Profile</h2>
              </div>
            </div>

            <form onSubmit={handleSaveGeneral}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-name-input">User Display Name</label>
                <input 
                  id="user-name-input"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="settings-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="currency-select">Currency Symbol</label>
                  <select 
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-control"
                  >
                    <option value="₹">Rupee (₹)</option>
                    <option value="$">US Dollar ($)</option>
                    <option value="€">Euro (€)</option>
                    <option value="£">Pound (£)</option>
                    <option value="¥">Yen (¥)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="saving-tgt-input">Monthly Savings Target</label>
                  <input 
                    id="saving-tgt-input"
                    type="number"
                    required
                    min="0"
                    placeholder="25000"
                    value={monthlySavingsTarget}
                    onChange={(e) => setMonthlySavingsTarget(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary flex-gap-8" style={{ marginTop: '12px' }}>
                <Save size={16} />
                <span>Save</span>
              </button>
            </form>
          </div>

          {/* Master Categories Manager Card */}
          <div className="card">
            <div className="widget-header" style={{ marginBottom: '20px' }}>
              <h2 className="widget-title">Custom Category Manager</h2>
            </div>

            {/* Quick Category Addition Form */}
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <input 
                type="text"
                required
                placeholder="Type new category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-control"
                style={{ flex: '1' }}
              />
              <button type="submit" className="btn btn-primary flex-gap-8">
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </form>

            {/* Grid list of categories */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map((c) => {
                const isEssential = ['Salary', 'Rent', 'Food', 'Bills', 'Travel', 'Shopping'].includes(c);
                return (
                  <div 
                    key={c} 
                    className="badge flex-gap-8" 
                    style={{ 
                      padding: '8px 12px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid var(--border-color)',
                      textTransform: 'none',
                      fontSize: '13px',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <span>{c}</span>
                    {!isEssential && (
                      <button 
                        type="button" 
                        onClick={() => handleDeleteCategory(c)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Data backup and system options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Backups Card */}
          <div className="card">
            <div className="widget-header" style={{ marginBottom: '16px' }}>
              <h2 className="widget-title">Backup</h2>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
              Export or import your data as a JSON file.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Export JSON Button */}
              <button onClick={handleExportBackup} className="btn btn-secondary flex-between">
                <span style={{ fontSize: '13px' }}>Export Backup (JSON)</span>
                <Download size={14} style={{ color: 'var(--secondary)' }} />
              </button>

              {/* Import JSON Button */}
              <label 
                className="btn btn-secondary flex-between" 
                style={{ cursor: 'pointer', margin: '0' }}
              >
                <span style={{ fontSize: '13px' }}>Import Backup (JSON)</span>
                <Upload size={14} style={{ color: 'var(--primary)' }} />
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportBackup} 
                  style={{ display: 'none' }}
                />
              </label>

            </div>
          </div>

          <div className="card" style={{ border: '1px dashed var(--danger)' }}>
            <div className="widget-header" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} style={{ color: 'var(--danger)' }} />
                <h2 className="widget-title" style={{ fontSize: '16px', color: 'var(--danger)' }}>Reset data</h2>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              Clear everything in this browser and load the default sample data again.
            </p>

            <button onClick={handleFactoryReset} className="btn btn-danger btn-block flex-gap-8 btn-sm" style={{ padding: '10px' }}>
              <RefreshCw size={14} />
              <span>Reset to defaults</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;

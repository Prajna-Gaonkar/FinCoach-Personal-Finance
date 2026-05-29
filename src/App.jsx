import React, { useState, useEffect } from 'react';

// Utilities
import { getData, saveData } from './utils/localStorage';

// Shell & Common Components
import Sidebar from './components/Common/Sidebar';
import MobileNav from './components/Common/MobileNav';

// Sub Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Subscriptions from './pages/Subscriptions';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [transactions, setTransactions] = useState(() => getData('transactions'));
  const [budgets, setBudgets] = useState(() => getData('budgets'));
  const [goals, setGoals] = useState(() => getData('goals'));
  const [subscriptions, setSubscriptions] = useState(() => getData('subscriptions'));
  const [settings, setSettings] = useState(() => getData('settings'));
  const [categories, setCategories] = useState(() => getData('custom_categories'));
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState(settings.theme || 'dark');

  // Persist to localStorage when data changes
  useEffect(() => {
    saveData('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveData('budgets', budgets);
  }, [budgets]);

  useEffect(() => {
    saveData('goals', goals);
  }, [goals]);

  useEffect(() => {
    saveData('subscriptions', subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    saveData('custom_categories', categories);
  }, [categories]);

  useEffect(() => {
    const updatedSettings = { ...settings, theme };
    setSettings(updatedSettings);
    saveData('settings', updatedSettings);
  }, [theme]);

  useEffect(() => {
    saveData('settings', settings);
  }, [settings]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions}
            budgets={budgets}
            goals={goals}
            subscriptions={subscriptions}
            settings={settings}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'transactions':
        return (
          <Transactions 
            transactions={transactions}
            setTransactions={setTransactions}
            categories={categories}
            setCategories={setCategories}
            settings={settings}
          />
        );
      case 'budgets':
        return (
          <Budgets 
            transactions={transactions}
            budgets={budgets}
            setBudgets={setBudgets}
            categories={categories}
            settings={settings}
          />
        );
      case 'goals':
        return (
          <Goals 
            goals={goals}
            setGoals={setGoals}
            settings={settings}
          />
        );
      case 'subscriptions':
        return (
          <Subscriptions 
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
            settings={settings}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        );
      case 'analytics':
        return (
          <Analytics 
            transactions={transactions}
            budgets={budgets}
            settings={settings}
            theme={theme}
          />
        );
      case 'reports':
        return (
          <Reports 
            transactions={transactions}
            budgets={budgets}
            settings={settings}
          />
        );
      case 'settings':
        return (
          <Settings 
            settings={settings}
            setSettings={setSettings}
            categories={categories}
            setCategories={setCategories}
            transactions={transactions}
            setTransactions={setTransactions}
            budgets={budgets}
            setBudgets={setBudgets}
            goals={goals}
            setGoals={setGoals}
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
          />
        );
      default:
        return <Dashboard transactions={transactions} budgets={budgets} goals={goals} settings={settings} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <>
      <MobileNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        settings={settings}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="app-layout">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          settings={settings}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="main-content">
          {renderCurrentPage()}
        </main>
      </div>
    </>
  );
}

export default App;

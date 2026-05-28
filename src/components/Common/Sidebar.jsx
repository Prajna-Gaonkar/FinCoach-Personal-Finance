import React from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  Target, 
  CreditCard,
  BarChart3, 
  FileText, 
  Settings,
  Sun,
  Moon,
  PiggyBank
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, settings, theme, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', name: 'Transactions', icon: ArrowRightLeft },
    { id: 'budgets', name: 'Budgets', icon: Wallet },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="logo-container">
          <div className="logo-icon">
            <PiggyBank size={20} />
          </div>
          <span className="logo-text">FinCoach</span>
        </div>

        <nav>
          <ul className="nav-links">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button 
                    onClick={() => setCurrentPage(item.id)}
                    className={`nav-item btn-block ${currentPage === item.id ? 'active' : ''}`}
                    style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-block flex-between"
          title="Toggle Theme"
        >
          <span style={{ fontSize: '13px' }}>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} />}
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {settings.userName ? settings.userName.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div>
            <div className="user-name">{settings.userName || 'Prajna Gaonkar'}</div>
            <div className="user-role">Target: {settings.currency}{Number(settings.monthlySavingsTarget).toLocaleString()}/mo</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

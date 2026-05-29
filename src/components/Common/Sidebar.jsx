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

const NAV_ITEMS = [
  { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
  { id: 'transactions', name: 'Txns', icon: ArrowRightLeft },
  { id: 'budgets', name: 'Budget', icon: Wallet },
  { id: 'goals', name: 'Goals', icon: Target },
  { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const Sidebar = ({ currentPage, setCurrentPage, settings, theme, toggleTheme }) => {
  const initials = settings.userName
    ? settings.userName.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : 'U';

  return (
    <aside className="sidebar sidebar-desktop" aria-label="Main navigation">
      <div>
        <div className="logo-container">
          <div className="logo-icon">
            <PiggyBank size={20} />
          </div>
          <span className="logo-text">FinCoach</span>
        </div>

        <nav>
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(item.id)}
                    className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                    title={item.name}
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
          type="button"
          onClick={toggleTheme}
          className="btn btn-secondary btn-block flex-between"
          title="Toggle theme"
        >
          <span className="theme-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} />}
        </button>

        <div className="user-profile">
          <div className="user-avatar">{initials}</div>
          <div className="user-profile-text">
            <div className="user-name">{settings.userName || 'Prajna Gaonkar'}</div>
            <div className="user-role">
              Target: {settings.currency}
              {Number(settings.monthlySavingsTarget).toLocaleString()}/mo
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

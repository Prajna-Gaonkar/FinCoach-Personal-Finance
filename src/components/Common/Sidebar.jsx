import React, { useState, useEffect } from 'react';
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
  PiggyBank,
  Menu,
  X
} from 'lucide-react';

const PRIMARY_NAV = [
  { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
  { id: 'transactions', name: 'Txns', icon: ArrowRightLeft },
  { id: 'budgets', name: 'Budget', icon: Wallet },
  { id: 'goals', name: 'Goals', icon: Target },
];

const MORE_NAV = [
  { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const Sidebar = ({ currentPage, setCurrentPage, settings, theme, toggleTheme }) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const navigate = (pageId) => {
    setCurrentPage(pageId);
    setMoreOpen(false);
  };

  const isMoreSectionActive = MORE_NAV.some((item) => item.id === currentPage);

  useEffect(() => {
    document.body.style.overflow = moreOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  const initials = settings.userName
    ? settings.userName.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : 'U';

  return (
    <>
      {/* Desktop & tablet sidebar */}
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
              {[...PRIMARY_NAV, ...MORE_NAV].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => navigate(item.id)}
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

      {/* Mobile top bar */}
      <header className="mobile-header">
        <div className="mobile-header-brand">
          <div className="logo-icon">
            <PiggyBank size={18} />
          </div>
          <span className="logo-text">FinCoach</span>
        </div>
        <div className="mobile-header-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMoreOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`mobile-nav-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={`mobile-nav-item ${isMoreSectionActive ? 'active' : ''}`}
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile more menu */}
      {moreOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMoreOpen(false)}
          role="presentation"
        >
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="More pages"
          >
            <div className="mobile-drawer-header">
              <h2>Menu</h2>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mobile-drawer-user">
              <div className="user-avatar">{initials}</div>
              <div>
                <div className="user-name">{settings.userName || 'Prajna Gaonkar'}</div>
                <div className="user-role">
                  Savings target: {settings.currency}
                  {Number(settings.monthlySavingsTarget).toLocaleString()}/mo
                </div>
              </div>
            </div>

            <ul className="mobile-drawer-links">
              {MORE_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => navigate(item.id)}
                      className={`mobile-drawer-link ${currentPage === item.id ? 'active' : ''}`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

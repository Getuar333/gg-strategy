import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBookOpen,
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiCpu,
  FiFolder,
  FiInfo,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiTarget,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiCheckSquare },
  { path: '/home', label: 'Notes', icon: FiBookOpen },
  { path: '/calendar', label: 'Calendar', icon: FiCalendar },
  { path: '/portfolio', label: 'Portfolio', icon: FiFolder },
  { path: '/settings', label: 'Settings', icon: FiSettings },
  { path: '/information', label: 'Information', icon: FiInfo },
  { path: '/clock-studio', label: 'Clock Studio', icon: FiClock },
  { path: '/ai-assistant', label: 'AI Assistant', icon: FiCpu },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="sidebar-menu-toggle fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 text-white shadow-lg backdrop-blur md:hidden"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <aside className={`sidebar-veil fixed inset-y-0 left-0 z-40 flex w-[288px] max-w-[calc(100vw-2rem)] flex-col transition-transform duration-300 md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="sidebar-brand relative overflow-hidden px-5 py-7">
          <Link to="/dashboard" className="relative flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="sidebar-mark flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15">
              <FiTarget className="hidden"/><span>🕋</span>
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-white/40">G.G Strategy</span>
              <span className="mt-1 block text-xs text-slate-400">Your menu is here</span>
            </span>
          </Link>
        </div>

        {user && (
          <div className="sidebar-user border-b border-white/10 px-5 py-4">
            <p className="text-sm font-semibold text-white">{user.fullName}</p>
            <p className="mt-1 truncate text-xs text-violet-200/65">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`sidebar-nav-link flex h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold transition-all duration-200 ${
                  active ? 'is-active text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer border-t border-white/10 p-4">
          <Button type="button" onClick={handleLogout} variant="outline" className="w-full">
            <FiLogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {isOpen && (
        <button type="button" className="fixed inset-0 z-30 bg-[#02030a]/75 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} aria-label="Close navigation overlay" />
      )}
    </>
  );
};

export default Sidebar;

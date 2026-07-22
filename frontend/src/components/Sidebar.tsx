import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiCheckSquare, FiFolder, FiLogOut, FiMenu, FiSettings, FiTarget, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiCheckSquare },
  { path: '/home', label: 'Notes', icon: FiBookOpen },
  { path: '/calendar', label: 'Calendar', icon: FiCalendar },
  { path: '/portfolio', label: 'Portfolio', icon: FiFolder },
  { path: '/settings', label: 'Settings', icon: FiSettings },
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
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/70 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur md:hidden"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <aside className={`sidebar-veil fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative overflow-hidden border-b border-white/10 px-6 py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,91,39,0.35),_transparent_75%),radial-gradient(circle_at_bottom_right,_rgba(0,212,255,0.25),_transparent_45%)]" />
          <Link to="/dashboard" className="relative flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="flex h-9 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 shadow-[0_10px_20px_rgba(239,68,68,0.25)]">
              <FiTarget className="hidden"/><span>🕋</span>
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-white/40">G.G Strategy</span>
              <span className="block text-xs text-slate-400">𝓖𝓮𝓽</span>
            </span>
          </Link>
        </div>

        {user && (
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-sm font-semibold text-white">{user.fullName}</p>
            <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-[#ff5e3a] to-[#0ea5e9] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)]'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-6">
          <Button type="button" onClick={handleLogout} variant="outline" className="w-full">
            <FiLogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {isOpen && (
        <button type="button" className="fixed inset-0 z-30 bg-black/70 md:hidden" onClick={() => setIsOpen(false)} aria-label="Close navigation overlay" />
      )}
    </>
  );
};

export default Sidebar;

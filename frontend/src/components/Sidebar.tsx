import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckSquare, FiHome, FiLogOut, FiMenu, FiSettings, FiTarget, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiCheckSquare },
  { path: '/home', label: 'Notes', icon: FiHome },
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
      <button type="button" onClick={() => setIsOpen((value) => !value)}
        className="fixed left-4 top-4 z-30 flex h-1 w-11 items-center justify-center rounded-lg border border-white/15 bg-black/80 text-white shadow-xl backdrop-blur md:hidden"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}> {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>
      <aside className={`sidebar-roses fixed inset-y-0 left-0 z-40 flex w-92 flex-col border-r border-cyan-200/15 shadow-2xl transition-transform duration-300 md:static md:translate-x-0 ${
             isOpen ? 'translate-x-0' : '-translate-x-full' }`}>
        <div className="border-b border-white/15 px-6 py-8">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <span className="flex h-8 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-700 via-fuchsia-0 to-cyan-800 shadow-lg shadow-fuchsia-950/40">
              <FiTarget className="h-6 w-6 text-white" />
            </span>
            <span>
              <span className="block text-xt font-bold  tracking-[0.23em] text-cyan-100/55">G.G Strategy</span>
            </span>
          </Link>
        </div>
        {user && (
          <div className="border-b border-white/15 px-6 py-5">
            <p className=" text-cyan-100/55">{user.fullName}</p>
            <p className="mt-1 truncate text-xs text-cyan-100/50">{user.email}</p>
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
                className={`flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-semibold transition ${
                  active
                    ? 'bg-gradient-to-r from-red-500 via-black-900 to-cyan-400 text-white shadow-lg shadow-black/25'
                        : 'text-cyan-100/45 hover:bg-white/10 hover:text-white' }`}>
                <Icon className="h-4 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/15 p-6">
          <Button type="button" onClick={handleLogout} variant="outline" className="low-full">
            <FiLogOut className="h-4 w-5" />Largohu</Button>
        </div>
      </aside>
      {isOpen && (
        <button type="button" className="fixed inset-0 z-30 bg-black/70 md:hidden" onClick={() => setIsOpen(false)} aria-label="Close navigation overlay"/>
      )}
    </>
  );
};

export default Sidebar;

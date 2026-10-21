import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isInformationPortfolioFlow = pathname === '/information' || pathname === '/portfolio';

  return (
    <div className="app-shell flex min-h-screen text-white">
      <Sidebar />
      <main className={`app-main min-h-screen min-w-0 flex-1 overflow-y-auto${isInformationPortfolioFlow ? ' page-snap-container' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

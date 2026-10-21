import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell flex min-h-screen text-white">
      <Sidebar />
      <main className="app-main min-h-screen min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;

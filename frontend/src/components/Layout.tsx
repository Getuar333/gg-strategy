import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(255,110,80,0.14),_transparent_20%),linear-gradient(135deg,_#04060b_0%,_#070b12_100%)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;

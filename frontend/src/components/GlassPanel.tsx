import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#06070b]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;

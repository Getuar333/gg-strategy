import React from 'react';

const Modal = ({ isOpen, onClose, title, size = "md", children }) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-1xl",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-2 transition-all">
      <div 
        className={`bg-slate-900 border border-slate-800 rounded-3xl w-full ${sizeClasses[size]} shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-200`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
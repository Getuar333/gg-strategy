import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    const variantStyles = {
      primary: `bg-gradient-to-br from-red-600 to-black
                hover:from-red-700 hover:to-slate-900
                text-white font-semibold shadow-xl shadow-red-950/50 hover:shadow-red-900/60
                active:from-red-800 active:to-black
                transition-all duration-200`,
      
      secondary: `bg-white/10 hover:bg-white/15 border border-white/20
                 text-white font-semibold shadow-md hover:shadow-lg
                 active:bg-white/20
                 transition-all duration-200`,
      
      danger: `bg-gradient-to-br from-rose-600 to-rose-900
              hover:from-rose-700 hover:to-slate-950
              text-white font-semibold shadow-lg shadow-rose-950/40
              active:from-rose-800 active:to-black
              transition-all duration-200`,
      
      outline: `border-2 border-red-500/70 text-red-100 hover:bg-red-500/10 hover:border-red-400
               active:bg-red-500/20
               font-semibold transition-all duration-200`,
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          rounded-lg font-medium min-h-10
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

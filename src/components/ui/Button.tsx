import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-200',
      secondary: 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200',
      warning: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-100',
      ghost: 'bg-transparent hover:bg-stone-100 text-stone-600',
      outline: 'bg-transparent border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-xl',
      md: 'px-6 py-2.5 text-sm rounded-2xl',
      lg: 'px-8 py-4 text-base rounded-[2rem]',
      xl: 'px-10 py-6 text-xl rounded-[2.5rem]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

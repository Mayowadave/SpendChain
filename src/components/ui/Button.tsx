import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gradient' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl cursor-pointer';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2 min-h-[40px]',
    lg: 'px-5 py-2.5 sm:py-3 text-sm gap-2.5 min-h-[48px]',
  };

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 active:scale-[0.98]',
    gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]',
    secondary: 'bg-slate-800/90 hover:bg-slate-700/90 text-white border border-white/10 active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-white/5 text-gray-200 hover:text-white border border-white/15 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white active:scale-[0.98]',
    danger: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 active:scale-[0.98]',
    amber: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};


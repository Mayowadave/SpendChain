import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'teal' | 'rose' | 'indigo' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    teal: 'bg-teal-500/10 text-teal-300 border border-teal-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    slate: 'bg-slate-800 text-gray-300 border border-white/10',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  };

  const dotColors = {
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-400 animate-pulse',
    amber: 'bg-amber-400',
    teal: 'bg-teal-300',
    rose: 'bg-rose-400',
    indigo: 'bg-indigo-400',
    slate: 'bg-gray-400',
    purple: 'bg-purple-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg font-mono leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

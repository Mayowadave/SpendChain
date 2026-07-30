import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'panel' | 'solid' | 'gradient';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    glass: 'glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl shadow-lg shadow-black/20',
    panel: 'glass-panel p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0A0F1D]/90 backdrop-blur-2xl shadow-xl shadow-black/30',
    solid: 'p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/90 shadow-md',
    gradient: 'p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/90 shadow-xl',
  };

  const hoverStyles = hoverEffect 
    ? 'hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-250 ease-out' 
    : 'transition-all duration-200';

  return (
    <div className={`${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};


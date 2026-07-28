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
    glass: 'glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0B1220]/70 backdrop-blur-xl',
    panel: 'glass-panel p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0B1220]/90 backdrop-blur-2xl shadow-xl',
    solid: 'p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900',
    gradient: 'p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900',
  };

  const hoverStyles = hoverEffect ? 'hover:border-blue-500/30 hover:scale-[1.01] transition-all duration-200' : '';

  return (
    <div className={`${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

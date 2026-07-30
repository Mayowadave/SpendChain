import React from 'react';
import { Card } from './Card';
import { StatCardSkeleton } from './Skeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: React.ReactNode;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    type: 'up' | 'down' | 'neutral';
    text: string;
  };
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  iconBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  trend,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <Card 
      variant="glass" 
      hoverEffect
      className={`space-y-3 relative group overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-semibold tracking-tight text-gray-300">{title}</span>
        <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 duration-200 ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight leading-none">
        {value}
      </div>

      <div className="flex items-center space-x-2 text-xs pt-0.5">
        {trend && (
          <span className={`font-semibold font-mono ${
            trend.type === 'up' ? 'text-emerald-400' : trend.type === 'down' ? 'text-rose-400' : 'text-gray-400'
          }`}>
            {trend.type === 'up' ? '↑ ' : trend.type === 'down' ? '↓ ' : ''}{trend.text}
          </span>
        )}
        {subtext && <span className="text-gray-400 truncate font-medium">{subtext}</span>}
      </div>
    </Card>
  );
};


import React from 'react';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

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
  iconBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  trend,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <Card variant="glass" className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-3 w-24" />
      </Card>
    );
  }

  return (
    <Card variant="glass" className={`space-y-2 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-medium">{title}</span>
        <div className={`p-2 rounded-xl border ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
        {value}
      </div>

      <div className="flex items-center space-x-1.5 text-xs">
        {trend && (
          <span className={`font-semibold ${
            trend.type === 'up' ? 'text-emerald-400' : trend.type === 'down' ? 'text-rose-400' : 'text-gray-400'
          }`}>
            {trend.text}
          </span>
        )}
        {subtext && <span className="text-gray-400">{subtext}</span>}
      </div>
    </Card>
  );
};

import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Layers className="w-8 h-8 text-indigo-400" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`py-12 px-6 rounded-3xl glass-panel border border-white/10 bg-[#0A0F1D]/80 text-center flex flex-col items-center justify-center space-y-4 shadow-xl ${className}`}>
      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-amber-500/20 blur-sm" />
        <div className="relative p-4 rounded-2xl bg-slate-900 border border-white/10 text-indigo-400 shadow-lg">
          {icon}
        </div>
      </div>

      <div className="max-w-md space-y-1.5">
        <h4 className="text-base font-extrabold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="gradient" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};


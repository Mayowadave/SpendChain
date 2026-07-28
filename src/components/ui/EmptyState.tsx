import React from 'react';
import { FolderOpen } from 'lucide-react';
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
  icon = <FolderOpen className="w-8 h-8 text-blue-400" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-10 rounded-3xl glass-panel border border-white/10 bg-[#0B1220]/60 text-center flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        {icon}
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-bold text-white">{title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="gradient" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

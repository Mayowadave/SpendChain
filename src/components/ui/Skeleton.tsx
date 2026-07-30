import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-shimmer rounded-xl bg-slate-800/60 border border-white/5 ${className}`}
      {...props}
    />
  );
};

export const StatCardSkeleton: React.FC = () => (
  <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-8 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-36" />
    <div className="flex items-center space-x-2 pt-1">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = "h-72" }) => (
  <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
    <div className={`${height} w-full flex items-end gap-3 pt-6`}>
      {[40, 65, 30, 85, 50, 70, 90, 60, 45, 80].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end h-full">
          <Skeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden space-y-2 p-4">
    <div className="flex items-center justify-between pb-3 border-b border-white/5">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-8 w-28 rounded-xl" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 px-2 border-b border-white/5 gap-4">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
    ))}
  </div>
);

export const ViewSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in p-2">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-96" />
      </div>
      <Skeleton className="h-10 w-36 rounded-2xl" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    <ChartSkeleton height="h-64" />
    <TableSkeleton rows={4} />
  </div>
);


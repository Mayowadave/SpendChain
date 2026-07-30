import React, { useState } from 'react';
import { EcosystemChartDataPoint } from '../../types';
import { BarChart3, LineChart as LineChartIcon, Activity, Users, DollarSign, Code, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  chartData: EcosystemChartDataPoint[];
}

type ChartMetric = 'transactions' | 'activeWallets' | 'tvlUsd' | 'protocolVolumeUsd' | 'contractsDeployed' | 'nftVolumeUsd';

export const EcosystemChartsSection: React.FC<Props> = ({ chartData }) => {
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('tvlUsd');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y' | 'ALL'>('30D');

  const metricsConfig: Record<ChartMetric, { label: string; icon: any; color: string; fillGrad: string; formatter: (val: number) => string }> = {
    tvlUsd: {
      label: 'Ecosystem TVL Growth',
      icon: DollarSign,
      color: '#6366f1',
      fillGrad: 'from-indigo-600/40 to-transparent',
      formatter: (v) => `$${(v / 1000000).toFixed(1)}M`
    },
    transactions: {
      label: 'Daily Network Transactions',
      icon: Activity,
      color: '#10b981',
      fillGrad: 'from-emerald-600/40 to-transparent',
      formatter: (v) => v.toLocaleString()
    },
    activeWallets: {
      label: 'Active Stacks Wallets',
      icon: Users,
      color: '#06b6d4',
      fillGrad: 'from-cyan-600/40 to-transparent',
      formatter: (v) => v.toLocaleString()
    },
    protocolVolumeUsd: {
      label: 'DEX & Lending Volume',
      icon: BarChart3,
      color: '#f59e0b',
      fillGrad: 'from-amber-600/40 to-transparent',
      formatter: (v) => `$${(v / 1000000).toFixed(1)}M`
    },
    contractsDeployed: {
      label: 'Clarity Smart Contracts Deployed',
      icon: Code,
      color: '#ec4899',
      fillGrad: 'from-pink-600/40 to-transparent',
      formatter: (v) => `${v} contracts`
    },
    nftVolumeUsd: {
      label: 'NFT & Ordinals Secondary Volume',
      icon: ImageIcon,
      color: '#a855f7',
      fillGrad: 'from-purple-600/40 to-transparent',
      formatter: (v) => `$${(v / 1000).toFixed(0)}k`
    }
  };

  const currentConfig = metricsConfig[selectedMetric];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
      
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Interactive Stacks Ecosystem Charts</h2>
            <p className="text-xs text-gray-400">Time-series analytics for network TVL, user wallets, contract deploys, and trading volume</p>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs font-mono font-bold">
          {(['7D', '30D', '90D', '1Y', 'ALL'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeframe === tf ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {(Object.keys(metricsConfig) as ChartMetric[]).map(metricKey => {
          const cfg = metricsConfig[metricKey];
          const Icon = cfg.icon;
          const isSelected = selectedMetric === metricKey;
          return (
            <button
              key={metricKey}
              onClick={() => setSelectedMetric(metricKey)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-slate-950 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/50 text-gray-400 hover:text-white border-white/5 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: cfg.color }} />
                <span className="text-xs font-bold truncate">{cfg.label.split(' ')[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas Display */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono px-2">
          <span className="text-white font-bold flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentConfig.color }} />
            <span>{currentConfig.label}</span>
          </span>
          <span className="text-gray-400">Timeframe: {timeframe}</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="selectedMetricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => currentConfig.formatter(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val: any) => [currentConfig.formatter(val), currentConfig.label]}
              />
              <Area type="monotone" dataKey={selectedMetric} stroke={currentConfig.color} strokeWidth={3} fillOpacity={1} fill="url(#selectedMetricGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

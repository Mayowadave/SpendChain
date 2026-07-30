import React from 'react';
import { EcosystemHealthData } from '../../types';
import { HeartPulse, Sparkles, TrendingUp, Users, Code2, ShieldAlert, BarChart2 } from 'lucide-react';

interface Props {
  data: EcosystemHealthData;
  onTriggerAiCopilot: (prompt: string) => void;
}

export const EcosystemHealthSection: React.FC<Props> = ({ data, onTriggerAiCopilot }) => {
  const healthSubscores = [
    { label: 'Network Activity', score: data.networkActivityScore, icon: TrendingUp, color: 'from-emerald-500 to-teal-400' },
    { label: 'Developer Activity', score: data.developerActivityScore, icon: Code2, color: 'from-indigo-500 to-purple-400' },
    { label: 'Protocol Growth', score: data.protocolGrowthScore, icon: BarChart2, color: 'from-amber-500 to-orange-400' },
    { label: 'Wallet Growth', score: data.walletGrowthScore, icon: Users, color: 'from-cyan-500 to-blue-400' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Ecosystem Health Dashboard</h2>
            <p className="text-xs text-gray-400">On-chain health telemetry, developer metrics, and AI health assessment</p>
          </div>
        </div>

        <button
          onClick={() => onTriggerAiCopilot("Analyze current Stacks ecosystem health and growth drivers")}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask AI Health Diagnosis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Main Overall Health Radial Score */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-3 relative overflow-hidden">
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Overall Ecosystem Index</div>
          
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {/* SVG Ring Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={326}
                strokeDashoffset={326 - (326 * data.overallHealthScore) / 100}
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white font-mono tracking-tighter">{data.overallHealthScore}</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Strong Expansion</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="text-gray-400 block text-[10px]">Active Users 24h</span>
              <span className="text-white font-bold">{data.activeUsersCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Tx Growth MoM</span>
              <span className="text-emerald-400 font-bold">+{data.txGrowthPercent}%</span>
            </div>
          </div>
        </div>

        {/* Subscore Progress Bars */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {healthSubscores.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-300 flex items-center space-x-1.5">
                      <Icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono font-bold text-white">{item.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Explanation Callout Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 border border-indigo-500/30 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold font-mono">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>AI Ecosystem Diagnosis</span>
            </div>
            <p className="text-gray-300 font-sans">
              {data.aiExplanation}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

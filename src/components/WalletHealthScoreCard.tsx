import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  PieChart, 
  Zap, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Info,
  RotateCw
} from 'lucide-react';
import { WalletAnalytics } from '../services/analyticsEngine';
import { Wallet } from '../types';
import { Badge, Button, Card } from './ui';

interface WalletHealthScoreCardProps {
  analytics: WalletAnalytics;
  wallets: Wallet[];
  onTriggerAi: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export interface ComponentScore {
  name: string;
  key: 'security' | 'activity' | 'diversification' | 'defi' | 'fees' | 'age';
  score: number;
  weight: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  suggestion?: string;
}

export function calculateHealthBreakdown(analytics: WalletAnalytics, wallets: Wallet[]) {
  // 1. Security Score (0-100)
  const totalApprovals = wallets.reduce((acc, w) => acc + (w.unspentApprovalsCount || 0), 0);
  let securityScore = 100;
  let securitySuggestion = 'No open Clarity authorizations detected. Maintain standard post-conditions.';
  if (totalApprovals > 0) {
    securityScore = Math.max(30, 100 - totalApprovals * 25);
    securitySuggestion = `Revoke ${totalApprovals} open Clarity contract authorizations to gain up to +${totalApprovals * 25} pts.`;
  }

  // 2. Activity Score (0-100)
  const txCount = analytics.txCount || 0;
  let activityScore = 50;
  let activitySuggestion = 'Execute regular transactions or automated PoX stacking cycles to boost score.';
  if (txCount >= 40) {
    activityScore = 98;
    activitySuggestion = 'Outstanding transaction activity across Stacks L2 & Bitcoin networks.';
  } else if (txCount >= 20) {
    activityScore = 85;
    activitySuggestion = 'Good activity volume. Maintain weekly Clarity interaction frequency.';
  } else if (txCount >= 5) {
    activityScore = 70;
  } else {
    activityScore = 45;
    activitySuggestion = 'Low 30-day activity. Perform swaps or sBTC transfers to increase score (+20 pts).';
  }

  // 3. Diversification Score (0-100)
  let holdingsCount = 0;
  const hasStx = wallets.some(w => w.balanceStx > 0);
  const hasSbtc = wallets.some(w => w.balanceSbtc > 0);
  const hasStacking = wallets.some(w => w.stackingInfo?.isStacking);
  const hasTokens = wallets.some(w => w.sip010Tokens && w.sip010Tokens.length > 0);
  
  if (hasStx) holdingsCount++;
  if (hasSbtc) holdingsCount++;
  if (hasStacking) holdingsCount++;
  if (hasTokens) holdingsCount++;

  let diversificationScore = Math.min(100, holdingsCount * 25 + 10);
  let diversificationSuggestion = 'Optimal asset distribution across STX, sBTC, SIP-010, & PoX yield.';
  if (!hasSbtc) {
    diversificationSuggestion = 'Bridge Bitcoin to sBTC liquid L2 reserves to gain +15 pts.';
  } else if (!hasStacking) {
    diversificationSuggestion = 'Lock STX in PoX-4 stacking yield to improve diversification (+15 pts).';
  }

  // 4. DeFi Usage Score (0-100)
  const topProtocol = analytics.mostInteractedProtocol?.protocolName;
  let defiScore = 60;
  let defiSuggestion = 'Interact with ALEX, Velar, or Zest yield vaults to increase DeFi score.';
  if (topProtocol && topProtocol !== 'None') {
    defiScore = 92;
    defiSuggestion = `Active DeFi user on ${topProtocol}. Explore liquid stacking pools for higher yield.`;
  }

  // 5. Fee Efficiency Score (0-100)
  const avgGasStx = analytics.txCount > 0 ? analytics.gasFeesPaidStx / analytics.txCount : 0.05;
  let feeScore = 90;
  let feeSuggestion = 'Excellent gas efficiency using Stacks Nakamoto fast-block execution.';
  if (avgGasStx > 0.1) {
    feeScore = 72;
    feeSuggestion = 'Use Nakamoto micro-fee batching on complex Clarity smart contracts (+10 pts).';
  }

  // 6. Wallet Age Score (0-100)
  const ageDays = analytics.walletAgeDays || 180;
  let ageScore = Math.min(100, Math.max(40, Math.floor((ageDays / 365) * 100)));
  let ageSuggestion = 'Established wallet provenance on the Stacks blockchain.';
  if (ageDays < 90) {
    ageSuggestion = `Wallet age is ${ageDays} days. Continuous active tenure will increase score over time.`;
  }

  // Weighted sum
  const components: ComponentScore[] = [
    {
      name: 'Security',
      key: 'security',
      score: securityScore,
      weight: 0.25,
      description: totalApprovals > 0 ? `${totalApprovals} open authorizations` : 'Zero risk flags detected',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      color: securityScore >= 80 ? '#10B981' : securityScore >= 60 ? '#F59E0B' : '#F43F5E',
      suggestion: securitySuggestion,
    },
    {
      name: 'Activity',
      key: 'activity',
      score: activityScore,
      weight: 0.15,
      description: `${txCount} transactions in 30D`,
      icon: <Activity className="w-4 h-4 text-indigo-400" />,
      color: activityScore >= 80 ? '#6366F1' : '#F59E0B',
      suggestion: activitySuggestion,
    },
    {
      name: 'Diversification',
      key: 'diversification',
      score: diversificationScore,
      weight: 0.15,
      description: `${holdingsCount} asset classes active`,
      icon: <PieChart className="w-4 h-4 text-amber-400" />,
      color: diversificationScore >= 80 ? '#F59E0B' : '#6366F1',
      suggestion: diversificationSuggestion,
    },
    {
      name: 'DeFi Usage',
      key: 'defi',
      score: defiScore,
      weight: 0.15,
      description: topProtocol !== 'None' ? `Active on ${topProtocol}` : 'No active DEX calls',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      color: defiScore >= 80 ? '#8B5CF6' : '#64748B',
      suggestion: defiSuggestion,
    },
    {
      name: 'Fee Efficiency',
      key: 'fees',
      score: feeScore,
      weight: 0.15,
      description: `${avgGasStx.toFixed(3)} STX avg gas`,
      icon: <Flame className="w-4 h-4 text-teal-400" />,
      color: '#14B8A6',
      suggestion: feeSuggestion,
    },
    {
      name: 'Wallet Age',
      key: 'age',
      score: ageScore,
      weight: 0.15,
      description: `${ageDays} days active tenure`,
      icon: <Clock className="w-4 h-4 text-blue-400" />,
      color: '#3B82F6',
      suggestion: ageSuggestion,
    },
  ];

  const overallScore = Math.round(
    components.reduce((acc, c) => acc + c.score * c.weight, 0)
  );

  let letterGrade = 'A';
  let gradeColor = 'text-emerald-400';
  let gradeBg = 'bg-emerald-500/10 border-emerald-500/30';

  if (overallScore >= 95) {
    letterGrade = 'A+';
    gradeColor = 'text-emerald-300';
    gradeBg = 'bg-emerald-500/20 border-emerald-500/40';
  } else if (overallScore >= 88) {
    letterGrade = 'A';
    gradeColor = 'text-emerald-400';
    gradeBg = 'bg-emerald-500/10 border-emerald-500/30';
  } else if (overallScore >= 80) {
    letterGrade = 'B+';
    gradeColor = 'text-indigo-300';
    gradeBg = 'bg-indigo-500/10 border-indigo-500/30';
  } else if (overallScore >= 72) {
    letterGrade = 'B';
    gradeColor = 'text-indigo-400';
    gradeBg = 'bg-indigo-500/10 border-indigo-500/30';
  } else if (overallScore >= 60) {
    letterGrade = 'C';
    gradeColor = 'text-amber-400';
    gradeBg = 'bg-amber-500/10 border-amber-500/30';
  } else {
    letterGrade = 'D';
    gradeColor = 'text-rose-400';
    gradeBg = 'bg-rose-500/10 border-rose-500/30';
  }

  return {
    overallScore,
    letterGrade,
    gradeColor,
    gradeBg,
    components,
    totalApprovals,
  };
}

export const WalletHealthScoreCard: React.FC<WalletHealthScoreCardProps> = ({
  analytics,
  wallets,
  onTriggerAi,
  onNavigateTab,
}) => {
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(false);
  const healthData = calculateHealthBreakdown(analytics, wallets);
  const { overallScore, letterGrade, gradeColor, gradeBg, components, totalApprovals } = healthData;

  // SVG progress ring values
  const radius = 54;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Generate dynamic AI Explanation
  const aiExplanation = `Your Stacks wallet achieves an overall score of ${overallScore}/100 (Grade ${letterGrade}). This reflects ${
    totalApprovals === 0
      ? 'flawless Clarity security post-conditions with zero unrevoked permissions'
      : `${totalApprovals} open Clarity smart contract authorization${totalApprovals > 1 ? 's' : ''}`
  }, combined with ${analytics.txCount} transactions over the last 30 days and active engagement on ${
    analytics.mostInteractedProtocol?.protocolName || 'Stacks L2 DeFi'
  }.`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 glass-panel bg-[#0A0F1D]/90 p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Background Accent Gradients */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Stacks Wallet Intelligence</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Wallet Health Score System
          </h3>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Dynamic 6-factor algorithmic audit of security, activity, DeFi, and fee efficiency
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
            rightIcon={showBreakdownDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          >
            {showBreakdownDetails ? 'Compact View' : 'Full Component Analysis'}
          </Button>

          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            onClick={() => onTriggerAi(`Explain my Wallet Health Score (${overallScore}/100, Grade ${letterGrade}) in detail and outline a step-by-step plan to reach 100/100.`)}
          >
            AI Score Plan
          </Button>
        </div>
      </div>

      {/* Core Health Overview: Ring Gauge + Grades + AI Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Ring Gauge & Grade Badge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
          <div className="relative flex items-center justify-center">
            
            {/* SVG Progress Ring */}
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                stroke="rgba(255, 255, 255, 0.08)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress circle */}
              <circle
                stroke="url(#healthGradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={overallScore >= 80 ? '#10B981' : overallScore >= 60 ? '#F59E0B' : '#F43F5E'} />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black font-mono text-white tracking-tight leading-none">
                {overallScore}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Out of 100
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <div className={`px-3 py-1 rounded-xl border ${gradeBg} flex items-center space-x-1.5`}>
              <span className="text-xs text-gray-300 font-medium">Grade:</span>
              <span className={`text-base font-black font-mono ${gradeColor}`}>{letterGrade}</span>
            </div>

            <Badge variant={overallScore >= 80 ? 'emerald' : overallScore >= 60 ? 'amber' : 'rose'}>
              {overallScore >= 80 ? 'Healthy L2 Status' : overallScore >= 60 ? 'Moderate Health' : 'Action Required'}
            </Badge>
          </div>
        </div>

        {/* AI Explanation & Key Observations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Health Explanation</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Dynamic Stacks Audit</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
              {aiExplanation}
            </p>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
              <span className="text-gray-400 text-[10px] uppercase font-mono block">Security Approvals</span>
              <span className={`font-mono font-bold ${totalApprovals > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {totalApprovals === 0 ? '0 Open Flags' : `${totalApprovals} Revocations Needed`}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
              <span className="text-gray-400 text-[10px] uppercase font-mono block">30D Transactions</span>
              <span className="font-mono font-bold text-indigo-300">
                {analytics.txCount} Executions
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs col-span-2 sm:col-span-1">
              <span className="text-gray-400 text-[10px] uppercase font-mono block">Fee Overhead</span>
              <span className="font-mono font-bold text-teal-300">
                {(analytics.gasFeesPaidStx || 0).toFixed(2)} STX Total
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 6 Component Breakdown Bars */}
      <div className="space-y-3 relative z-10 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-300 uppercase tracking-wider font-mono">
            6 Score Components
          </span>
          <span className="text-gray-400 text-[11px]">
            Weighted Total = {overallScore} / 100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {components.map((c) => (
            <div 
              key={c.key} 
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                    {c.icon}
                  </div>
                  <span className="font-bold text-white">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-sm" style={{ color: c.color }}>
                  {c.score}/100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.score}%`, backgroundColor: c.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 font-sans">
                <span className="truncate">{c.description}</span>
                <span className="font-mono text-[10px] text-gray-500">{(c.weight * 100).toFixed(0)}% weight</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions for Improving the Score */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recommended Actions to Improve Health Score</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Algorithmic Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {components
            .filter((c) => c.score < 95)
            .map((c) => (
              <div 
                key={c.key} 
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    {c.icon}
                    <span>{c.name} Optimization</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed font-sans">
                    {c.suggestion}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-[11px] py-1 px-2.5 h-auto"
                  onClick={() => {
                    if (c.key === 'security') onNavigateTab('wallets');
                    else if (c.key === 'defi' || c.key === 'activity') onNavigateTab('transactions');
                    else onTriggerAi(`How can I specifically improve my ${c.name} score from ${c.score}/100?`);
                  }}
                >
                  Action <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Button>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

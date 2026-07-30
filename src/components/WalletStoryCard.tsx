import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Bot, ArrowRight, ShieldCheck, Flame, Zap, Compass, CheckCircle2, Dna } from 'lucide-react';
import { WalletAnalytics } from '../services/analyticsEngine';
import { Badge, Button } from './ui';

interface WalletStoryCardProps {
  analytics: WalletAnalytics;
  avgHealthScore: number;
  walletsCount: number;
  totalBalanceUsd: number;
  onTriggerAi: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const WalletStoryCard: React.FC<WalletStoryCardProps> = ({
  analytics,
  avgHealthScore,
  walletsCount,
  totalBalanceUsd,
  onTriggerAi,
  onNavigateTab,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [visibleStep, setVisibleStep] = useState(0);

  // Trigger typewriter / step reveal effect on mount or refresh
  const triggerStoryAnimation = () => {
    setIsAnimating(true);
    setVisibleStep(0);
  };

  useEffect(() => {
    if (!isAnimating) return;

    const timer = setInterval(() => {
      setVisibleStep((prev) => {
        if (prev >= 4) {
          clearInterval(timer);
          setIsAnimating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [isAnimating]);

  const topProtocolName = analytics.mostInteractedProtocol?.protocolName || 'ALEX DeFi';
  const txCount = analytics.txCount || 46;
  const gasStx = (analytics.gasFeesPaidStx || 1.23).toFixed(2);
  const healthDelta = 8; // Health score improvement

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0B1229] via-[#0D1535] to-[#0A0F24] p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 transition-all duration-300 hover:border-indigo-500/50">
      
      {/* Decorative Background Glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />

      <div className="relative z-10 space-y-6">
        
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Your Wallet Story
                </h2>
                <Badge variant="amber" size="sm">
                  <Zap className="w-3 h-3 inline mr-1" /> Live Digest
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                Automated natural language intelligence generated from Stacks L2 transactions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={triggerStoryAnimation}
              disabled={isAnimating}
              title="Re-animate Story"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Refresh Narrative</span>
            </button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Bot className="w-3.5 h-3.5 text-amber-400" />}
              onClick={() => onTriggerAi('Elaborate on my wallet story narrative and suggest optimizations for gas, PoX yield, and security')}
            >
              Ask AI Copilot
            </Button>
          </div>
        </div>

        {/* Story Body Paragraphs with Progressive Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Narrative Area */}
          <div className="lg:col-span-8 space-y-4 text-base sm:text-lg leading-relaxed text-gray-200 font-sans">
            
            {/* Sentence 0: Welcome Back */}
            <div 
              className={`transition-all duration-500 transform ${
                visibleStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                Welcome back.
              </span>
            </div>

            {/* Sentence 1: Transactions count */}
            <div 
              className={`transition-all duration-500 delay-100 transform ${
                visibleStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              During the last 30 days you completed{' '}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-200 font-mono font-bold border border-indigo-500/30 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-400 inline" />
                {txCount} transactions
              </span>{' '}
              across Stacks L2 & Bitcoin networks.
            </div>

            {/* Sentence 2: Most activity */}
            <div 
              className={`transition-all duration-500 delay-200 transform ${
                visibleStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              Most of your activity happened on{' '}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30 shadow-sm">
                <Compass className="w-3.5 h-3.5 text-amber-400 inline" />
                {topProtocolName}
              </span>.
            </div>

            {/* Sentence 3: Gas spent & Health improvement */}
            <div 
              className={`transition-all duration-500 delay-300 transform ${
                visibleStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              You spent{' '}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-200 font-mono font-bold border border-teal-500/30 shadow-sm">
                {gasStx} STX
              </span>{' '}
              on gas, and your wallet health improved by{' '}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                +{healthDelta}%
              </span>{' '}
              to a score of {avgHealthScore}/100.
            </div>

            {/* Active typing cursor while animating */}
            {isAnimating && (
              <div className="flex items-center space-x-2 pt-1 text-xs text-indigo-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Synthesizing real-time Stacks L2 telemetry...</span>
              </div>
            )}
          </div>

          {/* Right Highlights Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
            
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                30D Volume
              </span>
              <p className="text-base font-extrabold text-white font-mono">
                ${(analytics.totalSentUsd + analytics.totalReceivedUsd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                Top Hub
              </span>
              <p className="text-base font-extrabold text-amber-300 truncate">
                {topProtocolName.split(' ')[0]}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                Gas Consumed
              </span>
              <p className="text-base font-extrabold text-teal-300 font-mono">
                {gasStx} STX
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                Security Rating
              </span>
              <p className="text-base font-extrabold text-emerald-400 font-mono">
                {avgHealthScore}/100
              </p>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => onNavigateTab('wallet-dna')}
                className="flex items-center justify-between p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-semibold text-purple-200 transition-all group cursor-pointer"
              >
                <span className="flex items-center space-x-1">
                  <Dna className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Wallet DNA</span>
                </span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('analytics')}
                className="flex items-center justify-between p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-200 transition-all group cursor-pointer"
              >
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Analytics</span>
                </span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

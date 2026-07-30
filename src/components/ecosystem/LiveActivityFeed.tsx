import React, { useState } from 'react';
import { LiveEcosystemEvent } from '../../types';
import { Radio, Filter, ArrowUpRight, ShieldCheck, Flame, Coins, Code, Image as ImageIcon, Wallet, Zap } from 'lucide-react';

interface Props {
  events: LiveEcosystemEvent[];
}

export const LiveActivityFeed: React.FC<Props> = ({ events }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'DeFi & DEX', 'Liquid Staking', 'Contracts', 'NFT & Gaming', 'Whale Activity', 'SIP-010 Tokens'];

  const filteredEvents = filterCategory === 'All'
    ? events
    : events.filter(e => e.category === filterCategory);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">Live Ecosystem Event Feed</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-gray-400">Real-time stream of whale transfers, contract deploys, swaps, and NFT mints</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Event Items List */}
      <div className="space-y-3">
        {filteredEvents.map(evt => (
          <div
            key={evt.id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-center space-x-3.5">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${evt.iconBg} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                <Zap className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors">{evt.title}</span>
                  <span className="px-2 py-0.2 rounded-md bg-slate-900 border border-white/10 text-[10px] font-mono text-indigo-300">
                    {evt.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-sans">{evt.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 font-mono text-xs shrink-0">
              {evt.valueUsd && (
                <span className="font-black text-emerald-400">
                  ${evt.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              )}
              <span className="text-gray-500 text-[11px]">{evt.timestamp}</span>
              {evt.txHash && (
                <a
                  href={`https://explorer.hiro.so/txid/${evt.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-900 text-gray-400 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center"
                  title="View Transaction on Hiro Explorer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

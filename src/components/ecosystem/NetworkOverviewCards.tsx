import React from 'react';
import { StacksNetworkStats } from '../../types';
import { DollarSign, Activity, Blocks, Clock, Cpu, Bitcoin, ShieldCheck, Layers } from 'lucide-react';

interface Props {
  stats: StacksNetworkStats;
}

export const NetworkOverviewCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    {
      title: 'STX Price',
      value: `$${stats.stxPriceUsd < 1 ? stats.stxPriceUsd.toFixed(3) : stats.stxPriceUsd.toFixed(2)}`,
      change: `${stats.priceChange24h >= 0 ? '+' : ''}${stats.priceChange24h.toFixed(2)}%`,
      isPositive: stats.priceChange24h >= 0,
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      subtext: `MCap: $${(stats.marketCapUsd / 1000000000).toFixed(2)}B`
    },
    {
      title: 'Daily Network Tx',
      value: stats.totalTxToday.toLocaleString(),
      change: '+18.4% 24h',
      isPositive: true,
      icon: Activity,
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      subtext: `${stats.blocksToday} Blocks Minted Today`
    },
    {
      title: 'Block Height',
      value: `#${stats.currentBlockHeight.toLocaleString()}`,
      subtext: `Avg Time: ${stats.avgBlockTimeSeconds}s`,
      icon: Blocks,
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      isLive: true
    },
    {
      title: 'Consensus Epoch',
      value: 'Nakamoto 3.0',
      subtext: `Status: ${stats.networkStatus}`,
      icon: ShieldCheck,
      iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      badge: 'Fast Blocks'
    },
    {
      title: 'Bitcoin Anchor Height',
      value: `#${stats.bitcoinBlockHeight.toLocaleString()}`,
      subtext: `Mempool: ${stats.mempoolSize} txs`,
      icon: Bitcoin,
      iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      badge: 'L1 Finality'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider font-mono flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Real-time Stacks Network Vitals</span>
        </h2>
        <span className="text-[11px] font-mono text-gray-400 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Mainnet Telemetry</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight flex items-baseline justify-between">
                  <span>{card.value}</span>
                  {card.change && (
                    <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${card.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'}`}>
                      {card.change}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-1">
                  <span>{card.subtext}</span>
                  {card.badge && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sip10EcosystemToken } from '../../types';
import { Coins, ShieldCheck, AlertCircle, ExternalLink, Search, Users, DollarSign } from 'lucide-react';

interface Props {
  tokens: Sip10EcosystemToken[];
}

export const Sip10TokensSection: React.FC<Props> = ({ tokens }) => {
  const [query, setQuery] = useState('');

  const filtered = tokens.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.symbol.toLowerCase().includes(query.toLowerCase()) ||
    t.creatorAddress.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">SIP-010 Fungible Tokens Directory</h2>
            <p className="text-xs text-gray-400">Tracked fungible tokens across Stacks liquid staking, governance, and stablecoins</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tokens..."
            className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 font-sans"
          />
        </div>
      </div>

      {/* Grid of Tokens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(token => (
          <div
            key={token.id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-amber-500/30 transition-all space-y-3 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${token.logoBg} flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform`}>
                  {token.symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center space-x-1.5">
                    <span>{token.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">{token.symbol} • {token.decimals} decimals</div>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                token.riskBadge === 'Verified' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                token.riskBadge === 'Community' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                {token.riskBadge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[10px]">Price</span>
                <span className="text-white font-bold">${token.priceUsd < 0.01 ? token.priceUsd.toFixed(4) : token.priceUsd.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Holders</span>
                <span className="text-amber-300 font-bold">{token.holdersCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 font-mono truncate pt-1 flex items-center justify-between">
              <span>Creator: {token.creatorAddress.slice(0, 10)}...</span>
              <a
                href={`https://explorer.hiro.so/address/${token.creatorAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline flex items-center"
              >
                <span>Explorer</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

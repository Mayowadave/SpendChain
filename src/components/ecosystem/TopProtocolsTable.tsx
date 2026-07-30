import React, { useState } from 'react';
import { ProtocolDetail, ProtocolCategory, ProtocolRiskLevel } from '../../types';
import { Layers, ArrowUpDown, ExternalLink, ShieldCheck, AlertTriangle, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  protocols: ProtocolDetail[];
  selectedCategory: string;
  selectedRisk: string;
  onSelectProtocol: (protocol: ProtocolDetail) => void;
}

type SortField = 'tvlUsd' | 'volume24hUsd' | 'weeklyGrowthPercent' | 'activeUsers24h' | 'totalTransactions24h';

export const TopProtocolsTable: React.FC<Props> = ({
  protocols,
  selectedCategory,
  selectedRisk,
  onSelectProtocol,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('tvlUsd');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter Protocols
  const filteredProtocols = protocols.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesRisk = selectedRisk === 'All Risks' || p.riskLevel === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  // Sort Protocols
  const sortedProtocols = [...filteredProtocols].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
      
      {/* Table Header & Local Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Top Stacks Ecosystem Protocols</h2>
            <p className="text-xs text-gray-400">DeFi venues, liquid staking, lending markets, and NFT infrastructure</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search protocols..."
            className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 font-sans"
          />
        </div>
      </div>

      {/* Protocols Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-[11px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/10">
              <th className="py-3.5 px-4 font-bold">Protocol</th>
              <th className="py-3.5 px-4 font-bold">Category</th>
              <th 
                className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('tvlUsd')}
              >
                <div className="flex items-center space-x-1">
                  <span>TVL</span>
                  <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('volume24hUsd')}
              >
                <div className="flex items-center space-x-1">
                  <span>24H Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('weeklyGrowthPercent')}
              >
                <div className="flex items-center space-x-1">
                  <span>7D Growth</span>
                  <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors hidden md:table-cell"
                onClick={() => handleSort('activeUsers24h')}
              >
                <div className="flex items-center space-x-1">
                  <span>Daily Users</span>
                  <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold">Security & Risk</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-sans">
            {sortedProtocols.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400 font-mono">
                  No protocols found matching the search criteria.
                </td>
              </tr>
            ) : (
              sortedProtocols.map((protocol) => {
                const isPositive = protocol.weeklyGrowthPercent >= 0;
                return (
                  <tr
                    key={protocol.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`View protocol details for ${protocol.name}`}
                    onClick={() => onSelectProtocol(protocol)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectProtocol(protocol);
                      }
                    }}
                    className="hover:bg-slate-800/60 focus:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer transition-colors group"
                  >
                    {/* Name & Logo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${protocol.iconBg} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                          {protocol.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center space-x-1.5">
                            <span>{protocol.name}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono truncate max-w-[160px]">
                            {protocol.smartContracts[0] || 'Clarity Contract'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-gray-300 font-semibold text-[11px] whitespace-nowrap">
                        {protocol.category}
                      </span>
                    </td>

                    {/* TVL */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      ${(protocol.tvlUsd / 1000000).toFixed(2)}M
                    </td>

                    {/* Volume 24h */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-300">
                      ${(protocol.volume24hUsd / 1000000).toFixed(2)}M
                    </td>

                    {/* Weekly Growth */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{isPositive ? '+' : ''}{protocol.weeklyGrowthPercent.toFixed(1)}%</span>
                      </div>
                    </td>

                    {/* Users */}
                    <td className="py-3.5 px-4 font-mono text-gray-300 hidden md:table-cell">
                      {protocol.activeUsers24h.toLocaleString()}
                    </td>

                    {/* Security Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        protocol.riskLevel === 'Audited'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{protocol.riskLevel}</span>
                      </span>
                    </td>

                    {/* Action Chevron */}
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 rounded-lg bg-slate-950 text-gray-400 group-hover:text-white group-hover:bg-indigo-600 transition-all cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

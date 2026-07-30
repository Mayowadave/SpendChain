import React, { useState } from 'react';
import { ProtocolDetail } from '../../types';
import { X, ExternalLink, ShieldCheck, Sparkles, AlertTriangle, Layers, Activity, Users, Code, Newspaper, ChevronRight, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
  protocol: ProtocolDetail | null;
  onClose: () => void;
  onSelectProtocol: (protocol: ProtocolDetail) => void;
  allProtocols: ProtocolDetail[];
  onTriggerAiCopilot: (prompt: string) => void;
}

export const ProtocolDetailModal: React.FC<Props> = ({
  protocol,
  onClose,
  onSelectProtocol,
  allProtocols,
  onTriggerAiCopilot
}) => {
  if (!protocol) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'news' | 'risk'>('overview');

  const relatedProtocols = allProtocols.filter(p => protocol.relatedProtocolIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto"
        role="dialog"
        aria-labelledby="protocol-detail-title"
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${protocol.iconBg} flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0`}>
              {protocol.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="protocol-detail-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">{protocol.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-xs font-semibold text-gray-300">
                  {protocol.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{protocol.riskLevel}</span>
                </span>
              </div>

              <p className="text-xs text-gray-400 max-w-xl mt-1 leading-relaxed">
                {protocol.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close protocol details"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center space-x-2 px-6 pt-4 border-b border-white/10 bg-slate-950/50">
          {[
            { id: 'overview', label: 'Protocol Analytics & TVL' },
            { id: 'contracts', label: 'Clarity Smart Contracts', count: protocol.smartContracts.length },
            { id: 'risk', label: 'AI Risk Audit', badge: `${protocol.protocolHealthScore}/100 Health` },
            { id: 'news', label: 'Ecosystem Updates', count: protocol.news.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white bg-indigo-600/10'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && <span className="ml-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{tab.badge}</span>}
              {tab.count !== undefined && <span className="ml-1.5 text-[10px] font-mono text-gray-400 bg-slate-800 px-1.5 py-0.5 rounded">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10">
                  <div className="text-[11px] font-mono text-gray-400">Total Value Locked</div>
                  <div className="text-lg font-black font-mono text-white mt-1">${(protocol.tvlUsd / 1000000).toFixed(2)}M</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">+{protocol.weeklyGrowthPercent.toFixed(1)}% 7d</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10">
                  <div className="text-[11px] font-mono text-gray-400">24H Trading Volume</div>
                  <div className="text-lg font-black font-mono text-white mt-1">${(protocol.volume24hUsd / 1000000).toFixed(2)}M</div>
                  <div className="text-[10px] font-mono text-gray-400 mt-1">DEX & Pool Liquidity</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10">
                  <div className="text-[11px] font-mono text-gray-400">Daily Active Wallets</div>
                  <div className="text-lg font-black font-mono text-white mt-1">{protocol.activeUsers24h.toLocaleString()}</div>
                  <div className="text-[10px] font-mono text-gray-400 mt-1">{protocol.totalTransactions24h.toLocaleString()} txs 24h</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10">
                  <div className="text-[11px] font-mono text-gray-400">External Links</div>
                  <div className="pt-2 flex items-center space-x-2">
                    <a
                      href={protocol.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Historical TVL Chart */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span>Historical TVL & Volume Growth Trend</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">7-Day Trailing</span>
                </div>

                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={protocol.historicalTvl}>
                      <defs>
                        <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(val: any) => [`$${(val / 1000000).toFixed(2)}M`, 'TVL']}
                      />
                      <Area type="monotone" dataKey="tvlUsd" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#tvlGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Summary Box */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-indigo-300 font-bold font-mono">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Protocol Executive Summary</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-sans">
                  {protocol.aiSummary}
                </p>
              </div>

            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Verified Clarity Smart Contracts ({protocol.smartContracts.length})</span>
              </h3>

              <div className="space-y-2">
                {protocol.smartContracts.map((contract, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="font-mono text-xs text-white break-all">
                      {contract}
                    </div>
                    <a
                      href={`https://explorer.hiro.so/txid/${contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs font-bold shrink-0 flex items-center space-x-1 self-start sm:self-center"
                    >
                      <span>Explore on Hiro</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-gray-300 uppercase">Health Score Breakdown</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">{protocol.protocolHealthScore}/100</div>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full" style={{ width: `${protocol.protocolHealthScore}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Auditing Overview</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-sans">
                  {protocol.riskAnalysis}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Recent Protocol Announcements & News</h3>
              {protocol.news.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.source} • {item.date}</div>
                  </div>
                  <Newspaper className="w-4 h-4 text-indigo-400" />
                </div>
              ))}
            </div>
          )}

          {/* Related Protocols */}
          {relatedProtocols.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Related Stacks Protocols</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProtocols.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectProtocol(rel)}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/10 hover:border-indigo-500/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${rel.iconBg} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                        {rel.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{rel.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onTriggerAiCopilot(`Deep dive into ${protocol.name} protocol and analyze its growth potential.`);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask AI Copilot About {protocol.name}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

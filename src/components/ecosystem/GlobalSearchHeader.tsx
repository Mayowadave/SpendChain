import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Layers, Code, Coins, Image as ImageIcon, Sparkles, X, ChevronRight, ExternalLink } from 'lucide-react';
import { ProtocolDetail, ClarityContractDeployment, Sip10EcosystemToken, EcosystemNftCollection } from '../../types';

interface Props {
  protocols: ProtocolDetail[];
  contracts: ClarityContractDeployment[];
  tokens: Sip10EcosystemToken[];
  nfts: EcosystemNftCollection[];
  onSelectProtocol: (protocol: ProtocolDetail) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedRisk: string;
  onSelectRisk: (risk: string) => void;
  activeSectionTab: string;
  onChangeSectionTab: (tab: string) => void;
}

export const GlobalSearchHeader: React.FC<Props> = ({
  protocols,
  contracts,
  tokens,
  nfts,
  onSelectProtocol,
  selectedCategory,
  onSelectCategory,
  selectedRisk,
  onSelectRisk,
  activeSectionTab,
  onChangeSectionTab
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered matching results
  const matchingProtocols = query.trim()
    ? protocols.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchingContracts = query.trim()
    ? contracts.filter(c => c.contractName.toLowerCase().includes(query.toLowerCase()) || c.contractAddress.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchingTokens = query.trim()
    ? tokens.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.symbol.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchingNfts = query.trim()
    ? nfts.filter(n => n.name.toLowerCase().includes(query.toLowerCase()) || n.symbol.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults = matchingProtocols.length > 0 || matchingContracts.length > 0 || matchingTokens.length > 0 || matchingNfts.length > 0;

  const categories = ['All', 'DeFi & DEX', 'Lending & Yield', 'Liquid Staking', 'NFT & Gaming'];
  const risks = ['All Risks', 'Audited', 'Low', 'Medium'];

  const sectionTabs = [
    { id: 'overview', label: 'Ecosystem Pulse' },
    { id: 'protocols', label: 'Protocols', count: protocols.length },
    { id: 'live-feed', label: 'Live Stream' },
    { id: 'contracts', label: 'Clarity Contracts', count: contracts.length },
    { id: 'tokens', label: 'SIP-010 Tokens', count: tokens.length },
    { id: 'nfts', label: 'NFT Collections', count: nfts.length },
    { id: 'charts', label: 'Analytics Charts' },
    { id: 'ai-copilot', label: 'Ecosystem AI', isAi: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Global Search Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span>Stacks L2 Central Explorer</span>
            </span>
            <span className="text-xs text-gray-400 font-mono">• Nakamoto Mainnet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>Stacks Ecosystem Explorer</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
            Real-time analytics, protocol metrics, smart contract activity, and AI-powered intelligence across the Bitcoin L2 ecosystem.
          </p>
        </div>

        {/* Global Search Input Box */}
        <div ref={searchRef} className="relative w-full lg:w-96 z-20">
          <div className="relative">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search protocols, contracts, tokens, NFTs..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-indigo-500/30 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 shadow-inner font-sans transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Popup */}
          {isOpen && query.trim() && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-[420px] bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl p-3 z-50 max-h-[420px] overflow-y-auto space-y-3 animate-fade-in">
              {!hasResults && (
                <div className="p-4 text-center text-xs text-gray-400 font-mono">
                  No matching protocols, contracts, or tokens found for "{query}".
                </div>
              )}

              {/* Protocol Matches */}
              {matchingProtocols.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider px-2 flex items-center justify-between">
                    <span>Protocols ({matchingProtocols.length})</span>
                    <Layers className="w-3 h-3" />
                  </div>
                  {matchingProtocols.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProtocol(p);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.iconBg} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{p.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{p.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-400">${(p.tvlUsd / 1000000).toFixed(1)}M TVL</div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white inline-block ml-1" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Contract Matches */}
              {matchingContracts.length > 0 && (
                <div className="space-y-1 border-t border-white/10 pt-2">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider px-2 flex items-center justify-between">
                    <span>Contracts ({matchingContracts.length})</span>
                    <Code className="w-3 h-3" />
                  </div>
                  {matchingContracts.map(c => (
                    <a
                      key={c.id}
                      href={c.explorerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-mono font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{c.contractName}</div>
                        <div className="text-[10px] text-gray-400 font-mono truncate">{c.contractAddress}</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white shrink-0" />
                    </a>
                  ))}
                </div>
              )}

              {/* Token Matches */}
              {matchingTokens.length > 0 && (
                <div className="space-y-1 border-t border-white/10 pt-2">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider px-2 flex items-center justify-between">
                    <span>SIP-010 Tokens ({matchingTokens.length})</span>
                    <Coins className="w-3 h-3" />
                  </div>
                  {matchingTokens.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full ${t.logoBg} flex items-center justify-center text-white font-bold text-[10px]`}>
                          {t.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{t.name} ({t.symbol})</div>
                          <div className="text-[10px] text-gray-400 font-mono">{t.holdersCount.toLocaleString()} holders</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-white">${t.priceUsd.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar & Section Nav Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Scrollable Section Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {sectionTabs.map((tab) => {
            const isActive = activeSectionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeSectionTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? tab.isAi
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/80 text-gray-400 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {tab.isAi && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-gray-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Category & Risk Filter Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-400 mr-1" />
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-transparent text-gray-300 font-semibold focus:outline-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <select
              value={selectedRisk}
              onChange={(e) => onSelectRisk(e.target.value)}
              className="bg-transparent text-gray-300 font-semibold focus:outline-none cursor-pointer"
            >
              {risks.map(r => <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>)}
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Sparkles, 
  Star, 
  TrendingUp, 
  ArrowUpRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Bot, 
  RefreshCw, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Coins, 
  Filter, 
  ArrowUpDown,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Wallet, Transaction } from '../types';
import { useWalletAnalytics } from '../hooks/useWalletAnalytics';
import { WalletAnalytics } from '../services/analyticsEngine';
import { Badge, Button, Card } from './ui';

interface ProtocolIntelligenceViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onTriggerAi: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export interface ProtocolItem {
  id: string;
  name: string;
  category: string;
  contractAddress: string;
  txCount: number;
  volumeUsd: number;
  volumeCrypto: number;
  cryptoSymbol: string;
  percentageShare: number;
  lastInteraction: string;
  lastInteractionRelative: string;
  website: string;
  description: string;
  aiObservation: string;
  gradient: string;
  iconBg: string;
  badgeText?: string;
  logoType: 'alex' | 'velar' | 'zest' | 'stacking_dao' | 'sbtc' | 'arkadiko' | 'gamma' | 'bns' | 'bitflow' | 'default';
}

// Custom Protocol SVG Logos Renderer
const ProtocolLogo: React.FC<{ type: ProtocolItem['logoType']; className?: string }> = ({ type, className = "w-6 h-6" }) => {
  switch (type) {
    case 'alex':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#alex-grad)" />
          <path d="M10 22L16 10L22 22H18.5L16 16.5L13.5 22H10Z" fill="white" />
          <defs>
            <linearGradient id="alex-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'velar':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#velar-grad)" />
          <path d="M9 11L16 23L23 11H18.5L16 15.5L13.5 11H9Z" fill="white" />
          <defs>
            <linearGradient id="velar-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'zest':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#zest-grad)" />
          <path d="M10 11H22L12 21H22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="zest-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'stacking_dao':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#sdao-grad)" />
          <path d="M16 7L23 13.5L16 25L9 13.5L16 7Z" fill="white" />
          <defs>
            <linearGradient id="sdao-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'sbtc':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#sbtc-grad)" />
          <path d="M18.5 12.5C18.5 11.67 17.83 11 17 11H13V15H17C17.83 15 18.5 14.33 18.5 13.5V12.5ZM19 18.5C19 17.67 18.33 17 17.5 17H13V21H17.5C18.33 21 19 20.33 19 19.5V18.5Z" fill="white" />
          <path d="M15 9V11M17 9V11M15 21V23M17 21V23" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="sbtc-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'arkadiko':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#ark-grad)" />
          <path d="M10 20L16 10L22 20M12 17H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="ark-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'gamma':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#gamma-grad)" />
          <rect x="10" y="10" width="5" height="5" rx="1" fill="white" />
          <rect x="17" y="10" width="5" height="5" rx="1" fill="white" fillOpacity="0.8" />
          <rect x="10" y="17" width="5" height="5" rx="1" fill="white" fillOpacity="0.8" />
          <rect x="17" y="17" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
          <defs>
            <linearGradient id="gamma-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EC4899" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'bns':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#bns-grad)" />
          <circle cx="16" cy="16" r="8" stroke="white" strokeWidth="2" />
          <path d="M8 16H24M16 8C18 10.5 19 13.2 19 16C19 18.8 18 21.5 16 24C14 21.5 13 18.8 13 16C13 13.2 14 10.5 16 8Z" stroke="white" strokeWidth="1.5" />
          <defs>
            <linearGradient id="bns-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'bitflow':
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#bf-grad)" />
          <path d="M17 7L10 17H16L15 25L22 15H16L17 7Z" fill="white" />
          <defs>
            <linearGradient id="bf-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#def-grad)" />
          <path d="M11 16L16 11L21 16L16 21L11 16Z" fill="white" />
          <defs>
            <linearGradient id="def-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#64748B" />
              <stop offset="1" stopColor="#334155" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};

export const ProtocolIntelligenceView: React.FC<ProtocolIntelligenceViewProps> = ({
  wallets,
  transactions,
  onTriggerAi,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'txCount' | 'volume' | 'name'>('txCount');
  const [copiedContract, setCopiedContract] = useState<string | null>(null);

  const analytics: WalletAnalytics = useWalletAnalytics(transactions, wallets[0]?.address);

  // Compute protocol list dynamically from transactions
  const protocolList = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      category: string;
      contractAddress: string;
      txCount: number;
      volumeUsd: number;
      volumeCrypto: number;
      cryptoSymbol: string;
      lastTxTime: number;
      lastTxDateStr: string;
      website: string;
      description: string;
      logoType: ProtocolItem['logoType'];
      gradient: string;
      iconBg: string;
      aiObservation: string;
    }>();

    // Default predefined Stacks protocols to seed
    const protocolMetadata: Record<string, {
      category: string;
      contract: string;
      website: string;
      description: string;
      logoType: ProtocolItem['logoType'];
      gradient: string;
      iconBg: string;
      aiObservation: string;
    }> = {
      'ALEX DEX & Vaults': {
        category: 'DEX & Swaps',
        contract: 'SP3K8BC0PPEVCVKS3VM1GXM5XVLGAEG2PGY2B54A.alex-vault',
        website: 'https://alexlab.co',
        description: 'Automated Market Maker (AMM), liquidity pools, and yield vaults on Stacks L2.',
        logoType: 'alex',
        gradient: 'from-purple-600 via-indigo-600 to-pink-500',
        iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        aiObservation: 'Your most active DEX destination for SIP-010 token swaps and auto-compounding liquidity vaults.'
      },
      'Velar DEX & Perpetuals': {
        category: 'DEX & Swaps',
        contract: 'SP1Y5YSTAHZ88XY3283282N9D16QAT25A8FE.velar-core',
        website: 'https://velar.co',
        description: 'Multi-chain Bitcoin DeFi suite with spot swapping, farming pools, and perpetuals.',
        logoType: 'velar',
        gradient: 'from-cyan-500 via-teal-600 to-blue-600',
        iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        aiObservation: 'High-frequency spot liquidity router. Excellent gas execution efficiency on Nakamoto blocks.'
      },
      'Zest Protocol Lending': {
        category: 'Lending & Yield',
        contract: 'SP2VC95C17THS81GAT45HJS6348C3D.zest-lending-pool',
        website: 'https://zestprotocol.com',
        description: 'Bitcoin-native lending & borrowing protocol powered by Clarity smart contracts.',
        logoType: 'zest',
        gradient: 'from-emerald-500 via-teal-600 to-cyan-500',
        iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        aiObservation: 'Primary credit market for borrowing STX and sBTC collateral with low liquidation ratio.'
      },
      'StackingDAO Liquid STX': {
        category: 'Liquid Stacking',
        contract: 'SP4SZE2E442F688247F6E0EB07232439178E.stacking-dao-core',
        website: 'https://stackingdao.com',
        description: 'Liquid Stacking protocol for STX. Mint stSTX while earning native PoX-4 BTC yield.',
        logoType: 'stacking_dao',
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        aiObservation: 'Unlocks capital efficiency by granting stSTX liquid tokens while locking underlying STX in PoX.'
      },
      'sBTC Bridge & Peg': {
        category: 'Bitcoin Bridge',
        contract: 'SP000000000000000000002Q6VF78.sbtc-registry',
        website: 'https://stacks.co/sbtc',
        description: 'Trust-minimized 1:1 Bitcoin peg-in and peg-out gateway for Stacks L2 applications.',
        logoType: 'sbtc',
        gradient: 'from-amber-500 via-yellow-500 to-orange-600',
        iconBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        aiObservation: 'Essential gateway bridging L1 Bitcoin liquidity into smart contract application layers.'
      },
      'Arkadiko Protocol': {
        category: 'Lending & Yield',
        contract: 'SP2C2YFP12AJB8A649E7XBP3010C.arkadiko-freddie',
        website: 'https://arkadiko.org',
        description: 'Non-custodial liquidity protocol for self-repaying stablecoin loans using USDA.',
        logoType: 'arkadiko',
        gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
        iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        aiObservation: 'Stablecoin vault interface enabling USDA minting against STX collateral reserves.'
      },
      'Gamma NFT Marketplace': {
        category: 'NFTs & Domains',
        contract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4W1574.gamma-marketplace',
        website: 'https://gamma.io',
        description: 'Premier Bitcoin digital artifacts and Stacks SIP-009 NFT minting marketplace.',
        logoType: 'gamma',
        gradient: 'from-pink-500 via-rose-500 to-purple-600',
        iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        aiObservation: 'Marketplace hub for secondary trading and minting of Bitcoin Ordinals and SIP-009 NFTs.'
      },
      'BNS Names Service': {
        category: 'NFTs & Domains',
        contract: 'SP000000000000000000002Q6VF78.bns-registrar',
        website: 'https://btc.us',
        description: 'Bitcoin Name System decentralized domain registration and primary address resolution.',
        logoType: 'bns',
        gradient: 'from-indigo-500 via-blue-500 to-teal-400',
        iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        aiObservation: 'Decentralized identity resolver anchoring readable .btc domains directly to Stacks L2.'
      },
      'Bitflow Bitcoin DEX': {
        category: 'DEX & Swaps',
        contract: 'SP31C64G19AC23EC38QTH70WCDA25T1P.bitflow-router',
        website: 'https://bitflow.finance',
        description: 'DEX for Bitcoiners: swap 1:1 stablecoins and BTC wrappers with near-zero slippage.',
        logoType: 'bitflow',
        gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
        iconBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
        aiObservation: 'Optimized curve AMM for stablecoin and wrapped BTC pairs with minimal price impact.'
      }
    };

    // Aggregate transactions into protocol buckets
    let totalTxAll = transactions.length || 1;

    transactions.forEach(t => {
      let pName = t.counterpartyName || 'Stacks L2 Network';
      
      if (t.clarityFunction) {
        if (t.clarityFunction.includes('alex') || t.clarityFunction.includes('swap')) pName = 'ALEX DEX & Vaults';
        else if (t.clarityFunction.includes('velar')) pName = 'Velar DEX & Perpetuals';
        else if (t.clarityFunction.includes('zest') || t.clarityFunction.includes('borrow')) pName = 'Zest Protocol Lending';
        else if (t.clarityFunction.includes('stacking-dao') || t.clarityFunction.includes('ststx')) pName = 'StackingDAO Liquid STX';
        else if (t.clarityFunction.includes('sbtc') || t.clarityFunction.includes('peg')) pName = 'sBTC Bridge & Peg';
        else if (t.clarityFunction.includes('arkadiko')) pName = 'Arkadiko Protocol';
        else if (t.clarityFunction.includes('gamma')) pName = 'Gamma NFT Marketplace';
        else if (t.clarityFunction.includes('bns')) pName = 'BNS Names Service';
        else if (t.clarityFunction.includes('bitflow')) pName = 'Bitflow Bitcoin DEX';
      }

      const meta = protocolMetadata[pName] || {
        category: t.category || 'Clarity Contract Exec',
        contract: t.counterpartyAddress || 'SP2C2YFP12AJB8A649E7XBP3010C.clarity-router',
        website: 'https://stacks.co',
        description: 'Stacks L2 Smart Contract Execution Node',
        logoType: 'default',
        gradient: 'from-slate-700 via-slate-800 to-slate-900',
        iconBg: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
        aiObservation: 'Standard smart contract interactions on Stacks mainnet.'
      };

      const ts = new Date(t.timestamp).getTime();
      const existing = map.get(pName);

      if (existing) {
        existing.txCount += 1;
        existing.volumeUsd += (t.amountUsd || 0);
        existing.volumeCrypto += (t.amountCrypto || 0);
        if (ts > existing.lastTxTime) {
          existing.lastTxTime = ts;
          existing.lastTxDateStr = t.timestamp;
        }
      } else {
        map.set(pName, {
          id: pName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: pName,
          category: meta.category,
          contractAddress: meta.contract,
          txCount: 1,
          volumeUsd: t.amountUsd || 0,
          volumeCrypto: t.amountCrypto || 0,
          cryptoSymbol: t.tokenSymbol || 'STX',
          lastTxTime: ts,
          lastTxDateStr: t.timestamp,
          website: meta.website,
          description: meta.description,
          logoType: meta.logoType,
          gradient: meta.gradient,
          iconBg: meta.iconBg,
          aiObservation: meta.aiObservation
        });
      }
    });

    // If map is empty, fill with default protocol samples
    if (map.size === 0) {
      Object.entries(protocolMetadata).forEach(([pName, meta], idx) => {
        map.set(pName, {
          id: pName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: pName,
          category: meta.category,
          contractAddress: meta.contract,
          txCount: 12 - idx,
          volumeUsd: 14500 - (idx * 1200),
          volumeCrypto: 8500 - (idx * 600),
          cryptoSymbol: 'STX',
          lastTxTime: Date.now() - (idx * 86400000),
          lastTxDateStr: new Date(Date.now() - (idx * 86400000)).toLocaleDateString(),
          website: meta.website,
          description: meta.description,
          logoType: meta.logoType,
          gradient: meta.gradient,
          iconBg: meta.iconBg,
          aiObservation: meta.aiObservation
        });
      });
    }

    const items: ProtocolItem[] = Array.from(map.values()).map(p => {
      const share = Math.min(100, Math.round((p.txCount / totalTxAll) * 100));
      return {
        ...p,
        percentageShare: share,
        lastInteraction: p.lastTxDateStr,
        lastInteractionRelative: getRelativeTimeString(p.lastTxTime)
      };
    });

    return items;
  }, [transactions]);

  // Favorite protocol is #1 by transaction count
  const favouriteProtocol = useMemo(() => {
    if (protocolList.length === 0) return null;
    return [...protocolList].sort((a, b) => b.txCount - a.txCount)[0];
  }, [protocolList]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    protocolList.forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, [protocolList]);

  // Filtered & Sorted Protocols List
  const filteredProtocols = useMemo(() => {
    return protocolList
      .filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.contractAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'txCount') return b.txCount - a.txCount;
        if (sortBy === 'volume') return b.volumeUsd - a.volumeUsd;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [protocolList, selectedCategory, searchQuery, sortBy]);

  const copyContract = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedContract(address);
    setTimeout(() => setCopiedContract(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <Layers className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Protocol Interaction Analytics & Smart Contract Audits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>Protocol Intelligence</span>
            <Badge variant="purple" size="md">Multi-Contract Audit</Badge>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            Comprehensive usage frequency, USD transacted volume, contract addresses, and AI insights across Stacks & Bitcoin L2 protocols.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="gradient"
            size="md"
            leftIcon={<Bot className="w-4 h-4 text-amber-400" />}
            onClick={() => onTriggerAi(`Analyze my protocol interactions on Stacks. My favorite protocol is ${favouriteProtocol?.name || 'ALEX DEX'}. Recommend optimization strategies.`)}
          >
            AI Protocol Audit
          </Button>
        </div>
      </div>

      {/* HIGHLIGHT 1: FAVOURITE PROTOCOL SHOWCASE BANNER */}
      {favouriteProtocol && (
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#0E1026] via-[#141538] to-[#0A0B1A] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>#1 Favourite Protocol</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
                  Category: {favouriteProtocol.category}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 shadow-xl shrink-0">
                  <ProtocolLogo type={favouriteProtocol.logoType} className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {favouriteProtocol.name}
                  </h2>
                  <p className="text-xs text-gray-300 font-sans mt-0.5 max-w-xl">
                    {favouriteProtocol.description}
                  </p>
                </div>
              </div>

              {/* AI Protocol Observation Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 shadow-inner">
                <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Usage Observation</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans italic">
                  "{favouriteProtocol.aiObservation}"
                </p>
              </div>
            </div>

            {/* Right Metrics Grid Column */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-mono block">Volume Transacted</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono block">
                  ${favouriteProtocol.volumeUsd.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  ~{favouriteProtocol.volumeCrypto.toLocaleString()} {favouriteProtocol.cryptoSymbol}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-mono block">Total Calls</span>
                <span className="text-lg font-extrabold text-indigo-400 font-mono block">
                  {favouriteProtocol.txCount} txs
                </span>
                <span className="text-[10px] text-purple-300 font-mono">
                  {favouriteProtocol.percentageShare}% of all txs
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-1 col-span-2">
                <span className="text-[11px] text-gray-400 font-mono block">Last Interaction</span>
                <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{favouriteProtocol.lastInteraction} ({favouriteProtocol.lastInteractionRelative})</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* HIGHLIGHT 2: SEARCH & CATEGORY FILTERS BAR */}
      <div className="space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search protocols by name, category, or contract address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Control Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-mono flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="txCount">Most Transactions</option>
              <option value="volume">Highest USD Volume</option>
              <option value="name">Protocol Name (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-gray-300 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* HIGHLIGHT 3: SEARCHABLE PROTOCOL CARDS GRID */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Showing {filteredProtocols.length} protocol(s)</span>
          <span>{searchQuery ? `Search query: "${searchQuery}"` : 'All Stacks mainnet smart contracts'}</span>
        </div>

        {filteredProtocols.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/5 space-y-3">
            <Layers className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No protocols match your search query</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try searching for "ALEX", "Velar", "Lending", or clear your filter query to view all smart contracts.
            </p>
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Search Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProtocols.map((proto, index) => (
              <Card 
                key={proto.id} 
                variant="glass" 
                hoverEffect 
                className="p-5 space-y-4 border border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Protocol Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 shadow-md">
                        <ProtocolLogo type={proto.logoType} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white flex items-center space-x-1.5">
                          <span>{proto.name}</span>
                          {favouriteProtocol?.id === proto.id && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                        </h3>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {proto.category}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/20">
                      {proto.percentageShare}% Share
                    </span>
                  </div>

                  {/* Volume & Interaction Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-white/5 text-xs">
                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">Volume Transacted</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        ${proto.volumeUsd.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block font-mono text-[10px]">Interaction Count</span>
                      <span className="font-bold text-indigo-300 font-mono">
                        {proto.txCount} calls
                      </span>
                    </div>
                  </div>

                  {/* AI Observation Snippet */}
                  <p className="text-xs text-gray-300 leading-relaxed font-sans bg-white/5 p-3 rounded-xl border border-white/5">
                    "{proto.aiObservation}"
                  </p>
                </div>

                {/* Footer Details: Contract Address & Links */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>{proto.lastInteractionRelative}</span>
                    </span>

                    <button
                      onClick={() => copyContract(proto.contractAddress)}
                      className="hover:text-white flex items-center space-x-1 cursor-pointer"
                      title="Copy contract address"
                    >
                      <span>{proto.contractAddress.substring(0, 8)}...</span>
                      {copiedContract === proto.contractAddress ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <a
                    href={proto.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-gray-200 transition-colors"
                  >
                    <span>Launch {proto.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  </a>
                </div>

              </Card>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

function getRelativeTimeString(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 5) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

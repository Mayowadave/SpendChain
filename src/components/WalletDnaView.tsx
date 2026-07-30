import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Bot, 
  TrendingUp, 
  Coins, 
  Layers, 
  Image as ImageIcon, 
  Zap, 
  Flame, 
  Code2, 
  Vote, 
  ShieldCheck, 
  Compass, 
  Award,
  RefreshCw,
  Download,
  ExternalLink,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { Wallet, Transaction } from '../types';
import { useWalletAnalytics } from '../hooks/useWalletAnalytics';
import { Badge, Button, Card } from './ui';

interface WalletDnaViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onTriggerAi: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export interface ArchetypeScore {
  id: string;
  name: string;
  percentage: number; // 0 - 100
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
  traits: string[];
}

export function calculateWalletDna(wallets: Wallet[], transactions: Transaction[]) {
  const primaryWallet = wallets[0];
  const txCount = transactions.length || 1;
  
  // Count various transaction types
  let swapsCount = 0;
  let stackingCount = 0;
  let nftCount = 0;
  let contractCallsCount = 0;
  let contractDeploymentsCount = 0;
  let govCount = 0;
  let liquidityCount = 0;

  transactions.forEach(t => {
    const cat = (t.category || '').toLowerCase();
    const type = (t.type || '').toLowerCase();
    const memo = (t.memo || '').toLowerCase();
    const counterparty = (t.counterpartyAddress || '').toLowerCase();

    if (cat.includes('defi') || cat.includes('swap') || type.includes('swap')) {
      swapsCount++;
    }
    if (cat.includes('stacking') || memo.includes('pox') || memo.includes('stack')) {
      stackingCount++;
    }
    if (cat.includes('nft') || type.includes('nft') || memo.includes('mint') || memo.includes('bns')) {
      nftCount++;
    }
    if (cat.includes('contract') || type.includes('call') || t.clarityFunction) {
      contractCallsCount++;
    }
    if (memo.includes('deploy') || type.includes('deploy') || cat.includes('developer')) {
      contractDeploymentsCount++;
    }
    if (memo.includes('vote') || memo.includes('proposal') || cat.includes('governance')) {
      govCount++;
    }
    if (memo.includes('liquidity') || memo.includes('pool') || cat.includes('yield')) {
      liquidityCount++;
    }
  });

  // Check Wallet holdings
  const hasStacking = wallets.some(w => w.stackingInfo?.isStacking);
  const stackedStx = wallets.reduce((acc, w) => acc + (w.stackingInfo?.stackedStx || 0), 0);
  const totalStx = wallets.reduce((acc, w) => acc + w.balanceStx, 0);
  const hasSbtc = wallets.some(w => w.balanceSbtc > 0);
  const hasNfts = wallets.some(w => w.nftHoldings && w.nftHoldings.length > 0);
  const nftHoldingsCount = wallets.reduce((acc, w) => acc + (w.nftHoldings?.length || 0), 0);
  const tokenTypesCount = wallets.reduce((acc, w) => acc + (w.sip010Tokens?.length || 0), 0);

  // 1. Explorer Score
  // Driven by transaction diversity and contract calls
  const uniqueRecipients = new Set(transactions.map(t => t.counterpartyAddress)).size;
  const explorerScore = Math.min(98, Math.max(25, Math.round((uniqueRecipients / Math.max(1, txCount)) * 40 + (txCount > 10 ? 35 : 20) + (contractCallsCount > 3 ? 20 : 10))));

  // 2. Trader Score
  // Driven by swaps, DEX activity, token diversity
  const traderScore = Math.min(98, Math.max(15, Math.round((swapsCount / Math.max(1, txCount)) * 60 + tokenTypesCount * 12 + 15)));

  // 3. Holder Score
  // Driven by high total balance ratio to spending, holding STX/sBTC without selling
  const holderScore = Math.min(98, Math.max(20, Math.round((totalStx > 1000 ? 50 : totalStx > 100 ? 35 : 20) + (hasSbtc ? 25 : 10) + (txCount < 50 ? 20 : 10))));

  // 4. NFT Collector Score
  // Driven by NFT holdings, SIP-009 activity, BNS names
  const nftScore = Math.min(98, Math.max(10, Math.round(nftHoldingsCount * 25 + nftCount * 15 + (wallets.some(w => w.bnsName) ? 20 : 5))));

  // 5. DeFi User Score
  // Driven by liquidity provision, DEX interaction, yield farming
  const defiScore = Math.min(98, Math.max(15, Math.round((swapsCount + liquidityCount) * 12 + tokenTypesCount * 10 + 25)));

  // 6. Staker Score
  // Driven by PoX stacking status and stacked STX volume
  const stakerScore = Math.min(98, Math.max(10, Math.round((hasStacking ? 55 : 0) + (stackedStx > 0 ? 30 : 0) + stackingCount * 10 + (hasStacking ? 10 : 15))));

  // 7. Builder Score
  // Driven by Clarity deployments, contract calls, gas execution
  const builderScore = Math.min(98, Math.max(10, Math.round(contractDeploymentsCount * 45 + contractCallsCount * 5 + (txCount > 30 ? 15 : 5) + 10)));

  // 8. Governance Participant Score
  // Driven by DAO voting and proposal interactions
  const govScore = Math.min(98, Math.max(10, Math.round(govCount * 35 + (hasStacking ? 20 : 0) + (totalStx > 500 ? 20 : 10) + 10)));

  const archetypes: ArchetypeScore[] = [
    {
      id: 'defi',
      name: 'DeFi User',
      percentage: defiScore,
      icon: <Zap className="w-4 h-4" />,
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Active liquidity provider and yield farmer on Stacks DEX protocols like ALEX & Velar.',
      traits: ['Yield Optimizing', 'DEX Swaps', 'Liquidity Pools']
    },
    {
      id: 'trader',
      name: 'Trader',
      percentage: traderScore,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-indigo-400',
      gradient: 'from-indigo-500 to-blue-500',
      description: 'High transaction frequency, active token rotation, and market timing execution.',
      traits: ['SIP-010 Swaps', 'Market Arbitrage', 'Volume Driver']
    },
    {
      id: 'staker',
      name: 'Staker',
      percentage: stakerScore,
      icon: <Flame className="w-4 h-4" />,
      color: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
      description: 'Locks STX in PoX-4 consensus cycles to earn native BTC yield rewards.',
      traits: ['PoX-4 Yield', 'BTC Rewards', 'Consensus Backer']
    },
    {
      id: 'holder',
      name: 'Holder',
      percentage: holderScore,
      icon: <Coins className="w-4 h-4" />,
      color: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Long-term asset custody with steady STX & sBTC reserve accumulation.',
      traits: ['Low Turnover', 'sBTC Custody', 'Cold Treasury']
    },
    {
      id: 'explorer',
      name: 'Explorer',
      percentage: explorerScore,
      icon: <Compass className="w-4 h-4" />,
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Interacts with new Clarity dApps, tests smart contracts, and expands network reach.',
      traits: ['Contract Tester', 'Network Pioneer', 'Early Adopter']
    },
    {
      id: 'nft',
      name: 'NFT Collector',
      percentage: nftScore,
      icon: <ImageIcon className="w-4 h-4" />,
      color: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-500',
      description: 'Holds Bitcoin-anchored digital artifacts, SIP-009 NFTs, and BNS domain names.',
      traits: ['Digital Artifacts', 'SIP-009 Standard', 'BNS Domains']
    },
    {
      id: 'builder',
      name: 'Builder',
      percentage: builderScore,
      icon: <Code2 className="w-4 h-4" />,
      color: 'text-teal-400',
      gradient: 'from-teal-500 to-emerald-500',
      description: 'Deploys and tests Clarity smart contracts on Stacks Nakamoto L2.',
      traits: ['Clarity Code', 'Contract Publisher', 'Developer Activity']
    },
    {
      id: 'governance',
      name: 'Governance Participant',
      percentage: govScore,
      icon: <Vote className="w-4 h-4" />,
      color: 'text-amber-300',
      gradient: 'from-amber-400 to-yellow-500',
      description: 'Votes on Stacks Improvement Proposals (SIPs) and protocol DAO upgrades.',
      traits: ['SIP Voting', 'DAO Signer', 'Community Leader']
    }
  ];

  // Sort archetypes by percentage score descending
  archetypes.sort((a, b) => b.percentage - a.percentage);

  // Top 2 dominant traits
  const primary = archetypes[0];
  const secondary = archetypes[1];

  // Primary AI Summary narrative string
  const aiExplanation = `You are primarily a ${primary.name} (${primary.percentage}%) with moderate ${secondary.name.toLowerCase()} activity (${secondary.percentage}%). Your wallet demonstrates strong engagement in Stacks L2 ecosystem protocols.`;

  return {
    archetypes,
    primary,
    secondary,
    aiExplanation
  };
}

export const WalletDnaView: React.FC<WalletDnaViewProps> = ({
  wallets,
  transactions,
  onTriggerAi,
  onNavigateTab
}) => {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const dnaData = calculateWalletDna(wallets, transactions);
  const { archetypes, primary, secondary, aiExplanation } = dnaData;

  const primaryAddress = wallets[0]?.address || 'SP2C2YFP12AJB8A649E7XBP3010C';
  const bnsName = wallets[0]?.bnsName || 'sats.btc';

  // Trigger progress bar fill animations on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyShareText = () => {
    const shareText = `🧬 My Stacks Wallet DNA Profile:\n` +
      `• Primary: ${primary.name} (${primary.percentage}%)\n` +
      `• Secondary: ${secondary.name} (${secondary.percentage}%)\n` +
      `\n"${aiExplanation}"\n` +
      `\nAnalyzed on SpendChain Stacks L2 Analytics 🚀`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <Dna className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Behavioral Pattern Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>Wallet DNA</span>
            <Badge variant="indigo" size="md">On-Chain Archetype</Badge>
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            Deep algorithmic fingerprinting of your Stacks L2 transaction history and asset behavior
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="md"
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            onClick={handleCopyShareText}
          >
            {copied ? 'DNA Copied!' : 'Copy Share Card'}
          </Button>

          <Button
            variant="gradient"
            size="md"
            leftIcon={<Bot className="w-4 h-4 text-amber-400" />}
            onClick={() => onTriggerAi(`Deep dive into my Wallet DNA breakdown (${primary.name} ${primary.percentage}%, ${secondary.name} ${secondary.percentage}%). Provide 3 strategic growth avenues for my profile.`)}
          >
            AI Deep Analysis
          </Button>
        </div>
      </div>

      {/* HIGHLIGHT 1: Shareable Web3 Passport Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0B1229] via-[#0E1738] to-[#080D21] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Decorative Background Elements */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Passport Left Summary */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Archetype</span>
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Address: {primaryAddress.substring(0, 6)}...{primaryAddress.slice(-4)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {primary.name} & <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">{secondary.name}</span>
            </h2>

            {/* AI Generated Quote Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-inner space-y-2">
              <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI DNA Behavioral Summary</span>
              </div>
              <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed font-sans italic">
                "{aiExplanation}"
              </p>
            </div>

            {/* Traits Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {primary.traits.concat(secondary.traits).map((trait, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center space-x-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  <span>{trait}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Passport Right Share Badge Card */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-indigo-500/30 shadow-2xl space-y-4 text-center relative group">
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Dna className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{bnsName}</h3>
              <p className="text-xs text-indigo-300 font-mono font-semibold mt-0.5">
                Stacks L2 Citizen Tier #1
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-left pt-2 border-t border-white/10">
              <div className="p-2 rounded-xl bg-white/5 text-[11px]">
                <span className="text-gray-400 block font-mono">Dominant</span>
                <span className="font-bold text-white truncate block">{primary.name}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 text-[11px]">
                <span className="text-gray-400 block font-mono">Affinity Score</span>
                <span className="font-bold text-indigo-400 font-mono block">{primary.percentage}%</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              leftIcon={<Share2 className="w-3.5 h-3.5 text-indigo-400" />}
              onClick={handleCopyShareText}
            >
              {copied ? 'Copied to Clipboard!' : 'Share DNA Passport'}
            </Button>
          </div>

        </div>
      </div>

      {/* HIGHLIGHT 2: Animated Progress Bars for 8 Archetypes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Archetype Breakdown (8 Dimensions)
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Calculated dynamically from smart contract execution, token holdings, and protocol frequency
            </p>
          </div>

          <span className="text-xs font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
            Ranked by Affinity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archetypes.map((arch, index) => (
            <Card 
              key={arch.id} 
              variant="glass" 
              hoverEffect 
              className="p-5 space-y-3.5 border border-white/10"
            >
              {/* Header: Title, Icon, Score Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl bg-slate-900 border border-white/10 ${arch.color}`}>
                    {arch.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-white">{arch.name}</h3>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                          #1 Primary
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      Dimension #{index + 1}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xl font-black font-mono ${arch.color}`}>
                    {arch.percentage}%
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${arch.gradient} transition-all duration-1000 ease-out shadow-lg`}
                    style={{
                      width: isAnimating ? '0%' : `${arch.percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Description & Traits */}
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {arch.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {arch.traits.map((trait, tIdx) => (
                  <span 
                    key={tIdx}
                    className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-gray-400 font-mono"
                  >
                    #{trait}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* HIGHLIGHT 3: AI Ecosystem Recommendations */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Wallet DNA Strategic Next Steps</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('ai-insights')}
          >
            Launch Full Copilot <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono block">
              01 • Protocol Discovery
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              As a dominant <strong className="text-white">{primary.name}</strong>, consider interacting with Zest Protocol borrow/lend markets or StackingDAO liquid STX vaults.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono block">
              02 • Yield Optimization
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Combine your <strong className="text-white">{secondary.name}</strong> traits with Nakamoto fast-block finality to automate dual BTC + STX yield harvest.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono block">
              03 • On-Chain Reputation
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Your overall DNA profile puts you in the top 15% of active Stacks L2 wallets. Share your DNA card to prove reputation!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

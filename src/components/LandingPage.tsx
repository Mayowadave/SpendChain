import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Shield,
  Eye,
  Bot, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Globe2, 
  Dna, 
  Wallet, 
  ExternalLink, 
  Activity, 
  Layers, 
  Zap, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  PieChart, 
  Coins, 
  MessageSquare, 
  ShieldAlert, 
  Terminal, 
  Search,
  Check,
  Github,
  Twitter,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { Button, Card } from './ui';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenConnectModal: () => void;
  onNavigateToExplorer?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenConnectModal,
  onNavigateToExplorer
}) => {
  const [activeHeroTab, setActiveHeroTab] = useState<'overview' | 'copilot' | 'health'>('overview');
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<number>(0);
  const [stxPrice, setStxPrice] = useState<number>(0.133);
  const [networkBlock, setNetworkBlock] = useState<number>(884210);

  // Fetch real live STX price and handle block height updates
  useEffect(() => {
    let isMounted = true;

    const fetchRealStxPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd');
        if (res.ok) {
          const data = await res.json();
          if (data?.blockstack?.usd && isMounted) {
            setStxPrice(data.blockstack.usd);
          }
        }
      } catch (e) {
        // Fallback to current market value
      }
    };

    fetchRealStxPrice();

    const interval = setInterval(() => {
      fetchRealStxPrice();
      setNetworkBlock(prev => prev + 1);
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleExplorerClick = () => {
    if (onNavigateToExplorer) {
      onNavigateToExplorer();
    } else {
      onLaunchApp();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030611] text-gray-100 selection:bg-indigo-500/30 font-sans relative overflow-x-hidden">
      
      {/* Background Ambient Glowing Orbs - Linear/Vercel Style */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[1600px] right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[140px] pointer-events-none -z-10" />

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-8 pb-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 space-y-8 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-xl shadow-indigo-500/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Next-Gen Stacks & Bitcoin L2 Financial Intelligence</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Know Where Every <br />
                <span className="bg-gradient-to-r from-indigo-300 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                  Crypto Dollar Went.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl">
                SpendChain transforms raw Stacks blockchain data into beautiful analytics, AI insights, wallet health scores, and ecosystem intelligence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={onOpenConnectModal}
                  leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="px-8 py-4 text-sm font-bold shadow-xl shadow-indigo-600/20"
                >
                  Connect Wallet
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleExplorerClick}
                  leftIcon={<Globe2 className="w-4 h-4 text-indigo-400" />}
                  className="px-8 py-4 text-sm font-bold bg-slate-950/60 border-white/15 hover:bg-slate-900"
                >
                  Explore Ecosystem
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-400 font-mono">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>No Account Required</span>
                </div>
                <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Built for Stacks</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>AI Powered</span>
                </div>
              </div>

            </div>

            {/* Right Side: REALISTIC INTERACTIVE DASHBOARD PREVIEW */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl bg-slate-900/90 border border-white/15 p-5 sm:p-6 shadow-2xl shadow-indigo-500/10 space-y-5 backdrop-blur-2xl overflow-hidden group">
                
                {/* Decorative subtle ambient backdrop */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Dashboard Header Bar inside Mockup */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-white">SP3F...8K2</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40 font-bold">
                          Sample Demo Data
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">Nakamoto Block #{networkBlock.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Interactive Tab Switcher in Hero Mockup */}
                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[11px] font-mono font-semibold">
                    <button
                      onClick={() => setActiveHeroTab('overview')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        activeHeroTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Metrics
                    </button>
                    <button
                      onClick={() => setActiveHeroTab('copilot')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        activeHeroTab === 'copilot' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      AI
                    </button>
                    <button
                      onClick={() => setActiveHeroTab('health')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        activeHeroTab === 'health' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Health
                    </button>
                  </div>
                </div>

                {/* Tab View 1: Overview / Metrics */}
                {activeHeroTab === 'overview' && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Top Balance Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Total Net Worth</span>
                        <div className="text-lg font-black text-white font-mono">$142,850.20</div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+14.2% Yield 30D</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">STX & sBTC Holdings</span>
                        <div className="text-lg font-black text-amber-300 font-mono">42,500 STX</div>
                        <div className="text-[10px] text-gray-400 font-mono">1.482 sBTC ($98,200)</div>
                      </div>
                    </div>

                    {/* Mini Spending Allocation Bar */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-300 font-bold">Automated Category Breakdown</span>
                        <span className="text-indigo-400 text-[10px]">4 Protocol Directives</span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-slate-900 flex overflow-hidden border border-white/5">
                        <div className="h-full bg-indigo-500 w-[42%]" title="PoX Stacking (42%)" />
                        <div className="h-full bg-amber-400 w-[28%]" title="DEX Liquidity (28%)" />
                        <div className="h-full bg-emerald-400 w-[18%]" title="SIP-010 Tokens (18%)" />
                        <div className="h-full bg-pink-500 w-[12%]" title="NFT Artifacts (12%)" />
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-gray-400 pt-1">
                        <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /><span>Stacking</span></div>
                        <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>DEX LP</span></div>
                        <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span>SIP-010</span></div>
                        <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>NFTs</span></div>
                      </div>
                    </div>

                    {/* Live Recent Transactions Stream */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Live On-Chain Activity</span>
                      <div className="space-y-1.5">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-white font-bold">PoX Stacking Reward</span>
                          </div>
                          <span className="text-emerald-400 font-bold">+350 STX</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-white font-bold">ALEX DEX Swap</span>
                          </div>
                          <span className="text-amber-300 font-bold">-0.002 sBTC</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Tab View 2: AI Copilot Preview */}
                {activeHeroTab === 'copilot' && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 animate-fade-in font-mono text-xs">
                    <div className="flex items-center space-x-2 text-purple-300 font-bold border-b border-white/10 pb-2">
                      <Bot className="w-4 h-4 text-amber-400" />
                      <span>Gemini AI Wallet Intelligence</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-gray-300 space-y-2 text-[11px] leading-relaxed">
                      <p className="text-white font-bold">💡 Optimization Recommendation:</p>
                      <p>Your wallet has 42,500 STX currently yielding 8.2% APY in PoX Stacking Cycle #94. Re-allocating 15% to sBTC liquidity could increase annual yield by <span className="text-emerald-400 font-bold">+$1,420 USD</span>.</p>
                      <div className="p-2 rounded bg-purple-950/50 border border-purple-500/20 text-purple-200 text-[10px]">
                        ✓ All Clarity contract post-conditions verified safe.
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab View 3: Wallet Health Score Ring */}
                {activeHeroTab === 'health' && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-4 animate-fade-in text-center font-mono">
                    <div className="text-xs font-bold text-white">Wallet Health & Security Index</div>
                    
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-400 transition-all duration-1000"
                          strokeDasharray="88, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">88</span>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase">Excellent</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                      High diversification across Stacking, zero unspent risky allowances, and fast Nakamoto block execution.
                    </p>
                  </div>
                )}

                {/* Floating Micro Badge overlay */}
                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-2xl bg-slate-950 border border-amber-500/40 text-[10px] font-mono text-amber-200 shadow-xl flex items-center space-x-1.5 pointer-events-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Illustrative Demo Data • Connect Wallet for Live Stats</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECURITY FIRST TRUST SIGNAL BAR */}
      <section className="py-8 sm:py-10 border-y border-white/[0.08] bg-[#05091a]/80 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">Security First Architecture</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    Verified Safe
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-sans mt-0.5">Built to protect your wallet and ensure complete financial privacy on Stacks</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Read-Only Public Ledger Audit</span>
            </div>
          </div>

          {/* 3 Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            
            {/* Badge 1: Non-custodial */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 transition-all space-y-2.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">Non-custodial</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/20">
                  100% User Control
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Your keys remain entirely in Leather or Xverse. SpendChain never holds funds, requests transfer permissions, or executes transactions.
              </p>
            </div>

            {/* Badge 2: Read-only access */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-indigo-500/30 transition-all space-y-2.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">Read-only access</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-semibold border border-indigo-500/20">
                  Zero Contract Risk
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Queries public blockchain records purely to compute financial analytics. No smart contract approvals or spending limits requested.
              </p>
            </div>

            {/* Badge 3: Privacy-focused */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-purple-500/30 transition-all space-y-2.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">Privacy-focused</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono font-semibold border border-purple-500/20">
                  No Accounts or Logs
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                No KYC, account signup, or IP tracking. Analyze your wallet activity anonymously without leaving personal data footprints.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: LIVE ECOSYSTEM SNAPSHOT */}
      <section className="py-12 border-y border-white/[0.08] bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-[11px] text-gray-400">Live Stacks L2 Network Snapshot</span>
            </div>
            <span className="text-gray-500 hidden sm:inline">Updated automatically every block</span>
          </div>

          {/* Horizontal Row of Premium Statistic Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 transition-all space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Current STX Price</span>
              <div className="text-base font-bold text-white font-mono">${stxPrice < 1 ? stxPrice.toFixed(3) : stxPrice.toFixed(2)}</div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">+5.2% 24h</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 transition-all space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">24H DEX Volume</span>
              <div className="text-base font-bold text-amber-300 font-mono">$42.8M</div>
              <span className="text-[10px] font-mono text-gray-400">Across ALEX & Velar</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 transition-all space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Tracked Wallets</span>
              <div className="text-base font-bold text-white font-mono">18,420+</div>
              <span className="text-[10px] font-mono text-indigo-300">+240 today</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 transition-all space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Txns Analysed</span>
              <div className="text-base font-bold text-emerald-400 font-mono">$1.2B+</div>
              <span className="text-[10px] font-mono text-gray-400">Total volume</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 transition-all space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Supported Protocols</span>
              <div className="text-base font-bold text-purple-300 font-mono">28 Mainnet</div>
              <span className="text-[10px] font-mono text-gray-400">sBTC & Clarity</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 transition-all space-y-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Network Status</span>
              <div className="text-base font-bold text-emerald-300 font-mono flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Nakamoto</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Block #{networkBlock.toLocaleString()}</span>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: WHAT YOU CAN DO */}
      <section id="features" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything Needed for Stacks Financial Clarity
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Designed for investors, builders, and protocols requiring precision on-chain financial accounting.
            </p>
          </div>

          {/* 4 Large Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div 
              onClick={onLaunchApp}
              className="p-7 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 hover:bg-slate-900 transition-all space-y-4 group cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="p-3.5 w-fit rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Wallet Analytics
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Understand exactly where every transaction went.
              </p>
              <div className="pt-2 flex items-center text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>View Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={onLaunchApp}
              className="p-7 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-amber-500/40 hover:bg-slate-900 transition-all space-y-4 group cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="p-3.5 w-fit rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                AI Wallet Copilot
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Chat with your wallet and receive intelligent insights.
              </p>
              <div className="pt-2 flex items-center text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Talk to Copilot</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={onLaunchApp}
              className="p-7 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-900 transition-all space-y-4 group cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="p-3.5 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Wallet DNA
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Discover your unique on-chain personality and behaviour.
              </p>
              <div className="pt-2 flex items-center text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Inspect DNA</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={handleExplorerClick}
              className="p-7 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-purple-500/40 hover:bg-slate-900 transition-all space-y-4 group cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="p-3.5 w-fit rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Stacks Ecosystem Explorer
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Monitor the entire Stacks ecosystem in real time.
              </p>
              <div className="pt-2 flex items-center text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Hub</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: PRODUCT SHOWCASE */}
      <section id="showcase" className="py-20 space-y-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
              Product Tour
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Unmatched Precision
            </h2>
          </div>

          {/* SHOWCASE 1: DASHBOARD (Image Right / Text Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono border border-indigo-500/20 font-bold">
                Dashboard
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Everything about your wallet in one place.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Auto-categorized expenses, token holdings across STX, sBTC, and SIP-010 tokens, PoX Stacking yields, and transaction velocity—all mapped into high-fidelity financial reports.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onLaunchApp}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Dashboard
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white font-mono">Financial Workspace Summary</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Sample Preview Data</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400">Net Worth</span>
                    <div className="font-bold text-white">$142,850.20</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400">Stacking Yield</span>
                    <div className="font-bold text-emerald-400">+8.2% APY</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400">Gas Spent</span>
                    <div className="font-bold text-indigo-300">0.004 STX</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">Category Distribution</span>
                    <span className="text-gray-400 text-[10px]">4 active protocols</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-gray-300">
                      <span>PoX Stacking Protocol</span>
                      <span className="text-indigo-400 font-bold">$60,000 (42%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-300">
                      <span>ALEX DEX sBTC Pool</span>
                      <span className="text-amber-300 font-bold">$40,000 (28%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SHOWCASE 2: AI COPILOT (Image Left / Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4">
                <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white font-mono">SpendChain Gemini AI Copilot</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-100 max-w-md ml-auto">
                    "How much did I spend on Clarity contract calls this month?"
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-gray-200 space-y-2 leading-relaxed max-w-lg">
                    <p className="font-bold text-amber-300">🤖 Gemini AI Analysis:</p>
                    <p>You executed 14 Clarity smart contract calls across ALEX and Zest Protocol this month, consuming a total of <span className="text-white font-bold">0.082 STX (~$0.15)</span> in transaction fees.</p>
                    <div className="p-2 rounded bg-purple-950/40 border border-purple-500/20 text-[10px] text-purple-200">
                      Recommendation: Your gas consumption is in the top 5% efficiency bracket on Stacks.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/20 font-bold">
                AI Copilot
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Ask your wallet anything.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Powered by Gemini AI, your personal financial copilot interprets complex Clarity smart contract calls, identifies recurring gas costs, and generates strategic yield optimizations.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onLaunchApp}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Try AI Copilot
                </Button>
              </div>
            </div>

          </div>

          {/* SHOWCASE 3: WALLET DNA (Image Right / Text Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20 font-bold">
                Wallet DNA
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Understand your on-chain identity.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Analyze your transaction frequency, protocol usage, liquidity habits, and risk profile. SpendChain generates a dynamic Wallet DNA score and behavioral persona.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onLaunchApp}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Discover Your DNA
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Dna className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white font-mono">Wallet Behavioral Fingerprint</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    Persona: Yield Hunter
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400">Security Rating</span>
                    <div className="font-bold text-emerald-400">92/100 Grade A</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400">Contract Diversity</span>
                    <div className="font-bold text-indigo-300">8 Protocols Used</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="text-gray-300 font-bold">Traits & Behavioral Badges</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px]">⚡ Fast Execution</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">🏆 PoX Stacking Veteran</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">🛡️ Zero Unspent Approvals</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SHOWCASE 4: STACKS ECOSYSTEM EXPLORER (Image Left / Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Globe2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white font-mono">Stacks Ecosystem Protocol Hub</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300">Gamma & Hiro API</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white">AL</div>
                      <div>
                        <div className="font-bold text-white">ALEX DEX & Orderbook</div>
                        <div className="text-[10px] text-gray-400">DeFi • Stacks Mainnet</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">$62.4M TVL</div>
                      <div className="text-[10px] text-gray-400">+12.4% 24h</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-white">ZE</div>
                      <div>
                        <div className="font-bold text-white">Zest Protocol</div>
                        <div className="text-[10px] text-gray-400">Bitcoin Lending</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">$38.1M TVL</div>
                      <div className="text-[10px] text-gray-400">+8.1% 24h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/20 font-bold">
                Stacks Ecosystem Explorer
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Discover what is happening across the Stacks ecosystem.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Track TVL across Alex, Zest, Hermetica, and Velar, monitor newly deployed Clarity contracts, watch live whale movements, and analyze SIP-010 token activity.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleExplorerClick}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch Ecosystem Explorer
                </Button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: FINAL CALL TO ACTION */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950 border border-indigo-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl overflow-hidden backdrop-blur-2xl">
            
            {/* Subtle animated background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SpendChain L2 Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
              Ready to understand your wallet?
            </h2>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-normal leading-relaxed">
              Connect your wallet in seconds and transform raw blockchain activity into clear insights.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gradient"
                size="lg"
                onClick={onOpenConnectModal}
                leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold shadow-xl shadow-indigo-600/30"
              >
                Connect Wallet
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onLaunchApp}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold bg-slate-950/80 border-white/20 hover:bg-slate-900"
              >
                Open Dashboard
              </Button>
            </div>

            <p className="text-[11px] font-mono text-gray-400 pt-2">
              Read-Only Security • Compatible with Leather & Xverse • Mainnet Verified
            </p>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#02040a] py-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Brand Info */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="https://i.ibb.co/JR5K0m9x/1785179902166.png" 
                  alt="SpendChain" 
                  className="w-6 h-6 object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="font-extrabold text-white text-base tracking-tight">SpendChain</span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                The premium AI-powered financial analytics platform for the Stacks blockchain & Bitcoin L2 ecosystem.
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs">
              
              <div className="space-y-2.5">
                <div className="font-bold text-white uppercase text-[10px] tracking-wider">Product</div>
                <ul className="space-y-1.5 text-gray-400">
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
                  <li><button onClick={handleExplorerClick} className="hover:text-white transition-colors cursor-pointer">Ecosystem Hub</button></li>
                  <li><button onClick={onLaunchApp} className="hover:text-white transition-colors cursor-pointer">Dashboard</button></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-white uppercase text-[10px] tracking-wider">Resources</div>
                <ul className="space-y-1.5 text-gray-400">
                  <li><a href="https://github.com/spendchain" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                  <li><button onClick={() => scrollToSection('showcase')} className="hover:text-white transition-colors cursor-pointer">About SpendChain</button></li>
                  <li><a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Stacks Docs</a></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-white uppercase text-[10px] tracking-wider">Legal & Social</div>
                <ul className="space-y-1.5 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li className="flex items-center space-x-3 pt-1">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
                    <a href="https://github.com/spendchain" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-gray-500">
            <div>
              © 2026 SpendChain. All rights reserved.
            </div>
            <div>
              Built for Stacks Mainnet & Bitcoin L2
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

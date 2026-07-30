import React, { useState } from 'react';
import { 
  Wallet, 
  Globe,
  Globe2,
  Zap,
  Flame,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Dna,
  Layers,
  BellRing,
  ReceiptText,
  BarChart3,
  Bot
} from 'lucide-react';
import { AppSettings } from '../types';
import { Button, Badge } from './ui';
import { STX_PRICE_USD } from '../data/mockData';
import { useWallet } from '../context/WalletContext';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenConnectModal: () => void;
  settings: AppSettings;
  walletCount: number;
  totalBalanceUsd: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenConnectModal,
  walletCount,
  totalBalanceUsd
}) => {
  const { walletSession, isConnected, formattedAddress, disconnectWallet, accountData } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stacks-explorer', label: 'Ecosystem Explorer', icon: Globe2, badge: 'L2 Hub' },
    { id: 'wallet-dna', label: 'Wallet DNA', icon: Dna, badge: 'DNA' },
    { id: 'protocol-intelligence', label: 'Protocol Intelligence', icon: Layers, badge: 'Hot' },
    { id: 'smart-alerts', label: 'Smart Alerts', icon: BellRing, badge: 'Live' },
    { id: 'wallets', label: 'Stacks Wallets', icon: Wallet },
    { id: 'transactions', label: 'Clarity Ledger', icon: ReceiptText },
    { id: 'analytics', label: 'Protocol Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Copilot', icon: Bot, badge: 'Gemini' }
  ];


  const handleMobileNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#030611]/85 backdrop-blur-2xl shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <button 
            onClick={() => onTabChange('landing')}
            className="flex items-center space-x-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1 group cursor-pointer"
            aria-label="SpendChain Home Page"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#030611] border border-white/10 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center p-0.5 shrink-0">
              <img 
                src="https://i.ibb.co/JR5K0m9x/1785179902166.png" 
                alt="SpendChain Logo" 
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold bg-gradient-to-r from-white via-indigo-100 to-amber-200 bg-clip-text text-transparent tracking-tight font-sans">
                  SpendChain
                </span>
                <Badge variant="indigo" size="sm">Stacks L2</Badge>
              </div>
              <p className="text-[10px] text-gray-400 font-mono hidden sm:block tracking-normal">
                Stacks & Bitcoin L2 Web3 Analytics
              </p>
            </div>
          </button>

          {/* Navigation Pills (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 pl-4 border-l border-white/10" role="navigation" aria-label="Desktop Top Navigation">
            {navTabs.slice(0, 6).map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 ${
                    isActive
                      ? 'text-white bg-indigo-600/25 border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-bold bg-gradient-to-r from-amber-500 to-indigo-500 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-2">
          
          {/* STX Price & Nakamoto Status Indicator */}
          <div className="hidden xl:flex items-center space-x-3 text-xs bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-white/10 shadow-inner">
            <div className="flex items-center space-x-1.5 text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="font-semibold font-mono">STX ${STX_PRICE_USD.toFixed(2)}</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center space-x-1 text-teal-400">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Nakamoto Fast Blocks</span>
            </div>
          </div>

          {/* Landing Mode Toggle Button */}
          <Button
            variant={currentTab === 'landing' ? 'primary' : 'outline'}
            size="sm"
            leftIcon={<Globe className="w-3.5 h-3.5" />}
            onClick={() => onTabChange(currentTab === 'landing' ? 'dashboard' : 'landing')}
            aria-label="Toggle Landing or App Workspace"
          >
            <span className="hidden sm:inline">
              {currentTab === 'landing' ? 'App Workspace' : 'Overview Landing'}
            </span>
          </Button>

          {/* Connect / Connected Wallet Button */}
          {isConnected && walletSession ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenConnectModal}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-900/80 transition-all text-xs font-mono font-bold text-indigo-200 shadow-md shadow-indigo-500/10 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label={`Connected wallet ${formattedAddress}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-white group-hover:text-indigo-300 transition-colors">
                  {formattedAddress}
                </span>
                {accountData && accountData.stxBalance > 0 && (
                  <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 hidden sm:inline-block">
                    {accountData.stxBalance.toLocaleString()} STX
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                aria-label="Disconnect Wallet"
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="gradient"
              size="sm"
              leftIcon={<Wallet className="w-4 h-4" />}
              onClick={onOpenConnectModal}
              aria-label="Connect Stacks Wallet"
            >
              Connect Wallet
            </Button>
          )}

          {/* Mobile Navigation Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-gray-300 hover:text-white md:hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#030611]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fade-in shadow-2xl">
          <div className="text-[10px] font-mono font-bold text-gray-500 uppercase px-2 mb-2">
            Navigation Menu
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMobileNavClick(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/80 text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-indigo-300 font-mono px-2">
            <span>STX Price: ${STX_PRICE_USD.toFixed(2)}</span>
            <span className="text-emerald-400 font-semibold">Nakamoto Active</span>
          </div>
        </div>
      )}
    </header>
  );
};


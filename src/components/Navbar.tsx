import React from 'react';
import { 
  Wallet, 
  Layers,
  Globe,
  Zap,
  Flame,
  LogOut,
  ChevronDown
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

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => onTabChange('landing')}
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#050816] border border-white/10 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center p-0.5">
              <img 
                src="https://i.ibb.co/JR5K0m9x/1785179902166.png" 
                alt="SpendChain Logo" 
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-gradient-to-r from-white via-indigo-100 to-amber-200 bg-clip-text text-transparent tracking-tight">
                  SpendChain
                </span>
                <Badge variant="blue" size="sm">Stacks L2</Badge>
              </div>
              <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
                Stacks & Bitcoin L2 Web3 Analytics
              </p>
            </div>
          </button>

          {/* Quick View Selector (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 pl-4 border-l border-white/10">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'wallets', label: 'Stacks Wallets' },
              { id: 'transactions', label: 'Clarity Ledger' },
              { id: 'analytics', label: 'Protocol Analytics' },
              { id: 'ai-insights', label: 'AI Copilot', badge: 'Gemini' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                  currentTab === tab.id
                    ? 'text-white bg-indigo-600/30 border border-indigo-500/40 shadow-sm'
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
            ))}
          </div>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-3">
          
          {/* STX Price & Nakamoto Status Indicator */}
          <div className="hidden xl:flex items-center space-x-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-indigo-400">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="font-semibold font-mono">STX ${STX_PRICE_USD.toFixed(2)}</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center space-x-1 text-teal-400">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Nakamoto #168,242</span>
            </div>
          </div>

          {/* Landing Mode Toggle Button */}
          <Button
            variant={currentTab === 'landing' ? 'primary' : 'outline'}
            size="sm"
            leftIcon={<Globe className="w-3.5 h-3.5" />}
            onClick={() => onTabChange(currentTab === 'landing' ? 'dashboard' : 'landing')}
          >
            <span className="hidden sm:inline">
              {currentTab === 'landing' ? 'App Workspace' : 'Overview Landing'}
            </span>
          </Button>

          {/* Live Network Sync Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-gray-300">
              {walletCount} Wallets (${(totalBalanceUsd / 1000).toFixed(1)}k)
            </span>
          </div>

          {/* Connect / Connected Wallet Button */}
          {isConnected && walletSession ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenConnectModal}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-900/80 transition-all text-xs font-mono font-bold text-indigo-200 shadow-md shadow-indigo-500/10 group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-white group-hover:text-indigo-300 transition-colors">
                  {formattedAddress}
                </span>
                {accountData && accountData.stxBalance > 0 && (
                  <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {accountData.stxBalance.toLocaleString()} STX
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
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
            >
              Connect STX Wallet
            </Button>
          )}
        </div>

      </div>
    </header>
  );
};

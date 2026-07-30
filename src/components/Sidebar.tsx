import React from 'react';
import { 
  LayoutDashboard, 
  Dna,
  Layers,
  BellRing,
  Globe2,
  Wallet, 
  ReceiptText, 
  BarChart3, 
  ShieldAlert,
  ArrowUpRight,
  Bot,
  Sparkles
} from 'lucide-react';
import { Badge, Button } from './ui';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unspentApprovals: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  unspentApprovals
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stacks-explorer', label: 'Ecosystem Explorer', icon: Globe2, badge: 'L2 Hub' },
    { id: 'wallet-dna', label: 'Wallet DNA', icon: Dna, badge: 'New' },
    { id: 'protocol-intelligence', label: 'Protocol Intelligence', icon: Layers, badge: 'Hot' },
    { id: 'smart-alerts', label: 'Smart Alerts', icon: BellRing, badge: 'Live' },
    { id: 'wallets', label: 'Stacks Wallets', icon: Wallet },
    { id: 'transactions', label: 'Clarity Ledger', icon: ReceiptText },
    { id: 'analytics', label: 'Protocol Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Wallet Copilot', icon: Bot, badge: 'Gemini' },
  ];


  return (
    <aside 
      className="w-64 shrink-0 hidden md:block border-r border-white/[0.08] bg-[#030611]/75 backdrop-blur-2xl min-h-[calc(100vh-4rem)] p-4"
      role="navigation"
      aria-label="Primary sidebar navigation"
    >
      <div className="flex flex-col justify-between h-full space-y-6">
        
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
            Stacks Intelligence
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && <Badge variant="indigo" size="sm">{item.badge}</Badge>}
              </button>
            );
          })}
        </div>

        {/* Security & AI Copilot Card */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          
          {/* Security Alert Badge */}
          {unspentApprovals > 0 && (
            <div 
              onClick={() => onTabChange('wallets')}
              className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-all group"
            >
              <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-1">
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Clarity Security</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                {unspentApprovals} unrevoked Clarity authorization{unspentApprovals === 1 ? '' : 's'} flagged.
              </p>
            </div>
          )}

          {/* AI Advisor Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-950/40 to-slate-900 border border-indigo-500/30 shadow-xl space-y-2.5">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>SpendChain AI Copilot</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
              PoX yield, sBTC peg security, & Clarity contract gas analysis.
            </p>
            <Button
              variant="gradient"
              size="sm"
              fullWidth
              onClick={() => onTabChange('ai-insights')}
            >
              Ask Stacks AI
            </Button>
          </div>

        </div>

      </div>
    </aside>
  );
};




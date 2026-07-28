import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  BarChart3, 
  Sparkles, 
  Settings, 
  ShieldAlert,
  ArrowUpRight,
  Bot
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
    { id: 'wallets', label: 'Stacks Wallets', icon: Wallet },
    { id: 'transactions', label: 'Clarity Ledger', icon: ReceiptText },
    { id: 'analytics', label: 'Protocol Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Wallet Copilot', icon: Bot, badge: 'Gemini' },
    { id: 'settings', label: 'Settings & RPC', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-white/10 bg-[#050816]/60 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4">
      <div className="flex flex-col justify-between h-full space-y-6">
        
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Stacks Analytics
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <Badge variant="blue" size="sm">{item.badge}</Badge>}
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
                  <ShieldAlert className="w-4 h-4" />
                  <span>Clarity Security</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                {unspentApprovals} unrevoked Clarity authorizations flagged.
              </p>
            </div>
          )}

          {/* AI Advisor Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 shadow-xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>SpendChain AI Copilot</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Analyze PoX yield, sBTC peg security, & Clarity contract gas.
            </p>
            <Button
              variant="primary"
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



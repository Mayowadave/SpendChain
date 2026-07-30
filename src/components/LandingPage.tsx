import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Bot, 
  Layers, 
  BarChart3, 
  FileCode2, 
  Search, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button, Card } from './ui';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenConnectModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onOpenConnectModal
}) => {
  return (
    <div className="min-h-screen bg-[#050816] text-gray-100 selection:bg-blue-500/30">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-gradient-to-b from-indigo-600/15 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-20">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          
          {/* Logo & Badge */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#050816] border border-white/10 shadow-2xl shadow-indigo-500/30 flex items-center justify-center p-1">
              <img 
                src="https://i.ibb.co/JR5K0m9x/1785179902166.png" 
                alt="SpendChain Logo" 
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Stacks & Bitcoin L2 Financial Intelligence</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Understand Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
              Stacks & Bitcoin L2 Finances
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto font-normal leading-relaxed">
            SpendChain auto-categorizes transactions, tracks STX and sBTC balances, audits Clarity smart contract gas fees, and delivers AI-driven financial insights.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="gradient"
              size="lg"
              onClick={onLaunchApp}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 py-3.5 text-sm"
            >
              Launch Workspace
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onOpenConnectModal}
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
              className="w-full sm:w-auto px-8 py-3.5 text-sm"
            >
              Connect Stacks Wallet
            </Button>
          </div>
        </section>


        {/* 3 CORE PILLARS */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              What SpendChain Does
            </h2>
            <p className="text-xs text-gray-400">
              Clear, automated accounting designed specifically for the Stacks ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" hoverEffect className="p-6 sm:p-7 space-y-3.5 group">
              <div className="p-3 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">On-Chain Asset Tracking</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Monitor live STX, sBTC, SIP-010 token holdings, and active PoX Stacking balances directly from the Stacks blockchain.
              </p>
            </Card>

            <Card variant="glass" hoverEffect className="p-6 sm:p-7 space-y-3.5 group">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Clarity Contract Auditing</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Automatically map smart contract calls to financial categories, verify post-conditions, and analyze gas fee consumption.
              </p>
            </Card>

            <Card variant="glass" hoverEffect className="p-6 sm:p-7 space-y-3.5 group">
              <div className="p-3 w-fit rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">AI Financial Copilot</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Get data-backed observations, ask questions about your cashflow history, and receive strategic recommendations via Gemini AI.
              </p>
            </Card>
          </div>
        </section>


        {/* HOW IT WORKS (3 SIMPLE STEPS) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-xs text-gray-400">
              Get started in seconds with zero setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Connect or Search Address',
                desc: 'Connect your Leather or Xverse wallet, or search any public Stacks mainnet address.',
                icon: Search
              },
              {
                step: '02',
                title: 'Automatic Sync',
                desc: 'SpendChain fetches real-time transactions, contract calls, and token balances via Hiro API.',
                icon: Layers
              },
              {
                step: '03',
                title: 'Instant Financial Insights',
                desc: 'View structured expense reports, cashflow analytics, and AI copilot recommendations.',
                icon: CheckCircle2
              }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">{item.step}</span>
                    <IconComponent className="w-4 h-4 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>


        {/* CALL TO ACTION BOX */}
        <Card variant="gradient" className="p-8 text-center space-y-4 max-w-3xl mx-auto border border-indigo-500/30">
          <h2 className="text-2xl font-bold text-white">
            Ready to inspect your Stacks wallet?
          </h2>
          <p className="text-xs text-gray-300 max-w-md mx-auto">
            Launch the workspace now or connect your wallet to start analyzing your on-chain finances.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onLaunchApp}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Workspace
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onOpenConnectModal}
            >
              Connect Wallet
            </Button>
          </div>
        </Card>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050816] py-8 text-xs text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img 
              src="https://i.ibb.co/JR5K0m9x/1785179902166.png" 
              alt="SpendChain" 
              className="w-5 h-5 object-contain rounded"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-white">SpendChain</span>
            <span>• Stacks & Bitcoin L2 Financial Analytics</span>
          </div>
          <div>
            Read-Only Web3 Security • Stacks Mainnet
          </div>
        </div>
      </footer>

    </div>
  );
};

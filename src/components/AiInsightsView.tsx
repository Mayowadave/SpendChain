import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  Flame, 
  Receipt, 
  ShieldAlert,
  ArrowRight,
  Coins
} from 'lucide-react';
import { Wallet, Transaction } from '../types';

interface AiInsightsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  wallets,
  transactions,
  initialPrompt
}) => {
  const totalStx = wallets.reduce((acc, w) => acc + w.balanceStx, 0);
  const totalSbtc = wallets.reduce((acc, w) => acc + w.balanceSbtc, 0);
  const totalStacked = wallets.reduce((acc, w) => acc + (w.stackingInfo?.stackedStx || 0), 0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: transactions.length === 0
        ? `### Welcome to SpendChain Stacks AI Copilot 🧡
I'm your dedicated Stacks & Bitcoin L2 financial analyst.

**Quick Executive Stacks Takeaways:**
- **On-Chain Transactions:** Not enough data
- **Wallet Balances:** Connected address holds **${totalStx.toLocaleString()} STX** and **${totalSbtc} sBTC**.
- **PoX Stacking:** ${totalStacked > 0 ? `Currently stacking **${totalStacked.toLocaleString()} STX**` : 'Not stacking STX.'}

Select an audit trigger below or ask any custom question about your Stacks wallet activity!`
        : `### Welcome to SpendChain Stacks AI Copilot 🧡
I'm your dedicated Stacks & Bitcoin L2 financial analyst. I have analyzed **${wallets.length} active Stacks wallet(s)** and **${transactions.length} recent transaction(s)**.

**Quick Executive Stacks Takeaways:**
- **Portfolio Holdings:** Your wallet holds **${totalStx.toLocaleString()} STX** and **${totalSbtc} sBTC**.
- **PoX Stacking Status:** ${totalStacked > 0 ? `Currently stacking **${totalStacked.toLocaleString()} STX**` : 'No active STX locking detected.'}
- **Transaction History:** Analyzed **${transactions.length}** Hiro API mainnet events.

Select a quick audit trigger below or ask any question!`,
      timestamp: 'Just now'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // If initialPrompt was passed from another view (e.g. Dashboard/Wallet view)
  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          wallets: wallets.map(w => ({ name: w.name, chain: w.chain, balanceUsd: w.balanceUsd, balanceStx: w.balanceStx, balanceSbtc: w.balanceSbtc, stackingYieldApy: w.stackingInfo?.estApyBtc, healthScore: w.healthScore })),
          transactions: transactions.map(t => ({ counterparty: t.counterpartyName, chain: t.chain, amountUsd: t.amountUsd, category: t.category, clarityFunction: t.clarityFunction, gasStx: t.gasFeeStx })),
          mode: 'Stacks Bitcoin L2 Financial Audit'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI analysis');
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `**AI Analysis Error:** ${err.message || 'Unable to communicate with server-side Gemini endpoint. Please verify GEMINI_API_KEY environment variable.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessageText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadReport = (text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `SpendChain_Stacks_AI_Report_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Server-Side Gemini 3.6 Flash Stacks Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SpendChain Stacks AI Copilot
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            PoX-4 stacking yield optimization, sBTC bridge peg auditing, Clarity smart contract analysis, and BNS tax reporting.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>Stacks Mainnet & Hiro Indexer Active</span>
        </div>
      </div>

      {/* QUICK PRE-BUILT PROMPT TRIGGERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            icon: Coins,
            title: 'PoX-4 Yield Optimization',
            prompt: 'Analyze my STX stacking allocation and recommend strategies to maximize yield on StackingDAO and PoX-4 cycles.',
            badge: '8.4% APY'
          },
          {
            icon: Flame,
            title: 'sBTC Bridge Peg Audit',
            prompt: 'Audit my sBTC peg-in and peg-out operations across Stacks L2 and Bitcoin L1 for reserve security and friction.',
            badge: 'sBTC Security'
          },
          {
            icon: ShieldAlert,
            title: 'Clarity Contract Safety',
            prompt: 'Review my recent Clarity contract-calls and post-condition verification tags for potential exploit risks.',
            badge: 'Clarity Audit'
          },
          {
            icon: Receipt,
            title: 'SIP-010 & Tax Ledger',
            prompt: 'Generate an executive Stacks tax statement categorizing STX rewards, DEX swaps on ALEX, and BNS domain expenses.',
            badge: 'Stacks Taxes'
          }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              onClick={() => handleSendPrompt(card.prompt)}
              disabled={isLoading}
              className="p-4 rounded-2xl glass-card border border-white/10 text-left hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                  {card.badge}
                </span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                {card.title}
              </div>
              <div className="text-[11px] text-gray-400 line-clamp-2 leading-snug">
                {card.prompt}
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN CHAT INTERFACE */}
      <div className="glass-panel rounded-3xl border border-white/10 bg-[#0B1220]/90 p-6 space-y-6 shadow-2xl flex flex-col justify-between min-h-[500px]">
        
        {/* Messages Feed */}
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div 
                className={`p-4 rounded-2xl max-w-3xl border space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/10 rounded-tr-none'
                    : 'bg-slate-900/90 text-gray-200 border-white/10 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.text}
                </div>

                {msg.sender === 'ai' && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="font-mono">{msg.timestamp}</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => copyMessageText(msg.id, msg.text)}
                        className="hover:text-white flex items-center space-x-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => downloadReport(msg.text)}
                        className="hover:text-white flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3 text-indigo-400" />
                        <span>Export Report</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-gray-300 shrink-0 font-bold font-mono">
                  YOU
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-indigo-400 p-4 rounded-2xl bg-slate-900/60 border border-white/5 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>SpendChain Stacks AI Copilot analyzing Clarity transactions & PoX-4 parameters...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="pt-4 border-t border-white/10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputPrompt);
            }} 
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about STX balances, sBTC bridge, PoX yield, or Clarity contracts..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 flex items-center space-x-2"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};


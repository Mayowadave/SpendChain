import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Coins,
  Trash2,
  TrendingUp,
  Zap,
  PieChart,
  HelpCircle,
  FileCode2,
  Clock,
  Layers
} from 'lucide-react';
import { Wallet, Transaction } from '../types';
import { useWalletAnalytics } from '../hooks/useWalletAnalytics';
import { WalletAnalytics } from '../services/analyticsEngine';
import { Badge, Button } from './ui';

interface AiInsightsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  initialPrompt?: string;
  onNavigateTab?: (tab: string) => void;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  widget?: 'largest_tx' | 'money_breakdown' | 'stx_spend' | 'top_protocol' | 'wallet_explain';
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  wallets,
  transactions,
  initialPrompt,
  onNavigateTab
}) => {
  // Compute live wallet analytics and locate largest transaction
  const primaryWalletAddress = wallets[0]?.address;
  const analytics: WalletAnalytics = useWalletAnalytics(transactions, primaryWalletAddress);

  const largestTx = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;
    return [...transactions].sort((a, b) => (b.amountUsd || 0) - (a.amountUsd || 0))[0];
  }, [transactions]);

  const totalStx = wallets.reduce((acc, w) => acc + w.balanceStx, 0);
  const totalSbtc = wallets.reduce((acc, w) => acc + w.balanceSbtc, 0);
  const totalStacked = wallets.reduce((acc, w) => acc + (w.stackingInfo?.stackedStx || 0), 0);

  const initialWelcomeMsg: ChatMessage = {
    id: 'welcome',
    sender: 'ai',
    text: `### Hello! I am your Stacks AI Conversational Assistant 🧡
I have full access to your pre-calculated **Wallet Analytics** and Stacks L2 transaction history.

**Quick Wallet Overview:**
• **Holdings:** **${totalStx.toLocaleString()} STX** and **${totalSbtc} sBTC** across **${wallets.length} active wallet(s)**.
• **Activity:** **${analytics.txCount} transactions** analyzed spanning **${analytics.walletAgeDays} days**.
• **PoX-4 Stacking:** ${totalStacked > 0 ? `Locking **${totalStacked.toLocaleString()} STX** for BTC yield` : 'No active STX locking detected'}.

Ask me any question in natural language or pick one of the quick queries below!`,
    timestamp: 'Just now'
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMsg]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle prompt passed from initial state / external tabs
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // Fallback intelligent answer builder using pre-calculated analytics
  const buildLocalAnalyticsResponse = (prompt: string): { text: string; widget?: ChatMessage['widget'] } => {
    const p = prompt.toLowerCase();

    // 1. "How much STX did I spend?"
    if (p.includes('how much stx') || p.includes('stx did i spend') || p.includes('stx spent')) {
      const stxSent = analytics.totalSentCrypto['STX'] || 0;
      const gasStx = analytics.gasFeesPaidStx || 0;
      const totalStxSpent = stxSent + gasStx;
      const usdValue = analytics.totalSentUsd + analytics.gasFeesPaidUsd;

      return {
        text: `### 💰 STX Outflow & Gas Summary

You have spent a total of **${totalStxSpent.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} STX** (approx. **$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD**).

**Breakdown of STX Outflow:**
• **Direct Transfers & Protocol Spending:** **${stxSent.toLocaleString()} STX** ($${analytics.totalSentUsd.toLocaleString()} USD)
• **Clarity Contract Gas Fees:** **${gasStx.toFixed(2)} STX** ($${analytics.gasFeesPaidUsd.toFixed(2)} USD)
• **Transaction Count:** **${analytics.txCount} mainnet transactions**
• **Average Transaction Size:** **$${analytics.avgTxSizeUsd.toFixed(2)} USD**

*Tip: Your gas consumption represents only ${((gasStx / Math.max(1, totalStxSpent)) * 100).toFixed(1)}% of total STX outflow, demonstrating high execution efficiency on Stacks L2.*`,
        widget: 'stx_spend'
      };
    }

    // 2. "Which protocol do I use most?"
    if (p.includes('protocol do i use most') || p.includes('which protocol') || p.includes('most used protocol') || p.includes('top protocol')) {
      const proto = analytics.mostInteractedProtocol;
      const topContract = analytics.mostUsedContracts[0];

      return {
        text: `### ⚡ Most Used Protocol Analysis

Your most frequented protocol is **${proto.protocolName}**!

**Protocol Engagement Metrics:**
• **Primary Protocol:** **${proto.protocolName}**
• **Interaction Count:** **${proto.txCount} transactions** (${proto.percentageOfTotal}% of your total activity)
• **Volume Transacted:** **$${proto.volumeUsd.toLocaleString()} USD**
• **Top Contract Interacted:** \`${topContract ? topContract.contractName : 'ALEX DEX Router'}\` (**${topContract ? topContract.callCount : proto.txCount} calls**)

*Insights: You concentrate ${proto.percentageOfTotal}% of your smart contract executions on ${proto.protocolName}, making it your primary Stacks L2 DeFi hub.*`,
        widget: 'top_protocol'
      };
    }

    // 3. "Show my largest transaction."
    if (p.includes('largest transaction') || p.includes('biggest transaction') || p.includes('show my largest')) {
      if (!largestTx) {
        return {
          text: `You currently have no recorded transactions in your active ledger. Connect a wallet with mainnet history to view your largest transaction!`
        };
      }

      return {
        text: `### 🚀 Your Largest Single Transaction

Your largest recorded transaction was a **${largestTx.category}** operation amounting to **$${largestTx.amountUsd.toLocaleString()} USD** (${largestTx.amountCrypto.toLocaleString()} ${largestTx.tokenSymbol}).

**Transaction Details:**
• **Amount:** **${largestTx.amountCrypto.toLocaleString()} ${largestTx.tokenSymbol}** ($${largestTx.amountUsd.toLocaleString()} USD)
• **Category:** **${largestTx.category}**
• **Counterparty / Target:** **${largestTx.counterpartyName}** (\`${largestTx.counterpartyAddress.substring(0, 10)}...\`)
• **Clarity Function:** \`${largestTx.clarityFunction || 'contract-call'}\`
• **Execution Date:** **${largestTx.timestamp}**
• **Gas Paid:** **${largestTx.gasFeeStx} STX**
• **Transaction Hash:** \`${largestTx.hash.substring(0, 16)}...\``,
        widget: 'largest_tx'
      };
    }

    // 4. "Where did my money go?"
    if (p.includes('where did my money go') || p.includes('money go') || p.includes('spending breakdown') || p.includes('where spent')) {
      const breakdownText = analytics.categoryBreakdown.map(c => 
        `• **${c.category}:** **$${c.amountUsd.toLocaleString()} USD** (${c.percentage}% of total, ${c.txCount} txs)`
      ).join('\n');

      return {
        text: `### 📊 Capital Outflow & Category Allocation

Here is the exact destination breakdown of your wallet's capital outflow:

**Category Breakdown:**
${breakdownText || '• **Transfers & DeFi:** 100% of activity'}

**Summary Takeaways:**
• **Total Capital Outflow:** **$${analytics.totalSentUsd.toLocaleString()} USD**
• **Top Recipient / Protocol:** **${analytics.mostInteractedProtocol.protocolName}** ($${analytics.mostInteractedProtocol.volumeUsd.toLocaleString()} USD)
• **Gas Paid:** **${analytics.gasFeesPaidStx.toFixed(2)} STX** ($${analytics.gasFeesPaidUsd.toFixed(2)} USD)`,
        widget: 'money_breakdown'
      };
    }

    // 5. "Explain this wallet."
    if (p.includes('explain this wallet') || p.includes('explain my wallet') || p.includes('wallet summary') || p.includes('overview')) {
      const topCategory = analytics.categoryBreakdown[0]?.category || 'DeFi & Swaps';

      return {
        text: `### 🔍 Executive Wallet Diagnosis

**1. Activity Profile & Longevity:**
• **Wallet Age:** **${analytics.walletAgeDays} days** old (first active on ${analytics.firstTxDate || 'N/A'})
• **Total Volume:** **$${(analytics.totalSentUsd + analytics.totalReceivedUsd).toLocaleString()} USD** transacted across **${analytics.txCount} operations**
• **Average Transaction Size:** **$${analytics.avgTxSizeUsd.toFixed(2)} USD**

**2. Key Protocol Hubs & Holdings:**
• **Dominant Category:** **${topCategory}**
• **Favorite Protocol:** **${analytics.mostInteractedProtocol.protocolName}** (${analytics.mostInteractedProtocol.percentageOfTotal}% share)
• **Asset Portfolio:** **${totalStx.toLocaleString()} STX** & **${totalSbtc} sBTC** held

**3. Efficiency & Health:**
• **Network Efficiency:** Paid **${analytics.gasFeesPaidStx.toFixed(2)} STX** in gas fees (${analytics.txCount > 0 ? (analytics.gasFeesPaidStx / analytics.txCount).toFixed(3) : '0.00'} STX/tx)
• **PoX Stacking:** ${totalStacked > 0 ? `Currently locking **${totalStacked.toLocaleString()} STX** for native BTC yield` : 'Eligible for PoX-4 stacking yield'}`,
        widget: 'wallet_explain'
      };
    }

    // Default conversational fallback based on analytics context
    return {
      text: `### 💡 Wallet Analysis Insight

Based on your calculated **Wallet Analytics** (${analytics.txCount} transactions analyzed over ${analytics.walletAgeDays} days):

• **Total Sent:** **$${analytics.totalSentUsd.toLocaleString()} USD** (${analytics.totalSentCrypto['STX'] || 0} STX)
• **Most Frequented Protocol:** **${analytics.mostInteractedProtocol.protocolName}** (${analytics.mostInteractedProtocol.percentageOfTotal}% of total txs)
• **Gas Efficiency:** Paid **${analytics.gasFeesPaidStx.toFixed(2)} STX** in Clarity contract execution fees
• **Primary Category:** **${analytics.categoryBreakdown[0]?.category || 'DeFi'}**

How else can I assist you with your Stacks financial records?`
    };
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Call server AI endpoint with full conversation history and pre-calculated analytics
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          analytics: analytics,
          largestTx: largestTx,
          wallets: wallets.map(w => ({ 
            name: w.name, 
            chain: w.chain, 
            balanceUsd: w.balanceUsd, 
            balanceStx: w.balanceStx, 
            balanceSbtc: w.balanceSbtc, 
            healthScore: w.healthScore 
          })),
          transactions: transactions.slice(0, 15).map(t => ({
            counterparty: t.counterpartyName,
            amountUsd: t.amountUsd,
            tokenSymbol: t.tokenSymbol,
            amountCrypto: t.amountCrypto,
            category: t.category,
            clarityFunction: t.clarityFunction,
            gasFeeStx: t.gasFeeStx,
            date: t.timestamp
          })),
          mode: 'Conversational Stacks Wallet Analytics Assistant'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI endpoint returned error');
      }

      const localHint = buildLocalAnalyticsResponse(promptText);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || localHint.text,
        widget: localHint.widget,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('Using deterministic local analytics assistant fallback:', err.message);
      // Fallback seamlessly using analytics engine
      const localResp = buildLocalAnalyticsResponse(promptText);

      const aiMsg: ChatMessage = {
        id: `ai-local-${Date.now()}`,
        sender: 'ai',
        text: localResp.text,
        widget: localResp.widget,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([initialWelcomeMsg]);
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
    element.download = `SpendChain_AI_Copilot_Chat_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Quick prompt chips
  const suggestedQuestions = [
    { label: '💰 How much STX did I spend?', prompt: 'How much STX did I spend?' },
    { label: '⚡ Which protocol do I use most?', prompt: 'Which protocol do I use most?' },
    { label: '🚀 Show my largest transaction.', prompt: 'Show my largest transaction.' },
    { label: '🔍 Explain this wallet.', prompt: 'Explain this wallet.' },
    { label: '📊 Where did my money go?', prompt: 'Where did my money go?' },
    { label: '🛡️ Check my security health', prompt: 'Give me a security and contract safety review of my wallet.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Conversational Assistant • Live Wallet Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>AI Copilot</span>
            <Badge variant="indigo" size="md">Multi-Turn Session</Badge>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            Ask anything about your Stacks L2 spending, protocol habits, largest transactions, or capital destinations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-white"
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            onClick={handleClearHistory}
          >
            Clear Session
          </Button>

          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Analytics Connected</span>
          </div>
        </div>
      </div>

      {/* SUGGESTED CONVERSATIONAL PROMPT CHIPS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold text-gray-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Questions:</span>
          </span>
          <span className="text-[11px] font-mono text-indigo-400">Click to ask instantly</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(q.prompt)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 text-xs text-gray-200 hover:text-white font-medium transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT INTERFACE WINDOW */}
      <div className="rounded-3xl border border-white/10 bg-[#0B1220]/95 p-4 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="space-y-6 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* AI Avatar */}
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div 
                className={`p-4 sm:p-5 rounded-2xl max-w-2xl border space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/10 rounded-tr-none'
                    : 'bg-slate-900/95 text-gray-200 border-white/10 rounded-tl-none shadow-xl'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                  {msg.text}
                </div>

                {/* Optional Embedded Visual Stat Card Widgets for AI Messages */}
                {msg.sender === 'ai' && msg.widget === 'largest_tx' && largestTx && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300 font-bold">
                      <span>🚀 Transaction Highlight Card</span>
                      <span className="text-emerald-400">${largestTx.amountUsd.toLocaleString()} USD</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-white/5">
                        <span className="text-gray-400 block">Crypto Volume</span>
                        <span className="font-bold text-white">{largestTx.amountCrypto.toLocaleString()} {largestTx.tokenSymbol}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <span className="text-gray-400 block">Target Protocol</span>
                        <span className="font-bold text-amber-300">{largestTx.counterpartyName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {msg.sender === 'ai' && msg.widget === 'stx_spend' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 font-bold">
                      <span>💰 Total Outflow Metric</span>
                      <span className="text-amber-400">{(analytics.totalSentCrypto['STX'] || 0) + analytics.gasFeesPaidStx} STX</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full w-full" />
                    </div>
                  </div>
                )}

                {msg.sender === 'ai' && msg.widget === 'top_protocol' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
                      <span>⚡ Favorite Protocol</span>
                      <span className="text-purple-400">{analytics.mostInteractedProtocol.protocolName} ({analytics.mostInteractedProtocol.percentageOfTotal}%)</span>
                    </div>
                  </div>
                )}

                {/* Footer Controls for AI Message */}
                {msg.sender === 'ai' && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>{msg.timestamp}</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => copyMessageText(msg.id, msg.text)}
                        className="hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => downloadReport(msg.text)}
                        className="hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-indigo-400" />
                        <span>Export Markdown</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-gray-300 shrink-0 font-bold font-mono text-xs">
                  YOU
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-indigo-400 p-4 rounded-2xl bg-slate-900/80 border border-white/5 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>SpendChain Stacks AI Copilot analyzing wallet metrics & conversation context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Controls */}
        <div className="pt-4 border-t border-white/10 mt-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputPrompt);
            }} 
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'How much STX did I spend?' or 'Where did my money go?')..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 text-white text-xs sm:text-sm font-bold hover:opacity-95 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20 flex items-center space-x-2 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import Markdown from 'react-markdown';
import { queryEcosystemAiCopilot } from '../../services/stacksEcosystemService';

interface Props {
  initialPrompt?: string;
}

export const EcosystemAiCopilot: React.FC<Props> = ({ initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([
    {
      sender: 'ai',
      text: `Hello! I am your **Stacks Ecosystem AI Copilot**. You can ask me anything about protocol growth, sBTC liquidity, DEX volumes, verified Clarity smart contracts, or trending NFT collections across the Bitcoin L2 network.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "What is trending today?",
    "Which protocol grew the most?",
    "What changed this week?",
    "Show me ecosystem activity.",
    "What are the newest projects?"
  ];

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || prompt;
    if (!messageText.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    const conversationHistory = messages.map(m => ({ sender: m.sender, text: m.text }));
    const aiResponseText = await queryEcosystemAiCopilot(messageText, conversationHistory);

    const aiMsg = {
      sender: 'ai' as const,
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Ecosystem AI Copilot</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                Gemini Intelligence
              </span>
            </h2>
            <p className="text-xs text-gray-400">Contextual AI reasoning trained on real-time Stacks L2 metrics</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Suggested Queries</div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-950/50 text-indigo-200 hover:text-white border border-purple-500/20 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="space-y-4 max-h-[480px] overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-white/10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-1 ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                : 'bg-slate-900 border border-white/10 text-gray-200 rounded-tl-none'
            }`}>
              {msg.sender === 'ai' ? (
                <div className="markdown-body text-gray-200 space-y-2">
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
              <div className={`text-[10px] font-mono ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'} text-right`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-purple-300 font-mono p-3 bg-purple-950/30 rounded-2xl border border-purple-500/20">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            <span>Analyzing Stacks on-chain telemetry and protocol metrics...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Copilot about Stacks protocols, sBTC, or Clarity contracts..."
          className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-purple-500/30 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 top-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

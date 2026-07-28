import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Bot,
  Zap,
  Coins,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Wallet, Transaction, SpendCategoryBreakdown } from '../types';
import { SPEND_TIMELINE, SUPPORTED_CHAINS, STX_PRICE_USD, BTC_PRICE_USD } from '../data/mockData';
import { StatCard, Button, Badge, Card } from './ui';
import { useWalletAnalytics, useAiInsights } from '../hooks/useWalletAnalytics';
import { AiInsightCardsSection } from './AiInsightCardsSection';

interface DashboardViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  categoryBreakdown: SpendCategoryBreakdown[];
  onNavigateTab: (tab: string) => void;
  onOpenTxDetail: (tx: Transaction) => void;
  onTriggerAi: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wallets,
  transactions,
  categoryBreakdown,
  onNavigateTab,
  onOpenTxDetail,
  onTriggerAi
}) => {
  const [timelinePeriod, setTimelinePeriod] = useState<'30D' | '90D' | 'YTD'>('30D');

  // Aggregated totals for Stacks & Bitcoin L2
  const totalBalanceUsd = wallets.reduce((acc, w) => acc + w.balanceUsd, 0);
  const totalStx = wallets.reduce((acc, w) => acc + w.balanceStx, 0);
  const totalSbtc = wallets.reduce((acc, w) => acc + w.balanceSbtc, 0);
  const totalSpent30d = wallets.reduce((acc, w) => acc + w.totalSpent30d, 0);
  const totalGasSpentStx = wallets.reduce((acc, w) => acc + w.gasSpent30dStx, 0);
  const totalStackedStx = wallets.reduce((acc, w) => acc + (w.stackingInfo?.stackedStx || 0), 0);
  
  const totalIncome30d = transactions
    .filter(t => t.type === 'inflow' || t.type === 'stacking_reward')
    .reduce((acc, t) => acc + t.amountUsd, 0);

  const avgHealthScore = Math.round(wallets.reduce((acc, w) => acc + w.healthScore, 0) / (wallets.length || 1));

  // Compute live wallet analytics and structured AI insight cards
  const analytics = useWalletAnalytics(transactions, wallets[0]?.address);
  const insights = useAiInsights(analytics);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <Badge variant="emerald" dot>Nakamoto Fast Blocks Active</Badge>
            <span className="text-gray-400">Stacks & Bitcoin L2 Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Stacks Financial Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time tracking across {wallets.length} Stacks wallets, sBTC peg-in reserves, PoX-4 stacking yield, & Clarity contracts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="gradient"
            size="md"
            leftIcon={<Bot className="w-4 h-4 text-amber-400" />}
            onClick={() => onTriggerAi('Generate a complete executive financial audit for my Stacks wallets, sBTC holdings, and PoX stacking yield')}
          >
            Stacks AI Copilot
          </Button>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Portfolio Value */}
        <StatCard
          title="Total Stacks Asset Value"
          value={`$${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-4 h-4" />}
          iconBg="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          trend={{ type: 'up', text: `${totalStx.toLocaleString()} STX + ${totalSbtc.toFixed(2)} sBTC` }}
        />

        {/* Total Net Outflow (30D) */}
        <StatCard
          title="30D Outflow & Swaps"
          value={`$${totalSpent30d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingDown className="w-4 h-4" />}
          iconBg="bg-blue-500/10 text-blue-400 border-blue-500/20"
          subtext="ALEX, Velar & Zest activity"
        />

        {/* PoX Stacking Yield */}
        <StatCard
          title="Stacked STX & Yield"
          value={`${totalStackedStx.toLocaleString()} STX`}
          icon={<Coins className="w-4 h-4" />}
          iconBg="bg-amber-500/10 text-amber-400 border-amber-500/20"
          subtext="Cycle #88 • ~8.4% APY (BTC)"
        />

        {/* Gas Micro-Fees */}
        <StatCard
          title="30D Gas Micro-Fees"
          value={`${totalGasSpentStx.toFixed(1)} STX`}
          icon={<Flame className="w-4 h-4" />}
          iconBg="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          subtext={`Clarity Health: ${avgHealthScore}/100`}
        />

      </div>

      {/* AI ON-CHAIN INSIGHTS CARDS */}
      <AiInsightCardsSection 
        insights={insights} 
        onTriggerAi={onTriggerAi} 
      />

      {/* QUICK STACKS ECOSYSTEM BANNER */}
      <Card variant="gradient" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center space-x-2">
              <span>SpendChain Stacks Intelligence</span>
              <Badge variant="teal" size="sm">sBTC Peg & PoX Stacking</Badge>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
              {totalStackedStx > 0 ? (
                <>You have <strong className="text-amber-400 font-mono">{totalStackedStx.toLocaleString()} STX</strong> locked in PoX Stacking.</>
              ) : (
                <>No active STX locked in PoX stacking detected for connected wallet.</>
              )}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onTriggerAi('Evaluate my StackingDAO liquid stacking rewards versus solo PoX-4 stacking and sBTC yield farming opportunities.')}
        >
          Analyze Yield APY
        </Button>
      </Card>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Timeline Area Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Stacks Daily Activity & Volume</h3>
              <p className="text-xs text-gray-400">Daily transaction volume calculated from Hiro API</p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
              {(['30D', '90D', 'YTD'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTimelinePeriod(p)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    timelinePeriod === p ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {analytics.dailyActivity.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium text-sm">
                Not enough data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyActivity.map(d => ({ date: d.dayLabel, Volume: d.volumeUsd, Txs: d.txCount }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5546FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#5546FF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`$${val.toLocaleString()}`, 'Volume USD']}
                  />
                  <Area type="monotone" dataKey="Volume" stroke="#5546FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpent)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown Donut Chart (1 Col) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Stacks Category Breakdown</h3>
              <button onClick={() => onNavigateTab('analytics')} className="text-xs text-indigo-400 hover:underline">
                Full Analytics
              </button>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-0.5">SIP-010, sBTC & Clarity execution</p>

            <div className="h-48 w-full my-2">
              {analytics.categoryBreakdown.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium text-sm">
                  Not enough data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="amountUsd"
                    >
                      {analytics.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            {analytics.categoryBreakdown.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-300 font-medium truncate">{cat.category}</span>
                </div>
                <div className="font-mono text-white font-bold">${cat.amountUsd.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT STACKS CLARITY TRANSACTIONS LEDGER */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Clarity Smart Contract Executions</h3>
            <p className="text-xs text-gray-400">Searchable Stacks mainnet & Nakamoto fast block transactions</p>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center space-x-1"
          >
            <span>Open Clarity Ledger</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] font-semibold tracking-wider rounded-xl">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Clarity Call / Contract</th>
                <th className="px-4 py-3">Network & Method</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Post-Conditions</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Gas (STX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 font-medium text-sm">
                    Not enough data
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => onOpenTxDetail(tx)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white text-sm">{tx.counterpartyName}</div>
                      <div className="font-mono text-[11px] text-gray-500 truncate max-w-[200px]">{tx.hash}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                            {tx.chain === 'stacks-mainnet' ? 'MAINNET' : tx.chain === 'stacks-nakamoto' ? 'NAKAMOTO' : 'BITCOIN L1'}
                          </span>
                        </div>
                        {tx.clarityFunction && (
                          <span className="text-[11px] font-mono text-amber-400/90 truncate max-w-[160px]">
                            {tx.clarityFunction}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-200">
                      {tx.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-teal-300 rounded-md border border-white/10 font-mono">
                        {tx.postConditionsCount !== undefined ? `${tx.postConditionsCount} Verified` : 'Standard Transfer'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-sm text-white">
                      {tx.amountCrypto.toLocaleString()} {tx.tokenSymbol}
                      <div className="text-[10px] text-gray-400 font-normal">${tx.amountUsd.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-gray-400">
                      {tx.gasFeeStx ? `${tx.gasFeeStx} STX` : '0 STX'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};


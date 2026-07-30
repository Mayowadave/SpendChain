import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Activity, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Calendar,
  FileCode2,
  DollarSign,
  PieChart as PieIcon,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Transaction } from '../types';
import { useWalletAnalytics, useAiInsights } from '../hooks/useWalletAnalytics';
import { Button, Card, Badge } from './ui';
import { AiInsightCardsSection } from './AiInsightCardsSection';

interface AnalyticsViewProps {
  transactions: Transaction[];
  activeAddress?: string;
  onTriggerAi: (prompt: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  transactions, 
  activeAddress,
  onTriggerAi 
}) => {
  const analytics = useWalletAnalytics(transactions, activeAddress);
  const insights = useAiInsights(analytics);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Hiro API • Live Blockchain Wallet Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Wallet Analytics & On-Chain Engine
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Quantitative analysis calculated from {analytics.txCount} transactions for target <span className="font-mono text-indigo-300">{activeAddress || 'Wallet'}</span>.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
          onClick={() => onTriggerAi('Analyze my wallet analytics engine results, including total sent, received, gas fees, and top protocol interactions.')}
        >
          Generate AI Analytics Audit
        </Button>
      </div>

      {/* TOP METRICS GRID - 8 KEY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Sent */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Total Sent</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            ${analytics.totalSentUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-400 flex flex-wrap gap-1 pt-1 border-t border-white/5">
            {Object.entries(analytics.totalSentCrypto).map(([token, amt]) => (
              <span key={token} className="bg-slate-900 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                {amt.toFixed(2)} {token}
              </span>
            ))}
            {Object.keys(analytics.totalSentCrypto).length === 0 && <span>No outflows recorded</span>}
          </div>
        </Card>

        {/* 2. Total Received */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Total Received</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            ${analytics.totalReceivedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-400 flex flex-wrap gap-1 pt-1 border-t border-white/5">
            {Object.entries(analytics.totalReceivedCrypto).map(([token, amt]) => (
              <span key={token} className="bg-slate-900 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                {amt.toFixed(2)} {token}
              </span>
            ))}
            {Object.keys(analytics.totalReceivedCrypto).length === 0 && <span>No inflows recorded</span>}
          </div>
        </Card>

        {/* 3. Net Balance / Net Flow */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Net On-Chain Flow</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-black font-mono ${analytics.netBalanceUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {analytics.netBalanceUsd >= 0 ? '+' : ''}${analytics.netBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 flex items-center justify-between">
            <span>Inflows minus Outflows & Gas</span>
          </div>
        </Card>

        {/* 4. Wallet Age */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Wallet Age</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {analytics.walletAgeDays} <span className="text-sm font-normal text-gray-400">Days</span>
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 truncate">
            {analytics.firstTxDate ? `Active since ${new Date(analytics.firstTxDate).toLocaleDateString()}` : 'No transaction history'}
          </div>
        </Card>

        {/* 5. Transactions Count & Avg Size */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Tx Count & Avg Size</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {analytics.txCount} <span className="text-xs text-gray-400 font-normal">Txs</span>
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 flex items-center justify-between font-mono">
            <span>Avg Size:</span>
            <span className="text-white font-bold">${analytics.avgTxSizeUsd.toLocaleString()}</span>
          </div>
        </Card>

        {/* 6. Gas Fees Paid */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Gas Fees Paid</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
            {analytics.gasFeesPaidStx} <span className="text-xs font-normal text-amber-400/80">STX</span>
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 flex items-center justify-between font-mono">
            <span>USD Value:</span>
            <span className="text-white font-bold">${analytics.gasFeesPaidUsd.toFixed(2)}</span>
          </div>
        </Card>

        {/* 7. Most Active Day */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Most Active Day</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            {analytics.mostActiveDay.dayOfWeek}
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 flex items-center justify-between font-mono">
            <span>Peak Count:</span>
            <span className="text-teal-300 font-bold">{analytics.mostActiveDay.txCount} Txs</span>
          </div>
        </Card>

        {/* 8. Most Interacted Protocol */}
        <Card variant="panel" className="p-4 space-y-2 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium">Top Protocol</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-white truncate">
            {analytics.mostInteractedProtocol.protocolName}
          </div>
          <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5 flex items-center justify-between font-mono">
            <span>{analytics.mostInteractedProtocol.txCount} Calls</span>
            <span className="text-blue-300 font-bold">{analytics.mostInteractedProtocol.percentageOfTotal}% share</span>
          </div>
        </Card>

      </div>

      {/* AI OBSERVATIONS & INSIGHT CARDS */}
      <AiInsightCardsSection 
        insights={insights} 
        onTriggerAi={onTriggerAi} 
      />

      {/* CHARTS SECTION 1: MONTHLY SPENDING & DAILY ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Spending & Inflow Chart */}
        <Card variant="panel" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Monthly Spending & Income Flow</span>
              </h3>
              <p className="text-xs text-gray-400">Monthly breakdown of inflows vs outflows in USD</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            {analytics.monthlySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="monthLabel" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-1">
                            <p className="font-bold text-white">{label}</p>
                            {payload.map((p: any, idx: number) => (
                              <p key={idx} className="font-mono font-semibold" style={{ color: p.color }}>
                                {p.name}: ${Number(p.value).toLocaleString()}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="totalSpentUsd" name="Outflows USD" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalReceivedUsd" name="Inflows USD" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-medium text-gray-400">
                Not enough data
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 pt-2 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span>Outflows (USD)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>Inflows (USD)</span>
            </div>
          </div>
        </Card>

        {/* Daily Activity Volume Area Chart */}
        <Card variant="panel" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Daily Activity & Volume Trend</span>
              </h3>
              <p className="text-xs text-gray-400">Daily transaction counts and USD volume</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            {analytics.dailyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="dayLabel" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-md text-xs space-y-1">
                            <p className="font-bold text-white">{label}</p>
                            <p className="text-indigo-400 font-mono font-semibold">
                              Volume: ${Number(payload[0].value).toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="volumeUsd" stroke="#6366F1" fillOpacity={1} fill="url(#colorVol)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-medium text-gray-400">
                Not enough data
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5 font-mono">
            <span>Total On-Chain Days: <strong className="text-white">{analytics.dailyActivity.length}</strong></span>
            <span>Peak Activity: <strong className="text-emerald-400">{analytics.mostActiveDay.txCount} txs</strong></span>
          </div>
        </Card>

      </div>

      {/* CHARTS SECTION 2: MOST USED CONTRACTS & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Used Smart Contracts */}
        <Card variant="panel" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-purple-400" />
                <span>Most Used Clarity Contracts</span>
              </h3>
              <p className="text-xs text-gray-400">Top smart contracts called on Stacks mainnet</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.mostUsedContracts.length > 0 ? (
              analytics.mostUsedContracts.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white truncate">{c.contractName}</span>
                      <Badge variant="blue" size="sm">{c.category}</Badge>
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 truncate">
                      {c.contractAddress}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono font-bold text-indigo-300">
                      {c.callCount} calls
                    </div>
                    <div className="text-[10px] font-mono text-gray-400">
                      ${c.totalVolumeUsd.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm font-medium text-gray-400">
                Not enough data
              </div>
            )}
          </div>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card variant="panel" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <PieIcon className="w-4 h-4 text-amber-400" />
                <span>Category Distribution</span>
              </h3>
              <p className="text-xs text-gray-400">Transaction volume split by Clarity domain</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="h-48 w-48 flex-shrink-0">
              {analytics.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="amountUsd"
                    >
                      {analytics.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Volume']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm font-medium text-gray-400">
                  Not enough data
                </div>
              )}
            </div>

            <div className="space-y-2 w-full text-xs">
              {analytics.categoryBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-300 font-medium truncate">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-3 font-mono flex-shrink-0">
                    <span className="text-white font-bold">${item.amountUsd.toLocaleString()}</span>
                    <span className="text-gray-400 text-[10px] w-10 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};

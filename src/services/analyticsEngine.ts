import { Transaction, TransactionCategory } from '../types';

export interface MostUsedContract {
  contractAddress: string;
  contractName: string;
  callCount: number;
  totalVolumeUsd: number;
  category: TransactionCategory;
}

export interface MostInteractedProtocol {
  protocolName: string;
  txCount: number;
  volumeUsd: number;
  percentageOfTotal: number;
}

export interface MostActiveDay {
  dayOfWeek: string;
  date: string;
  txCount: number;
  volumeUsd: number;
}

export interface MonthlySpendItem {
  month: string; // "YYYY-MM"
  monthLabel: string; // "Jul 2026"
  totalSpentUsd: number;
  totalReceivedUsd: number;
  netUsd: number;
  txCount: number;
  gasUsd: number;
}

export interface DailyActivityItem {
  date: string; // "YYYY-MM-DD"
  dayLabel: string; // "Jul 27"
  txCount: number;
  volumeUsd: number;
  sentUsd: number;
  receivedUsd: number;
  gasUsd: number;
}

export interface CategoryBreakdownItem {
  category: TransactionCategory;
  amountUsd: number;
  percentage: number;
  txCount: number;
  color: string;
}

export interface AiInsightCard {
  id: string;
  title: string;
  observation: string;
  highlightValue?: string;
  badgeText?: string;
  category: 'spending' | 'activity' | 'contracts' | 'protocols' | 'gas' | 'flow' | 'age';
  icon: 'PieChart' | 'Calendar' | 'FileCode2' | 'Layers' | 'Flame' | 'DollarSign' | 'Clock' | 'TrendingUp';
  accentColor: string;
}

export interface WalletAnalytics {
  // Core metrics requested
  totalSentUsd: number;
  totalSentCrypto: Record<string, number>;
  totalReceivedUsd: number;
  totalReceivedCrypto: Record<string, number>;
  netBalanceUsd: number;
  walletAgeDays: number;
  firstTxDate: string | null;
  lastTxDate: string | null;
  txCount: number;
  avgTxSizeUsd: number;
  gasFeesPaidStx: number;
  gasFeesPaidUsd: number;
  mostActiveDay: MostActiveDay;
  mostUsedContracts: MostUsedContract[];
  mostInteractedProtocol: MostInteractedProtocol;
  monthlySpending: MonthlySpendItem[];
  dailyActivity: DailyActivityItem[];

  // Helper chart objects
  categoryBreakdown: CategoryBreakdownItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'PoX & Stacking Yield': '#10B981', // emerald
  'sBTC & Bitcoin Bridge': '#F59E0B', // amber
  'DeFi & Swaps': '#8B5CF6', // purple
  'Clarity Contract Exec': '#6366F1', // indigo
  'SIP-010 Tokens': '#3B82F6', // blue
  'SIP-009 NFTs & BNS': '#EC4899', // pink
  'Infrastructure & SaaS': '#64748B', // slate
  'Treasury & Transfers': '#14B8A6', // teal
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Main Analytics Engine function
 * Takes an array of wallet transactions and computes complete quantitative analytics.
 */
export function calculateWalletAnalytics(transactions: Transaction[], walletAddress?: string): WalletAnalytics {
  if (!transactions || transactions.length === 0) {
    return {
      totalSentUsd: 0,
      totalSentCrypto: {},
      totalReceivedUsd: 0,
      totalReceivedCrypto: {},
      netBalanceUsd: 0,
      walletAgeDays: 0,
      firstTxDate: null,
      lastTxDate: null,
      txCount: 0,
      avgTxSizeUsd: 0,
      gasFeesPaidStx: 0,
      gasFeesPaidUsd: 0,
      mostActiveDay: { dayOfWeek: 'N/A', date: 'N/A', txCount: 0, volumeUsd: 0 },
      mostUsedContracts: [],
      mostInteractedProtocol: { protocolName: 'None', txCount: 0, volumeUsd: 0, percentageOfTotal: 0 },
      monthlySpending: [],
      dailyActivity: [],
      categoryBreakdown: [],
    };
  }

  let totalSentUsd = 0;
  let totalReceivedUsd = 0;
  let gasFeesPaidStx = 0;
  let gasFeesPaidUsd = 0;
  let totalVolumeUsd = 0;

  const totalSentCrypto: Record<string, number> = {};
  const totalReceivedCrypto: Record<string, number> = {};

  // Contract tracking map: contractAddress -> { name, callCount, totalVolumeUsd, category }
  const contractMap = new Map<string, { contractName: string; callCount: number; totalVolumeUsd: number; category: TransactionCategory }>();

  // Protocol tracking map: protocolName -> { txCount, volumeUsd }
  const protocolMap = new Map<string, { txCount: number; volumeUsd: number }>();

  // Category tracking map: category -> { amountUsd, txCount }
  const categoryMap = new Map<TransactionCategory, { amountUsd: number; txCount: number }>();

  // Day of week tracking
  const dayOfWeekCounts: Record<string, { txCount: number; volumeUsd: number }> = {
    Sunday: { txCount: 0, volumeUsd: 0 },
    Monday: { txCount: 0, volumeUsd: 0 },
    Tuesday: { txCount: 0, volumeUsd: 0 },
    Wednesday: { txCount: 0, volumeUsd: 0 },
    Thursday: { txCount: 0, volumeUsd: 0 },
    Friday: { txCount: 0, volumeUsd: 0 },
    Saturday: { txCount: 0, volumeUsd: 0 },
  };

  // Specific date map: YYYY-MM-DD -> { txCount, volumeUsd, sentUsd, receivedUsd, gasUsd, dateObj }
  const dailyMap = new Map<string, { txCount: number; volumeUsd: number; sentUsd: number; receivedUsd: number; gasUsd: number; timestamp: number }>();

  // Monthly map: YYYY-MM -> { totalSpentUsd, totalReceivedUsd, txCount, gasUsd, year, monthIdx }
  const monthlyMap = new Map<string, { totalSpentUsd: number; totalReceivedUsd: number; txCount: number; gasUsd: number; year: number; monthIdx: number }>();

  let earliestTimestamp = Number.MAX_SAFE_INTEGER;
  let latestTimestamp = 0;

  transactions.forEach((tx) => {
    const txDate = new Date(tx.timestamp);
    const validDate = !isNaN(txDate.getTime()) ? txDate : new Date();
    const ts = validDate.getTime();

    if (ts < earliestTimestamp) earliestTimestamp = ts;
    if (ts > latestTimestamp) latestTimestamp = ts;

    const amountUsd = Number(tx.amountUsd || 0);
    const amountCrypto = Number(tx.amountCrypto || 0);
    const gasStx = Number(tx.gasFeeStx || 0);
    const gasUsd = Number(tx.gasFeeUsd || 0);
    const token = tx.tokenSymbol || 'STX';

    gasFeesPaidStx += gasStx;
    gasFeesPaidUsd += gasUsd;
    totalVolumeUsd += amountUsd;

    // Determine direction
    const isReceived = tx.type === 'inflow' || tx.type === 'stacking_reward';
    const isSent = tx.type === 'outflow' || tx.type === 'sbtc_peg_in' || (tx.type === 'contract_call' && amountUsd > 0);

    let txSentUsd = 0;
    let txReceivedUsd = 0;

    if (isReceived) {
      totalReceivedUsd += amountUsd;
      totalReceivedCrypto[token] = (totalReceivedCrypto[token] || 0) + amountCrypto;
      txReceivedUsd = amountUsd;
    } else {
      totalSentUsd += amountUsd;
      totalSentCrypto[token] = (totalSentCrypto[token] || 0) + amountCrypto;
      txSentUsd = amountUsd;
    }

    // Category aggregation
    const cat = tx.category || 'Clarity Contract Exec';
    const existingCat = categoryMap.get(cat) || { amountUsd: 0, txCount: 0 };
    categoryMap.set(cat, {
      amountUsd: existingCat.amountUsd + amountUsd,
      txCount: existingCat.txCount + 1,
    });

    // Protocol determination
    let protocolName = tx.counterpartyName || 'Stacks L2 Network';
    if (tx.clarityFunction) {
      if (tx.clarityFunction.includes('sbtc') || tx.clarityFunction.includes('peg')) {
        protocolName = 'sBTC Bridge & Peg';
      } else if (tx.clarityFunction.includes('alex') || tx.clarityFunction.includes('swap')) {
        protocolName = 'ALEX DEX & Vaults';
      } else if (tx.clarityFunction.includes('pox') || tx.clarityFunction.includes('stack')) {
        protocolName = 'PoX-4 Stacking Pool';
      } else if (tx.clarityFunction.includes('zest') || tx.clarityFunction.includes('borrow')) {
        protocolName = 'Zest Protocol Lending';
      } else if (tx.clarityFunction.includes('bns')) {
        protocolName = 'BNS Names Service';
      }
    } else if (cat === 'sBTC & Bitcoin Bridge') {
      protocolName = 'sBTC Bridge & Peg';
    } else if (cat === 'PoX & Stacking Yield') {
      protocolName = 'PoX-4 Stacking Pool';
    }

    const existingProto = protocolMap.get(protocolName) || { txCount: 0, volumeUsd: 0 };
    protocolMap.set(protocolName, {
      txCount: existingProto.txCount + 1,
      volumeUsd: existingProto.volumeUsd + amountUsd,
    });

    // Contract tracking
    let contractAddr = tx.counterpartyAddress;
    let contractName = tx.counterpartyName;

    if (tx.clarityFunction && tx.clarityFunction.includes('.')) {
      const parts = tx.clarityFunction.split('.');
      contractName = parts[0] ? parts[0].toUpperCase() : contractName;
    }

    if (contractAddr && contractAddr.startsWith('SP')) {
      const existingContract = contractMap.get(contractAddr) || {
        contractName,
        callCount: 0,
        totalVolumeUsd: 0,
        category: cat,
      };
      contractMap.set(contractAddr, {
        contractName: existingContract.contractName || contractName,
        callCount: existingContract.callCount + 1,
        totalVolumeUsd: existingContract.totalVolumeUsd + amountUsd,
        category: cat,
      });
    }

    // Day of week aggregation
    const dayName = DAY_NAMES[validDate.getDay()];
    dayOfWeekCounts[dayName].txCount += 1;
    dayOfWeekCounts[dayName].volumeUsd += amountUsd;

    // Daily aggregation (YYYY-MM-DD)
    const dateStr = validDate.toISOString().split('T')[0];
    const existingDay = dailyMap.get(dateStr) || {
      txCount: 0,
      volumeUsd: 0,
      sentUsd: 0,
      receivedUsd: 0,
      gasUsd: 0,
      timestamp: ts,
    };
    dailyMap.set(dateStr, {
      txCount: existingDay.txCount + 1,
      volumeUsd: existingDay.volumeUsd + amountUsd,
      sentUsd: existingDay.sentUsd + txSentUsd,
      receivedUsd: existingDay.receivedUsd + txReceivedUsd,
      gasUsd: existingDay.gasUsd + gasUsd,
      timestamp: ts,
    });

    // Monthly aggregation (YYYY-MM)
    const year = validDate.getFullYear();
    const monthIdx = validDate.getMonth();
    const monthKey = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;

    const existingMonth = monthlyMap.get(monthKey) || {
      totalSpentUsd: 0,
      totalReceivedUsd: 0,
      txCount: 0,
      gasUsd: 0,
      year,
      monthIdx,
    };
    monthlyMap.set(monthKey, {
      totalSpentUsd: existingMonth.totalSpentUsd + txSentUsd,
      totalReceivedUsd: existingMonth.totalReceivedUsd + txReceivedUsd,
      txCount: existingMonth.txCount + 1,
      gasUsd: existingMonth.gasUsd + gasUsd,
      year,
      monthIdx,
    });
  });

  const txCount = transactions.length;
  const avgTxSizeUsd = txCount > 0 ? Number((totalVolumeUsd / txCount).toFixed(2)) : 0;
  const netBalanceUsd = Number((totalReceivedUsd - totalSentUsd - gasFeesPaidUsd).toFixed(2));

  // Wallet Age calculation
  const now = Date.now();
  const walletAgeDays = earliestTimestamp < Number.MAX_SAFE_INTEGER 
    ? Math.max(1, Math.ceil((now - earliestTimestamp) / (1000 * 60 * 60 * 24)))
    : 0;

  const firstTxDate = earliestTimestamp < Number.MAX_SAFE_INTEGER 
    ? new Date(earliestTimestamp).toISOString()
    : null;
  const lastTxDate = latestTimestamp > 0 
    ? new Date(latestTimestamp).toISOString()
    : null;

  // Find Most Active Day
  let maxDayName = 'Wednesday';
  let maxDayCount = 0;
  let maxDayVol = 0;

  Object.entries(dayOfWeekCounts).forEach(([day, data]) => {
    if (data.txCount > maxDayCount) {
      maxDayCount = data.txCount;
      maxDayName = day;
      maxDayVol = data.volumeUsd;
    }
  });

  // Find peak specific date
  let peakDateStr = firstTxDate ? firstTxDate.split('T')[0] : 'N/A';
  let peakDateCount = 0;

  dailyMap.forEach((val, dateKey) => {
    if (val.txCount > peakDateCount) {
      peakDateCount = val.txCount;
      peakDateStr = dateKey;
    }
  });

  const mostActiveDay: MostActiveDay = {
    dayOfWeek: maxDayName,
    date: peakDateStr,
    txCount: maxDayCount || peakDateCount,
    volumeUsd: Number(maxDayVol.toFixed(2)),
  };

  // Process Most Used Contracts
  const mostUsedContracts: MostUsedContract[] = Array.from(contractMap.entries())
    .map(([contractAddress, data]) => ({
      contractAddress,
      contractName: data.contractName,
      callCount: data.callCount,
      totalVolumeUsd: Number(data.totalVolumeUsd.toFixed(2)),
      category: data.category,
    }))
    .sort((a, b) => b.callCount - a.callCount || b.totalVolumeUsd - a.totalVolumeUsd)
    .slice(0, 6);

  // Process Most Interacted Protocol
  let topProtoName = 'Stacks L2 Network';
  let topProtoTxCount = 0;
  let topProtoVolUsd = 0;

  protocolMap.forEach((val, protoName) => {
    if (val.txCount > topProtoTxCount || (val.txCount === topProtoTxCount && val.volumeUsd > topProtoVolUsd)) {
      topProtoName = protoName;
      topProtoTxCount = val.txCount;
      topProtoVolUsd = val.volumeUsd;
    }
  });

  const mostInteractedProtocol: MostInteractedProtocol = {
    protocolName: topProtoName,
    txCount: topProtoTxCount,
    volumeUsd: Number(topProtoVolUsd.toFixed(2)),
    percentageOfTotal: txCount > 0 ? Number(((topProtoTxCount / txCount) * 100).toFixed(1)) : 0,
  };

  // Format Daily Activity array (chronological)
  const dailyActivity: DailyActivityItem[] = Array.from(dailyMap.entries())
    .map(([dateStr, data]) => {
      const d = new Date(dateStr);
      const dayLabel = `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}`;
      return {
        date: dateStr,
        dayLabel,
        txCount: data.txCount,
        volumeUsd: Number(data.volumeUsd.toFixed(2)),
        sentUsd: Number(data.sentUsd.toFixed(2)),
        receivedUsd: Number(data.receivedUsd.toFixed(2)),
        gasUsd: Number(data.gasUsd.toFixed(4)),
        timestamp: data.timestamp,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ timestamp, ...rest }) => rest);

  // Format Monthly Spending array (chronological)
  const monthlySpending: MonthlySpendItem[] = Array.from(monthlyMap.entries())
    .map(([monthKey, data]) => {
      const monthLabel = `${MONTH_NAMES[data.monthIdx]} ${data.year}`;
      const totalSpentUsd = Number(data.totalSpentUsd.toFixed(2));
      const totalReceivedUsd = Number(data.totalReceivedUsd.toFixed(2));
      return {
        month: monthKey,
        monthLabel,
        totalSpentUsd,
        totalReceivedUsd,
        netUsd: Number((totalReceivedUsd - totalSpentUsd).toFixed(2)),
        txCount: data.txCount,
        gasUsd: Number(data.gasUsd.toFixed(2)),
        year: data.year,
        monthIdx: data.monthIdx,
      };
    })
    .sort((a, b) => (a.year - b.year) || (a.monthIdx - b.monthIdx))
    .map(({ year, monthIdx, ...rest }) => rest);

  // Format Category Breakdown array
  const totalCatAmountUsd = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.amountUsd, 0) || 1;
  const categoryBreakdown: CategoryBreakdownItem[] = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amountUsd: Number(data.amountUsd.toFixed(2)),
      percentage: Number(((data.amountUsd / totalCatAmountUsd) * 100).toFixed(1)),
      txCount: data.txCount,
      color: CATEGORY_COLORS[category] || '#6366F1',
    }))
    .sort((a, b) => b.amountUsd - a.amountUsd);

  return {
    totalSentUsd: Number(totalSentUsd.toFixed(2)),
    totalSentCrypto,
    totalReceivedUsd: Number(totalReceivedUsd.toFixed(2)),
    totalReceivedCrypto,
    netBalanceUsd,
    walletAgeDays,
    firstTxDate,
    lastTxDate,
    txCount,
    avgTxSizeUsd,
    gasFeesPaidStx: Number(gasFeesPaidStx.toFixed(6)),
    gasFeesPaidUsd: Number(gasFeesPaidUsd.toFixed(2)),
    mostActiveDay,
    mostUsedContracts,
    mostInteractedProtocol,
    monthlySpending,
    dailyActivity,
    categoryBreakdown,
  };
}

/**
 * Generates structured AI insight cards based on the calculated WalletAnalytics object.
 * Returns between 5 and 10 useful, data-backed observations.
 */
export function generateAiInsights(analytics: WalletAnalytics): AiInsightCard[] {
  if (!analytics || analytics.txCount === 0) {
    return [
      {
        id: 'no-history',
        title: 'Transaction History',
        observation: 'No transaction history detected. Connect or search an active Stacks wallet address to generate AI observations.',
        highlightValue: '0 Txs',
        badgeText: 'Awaiting Data',
        category: 'activity',
        icon: 'Calendar',
        accentColor: 'border-l-indigo-500 text-indigo-400',
      },
    ];
  }

  const insights: AiInsightCard[] = [];

  // 1. DeFi / Category Spending Share
  const defiCat = analytics.categoryBreakdown.find((c) => c.category === 'DeFi & Swaps');
  const topCat = analytics.categoryBreakdown[0];

  if (defiCat) {
    insights.push({
      id: 'insight-defi-spending',
      title: 'DeFi Capital Allocation',
      observation: `You spent ${defiCat.percentage}% of your STX interacting with DeFi.`,
      highlightValue: `${defiCat.percentage}% DeFi`,
      badgeText: 'DeFi Focus',
      category: 'spending',
      icon: 'PieChart',
      accentColor: 'border-l-purple-500 text-purple-400',
    });
  } else if (topCat) {
    insights.push({
      id: 'insight-top-spending',
      title: 'Dominant Category Allocation',
      observation: `You spent ${topCat.percentage}% of your STX interacting with ${topCat.category}.`,
      highlightValue: `${topCat.percentage}% ${topCat.category}`,
      badgeText: 'Top Category',
      category: 'spending',
      icon: 'PieChart',
      accentColor: 'border-l-purple-500 text-purple-400',
    });
  }

  // 2. Most Active Day of Week
  if (analytics.mostActiveDay && analytics.mostActiveDay.dayOfWeek !== 'N/A') {
    insights.push({
      id: 'insight-active-day',
      title: 'Trading Cadence',
      observation: `${analytics.mostActiveDay.dayOfWeek} is your most active trading day.`,
      highlightValue: analytics.mostActiveDay.dayOfWeek,
      badgeText: `${analytics.mostActiveDay.txCount} Peak Txs`,
      category: 'activity',
      icon: 'Calendar',
      accentColor: 'border-l-teal-500 text-teal-400',
    });
  }

  // 3. Smart Contracts Interaction Count
  const contractCount = analytics.mostUsedContracts.length || (analytics.txCount > 0 ? Math.min(analytics.txCount, 8) : 0);
  insights.push({
      id: 'insight-smart-contracts',
      title: 'Smart Contract Footprint',
      observation: `You've interacted with ${contractCount} smart contracts.`,
      highlightValue: `${contractCount} Contracts`,
      badgeText: 'Clarity Footprint',
      category: 'contracts',
      icon: 'FileCode2',
      accentColor: 'border-l-indigo-500 text-indigo-400',
  });

  // 4. Most Interacted Protocol
  if (analytics.mostInteractedProtocol && analytics.mostInteractedProtocol.protocolName !== 'None') {
    insights.push({
      id: 'insight-top-protocol',
      title: 'Primary Protocol Integration',
      observation: `${analytics.mostInteractedProtocol.protocolName} is your top interacted protocol, representing ${analytics.mostInteractedProtocol.percentageOfTotal}% of your on-chain calls.`,
      highlightValue: analytics.mostInteractedProtocol.protocolName,
      badgeText: `${analytics.mostInteractedProtocol.percentageOfTotal}% Share`,
      category: 'protocols',
      icon: 'Layers',
      accentColor: 'border-l-blue-500 text-blue-400',
    });
  }

  // 5. Gas Fees Paid Efficiency
  insights.push({
    id: 'insight-gas-fees',
    title: 'Gas & Execution Micro-Fees',
    observation: `You've paid ${analytics.gasFeesPaidStx} STX ($${analytics.gasFeesPaidUsd.toFixed(2)}) in network execution gas fees across ${analytics.txCount} transactions.`,
    highlightValue: `${analytics.gasFeesPaidStx} STX`,
    badgeText: 'Nakamoto Fast Blocks',
    category: 'gas',
    icon: 'Flame',
    accentColor: 'border-l-amber-500 text-amber-400',
  });

  // 6. Average Transaction Size
  insights.push({
    id: 'insight-avg-tx-size',
    title: 'Transaction Sizing',
    observation: `Your average transaction size is $${analytics.avgTxSizeUsd.toLocaleString()} USD across all executed contracts.`,
    highlightValue: `$${analytics.avgTxSizeUsd.toLocaleString()}`,
    badgeText: 'Avg Ticket Size',
    category: 'flow',
    icon: 'DollarSign',
    accentColor: 'border-l-emerald-500 text-emerald-400',
  });

  // 7. Wallet Age & On-Chain History Tenure
  if (analytics.walletAgeDays > 0) {
    insights.push({
      id: 'insight-wallet-age',
      title: 'Wallet Maturity & Tenure',
      observation: `Your wallet has been active on Stacks mainnet for ${analytics.walletAgeDays} days.`,
      highlightValue: `${analytics.walletAgeDays} Days Old`,
      badgeText: 'Established Wallet',
      category: 'age',
      icon: 'Clock',
      accentColor: 'border-l-rose-500 text-rose-400',
    });
  }

  // 8. Net On-Chain Flow
  const isPositive = analytics.netBalanceUsd >= 0;
  const absNet = Math.abs(analytics.netBalanceUsd).toLocaleString();
  const directionStr = isPositive ? 'positive (+)' : 'negative (-)';
  const prefixStr = isPositive ? '+' : '-';
  insights.push({
    id: 'insight-net-flow',
    title: 'Net Cashflow Position',
    observation: `Your net on-chain flow is ${directionStr} $${absNet} USD.`,
    highlightValue: `${prefixStr}$${absNet}`,
    badgeText: isPositive ? 'Net Positive' : 'Net Outflow',
    category: 'flow',
    icon: 'TrendingUp',
    accentColor: isPositive ? 'border-l-emerald-500 text-emerald-400' : 'border-l-rose-500 text-rose-400',
  });

  return insights;
}


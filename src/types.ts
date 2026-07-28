export type ChainId = 'stacks-mainnet' | 'stacks-nakamoto' | 'bitcoin-l1' | 'stacks-testnet';

export interface ChainInfo {
  id: ChainId;
  name: string;
  symbol: string;
  color: string;
  iconBg: string;
  explorerUrl: string;
}

export type TransactionCategory = 
  | 'PoX & Stacking Yield'
  | 'sBTC & Bitcoin Bridge'
  | 'DeFi & Swaps'
  | 'Clarity Contract Exec'
  | 'SIP-010 Tokens'
  | 'SIP-009 NFTs & BNS'
  | 'Infrastructure & SaaS'
  | 'Treasury & Transfers';

export type TaxTag = 'Deductible Expense' | 'Capital Gain/Loss' | 'Taxable Income' | 'Internal Transfer' | 'Uncategorized';

export interface Sip010Token {
  symbol: string;
  name: string;
  contractAddress: string;
  balance: number;
  valueUsd: number;
  priceUsd: number;
  change24h: number;
  iconBg?: string;
}

export interface Sip009Nft {
  id: string;
  name: string;
  collection: string;
  contractAddress: string;
  tokenId: string;
  estimatedValueStx: number;
  estimatedValueUsd: number;
  imageUrl: string;
}

export interface StackingInfo {
  isStacking: boolean;
  stackedStx: number;
  stackedStxUsd: number;
  poolName?: string;
  currentCycle?: number;
  estApyBtc?: number;
  unclaimedBtcRewards?: number;
  unclaimedBtcUsd?: number;
  unlockCycle?: number;
}

export interface Wallet {
  id: string;
  address: string; // Stacks address e.g. SP2C2YFP...
  bnsName?: string; // BNS domain e.g. satoshi.btc
  name: string;
  chain: ChainId;
  type: 'Stacks (Leather/Xverse)' | 'Stacks Multisig (Asigna)';
  balanceStx: number;
  balanceSbtc: number;
  balanceUsd: number;
  totalSpent30d: number;
  gasSpent30dStx: number;
  gasSpent30dUsd: number;
  healthScore: number; // 0-100
  unspentApprovalsCount: number;
  clarityCalls30d: number;
  isPrimary?: boolean;
  sip010Tokens: Sip010Token[];
  nftHoldings: Sip009Nft[];
  stackingInfo: StackingInfo;
}

export interface Transaction {
  id: string;
  hash: string;
  walletId: string;
  walletAddress: string;
  chain: ChainId;
  timestamp: string; // ISO or formatted date
  type: 'outflow' | 'inflow' | 'internal' | 'contract_call' | 'sbtc_peg_in' | 'stacking_reward';
  amountCrypto: number;
  tokenSymbol: string; // 'STX' | 'sBTC' | 'ALEX' | 'stSTX' | 'WELSH' | 'USDA'
  amountUsd: number;
  gasFeeStx: number;
  gasFeeUsd: number;
  clarityFunction?: string; // e.g. alex-vault.swap-exact-tokens-for-tokens
  counterpartyName: string;
  counterpartyAddress: string;
  postConditionsCount?: number;
  category: TransactionCategory;
  taxTag: TaxTag;
  memo?: string;
  receiptUrl?: string;
  isSubscription?: boolean;
  blockHeight?: number;
}

export interface SpendCategoryBreakdown {
  category: TransactionCategory;
  amountUsd: number;
  percentage: number;
  color: string;
  txCount: number;
}

export interface ChainSpendSummary {
  chain: ChainId;
  chainName: string;
  spentUsd: number;
  gasUsd: number;
  txCount: number;
  color: string;
}

export interface ProtocolMetric {
  id: string;
  name: string;
  category: string;
  tvlUsd: number;
  volume24hUsd: number;
  growth24h: number;
  contractAddress: string;
  description: string;
  iconBg: string;
}

export interface AiAuditReport {
  id: string;
  createdAt: string;
  headline: string;
  executiveSummary: string;
  potentialSavingsUsd: number;
  insights: {
    title: string;
    description: string;
    type: 'warning' | 'opportunity' | 'info';
    impactUsd?: number;
  }[];
}

export interface AppSettings {
  currency: 'USD' | 'STX' | 'BTC' | 'EUR';
  autoCategorizeClarity: boolean;
  stxGasAlertThreshold: number; // in STX
  enabledChains: ChainId[];
  hiroRpcUrl: string;
  bnsResolution: boolean;
  accountingExportFormat: 'quickbooks' | 'xero' | 'cointracker' | 'csv';
  teamName: string;
}


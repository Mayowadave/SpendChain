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

// Smart Alerts System Types
export type AlertEventType = 
  | 'receive_stx'
  | 'send_stx'
  | 'new_nft'
  | 'new_sip10'
  | 'large_tx'
  | 'contract_interaction'
  | 'gas_spike';

export type NotificationChannelId = 'dashboard' | 'email' | 'telegram' | 'webhook' | 'discord';

export interface NotificationChannelConfig {
  id: NotificationChannelId;
  name: string;
  enabled: boolean;
  isFutureChannel?: boolean;
  destination?: string; // e.g. email address, telegram @handle or Chat ID, webhook URL
  description: string;
  iconName: string;
}

export interface SmartAlertRule {
  id: string;
  name: string;
  eventType: AlertEventType;
  enabled: boolean;
  thresholdValue?: number; // e.g. $500 for large_tx, 0.5 STX for gas_spike
  walletAddress?: string; // specific wallet or 'all'
  channels: NotificationChannelId[];
  createdAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
}

export interface TriggeredAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  eventType: AlertEventType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  txHash?: string;
  amountUsd?: number;
  read: boolean;
  channelDispatched: NotificationChannelId[];
}

// Stacks Ecosystem Explorer Types
export interface StacksNetworkStats {
  stxPriceUsd: number;
  priceChange24h: number;
  marketCapUsd: number;
  circulatingSupply: number;
  totalTxToday: number;
  blocksToday: number;
  currentBlockHeight: number;
  avgBlockTimeSeconds: number;
  networkStatus: 'Operational' | 'Congested' | 'Upgrading';
  nakamotoEpoch: string;
  bitcoinBlockHeight: number;
  mempoolSize: number;
  lastUpdated: string;
}

export interface EcosystemHealthData {
  overallHealthScore: number; // 0 - 100
  networkActivityScore: number;
  developerActivityScore: number;
  protocolGrowthScore: number;
  walletGrowthScore: number;
  tvlTrendScore: number;
  activeUsersCount: number;
  txGrowthPercent: number;
  aiExplanation: string;
}

export type ProtocolCategory = 'DeFi & DEX' | 'Lending & Yield' | 'Liquid Staking' | 'NFT & Gaming' | 'Infrastructure & Bridges' | 'Payments';
export type ProtocolRiskLevel = 'Low' | 'Medium' | 'High' | 'Audited';

export interface ProtocolDetail {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  iconBg: string;
  category: ProtocolCategory;
  tvlUsd: number;
  volume24hUsd: number;
  weeklyGrowthPercent: number;
  activeUsers24h: number;
  totalTransactions24h: number;
  riskLevel: ProtocolRiskLevel;
  description: string;
  websiteUrl: string;
  auditReportUrl?: string;
  launchDate: string;
  smartContracts: string[];
  protocolHealthScore: number; // 0-100
  aiSummary: string;
  riskAnalysis: string;
  news: { title: string; date: string; link?: string; source: string }[];
  relatedProtocolIds: string[];
  historicalTvl: { date: string; tvlUsd: number; volumeUsd: number; users: number }[];
}

export interface LiveEcosystemEvent {
  id: string;
  type: 'large_transfer' | 'new_wallet' | 'nft_mint' | 'contract_deployed' | 'high_value_swap' | 'staking_deposit' | 'new_token';
  title: string;
  description: string;
  timestamp: string;
  txHash?: string;
  valueUsd?: number;
  category: string;
  iconBg: string;
}

export interface ClarityContractDeployment {
  id: string;
  contractName: string;
  contractAddress: string;
  deployerAddress: string;
  blockHeight: number;
  deploymentTime: string;
  verified: boolean;
  explorerLink: string;
  callsCount24h: number;
  category: string;
}

export interface Sip10EcosystemToken {
  id: string;
  name: string;
  symbol: string;
  logoBg: string;
  totalSupply: number;
  decimals: number;
  creatorAddress: string;
  creationDate: string;
  holdersCount: number;
  priceUsd: number;
  marketCapUsd: number;
  verified: boolean;
  riskBadge: 'Verified' | 'Unverified' | 'Community' | 'Warning';
}

export interface EcosystemNftCollection {
  id: string;
  name: string;
  symbol: string;
  logoBg: string;
  floorPriceStx: number;
  floorPriceUsd: number;
  volume24hStx: number;
  volume24hUsd: number;
  ownersCount: number;
  totalSupply: number;
  transactions24h: number;
  dailyChangePercent: number;
  verified: boolean;
}

export interface EcosystemChartDataPoint {
  date: string;
  transactions: number;
  activeWallets: number;
  tvlUsd: number;
  protocolVolumeUsd: number;
  contractsDeployed: number;
  stxTransfersUsd: number;
  nftVolumeUsd: number;
}




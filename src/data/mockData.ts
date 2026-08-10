import { Wallet, Transaction, ChainInfo, SpendCategoryBreakdown, ChainSpendSummary, AppSettings, ProtocolMetric } from '../types';

export const STX_PRICE_USD = 0.133;
export const BTC_PRICE_USD = 92500.00;

export const SUPPORTED_CHAINS: Record<string, ChainInfo> = {
  'stacks-mainnet': {
    id: 'stacks-mainnet',
    name: 'Stacks Mainnet',
    symbol: 'STX',
    color: '#5546FF',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    explorerUrl: 'https://explorer.hiro.so/txid/'
  },
  'stacks-nakamoto': {
    id: 'stacks-nakamoto',
    name: 'Nakamoto Fast Blocks',
    symbol: 'sBTC',
    color: '#00D1FF',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    explorerUrl: 'https://explorer.hiro.so/txid/?chain=mainnet&sub=nakamoto'
  },
  'bitcoin-l1': {
    id: 'bitcoin-l1',
    name: 'Bitcoin L1 (sBTC Peg)',
    symbol: 'BTC',
    color: '#F7931A',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    explorerUrl: 'https://mempool.space/tx/'
  },
  'stacks-testnet': {
    id: 'stacks-testnet',
    name: 'Stacks Testnet',
    symbol: 'tSTX',
    color: '#10B981',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    explorerUrl: 'https://explorer.hiro.so/txid/?chain=testnet'
  }
};

export const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'w1',
    address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    bnsName: 'satoshi.btc',
    name: 'Main Stacks Treasury & PoX Vault',
    chain: 'stacks-mainnet',
    type: 'Stacks (Leather/Xverse)',
    balanceStx: 145000,
    balanceSbtc: 1.45,
    balanceUsd: 402375.00, // 145000*1.85 + 1.45*92500
    totalSpent30d: 38450.00,
    gasSpent30dStx: 18.5,
    gasSpent30dUsd: 34.22,
    healthScore: 96,
    unspentApprovalsCount: 2,
    clarityCalls30d: 84,
    isPrimary: true,
    stackingInfo: {
      isStacking: true,
      stackedStx: 100000,
      stackedStxUsd: 185000,
      poolName: 'StackingDAO Liquid Pool (stSTX)',
      currentCycle: 88,
      estApyBtc: 8.4,
      unclaimedBtcRewards: 0.042,
      unclaimedBtcUsd: 3885,
      unlockCycle: 92
    },
    sip010Tokens: [
      { symbol: 'sBTC', name: 'Bitcoin L2 Token', contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-token', balance: 1.45, valueUsd: 134125, priceUsd: 92500, change24h: +2.4 },
      { symbol: 'stSTX', name: 'StackingDAO Liquid STX', contractAddress: 'SP4S24G7B55E44P8B20B3A505AA002964567222.ststx-token', balance: 100000, valueUsd: 185000, priceUsd: 1.85, change24h: +1.1 },
      { symbol: 'ALEX', name: 'ALEX Lab Governance', contractAddress: 'SP3K8BC0PPEVCV7NZ655F4B26PNJJLRAC2A054MG.age000-governance-token', balance: 450000, valueUsd: 36000, priceUsd: 0.08, change24h: +5.8 },
      { symbol: 'WELSH', name: 'Welshcorgicoin', contractAddress: 'SP3NE50GEXFG9SZGTT51P40X2C1M85712N60147N.welshcorgicoin-token', balance: 12500000, valueUsd: 15000, priceUsd: 0.0012, change24h: -1.2 },
      { symbol: 'USDA', name: 'Arkadiko USDA Stablecoin', contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token', balance: 32250, valueUsd: 32250, priceUsd: 1.00, change24h: 0.0 }
    ],
    nftHoldings: [
      { id: 'nft-1', name: 'satoshi.btc', collection: 'Bitcoin Name System (BNS)', contractAddress: 'SP000000000000000000002Q6VF78.bns', tokenId: '1042', estimatedValueStx: 2500, estimatedValueUsd: 4625, imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=300&q=80' },
      { id: 'nft-2', name: 'Megapont Ape #1284', collection: 'Megapont Ape Club', contractAddress: 'SP3D6PV2ACB21ZQ6743J2F0MG854AWG2282CEX1.megapont-ape-club', tokenId: '1284', estimatedValueStx: 1800, estimatedValueUsd: 3330, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
      { id: 'nft-3', name: 'Bitcoin Monkey #441', collection: 'Bitcoin Monkeys', contractAddress: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys', tokenId: '441', estimatedValueStx: 950, estimatedValueUsd: 1757, imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'w2',
    address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    bnsName: 'alex-vault.btc',
    name: 'ALEX & Zest Protocol Liquidity',
    chain: 'stacks-mainnet',
    type: 'Stacks (Leather/Xverse)',
    balanceStx: 32400,
    balanceSbtc: 0.65,
    balanceUsd: 120065.00, // 32400*1.85 + 0.65*92500
    totalSpent30d: 18200.00,
    gasSpent30dStx: 12.4,
    gasSpent30dUsd: 22.94,
    healthScore: 98,
    unspentApprovalsCount: 0,
    clarityCalls30d: 142,
    stackingInfo: {
      isStacking: false,
      stackedStx: 0,
      stackedStxUsd: 0,
      poolName: 'None',
      currentCycle: 88,
      estApyBtc: 0,
      unclaimedBtcRewards: 0,
      unclaimedBtcUsd: 0,
      unlockCycle: 0
    },
    sip010Tokens: [
      { symbol: 'sBTC', name: 'Bitcoin L2 Token', contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-token', balance: 0.65, valueUsd: 60125, priceUsd: 92500, change24h: +2.4 },
      { symbol: 'ALEX', name: 'ALEX Lab Governance', contractAddress: 'SP3K8BC0PPEVCV7NZ655F4B26PNJJLRAC2A054MG.age000-governance-token', balance: 750000, valueUsd: 60000, priceUsd: 0.08, change24h: +5.8 }
    ],
    nftHoldings: [
      { id: 'nft-4', name: 'alex-vault.btc', collection: 'BNS Domains', contractAddress: 'SP000000000000000000002Q6VF78.bns', tokenId: '8091', estimatedValueStx: 1200, estimatedValueUsd: 2220, imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'w3',
    address: 'SP2X0TZ59D5SZ8AC38D64CD824BCAAE5EE9Y12B',
    bnsName: 'build.btc',
    name: 'Bitcoin L2 Dev Grants & Infrastructure',
    chain: 'stacks-nakamoto',
    type: 'Stacks Multisig (Asigna)',
    balanceStx: 18500,
    balanceSbtc: 0.25,
    balanceUsd: 57350.00,
    totalSpent30d: 9400.00,
    gasSpent30dStx: 4.8,
    gasSpent30dUsd: 8.88,
    healthScore: 94,
    unspentApprovalsCount: 1,
    clarityCalls30d: 38,
    stackingInfo: {
      isStacking: true,
      stackedStx: 15000,
      stackedStxUsd: 27750,
      poolName: 'Asigna PoX-4 Vault',
      currentCycle: 88,
      estApyBtc: 7.8,
      unclaimedBtcRewards: 0.008,
      unclaimedBtcUsd: 740,
      unlockCycle: 90
    },
    sip010Tokens: [
      { symbol: 'sBTC', name: 'Bitcoin L2 Token', contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-token', balance: 0.25, valueUsd: 23125, priceUsd: 92500, change24h: +2.4 }
    ],
    nftHoldings: []
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-stx-101',
    hash: '0x2a9108f9c1b34e2a8901283719283012938102938102938102938102938102a1',
    walletId: 'w1',
    walletAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    chain: 'stacks-mainnet',
    timestamp: '2026-07-27T08:14:00Z',
    type: 'sbtc_peg_in',
    amountCrypto: 0.50,
    tokenSymbol: 'sBTC',
    amountUsd: 46250.00,
    gasFeeStx: 0.12,
    gasFeeUsd: 0.22,
    clarityFunction: 'sbtc-registry.peg-in-sbtc',
    counterpartyName: 'sBTC Bridge Signers Network',
    counterpartyAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-registry',
    postConditionsCount: 1,
    category: 'sBTC & Bitcoin Bridge',
    taxTag: 'Internal Transfer',
    memo: 'Bitcoin L1 to Stacks L2 sBTC peg deposit execution',
    blockHeight: 168242
  },
  {
    id: 'tx-stx-102',
    hash: '0x88f2010c2837192038102938102938102938102938102938102938102938102b',
    walletId: 'w1',
    walletAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    chain: 'stacks-mainnet',
    timestamp: '2026-07-26T14:32:00Z',
    type: 'contract_call',
    amountCrypto: 25000,
    tokenSymbol: 'STX',
    amountUsd: 46250.00,
    gasFeeStx: 0.25,
    gasFeeUsd: 0.46,
    clarityFunction: 'ststx-token.mint-ststx',
    counterpartyName: 'StackingDAO Protocol',
    counterpartyAddress: 'SP4S24G7B55E44P8B20B3A505AA002964567222.stacking-dao-core',
    postConditionsCount: 2,
    category: 'PoX & Stacking Yield',
    taxTag: 'Capital Gain/Loss',
    memo: 'Minted 25,000 stSTX liquid stacking yield position',
    blockHeight: 168210
  },
  {
    id: 'tx-stx-103',
    hash: '0x77c1092038129301928301293810293812039810293810293810293810293c1',
    walletId: 'w2',
    walletAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    chain: 'stacks-nakamoto',
    timestamp: '2026-07-25T19:15:10Z',
    type: 'contract_call',
    amountCrypto: 12500,
    tokenSymbol: 'ALEX',
    amountUsd: 1000.00,
    gasFeeStx: 0.08,
    gasFeeUsd: 0.15,
    clarityFunction: 'alex-vault.swap-exact-tokens-for-tokens',
    counterpartyName: 'ALEX Automated Market Maker',
    counterpartyAddress: 'SP3K8BC0PPEVCV7NZ655F4B26PNJJLRAC2A054MG.alex-vault',
    postConditionsCount: 2,
    category: 'DeFi & Swaps',
    taxTag: 'Capital Gain/Loss',
    memo: 'Nakamoto fast block swap ALEX -> STX',
    blockHeight: 168180
  },
  {
    id: 'tx-stx-104',
    hash: '0x9920192038129301928301293810293812039810293810293810293810293d2',
    walletId: 'w1',
    walletAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    chain: 'stacks-mainnet',
    timestamp: '2026-07-24T11:20:00Z',
    type: 'stacking_reward',
    amountCrypto: 0.018,
    tokenSymbol: 'BTC',
    amountUsd: 1665.00,
    gasFeeStx: 0,
    gasFeeUsd: 0,
    clarityFunction: 'pox-4.get-reward-payout',
    counterpartyName: 'PoX-4 Proof of Transfer Stacking',
    counterpartyAddress: 'SP000000000000000000002Q6VF78.pox-4',
    postConditionsCount: 0,
    category: 'PoX & Stacking Yield',
    taxTag: 'Taxable Income',
    memo: 'Bitcoin L1 Stacking yield payout Cycle #87',
    blockHeight: 168120
  },
  {
    id: 'tx-stx-105',
    hash: '0x1120192038129301928301293810293812039810293810293810293810293e3',
    walletId: 'w3',
    walletAddress: 'SP2X0TZ59D5SZ8AC38D64CD824BCAAE5EE9Y12B',
    chain: 'stacks-mainnet',
    timestamp: '2026-07-23T16:05:00Z',
    type: 'outflow',
    amountCrypto: 420,
    tokenSymbol: 'STX',
    amountUsd: 777.00,
    gasFeeStx: 0.05,
    gasFeeUsd: 0.09,
    clarityFunction: 'hiro-rpc-billing.pay-subscription',
    counterpartyName: 'Hiro Systems Developer RPC Node',
    counterpartyAddress: 'SP1P72Z3704VMT3DMHPP2CB8TGQG2E13CC82E62A.hiro-billing',
    postConditionsCount: 1,
    category: 'Infrastructure & SaaS',
    taxTag: 'Deductible Expense',
    memo: 'Monthly enterprise Clarity indexing node billing',
    isSubscription: true,
    blockHeight: 168050
  },
  {
    id: 'tx-stx-106',
    hash: '0x3320192038129301928301293810293812039810293810293810293810293f4',
    walletId: 'w1',
    walletAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    chain: 'stacks-mainnet',
    timestamp: '2026-07-22T13:40:00Z',
    type: 'contract_call',
    amountCrypto: 2500,
    tokenSymbol: 'STX',
    amountUsd: 4625.00,
    gasFeeStx: 0.15,
    gasFeeUsd: 0.28,
    clarityFunction: 'bns.name-claim',
    counterpartyName: 'Bitcoin Name System (BNS)',
    counterpartyAddress: 'SP000000000000000000002Q6VF78.bns',
    postConditionsCount: 1,
    category: 'SIP-009 NFTs & BNS',
    taxTag: 'Deductible Expense',
    memo: 'Registered satoshi.btc domain for treasury identity',
    blockHeight: 167990
  }
];

export const CATEGORY_BREAKDOWN: SpendCategoryBreakdown[] = [
  { category: 'PoX & Stacking Yield', amountUsd: 185000.00, percentage: 38.5, color: '#5546FF', txCount: 24 },
  { category: 'sBTC & Bitcoin Bridge', amountUsd: 134125.00, percentage: 27.9, color: '#00D1FF', txCount: 16 },
  { category: 'DeFi & Swaps', amountUsd: 68500.00, percentage: 14.3, color: '#3B82F6', txCount: 52 },
  { category: 'SIP-010 Tokens', amountUsd: 51000.00, percentage: 10.6, color: '#10B981', txCount: 38 },
  { category: 'SIP-009 NFTs & BNS', amountUsd: 22400.00, percentage: 4.7, color: '#F59E0B', txCount: 14 },
  { category: 'Infrastructure & SaaS', amountUsd: 19350.00, percentage: 4.0, color: '#8B5CF6', txCount: 28 },
];

export const CHAIN_SUMMARIES: ChainSpendSummary[] = [
  { chain: 'stacks-mainnet', chainName: 'Stacks Mainnet', spentUsd: 284500.00, gasUsd: 34.22, txCount: 112, color: '#5546FF' },
  { chain: 'stacks-nakamoto', chainName: 'Nakamoto Fast Blocks', spentUsd: 120065.00, gasUsd: 22.94, txCount: 184, color: '#00D1FF' },
  { chain: 'bitcoin-l1', chainName: 'Bitcoin L1 (sBTC Peg)', spentUsd: 76500.00, gasUsd: 18.50, txCount: 24, color: '#F7931A' },
  { chain: 'stacks-testnet', chainName: 'Stacks Testnet', spentUsd: 0.00, gasUsd: 0.00, txCount: 12, color: '#10B981' }
];

export const STACKS_PROTOCOLS: ProtocolMetric[] = [
  {
    id: 'p-1',
    name: 'StackingDAO',
    category: 'Liquid Stacking',
    tvlUsd: 168400000,
    volume24hUsd: 4200000,
    growth24h: +4.8,
    contractAddress: 'SP4S24G7B55E44P8B20B3A505AA002964567222.stacking-dao-core',
    description: 'Premier liquid stacking protocol for STX with stSTX auto-compounding BTC yields.',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  },
  {
    id: 'p-2',
    name: 'ALEX Lab',
    category: 'DeFi & AMM',
    tvlUsd: 94200000,
    volume24hUsd: 12800000,
    growth24h: +12.1,
    contractAddress: 'SP3K8BC0PPEVCV7NZ655F4B26PNJJLRAC2A054MG.alex-vault',
    description: 'Bitcoin L2 financial hub offering automated market making, orderbooks, and launchpads.',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  },
  {
    id: 'p-3',
    name: 'sBTC Protocol',
    category: 'Bitcoin L2 Peg',
    tvlUsd: 215000000,
    volume24hUsd: 18900000,
    growth24h: +8.4,
    contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-registry',
    description: '1:1 Bitcoin backed asset on Stacks enabling programmable Bitcoin smart contract utility.',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    id: 'p-4',
    name: 'Zest Protocol',
    category: 'Lending & Borrowing',
    tvlUsd: 48900000,
    volume24hUsd: 3400000,
    growth24h: +3.2,
    contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.zest-vault',
    description: 'Decentralized Bitcoin and STX money market with low collateral borrowing.',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    id: 'p-5',
    name: 'Velar',
    category: 'Liquidity & Perpetual AMM',
    tvlUsd: 31200000,
    volume24hUsd: 6100000,
    growth24h: +1.9,
    contractAddress: 'SP1P72Z3704VMT3DMHPP2CB8TGQG2E13CC82E62A.velar-v2',
    description: 'Multi-feature DeFi suite powering Bitcoin L2 swaps, perps, and farming.',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
];

export const SPEND_TIMELINE = [
  { date: 'Jul 1', Spent: 2100, Income: 3400, Gas: 1.2 },
  { date: 'Jul 5', Spent: 4800, Income: 1200, Gas: 2.4 },
  { date: 'Jul 9', Spent: 3200, Income: 5800, Gas: 1.8 },
  { date: 'Jul 13', Spent: 12500, Income: 2100, Gas: 4.2 },
  { date: 'Jul 17', Spent: 6400, Income: 8900, Gas: 2.1 },
  { date: 'Jul 21', Spent: 18200, Income: 6370, Gas: 5.4 },
  { date: 'Jul 25', Spent: 14100, Income: 4200, Gas: 3.8 },
  { date: 'Jul 27', Spent: 9500, Income: 7100, Gas: 2.6 },
];

export const INITIAL_SETTINGS: AppSettings = {
  currency: 'USD',
  autoCategorizeClarity: true,
  stxGasAlertThreshold: 5.0, // in STX
  enabledChains: ['stacks-mainnet', 'stacks-nakamoto', 'bitcoin-l1', 'stacks-testnet'],
  hiroRpcUrl: 'https://api.mainnet.hiro.so',
  bnsResolution: true,
  accountingExportFormat: 'quickbooks',
  teamName: 'Stacks Treasury & Bitcoin L2 Ops'
};


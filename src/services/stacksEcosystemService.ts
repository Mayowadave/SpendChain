import { 
  StacksNetworkStats, 
  EcosystemHealthData, 
  ProtocolDetail, 
  LiveEcosystemEvent, 
  ClarityContractDeployment, 
  Sip10EcosystemToken, 
  EcosystemNftCollection, 
  EcosystemChartDataPoint 
} from '../types';

// Mock Network Stats
export const INITIAL_NETWORK_STATS: StacksNetworkStats = {
  stxPriceUsd: 0.133,
  priceChange24h: 4.82,
  marketCapUsd: 2715000000,
  circulatingSupply: 1467000000,
  totalTxToday: 48920,
  blocksToday: 144,
  currentBlockHeight: 148920,
  avgBlockTimeSeconds: 600, // Nakamoto fast blocks ~10s - 600s average target
  networkStatus: 'Operational',
  nakamotoEpoch: 'Epoch 3.0 (Nakamoto)',
  bitcoinBlockHeight: 852410,
  mempoolSize: 312,
  lastUpdated: new Date().toISOString(),
};

// Mock Ecosystem Health
export const ECOSYSTEM_HEALTH_DATA: EcosystemHealthData = {
  overallHealthScore: 92,
  networkActivityScore: 94,
  developerActivityScore: 88,
  protocolGrowthScore: 91,
  walletGrowthScore: 89,
  tvlTrendScore: 95,
  activeUsersCount: 18450,
  txGrowthPercent: 18.4,
  aiExplanation: `The Stacks ecosystem is exhibiting robust health driven by post-Nakamoto upgrade block performance and rapid sBTC integration across major DeFi protocols. TVL has expanded by +24.5% month-over-month, led by liquid staking (StackingDAO) and lending pools (Zest Protocol). Developer activity remains high with over 45 new Clarity smart contracts verified this week.`
};

// Protocols Database
export const TOP_PROTOCOLS: ProtocolDetail[] = [
  {
    id: 'alex',
    name: 'ALEX Lab',
    slug: 'alex',
    iconBg: 'from-orange-500 to-amber-600',
    category: 'DeFi & DEX',
    tvlUsd: 84500000,
    volume24hUsd: 12400000,
    weeklyGrowthPercent: 14.2,
    activeUsers24h: 3820,
    totalTransactions24h: 18400,
    riskLevel: 'Audited',
    description: 'ALEX is the premier Bitcoin DeFi protocol on Stacks, offering orderbook and AMM DEX, launchpad, and yield farming powered by Clarity smart contracts.',
    websiteUrl: 'https://alexlab.co',
    auditReportUrl: 'https://alexlab.co/security-audits',
    launchDate: '2022-01-15',
    smartContracts: [
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault',
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.swap-helper-v1-03'
    ],
    protocolHealthScore: 94,
    aiSummary: 'ALEX remains the dominant liquidity venue on Stacks. Its trading volumes correlate strongly with sBTC rollout milestones.',
    riskAnalysis: 'Fully audited by CoinFabrik and Least Authority. Smart contracts enforce strict multi-sig governance and timelock upgrades.',
    news: [
      { title: 'ALEX V2 Liquidity Engine Live on Mainnet', date: '2 days ago', source: 'ALEX Blog' },
      { title: 'sBTC Trading Pairs See Record 24h Volume', date: '1 week ago', source: 'Stacks News' }
    ],
    relatedProtocolIds: ['velar', 'zest', 'stackingdao'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 72000000, volumeUsd: 8500000, users: 3100 },
      { date: 'Jul 25', tvlUsd: 74500000, volumeUsd: 9100000, users: 3300 },
      { date: 'Jul 26', tvlUsd: 78000000, volumeUsd: 10200000, users: 3500 },
      { date: 'Jul 27', tvlUsd: 80200000, volumeUsd: 11000000, users: 3650 },
      { date: 'Jul 28', tvlUsd: 82100000, volumeUsd: 11800000, users: 3720 },
      { date: 'Jul 29', tvlUsd: 83900000, volumeUsd: 12100000, users: 3790 },
      { date: 'Jul 30', tvlUsd: 84500000, volumeUsd: 12400000, users: 3820 }
    ]
  },
  {
    id: 'stackingdao',
    name: 'StackingDAO',
    slug: 'stackingdao',
    iconBg: 'from-indigo-500 to-purple-600',
    category: 'Liquid Staking',
    tvlUsd: 62100000,
    volume24hUsd: 4100000,
    weeklyGrowthPercent: 22.8,
    activeUsers24h: 2940,
    totalTransactions24h: 8900,
    riskLevel: 'Audited',
    description: 'Liquid stacking protocol for Stacks (STX). Users stake STX to receive stSTX, unlocking yield while preserving liquidity across Bitcoin L2 DeFi.',
    websiteUrl: 'https://stackingdao.com',
    launchDate: '2023-11-10',
    smartContracts: [
      'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v1',
      'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token'
    ],
    protocolHealthScore: 96,
    aiSummary: 'StackingDAO has captured over 35% of all stacked STX liquidity. Liquid staking integration across Zest and ALEX continues to accelerate TVL.',
    riskAnalysis: 'Non-custodial smart contracts audited by OpenZeppelin and SECBIT. Automated PoX reward distribution verified on-chain.',
    news: [
      { title: 'stSTX-STX Farm Rewards Boosted for Cycle 88', date: '3 days ago', source: 'StackingDAO X' }
    ],
    relatedProtocolIds: ['alex', 'zest', 'arkadiko'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 48000000, volumeUsd: 2800000, users: 2100 },
      { date: 'Jul 25', tvlUsd: 51200000, volumeUsd: 3100000, users: 2350 },
      { date: 'Jul 26', tvlUsd: 54000000, volumeUsd: 3400000, users: 2500 },
      { date: 'Jul 27', tvlUsd: 57100000, volumeUsd: 3700000, users: 2700 },
      { date: 'Jul 28', tvlUsd: 59500000, volumeUsd: 3900000, users: 2820 },
      { date: 'Jul 29', tvlUsd: 61000000, volumeUsd: 4000000, users: 2900 },
      { date: 'Jul 30', tvlUsd: 62100000, volumeUsd: 4100000, users: 2940 }
    ]
  },
  {
    id: 'zest',
    name: 'Zest Protocol',
    slug: 'zest',
    iconBg: 'from-emerald-500 to-teal-600',
    category: 'Lending & Yield',
    tvlUsd: 38900000,
    volume24hUsd: 6800000,
    weeklyGrowthPercent: 31.5,
    activeUsers24h: 1890,
    totalTransactions24h: 6200,
    riskLevel: 'Audited',
    description: 'On-chain Bitcoin lending protocol built on Stacks. Users supply STX, sBTC, and stSTX to earn yields or borrow native crypto assets.',
    websiteUrl: 'https://zestprotocol.com',
    launchDate: '2024-02-01',
    smartContracts: [
      'SP2VCQ83433500BSB08S32YWZX9E1A2K3GZGFGF4.zest-pool-v1',
      'SP2VCQ83433500BSB08S32YWZX9E1A2K3GZGFGF4.zest-oracle-v1'
    ],
    protocolHealthScore: 92,
    aiSummary: 'Zest Protocol experienced the highest percentage TVL growth this week following the launch of stSTX collateralized pools.',
    riskAnalysis: 'Isolated asset risk tiers, Pyth oracle integrations, and audited liquidation engine prevent cross-pool contamination.',
    news: [
      { title: 'Zest Adds STX Lending Cap Expansion to $50M', date: 'Yesterday', source: 'DeFi Pulse' }
    ],
    relatedProtocolIds: ['stackingdao', 'alex', 'hermetica'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 28000000, volumeUsd: 4200000, users: 1200 },
      { date: 'Jul 25', tvlUsd: 30100000, volumeUsd: 4800000, users: 1380 },
      { date: 'Jul 26', tvlUsd: 32500000, volumeUsd: 5300000, users: 1510 },
      { date: 'Jul 27', tvlUsd: 34800000, volumeUsd: 5900000, users: 1650 },
      { date: 'Jul 28', tvlUsd: 36200000, volumeUsd: 6200000, users: 1740 },
      { date: 'Jul 29', tvlUsd: 37800000, volumeUsd: 6500000, users: 1820 },
      { date: 'Jul 30', tvlUsd: 38900000, volumeUsd: 6800000, users: 1890 }
    ]
  },
  {
    id: 'velar',
    name: 'Velar Protocol',
    slug: 'velar',
    iconBg: 'from-blue-500 to-indigo-600',
    category: 'DeFi & DEX',
    tvlUsd: 21400000,
    volume24hUsd: 5200000,
    weeklyGrowthPercent: 8.7,
    activeUsers24h: 1420,
    totalTransactions24h: 5100,
    riskLevel: 'Audited',
    description: 'Bitcoin DeFi liquidity protocol providing Automated Market Maker (AMM), perpetuals trading, and yield farming infrastructure.',
    websiteUrl: 'https://velar.co',
    launchDate: '2023-08-12',
    smartContracts: [
      'SP1Y5YSTAHZ88XY3F87DB9M132EOA004515YPXCG.velar-core-v2'
    ],
    protocolHealthScore: 89,
    aiSummary: 'Velar provides efficient swaps with concentrated liquidity tiers for STX, VELAR, and MEME ecosystem tokens.',
    riskAnalysis: 'Audited by PeckShield and CertiK. Features timelocked governance and automated slippage controls.',
    news: [
      { title: 'Velar Perpetuals Beta Opens for Stacks Users', date: '4 days ago', source: 'Velar Medium' }
    ],
    relatedProtocolIds: ['alex', 'bitflow', 'gamma'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 19200000, volumeUsd: 4100000, users: 1210 },
      { date: 'Jul 25', tvlUsd: 19800000, volumeUsd: 4400000, users: 1280 },
      { date: 'Jul 26', tvlUsd: 20300000, volumeUsd: 4700000, users: 1320 },
      { date: 'Jul 27', tvlUsd: 20800000, volumeUsd: 4900000, users: 1370 },
      { date: 'Jul 28', tvlUsd: 21000000, volumeUsd: 5000000, users: 1390 },
      { date: 'Jul 29', tvlUsd: 21200000, volumeUsd: 5100000, users: 1410 },
      { date: 'Jul 30', tvlUsd: 21400000, volumeUsd: 5200000, users: 1420 }
    ]
  },
  {
    id: 'hermetica',
    name: 'Hermetica Finance',
    slug: 'hermetica',
    iconBg: 'from-rose-500 to-pink-600',
    category: 'Lending & Yield',
    tvlUsd: 18200000,
    volume24hUsd: 1900000,
    weeklyGrowthPercent: 19.4,
    activeUsers24h: 980,
    totalTransactions24h: 2800,
    riskLevel: 'Audited',
    description: 'Hermetica issues USDh, a Bitcoin-backed yield-bearing stablecoin utilizing delta-neutral hedging strategies on Clarity.',
    websiteUrl: 'https://hermetica.fi',
    launchDate: '2024-03-20',
    smartContracts: [
      'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usdh-token-v1'
    ],
    protocolHealthScore: 91,
    aiSummary: 'USDh is gaining significant traction as a synthetic stablecoin yield asset for Bitcoin holding treasuries on Stacks.',
    riskAnalysis: 'Algorithmic delta-neutral derivative hedging audited by Trail of Bits. Real-time proof of reserves published on-chain.',
    news: [
      { title: 'USDh Yield Reaches 12.4% APY in July', date: '5 days ago', source: 'Hermetica X' }
    ],
    relatedProtocolIds: ['zest', 'arkadiko', 'alex'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 14800000, volumeUsd: 1200000, users: 720 },
      { date: 'Jul 25', tvlUsd: 15600000, volumeUsd: 1400000, users: 790 },
      { date: 'Jul 26', tvlUsd: 16400000, volumeUsd: 1600000, users: 850 },
      { date: 'Jul 27', tvlUsd: 17100000, volumeUsd: 1750000, users: 910 },
      { date: 'Jul 28', tvlUsd: 17600000, volumeUsd: 1820000, users: 940 },
      { date: 'Jul 29', tvlUsd: 17900000, volumeUsd: 1880000, users: 960 },
      { date: 'Jul 30', tvlUsd: 18200000, volumeUsd: 1900000, users: 980 }
    ]
  },
  {
    id: 'arkadiko',
    name: 'Arkadiko Protocol',
    slug: 'arkadiko',
    iconBg: 'from-amber-500 to-yellow-600',
    category: 'DeFi & DEX',
    tvlUsd: 14600000,
    volume24hUsd: 1100000,
    weeklyGrowthPercent: -2.1,
    activeUsers24h: 740,
    totalTransactions24h: 2100,
    riskLevel: 'Audited',
    description: 'Self-repaying loans on Stacks using USDA stablecoin collateralized by STX, xBTC, and stSTX assets.',
    websiteUrl: 'https://arkadiko.finance',
    launchDate: '2021-10-18',
    smartContracts: [
      'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-freddie-v1'
    ],
    protocolHealthScore: 85,
    aiSummary: 'One of the battle-tested OG protocols on Stacks. USDA collateralization ratios remain safe above 190%.',
    riskAnalysis: 'Audited by Kudelski Security. Automated liquidate-on-health ratio engine enforced via Keepers.',
    news: [
      { title: 'Arkadiko V2 Governance Vote Passes', date: '1 week ago', source: 'Arkadiko Forum' }
    ],
    relatedProtocolIds: ['alex', 'hermetica', 'stackingdao'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 15100000, volumeUsd: 1200000, users: 790 },
      { date: 'Jul 25', tvlUsd: 14900000, volumeUsd: 1150000, users: 770 },
      { date: 'Jul 26', tvlUsd: 14800000, volumeUsd: 1120000, users: 760 },
      { date: 'Jul 27', tvlUsd: 14700000, volumeUsd: 1100000, users: 750 },
      { date: 'Jul 28', tvlUsd: 14650000, volumeUsd: 1090000, users: 745 },
      { date: 'Jul 29', tvlUsd: 14620000, volumeUsd: 1095000, users: 742 },
      { date: 'Jul 30', tvlUsd: 14600000, volumeUsd: 1100000, users: 740 }
    ]
  },
  {
    id: 'gamma',
    name: 'Gamma.io',
    slug: 'gamma',
    iconBg: 'from-purple-500 to-pink-500',
    category: 'NFT & Gaming',
    tvlUsd: 9200000,
    volume24hUsd: 2800000,
    weeklyGrowthPercent: 12.4,
    activeUsers24h: 3100,
    totalTransactions24h: 7400,
    riskLevel: 'Audited',
    description: 'The premier open marketplace for Bitcoin Inscriptions and Stacks NFTs, featuring creator minting launchpads and auction suites.',
    websiteUrl: 'https://gamma.io',
    launchDate: '2021-09-01',
    smartContracts: [
      'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.gamma-marketplace-v3'
    ],
    protocolHealthScore: 93,
    aiSummary: 'Gamma dominates the Stacks NFT ecosystem with >85% total marketplace secondary volume share.',
    riskAnalysis: 'Non-custodial escrow smart contracts. Verified creator provenance on Clarity contracts.',
    news: [
      { title: 'Megapont Apes Launch on Gamma Breaking Daily Mint Records', date: '3 days ago', source: 'Gamma News' }
    ],
    relatedProtocolIds: ['velar', 'alex'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 8100000, volumeUsd: 2100000, users: 2400 },
      { date: 'Jul 25', tvlUsd: 8300000, volumeUsd: 2300000, users: 2600 },
      { date: 'Jul 26', tvlUsd: 8600000, volumeUsd: 2500000, users: 2800 },
      { date: 'Jul 27', tvlUsd: 8800000, volumeUsd: 2650000, users: 2950 },
      { date: 'Jul 28', tvlUsd: 9000000, volumeUsd: 2720000, users: 3020 },
      { date: 'Jul 29', tvlUsd: 9150000, volumeUsd: 2780000, users: 3080 },
      { date: 'Jul 30', tvlUsd: 9200000, volumeUsd: 2800000, users: 3100 }
    ]
  },
  {
    id: 'bitflow',
    name: 'Bitflow DEX',
    slug: 'bitflow',
    iconBg: 'from-cyan-500 to-blue-600',
    category: 'DeFi & DEX',
    tvlUsd: 8100000,
    volume24hUsd: 3400000,
    weeklyGrowthPercent: 16.8,
    activeUsers24h: 1250,
    totalTransactions24h: 4200,
    riskLevel: 'Audited',
    description: 'Decentralized exchange optimized for stablecoin and Bitcoin-wrapper pair trading with near-zero slippage curve algorithms.',
    websiteUrl: 'https://bitflow.finance',
    launchDate: '2023-10-05',
    smartContracts: [
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.bitflow-ststx-stx'
    ],
    protocolHealthScore: 90,
    aiSummary: 'Bitflow handles high-volume stSTX/STX and USDh swaps with ultra-low price impact.',
    riskAnalysis: 'Curve-style stableSwap invariant formulas audited by SECBIT.',
    news: [
      { title: 'Bitflow Integrates Pyth Real-time Price Feeds', date: '6 days ago', source: 'Bitflow Blog' }
    ],
    relatedProtocolIds: ['stackingdao', 'hermetica', 'alex'],
    historicalTvl: [
      { date: 'Jul 24', tvlUsd: 6800000, volumeUsd: 2600000, users: 950 },
      { date: 'Jul 25', tvlUsd: 7100000, volumeUsd: 2800000, users: 1050 },
      { date: 'Jul 26', tvlUsd: 7400000, volumeUsd: 3000000, users: 1120 },
      { date: 'Jul 27', tvlUsd: 7700000, volumeUsd: 3200000, users: 1180 },
      { date: 'Jul 28', tvlUsd: 7900000, volumeUsd: 3300000, users: 1210 },
      { date: 'Jul 29', tvlUsd: 8020000, volumeUsd: 3360000, users: 1235 },
      { date: 'Jul 30', tvlUsd: 8100000, volumeUsd: 3400000, users: 1250 }
    ]
  }
];

// Live Ecosystem Activity Stream
export const LIVE_ECOSYSTEM_EVENTS: LiveEcosystemEvent[] = [
  {
    id: 'evt-101',
    type: 'high_value_swap',
    title: 'High-Value Swap on ALEX',
    description: 'Swapped 125,000 STX ($231,250) for stSTX on ALEX Pool',
    timestamp: 'Just now',
    txHash: '0x8f2a9d812...e1a3',
    valueUsd: 231250,
    category: 'DeFi & DEX',
    iconBg: 'from-amber-500 to-orange-600'
  },
  {
    id: 'evt-102',
    type: 'staking_deposit',
    title: 'Large StackingDAO Deposit',
    description: 'Wallet SP2J...39A1 deposited 80,000 STX ($148,000) into Liquid Stacking',
    timestamp: '2 mins ago',
    txHash: '0x3c9e1104a...129f',
    valueUsd: 148000,
    category: 'Liquid Staking',
    iconBg: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'evt-103',
    type: 'contract_deployed',
    title: 'New Contract Verified',
    description: 'Contract "bitcoin-yield-vault-v2" deployed by SP3K...0KBR',
    timestamp: '6 mins ago',
    txHash: '0x12d8a4391...441b',
    category: 'Contracts',
    iconBg: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'evt-104',
    type: 'nft_mint',
    title: 'Megapont Ape #3412 Minted',
    description: 'Minted on Gamma marketplace for 450 STX ($832.50)',
    timestamp: '11 mins ago',
    txHash: '0x77b21e902...81cc',
    valueUsd: 832.5,
    category: 'NFT & Gaming',
    iconBg: 'from-pink-500 to-rose-600'
  },
  {
    id: 'evt-105',
    type: 'large_transfer',
    title: 'Whale STX Transfer',
    description: 'Transferred 350,000 STX ($647,500) from Binance to Stacks Cold Vault',
    timestamp: '18 mins ago',
    txHash: '0x99a128e40...a112',
    valueUsd: 647500,
    category: 'Whale Activity',
    iconBg: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'evt-106',
    type: 'new_token',
    title: 'SIP-010 Token Created',
    description: 'New token "Satoshi BTC Shield" (SBS) deployed with 21,000,000 supply',
    timestamp: '25 mins ago',
    txHash: '0x00f129a03...9188',
    category: 'SIP-010 Tokens',
    iconBg: 'from-purple-500 to-indigo-600'
  }
];

// New Clarity Smart Contracts
export const CLARITY_CONTRACTS: ClarityContractDeployment[] = [
  {
    id: 'c-1',
    contractName: 'sbtc-deposit-gateway-v1',
    contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.sbtc-deposit-gateway-v1',
    deployerAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    blockHeight: 148918,
    deploymentTime: '35 mins ago',
    verified: true,
    explorerLink: 'https://explorer.hiro.so/txid/0xsbtcgateway',
    callsCount24h: 1420,
    category: 'Bridge / sBTC'
  },
  {
    id: 'c-2',
    contractName: 'zest-collateral-ststx-v2',
    contractAddress: 'SP2VCQ83433500BSB08S32YWZX9E1A2K3GZGFGF4.zest-collateral-ststx-v2',
    deployerAddress: 'SP2VCQ83433500BSB08S32YWZX9E1A2K3GZGFGF4',
    blockHeight: 148912,
    deploymentTime: '1.2 hours ago',
    verified: true,
    explorerLink: 'https://explorer.hiro.so/txid/0xzestcollateral',
    callsCount24h: 890,
    category: 'Lending'
  },
  {
    id: 'c-3',
    contractName: 'pyth-oracle-v3-stacks',
    contractAddress: 'SP1Y5YSTAHZ88XY3F87DB9M132EOA004515YPXCG.pyth-oracle-v3-stacks',
    deployerAddress: 'SP1Y5YSTAHZ88XY3F87DB9M132EOA004515YPXCG',
    blockHeight: 148902,
    deploymentTime: '3.4 hours ago',
    verified: true,
    explorerLink: 'https://explorer.hiro.so/txid/0xpythoracle',
    callsCount24h: 4890,
    category: 'Infrastructure'
  },
  {
    id: 'c-4',
    contractName: 'stackingdao-auto-compound',
    contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stackingdao-auto-compound',
    deployerAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    blockHeight: 148880,
    deploymentTime: '6.5 hours ago',
    verified: true,
    explorerLink: 'https://explorer.hiro.so/txid/0xdaoautocompound',
    callsCount24h: 2150,
    category: 'Yield'
  },
  {
    id: 'c-5',
    contractName: 'nakamoto-fast-relayer',
    contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.nakamoto-fast-relayer',
    deployerAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    blockHeight: 148850,
    deploymentTime: '12 hours ago',
    verified: true,
    explorerLink: 'https://explorer.hiro.so/txid/0xnakamotorelayer',
    callsCount24h: 6200,
    category: 'Consensus'
  }
];

// SIP-010 Tokens
export const SIP10_TOKENS: Sip10EcosystemToken[] = [
  {
    id: 'ststx',
    name: 'Stacked STX',
    symbol: 'stSTX',
    logoBg: 'bg-indigo-600',
    totalSupply: 32500000,
    decimals: 6,
    creatorAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    creationDate: '2023-11-10',
    holdersCount: 14200,
    priceUsd: 1.92,
    marketCapUsd: 62400000,
    verified: true,
    riskBadge: 'Verified'
  },
  {
    id: 'alex-token',
    name: 'ALEX Governance Token',
    symbol: 'ALEX',
    logoBg: 'bg-amber-600',
    totalSupply: 1000000000,
    decimals: 8,
    creatorAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    creationDate: '2022-01-15',
    holdersCount: 22400,
    priceUsd: 0.145,
    marketCapUsd: 48200000,
    verified: true,
    riskBadge: 'Verified'
  },
  {
    id: 'usdh',
    name: 'Hermetica USDh',
    symbol: 'USDh',
    logoBg: 'bg-rose-600',
    totalSupply: 18200000,
    decimals: 6,
    creatorAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    creationDate: '2024-03-20',
    holdersCount: 3100,
    priceUsd: 1.002,
    marketCapUsd: 18236000,
    verified: true,
    riskBadge: 'Verified'
  },
  {
    id: 'velar-token',
    name: 'Velar Token',
    symbol: 'VELAR',
    logoBg: 'bg-blue-600',
    totalSupply: 100000000,
    decimals: 6,
    creatorAddress: 'SP1Y5YSTAHZ88XY3F87DB9M132EOA004515YPXCG',
    creationDate: '2023-08-12',
    holdersCount: 8900,
    priceUsd: 0.082,
    marketCapUsd: 8200000,
    verified: true,
    riskBadge: 'Verified'
  },
  {
    id: 'welsh',
    name: 'Welshcorgicoin',
    symbol: 'WELSH',
    logoBg: 'bg-emerald-600',
    totalSupply: 10000000000,
    decimals: 6,
    creatorAddress: 'SP3NE50GEXFG9SZG25MGM32M197BJR33F9S56PQG3',
    creationDate: '2021-03-10',
    holdersCount: 31200,
    priceUsd: 0.0021,
    marketCapUsd: 21000000,
    verified: true,
    riskBadge: 'Community'
  },
  {
    id: 'leo',
    name: 'Leo Cat Token',
    symbol: 'LEO',
    logoBg: 'bg-purple-600',
    totalSupply: 1000000000,
    decimals: 6,
    creatorAddress: 'SP23K81...9113',
    creationDate: '2024-06-01',
    holdersCount: 1890,
    priceUsd: 0.00045,
    marketCapUsd: 450000,
    verified: false,
    riskBadge: 'Unverified'
  }
];

// NFT Collections
export const NFT_COLLECTIONS: EcosystemNftCollection[] = [
  {
    id: 'megapont-apes',
    name: 'Megapont Ape Club',
    symbol: 'APE',
    logoBg: 'from-orange-500 to-rose-600',
    floorPriceStx: 420,
    floorPriceUsd: 777,
    volume24hStx: 18400,
    volume24hUsd: 34040,
    ownersCount: 1240,
    totalSupply: 2500,
    transactions24h: 112,
    dailyChangePercent: 14.2,
    verified: true
  },
  {
    id: 'stacks-parrots',
    name: 'Stacks Parrots',
    symbol: 'PARROT',
    logoBg: 'from-emerald-500 to-teal-600',
    floorPriceStx: 185,
    floorPriceUsd: 342.25,
    volume24hStx: 8200,
    volume24hUsd: 15170,
    ownersCount: 890,
    totalSupply: 1500,
    transactions24h: 54,
    dailyChangePercent: 8.5,
    verified: true
  },
  {
    id: 'btc-monkeys',
    name: 'Bitcoin Monkeys',
    symbol: 'MONKEY',
    logoBg: 'from-amber-500 to-yellow-600',
    floorPriceStx: 310,
    floorPriceUsd: 573.5,
    volume24hStx: 12500,
    volume24hUsd: 23125,
    ownersCount: 1100,
    totalSupply: 2500,
    transactions24h: 78,
    dailyChangePercent: -2.4,
    verified: true
  },
  {
    id: 'crash-punks',
    name: 'Crash Punks',
    symbol: 'CRASH',
    logoBg: 'from-purple-500 to-indigo-600',
    floorPriceStx: 550,
    floorPriceUsd: 1017.5,
    volume24hStx: 21000,
    volume24hUsd: 38850,
    ownersCount: 1450,
    totalSupply: 3000,
    transactions24h: 96,
    dailyChangePercent: 21.0,
    verified: true
  }
];

// Ecosystem Charts Historical Time Series
export const ECOSYSTEM_CHART_DATA: EcosystemChartDataPoint[] = [
  { date: 'Jun 30', transactions: 28400, activeWallets: 12100, tvlUsd: 180000000, protocolVolumeUsd: 18500000, contractsDeployed: 12, stxTransfersUsd: 8500000, nftVolumeUsd: 180000 },
  { date: 'Jul 05', transactions: 31200, activeWallets: 13400, tvlUsd: 195000000, protocolVolumeUsd: 21000000, contractsDeployed: 18, stxTransfersUsd: 9200000, nftVolumeUsd: 210000 },
  { date: 'Jul 10', transactions: 34800, activeWallets: 14200, tvlUsd: 210000000, protocolVolumeUsd: 24500000, contractsDeployed: 22, stxTransfersUsd: 10500000, nftVolumeUsd: 240000 },
  { date: 'Jul 15', transactions: 39100, activeWallets: 15600, tvlUsd: 225000000, protocolVolumeUsd: 28000000, contractsDeployed: 29, stxTransfersUsd: 12100000, nftVolumeUsd: 290000 },
  { date: 'Jul 20', transactions: 42500, activeWallets: 16800, tvlUsd: 238000000, protocolVolumeUsd: 31200000, contractsDeployed: 34, stxTransfersUsd: 13800000, nftVolumeUsd: 330000 },
  { date: 'Jul 25', transactions: 46200, activeWallets: 17700, tvlUsd: 245000000, protocolVolumeUsd: 34800000, contractsDeployed: 39, stxTransfersUsd: 14900000, nftVolumeUsd: 360000 },
  { date: 'Jul 30', transactions: 48920, activeWallets: 18450, tvlUsd: 250000000, protocolVolumeUsd: 36900000, contractsDeployed: 45, stxTransfersUsd: 15800000, nftVolumeUsd: 388500 }
];

/**
 * Service to execute Gemini AI queries for the Stacks Ecosystem Copilot
 */
export async function queryEcosystemAiCopilot(prompt: string, conversationHistory: { sender: string; text: string }[] = []) {
  try {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `[STACKS ECOSYSTEM EXPLORER AI QUERY]: ${prompt}`,
        wallets: [],
        transactions: [],
        analytics: {
          ecosystemHealth: ECOSYSTEM_HEALTH_DATA,
          topProtocols: TOP_PROTOCOLS.map(p => ({ name: p.name, category: p.category, tvl: p.tvlUsd, growth: p.weeklyGrowthPercent })),
          networkStats: INITIAL_NETWORK_STATS
        },
        history: conversationHistory,
        mode: 'ecosystem'
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.analysis || 'No response generated.';
  } catch (err: any) {
    console.error('Ecosystem AI query error:', err);
    return `The Stacks Ecosystem AI Copilot encountered an issue: ${err.message || 'Network error'}. Standard stats show ALEX and StackingDAO lead ecosystem TVL at $84.5M and $62.1M.`;
  }
}

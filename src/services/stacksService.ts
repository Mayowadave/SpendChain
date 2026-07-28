import { Wallet, Transaction, Sip010Token, Sip009Nft, StackingInfo, TransactionCategory, TaxTag } from '../types';

export const STX_PRICE_USD = 1.85;
export const SBTC_PRICE_USD = 92500;

interface HiroBalancesResponse {
  stx?: {
    balance: string;
    total_sent: string;
    total_received: string;
    lock_amount?: string;
    lock_height?: number;
  };
  fungible_tokens?: Record<string, { balance: string; total_sent?: string; total_received?: string }>;
  non_fungible_tokens?: Record<string, { count: string }>;
}

interface HiroTxItem {
  tx_id: string;
  tx_status: string;
  tx_type: string;
  fee_rate: string;
  sender_address: string;
  burn_block_time_iso?: string;
  block_height?: number;
  post_conditions?: any[];
  token_transfer?: {
    recipient_address: string;
    amount: string;
    memo?: string;
  };
  contract_call?: {
    contract_id: string;
    function_name: string;
    function_args?: any[];
  };
}

interface HiroTxResponse {
  results: HiroTxItem[];
  total: number;
}

// In-memory response cache to optimize performance & limit Hiro API load
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 30_000; // 30 seconds cache TTL

async function fetchWithCache<T>(url: string): Promise<T | null> {
  const cached = apiCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    apiCache.set(url, { data, timestamp: Date.now() });
    return data as T;
  } catch (err) {
    console.warn(`Hiro API fetch failed for ${url}:`, err);
    return null;
  }
}

/**
 * Fetch BNS domain name for a given Stacks address
 */
export async function fetchBnsName(address: string): Promise<string | undefined> {
  if (!address) return undefined;
  const url = `https://api.mainnet.hiro.so/v1/addresses/stacks/${address}`;
  const data = await fetchWithCache<any>(url);
  if (data?.names && Array.isArray(data.names) && data.names.length > 0) {
    return data.names[0];
  }
  return undefined;
}

/**
 * Fetch token and STX balances from Hiro API
 */
export async function fetchBalances(address: string) {
  const url = `https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`;
  const data = await fetchWithCache<HiroBalancesResponse>(url);

  let stxBalance = 0;
  let sbtcBalance = 0;
  let lockAmount = 0;
  const sip010Tokens: Sip010Token[] = [];
  const nftHoldings: Sip009Nft[] = [];

  if (data?.stx) {
    stxBalance = Number(data.stx.balance || 0) / 1_000_000;
    lockAmount = Number(data.stx.lock_amount || 0) / 1_000_000;
  }

  // Parse fungible tokens
  if (data?.fungible_tokens) {
    Object.entries(data.fungible_tokens).forEach(([contractId, tokenData]) => {
      const rawBal = Number(tokenData.balance || 0);
      if (rawBal <= 0) return;

      const lowerKey = contractId.toLowerCase();

      if (lowerKey.includes('sbtc')) {
        const amt = rawBal / 100_000_000; // 8 decimals
        sbtcBalance += amt;
        sip010Tokens.push({
          symbol: 'sBTC',
          name: 'Bitcoin L2 Token (sBTC)',
          contractAddress: contractId,
          balance: Number(amt.toFixed(6)),
          valueUsd: Number((amt * SBTC_PRICE_USD).toFixed(2)),
          priceUsd: SBTC_PRICE_USD,
          change24h: 0,
          iconBg: 'bg-amber-500/20 text-amber-400',
        });
      } else if (lowerKey.includes('alex')) {
        const amt = rawBal / 100_000_000;
        sip010Tokens.push({
          symbol: 'ALEX',
          name: 'ALEX Lab Governance',
          contractAddress: contractId,
          balance: Number(amt.toFixed(2)),
          valueUsd: Number((amt * 0.22).toFixed(2)),
          priceUsd: 0.22,
          change24h: 0,
          iconBg: 'bg-indigo-500/20 text-indigo-400',
        });
      } else if (lowerKey.includes('welsh')) {
        const amt = rawBal / 1_000_000;
        sip010Tokens.push({
          symbol: 'WELSH',
          name: 'Welshcorgicoin',
          contractAddress: contractId,
          balance: Number(amt.toFixed(0)),
          valueUsd: Number((amt * 0.0025).toFixed(2)),
          priceUsd: 0.0025,
          change24h: 0,
          iconBg: 'bg-teal-500/20 text-teal-400',
        });
      } else if (lowerKey.includes('ststx')) {
        const amt = rawBal / 1_000_000;
        sip010Tokens.push({
          symbol: 'stSTX',
          name: 'StackingDAO Liquid STX',
          contractAddress: contractId,
          balance: Number(amt.toFixed(2)),
          valueUsd: Number((amt * 2.10).toFixed(2)),
          priceUsd: 2.10,
          change24h: 0,
          iconBg: 'bg-purple-500/20 text-purple-400',
        });
      } else {
        // Generic parsing for any other on-chain SIP-010 token
        const assetParts = contractId.split('::');
        const tokenSymbol = (assetParts[1] || contractId.split('.')[1] || 'FT').toUpperCase();
        const amt = rawBal / 1_000_000;
        sip010Tokens.push({
          symbol: tokenSymbol,
          name: `${tokenSymbol} Token`,
          contractAddress: contractId,
          balance: Number(amt.toFixed(4)),
          valueUsd: 0,
          priceUsd: 0,
          change24h: 0,
          iconBg: 'bg-blue-500/20 text-blue-400',
        });
      }
    });
  }

  // Parse NFTs
  if (data?.non_fungible_tokens) {
    Object.entries(data.non_fungible_tokens).forEach(([contractId, nftData]) => {
      const count = Number(nftData.count || 0);
      if (count <= 0) return;
      const collectionName = contractId.split('.')[1] || 'Stacks NFT Collection';
      nftHoldings.push({
        id: `nft-${contractId}`,
        name: `${collectionName} #${count}`,
        collection: collectionName,
        contractAddress: contractId,
        tokenId: String(count),
        estimatedValueStx: 0,
        estimatedValueUsd: 0,
        imageUrl: '',
      });
    });
  }

  return {
    stxBalance: Number(stxBalance.toFixed(4)),
    sbtcBalance: Number(sbtcBalance.toFixed(6)),
    lockAmount: Number(lockAmount.toFixed(4)),
    sip010Tokens,
    nftHoldings,
  };
}

/**
 * Fetch live transaction history for an address from Hiro API
 */
export async function fetchTransactions(address: string, limit = 50): Promise<Transaction[]> {
  if (!address) return [];
  const url = `https://api.mainnet.hiro.so/extended/v1/address/${address}/transactions?limit=${limit}`;
  const data = await fetchWithCache<any>(url);

  if (!data?.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((txItem: any) => {
    const isSender = (txItem.sender_address || '').toLowerCase() === address.toLowerCase();
    const gasStx = Number(txItem.fee_rate || 0) / 1_000_000;
    const gasUsd = Number((gasStx * STX_PRICE_USD).toFixed(4));
    const timestamp = txItem.burn_block_time_iso || txItem.parent_burn_block_time_iso || new Date().toISOString();

    let type: Transaction['type'] = 'contract_call';
    let tokenSymbol = 'STX';
    let amountCrypto = 0;
    let counterpartyAddress = isSender ? (txItem.contract_call?.contract_id || 'Contract / Recipient') : txItem.sender_address;
    let counterpartyName = 'Stacks L2 Network';
    let clarityFunc: string | undefined = undefined;
    let category: TransactionCategory = 'Clarity Contract Exec';
    let taxTag: TaxTag = 'Deductible Expense';

    if (txItem.tx_type === 'token_transfer' && txItem.token_transfer) {
      type = isSender ? 'outflow' : 'inflow';
      amountCrypto = Number(txItem.token_transfer.amount || 0) / 1_000_000;
      counterpartyAddress = isSender ? txItem.token_transfer.recipient_address : txItem.sender_address;
      counterpartyName = isSender ? 'Recipient Account' : 'Sender Account';
      category = 'Treasury & Transfers';
      taxTag = isSender ? 'Capital Gain/Loss' : 'Taxable Income';
    } else if (txItem.tx_type === 'contract_call' && txItem.contract_call) {
      type = 'contract_call';
      const contractId = txItem.contract_call.contract_id || '';
      const fnName = txItem.contract_call.function_name || '';
      clarityFunc = `${contractId.split('.')[1] || contractId}.${fnName}`;
      counterpartyAddress = contractId;
      counterpartyName = contractId.split('.')[1] || 'Smart Contract';

      // Parse asset transfers inside contract call events if available
      if (Array.isArray(txItem.events)) {
        for (const evt of txItem.events) {
          if (evt.event_type === 'stx_asset' && evt.asset) {
            const rawAmt = Number(evt.asset.amount || 0) / 1_000_000;
            if (rawAmt > 0) {
              amountCrypto = rawAmt;
              tokenSymbol = 'STX';
              break;
            }
          } else if (evt.event_type === 'fungible_token_asset' && evt.asset) {
            const assetId = (evt.asset.asset_id || '').toLowerCase();
            const rawAmt = Number(evt.asset.amount || 0);
            if (rawAmt > 0) {
              if (assetId.includes('sbtc')) {
                amountCrypto = rawAmt / 100_000_000;
                tokenSymbol = 'sBTC';
              } else {
                amountCrypto = rawAmt / 1_000_000;
                tokenSymbol = assetId.split('::')[1] || 'FT';
              }
              break;
            }
          }
        }
      }

      const lowerClarity = clarityFunc.toLowerCase();
      if (lowerClarity.includes('sbtc') || lowerClarity.includes('peg')) {
        category = 'sBTC & Bitcoin Bridge';
        type = 'sbtc_peg_in';
        if (tokenSymbol === 'STX') tokenSymbol = 'sBTC';
        taxTag = 'Capital Gain/Loss';
      } else if (lowerClarity.includes('alex') || lowerClarity.includes('swap') || lowerClarity.includes('vault') || lowerClarity.includes('zest')) {
        category = 'DeFi & Swaps';
        taxTag = 'Capital Gain/Loss';
      } else if (lowerClarity.includes('stack') || lowerClarity.includes('pox') || lowerClarity.includes('delegate')) {
        category = 'PoX & Stacking Yield';
        type = 'stacking_reward';
        taxTag = 'Taxable Income';
      }
    } else if (txItem.tx_type === 'smart_contract') {
      type = 'contract_call';
      clarityFunc = 'deploy-smart-contract';
      counterpartyName = 'Clarity Deployer';
      category = 'Clarity Contract Exec';
      taxTag = 'Deductible Expense';
    } else if (txItem.tx_type === 'coinbase') {
      type = 'inflow';
      category = 'PoX & Stacking Yield';
      taxTag = 'Taxable Income';
      counterpartyName = 'Coinbase Block Reward';
    }

    const price = tokenSymbol === 'sBTC' ? SBTC_PRICE_USD : STX_PRICE_USD;
    const amountUsd = Number((amountCrypto * price).toFixed(2));

    return {
      id: txItem.tx_id,
      hash: txItem.tx_id,
      walletId: `w-${address.substring(0, 8)}`,
      walletAddress: address,
      chain: 'stacks-mainnet',
      timestamp,
      type,
      amountCrypto: Number(amountCrypto.toFixed(6)),
      tokenSymbol,
      amountUsd,
      gasFeeStx: Number(gasStx.toFixed(6)),
      gasFeeUsd: gasUsd,
      clarityFunction: clarityFunc,
      counterpartyName,
      counterpartyAddress,
      postConditionsCount: txItem.post_conditions?.length || 0,
      category,
      taxTag,
      blockHeight: txItem.block_height,
      memo: txItem.token_transfer?.memo,
    };
  });
}

/**
 * High-level service method to build complete wallet portfolio object
 */
export async function fetchFullWalletPortfolio(address: string): Promise<{
  wallet: Wallet;
  transactions: Transaction[];
}> {
  const [bnsName, balances, txs] = await Promise.all([
    fetchBnsName(address),
    fetchBalances(address),
    fetchTransactions(address, 50),
  ]);

  const stxVal = balances.stxBalance * STX_PRICE_USD;
  const sbtcVal = balances.sbtcBalance * SBTC_PRICE_USD;
  const tokenVal = balances.sip010Tokens.reduce((acc, t) => acc + t.valueUsd, 0);
  const totalBalanceUsd = Number((stxVal + sbtcVal + tokenVal).toFixed(2));

  const totalGasStx = txs.reduce((acc, t) => acc + t.gasFeeStx, 0);
  const totalGasUsd = txs.reduce((acc, t) => acc + t.gasFeeUsd, 0);
  const totalSpent = txs.filter(t => t.type === 'outflow' || t.type === 'contract_call').reduce((acc, t) => acc + t.amountUsd, 0);

  const isStacking = balances.lockAmount > 0;
  const stackingInfo: StackingInfo = {
    isStacking,
    stackedStx: isStacking ? balances.lockAmount : 0,
    stackedStxUsd: isStacking ? Number((balances.lockAmount * STX_PRICE_USD).toFixed(2)) : 0,
    poolName: isStacking ? 'PoX Stacking' : undefined,
    currentCycle: isStacking ? 88 : undefined,
    estApyBtc: isStacking ? 8.4 : 0,
    unclaimedBtcRewards: 0,
    unclaimedBtcUsd: 0,
    unlockCycle: isStacking ? 92 : undefined,
  };

  const highGasTxs = txs.filter(t => t.gasFeeStx > 1.0).length;
  const healthScore = Math.max(70, 100 - highGasTxs * 5);

  const wallet: Wallet = {
    id: `w-${address.substring(0, 8)}`,
    address,
    bnsName: bnsName || (address.substring(0, 6) + '...' + address.slice(-4)),
    name: bnsName || `Wallet (${address.substring(0, 6)}...${address.slice(-4)})`,
    chain: 'stacks-mainnet',
    type: 'Stacks (Leather/Xverse)',
    balanceStx: balances.stxBalance,
    balanceSbtc: balances.sbtcBalance,
    balanceUsd: totalBalanceUsd,
    totalSpent30d: Number(totalSpent.toFixed(2)),
    gasSpent30dStx: Number(totalGasStx.toFixed(4)),
    gasSpent30dUsd: Number(totalGasUsd.toFixed(2)),
    healthScore: 98,
    unspentApprovalsCount: 0,
    clarityCalls30d: txs.filter(t => t.clarityFunction).length,
    sip010Tokens: balances.sip010Tokens,
    nftHoldings: balances.nftHoldings,
    stackingInfo,
  };

  return {
    wallet,
    transactions: txs,
  };
}

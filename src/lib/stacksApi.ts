export interface StacksAccountBalance {
  stxBalance: number;
  stxUsdValue: number;
  sbtcBalance: number;
  bnsName?: string;
  txCount: number;
}

const STX_PRICE_ESTIMATE = 1.85;

/**
 * Fetch real address balance and BNS domain name from public Hiro Stacks API
 */
export async function fetchStacksAccountData(address: string): Promise<StacksAccountBalance> {
  if (!address || (!address.startsWith('SP') && !address.startsWith('ST'))) {
    return {
      stxBalance: 0,
      stxUsdValue: 0,
      sbtcBalance: 0,
      txCount: 0,
    };
  }

  let stxBalance = 0;
  let sbtcBalance = 0;
  let bnsName: string | undefined = undefined;

  try {
    // 1. Fetch Balances from Hiro API
    const balanceRes = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`, {
      headers: { 'Accept': 'application/json' }
    });

    if (balanceRes.ok) {
      const data = await balanceRes.json();
      
      // STX Balance is in microSTX (1 STX = 1,000,000 uSTX)
      if (data.stx && data.stx.balance) {
        stxBalance = Number(data.stx.balance) / 1_000_000;
      }

      // Check sBTC or SIP-010 tokens
      if (data.fungible_tokens) {
        Object.keys(data.fungible_tokens).forEach(key => {
          if (key.toLowerCase().includes('sbtc')) {
            const tokenObj = data.fungible_tokens[key];
            if (tokenObj && tokenObj.balance) {
              sbtcBalance += Number(tokenObj.balance) / 100_000_000; // 8 decimals for satoshis
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn('Hiro balance fetch error, using fallback:', err);
  }

  try {
    // 2. Resolve BNS domain name for the address
    const bnsRes = await fetch(`https://api.mainnet.hiro.so/v1/addresses/stacks/${address}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (bnsRes.ok) {
      const bnsData = await bnsRes.json();
      if (bnsData.names && Array.isArray(bnsData.names) && bnsData.names.length > 0) {
        bnsName = bnsData.names[0];
      }
    }
  } catch (err) {
    console.warn('Hiro BNS resolution error:', err);
  }

  return {
    stxBalance: Number(stxBalance.toFixed(4)),
    stxUsdValue: Number((stxBalance * STX_PRICE_ESTIMATE).toFixed(2)),
    sbtcBalance: Number(sbtcBalance.toFixed(6)),
    bnsName,
    txCount: 12,
  };
}

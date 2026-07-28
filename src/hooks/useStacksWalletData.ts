import { useState, useEffect, useCallback, useRef } from 'react';
import { Wallet, Transaction } from '../types';
import { fetchFullWalletPortfolio } from '../services/stacksService';

export interface UseStacksWalletDataResult {
  data: {
    wallet: Wallet;
    transactions: Transaction[];
  } | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

// In-memory hook cache across component renders
const dataCache = new Map<string, {
  wallet: Wallet;
  transactions: Transaction[];
  timestamp: number;
}>();

const CACHE_TTL_MS = 60_000; // 1 minute hook cache

export function useStacksWalletData(address?: string): UseStacksWalletDataResult {
  const [data, setData] = useState<UseStacksWalletDataResult['data']>(() => {
    if (!address) return null;
    const cached = dataCache.get(address.toLowerCase());
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { wallet: cached.wallet, transactions: cached.transactions };
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(!data && Boolean(address));
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => data ? new Date() : null);

  const activeFetchRef = useRef<string | null>(null);

  const loadWalletData = useCallback(async (targetAddress: string, force = false) => {
    if (!targetAddress) return;

    const cacheKey = targetAddress.toLowerCase();
    const cached = dataCache.get(cacheKey);

    if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setData({ wallet: cached.wallet, transactions: cached.transactions });
      setLoading(false);
      setError(null);
      return;
    }

    activeFetchRef.current = cacheKey;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFullWalletPortfolio(targetAddress);

      // Only update if current target address matches requested fetch
      if (activeFetchRef.current === cacheKey) {
        dataCache.set(cacheKey, {
          wallet: result.wallet,
          transactions: result.transactions,
          timestamp: Date.now(),
        });

        setData(result);
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      if (activeFetchRef.current === cacheKey) {
        console.error('Error fetching Stacks wallet data:', err);
        setError(err.message || 'Failed to sync with Stacks blockchain API.');
      }
    } finally {
      if (activeFetchRef.current === cacheKey) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (address) {
      loadWalletData(address);
    } else {
      setData(null);
      setLoading(false);
      setError(null);
    }
  }, [address, loadWalletData]);

  const refetch = useCallback(async () => {
    if (address) {
      await loadWalletData(address, true);
    }
  }, [address, loadWalletData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
  };
}

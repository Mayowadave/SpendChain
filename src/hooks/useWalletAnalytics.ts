import { useMemo } from 'react';
import { Transaction } from '../types';
import { calculateWalletAnalytics, WalletAnalytics, generateAiInsights, AiInsightCard } from '../services/analyticsEngine';

export function useWalletAnalytics(transactions: Transaction[], walletAddress?: string): WalletAnalytics {
  return useMemo(() => {
    return calculateWalletAnalytics(transactions, walletAddress);
  }, [transactions, walletAddress]);
}

export function useAiInsights(analytics: WalletAnalytics): AiInsightCard[] {
  return useMemo(() => {
    return generateAiInsights(analytics);
  }, [analytics]);
}


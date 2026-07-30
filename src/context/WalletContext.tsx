import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  WalletAccount, 
  WalletProviderId, 
  WalletAdapter, 
  getAllWalletAdapters, 
  getWalletAdapter, 
  formatAddress 
} from '../lib/wallets';
import { fetchStacksAccountData, StacksAccountBalance } from '../lib/stacksApi';

const STORAGE_KEY = 'spendchain_stacks_wallet_session_v2';

export interface WalletContextState {
  walletSession: WalletAccount | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectingWalletId: WalletProviderId | null;
  error: string | null;
  accountData: StacksAccountBalance | null;
  formattedAddress: string;
  availableWallets: Array<WalletAdapter & { installed: boolean }>;
  connectWallet: (walletId: WalletProviderId) => Promise<void>;
  disconnectWallet: () => void;
  clearError: () => void;
  refreshAccountData: () => Promise<void>;
}

const WalletContext = createContext<WalletContextState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletSession, setWalletSession] = useState<WalletAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectingWalletId, setConnectingWalletId] = useState<WalletProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<StacksAccountBalance | null>(null);

  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});

  const checkInstalledWallets = useCallback(() => {
    const map: Record<string, boolean> = {};
    getAllWalletAdapters().forEach(adapter => {
      map[adapter.info.id] = adapter.isInstalled();
    });
    setInstalledMap(map);
  }, []);

  useEffect(() => {
    checkInstalledWallets();
    const t1 = setTimeout(checkInstalledWallets, 500);
    const t2 = setTimeout(checkInstalledWallets, 1500);
    window.addEventListener('focus', checkInstalledWallets);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('focus', checkInstalledWallets);
    };
  }, [checkInstalledWallets]);

  // Re-check installed status for registered wallets
  const availableWallets = useMemo(() => {
    return getAllWalletAdapters().map(adapter => ({
      ...adapter,
      installed: Boolean(installedMap[adapter.info.id]),
    }));
  }, [installedMap]);

  // Fetch real on-chain Hiro API data when address is available
  const refreshAccountData = useCallback(async () => {
    if (!walletSession?.address) {
      setAccountData(null);
      return;
    }

    try {
      const data = await fetchStacksAccountData(walletSession.address);
      setAccountData(data);

      // If BNS name resolved, update walletSession object
      if (data.bnsName && data.bnsName !== walletSession.bnsName) {
        setWalletSession(prev => prev ? { ...prev, bnsName: data.bnsName } : null);
      }
    } catch (err) {
      console.warn('Failed to load Hiro Stacks address data:', err);
    }
  }, [walletSession?.address, walletSession?.bnsName]);

  // Sync session to localStorage & load balance on session change
  useEffect(() => {
    if (walletSession) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(walletSession));
      } catch (e) {
        console.warn('Could not save wallet session:', e);
      }
      refreshAccountData();
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAccountData(null);
    }
  }, [walletSession, refreshAccountData]);

  // Connect Wallet Action
  const connectWallet = useCallback(async (walletId: WalletProviderId) => {
    setError(null);
    setIsConnecting(true);
    setConnectingWalletId(walletId);

    try {
      const adapter = getWalletAdapter(walletId);

      // Directly attempt wallet adapter connection so sats-connect / RPC standard can execute
      const account = await adapter.connect();

      // Retrieve BNS name if available
      try {
        const initialData = await fetchStacksAccountData(account.address);
        if (initialData.bnsName) {
          account.bnsName = initialData.bnsName;
        }
        setAccountData(initialData);
      } catch (err) {
        console.warn('Initial BNS lookup error:', err);
      }

      setWalletSession(account);
    } catch (err: any) {
      if (err.message === 'USER_REJECTED') {
        setError('Connection request was cancelled or closed. Click connect again when ready, or use the 1-Click Sample Address / Manual Entry option.');
      } else {
        console.error(`Error connecting to ${walletId}:`, err);

        if (err.message === 'IFRAME_EXTENSION_RESTRICTED') {
          setError('Web3 browser extensions block popups inside embedded preview frames for security. Please click "Open in Standalone Tab ↗" above to connect directly on PC, or switch to "Manual Address or .btc" tab.');
        } else if (err.message === 'WALLET_TIMEOUT') {
          setError('Wallet connection timed out or extension popup was closed/locked. Please unlock your browser extension (Leather or Xverse), verify your PIN, and try connecting again, or use the "Manual Address or .btc" tab.');
        } else if (err.message === 'XVERSE_PERMISSION_DENIED') {
          setError('Connection request was not approved in Xverse. Please unlock your Xverse extension, verify permissions under Xverse Settings -> Connected Apps, or enter your Stacks address manually.');
        } else if (err.message === 'XVERSE_NOT_INSTALLED') {
          setError('Xverse wallet extension was not detected in this browser. Please install Xverse or enter your Stacks address in the Manual tab.');
        } else if (err.message === 'LEATHER_NOT_INSTALLED') {
          setError('Leather wallet extension was not detected. Please install Leather or enter your address in the Manual tab.');
        } else {
          setError(err.message || `Failed to connect ${walletId} wallet. Please try again or use manual address entry.`);
        }
      }
    } finally {
      setIsConnecting(false);
      setConnectingWalletId(null);
    }
  }, []);

  // Disconnect Wallet Action
  const disconnectWallet = useCallback(() => {
    if (walletSession?.walletType) {
      try {
        const adapter = getWalletAdapter(walletSession.walletType);
        adapter.disconnect().catch(() => {});
      } catch (e) {
        // ignore error on disconnect
      }
    }

    setWalletSession(null);
    setAccountData(null);
    setError(null);
  }, [walletSession?.walletType]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const formattedAddress = useMemo(() => {
    if (!walletSession?.address) return '';
    if (walletSession.bnsName) return walletSession.bnsName;
    return formatAddress(walletSession.address);
  }, [walletSession]);

  const value: WalletContextState = {
    walletSession,
    isConnected: Boolean(walletSession?.address),
    isConnecting,
    connectingWalletId,
    error,
    accountData,
    formattedAddress,
    availableWallets,
    connectWallet,
    disconnectWallet,
    clearError,
    refreshAccountData,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export function useWallet(): WalletContextState {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

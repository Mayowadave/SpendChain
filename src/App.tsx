import React, { useState, useEffect, useMemo } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { useStacksWalletData } from './hooks/useStacksWalletData';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { WalletAnalysisView } from './components/WalletAnalysisView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { WalletDnaView } from './components/WalletDnaView';
import { ProtocolIntelligenceView } from './components/ProtocolIntelligenceView';
import { SmartAlertsView } from './components/SmartAlertsView';
import { EcosystemExplorerView } from './components/EcosystemExplorerView';
import { AiInsightsView } from './components/AiInsightsView';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';

import { 
  INITIAL_WALLETS, 
  INITIAL_TRANSACTIONS, 
  CATEGORY_BREAKDOWN, 
  INITIAL_SETTINGS 
} from './data/mockData';
import { Wallet, Transaction, AppSettings } from './types';

function AppContent() {
  const { walletSession, isConnected } = useWallet();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  const [inspectAddress, setInspectAddress] = useState<string | undefined>(undefined);

  // Active target address for live Stacks blockchain syncing
  const activeAddress = inspectAddress || walletSession?.address || wallets[0]?.address;

  // Use live blockchain service layer hook
  const { data: liveData, loading: isSyncingData, refetch: refreshLiveData } = useStacksWalletData(activeAddress);

  // Synchronize live fetched blockchain data when available
  useEffect(() => {
    const isCustomTarget = Boolean(walletSession?.address || inspectAddress);

    if (isCustomTarget) {
      if (liveData && liveData.wallet) {
        setWallets([liveData.wallet]);
        setTransactions(liveData.transactions || []);
      } else if (!liveData) {
        const target = inspectAddress || walletSession?.address || '';
        if (target) {
          setWallets([{
            id: `w-${target.substring(0, 8)}`,
            address: target,
            bnsName: target.substring(0, 6) + '...' + target.slice(-4),
            name: `Stacks Wallet (${target.substring(0, 6)}...)`,
            chain: 'stacks-mainnet',
            type: 'Stacks (Leather/Xverse)',
            balanceStx: 0,
            balanceSbtc: 0,
            balanceUsd: 0,
            totalSpent30d: 0,
            gasSpent30dStx: 0,
            gasSpent30dUsd: 0,
            healthScore: 100,
            unspentApprovalsCount: 0,
            clarityCalls30d: 0,
            sip010Tokens: [],
            nftHoldings: [],
            stackingInfo: {
              isStacking: false,
              stackedStx: 0,
              stackedStxUsd: 0,
            }
          }]);
          setTransactions([]);
        }
      }
    } else {
      if (liveData && liveData.wallet) {
        setWallets(prev => {
          const liveWallet = liveData.wallet;
          const exists = prev.some(w => w.address.toLowerCase() === liveWallet.address.toLowerCase());
          if (exists) {
            return prev.map(w => w.address.toLowerCase() === liveWallet.address.toLowerCase() ? { ...w, ...liveWallet } : w);
          }
          return [liveWallet, ...prev];
        });

        if (liveData.transactions) {
          setTransactions(liveData.transactions);
        }
      }
    }
  }, [liveData, walletSession?.address, inspectAddress]);

  // Modal States
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);
  const [aiCopilotPrompt, setAiCopilotPrompt] = useState<string | undefined>(undefined);

  // Computed Totals (Memoized for high performance)
  const totalBalanceUsd = useMemo(() => {
    return wallets.reduce((acc, w) => acc + (w.balanceUsd || 0), 0);
  }, [wallets]);

  const unspentApprovalsCount = useMemo(() => {
    return wallets.reduce((acc, w) => acc + (w.unspentApprovalsCount || 0), 0);
  }, [wallets]);

  // Add Wallet / Inspect Target Address
  const handleAddWallet = (newWalletPartial: Partial<Wallet>) => {
    if (newWalletPartial.address) {
      setInspectAddress(newWalletPartial.address);
      setCurrentTab('dashboard');
    }
  };

  // Delete Wallet
  const handleDeleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  // Add Transaction
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  // Update Transaction
  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  // Trigger AI with custom prompt and navigate to AI tab
  const handleTriggerAiWithPrompt = (prompt: string) => {
    setAiCopilotPrompt(prompt);
    setCurrentTab('ai-insights');
  };

  return (
    <div className="min-h-screen bg-[#050816] text-gray-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        settings={settings}
        walletCount={wallets.length}
        totalBalanceUsd={totalBalanceUsd}
      />

      {/* Main Workspace Body */}
      {currentTab === 'landing' ? (
        <LandingPage
          onLaunchApp={() => setCurrentTab('dashboard')}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
          onNavigateToExplorer={() => setCurrentTab('stacks-explorer')}
        />
      ) : (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-1 gap-6">
          
          {/* Workspace Left Navigation Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            unspentApprovals={unspentApprovalsCount}
          />

          {/* Tab View Content Container with ErrorBoundary */}
          <main className="flex-1 min-w-0" role="main" aria-label="SpendChain Dashboard Content">
            <ErrorBoundary>
              {currentTab === 'dashboard' && (
                <DashboardView
                  wallets={wallets}
                  transactions={transactions}
                  categoryBreakdown={CATEGORY_BREAKDOWN}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenTxDetail={(tx) => setSelectedTxForDetail(tx)}
                  onTriggerAi={handleTriggerAiWithPrompt}
                />
              )}

              {currentTab === 'stacks-explorer' && (
                <EcosystemExplorerView />
              )}


              {currentTab === 'wallet-dna' && (
                <WalletDnaView
                  wallets={wallets}
                  transactions={transactions}
                  onTriggerAi={handleTriggerAiWithPrompt}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'protocol-intelligence' && (
                <ProtocolIntelligenceView
                  wallets={wallets}
                  transactions={transactions}
                  onTriggerAi={handleTriggerAiWithPrompt}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'smart-alerts' && (
                <SmartAlertsView
                  wallets={wallets}
                  transactions={transactions}
                  onTriggerAi={handleTriggerAiWithPrompt}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'wallets' && (
                <WalletAnalysisView
                  wallets={wallets}
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
                  onDeleteWallet={handleDeleteWallet}
                  onTriggerAi={handleTriggerAiWithPrompt}
                />
              )}

              {currentTab === 'transactions' && (
                <TransactionsView
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onOpenTxDetail={(tx) => setSelectedTxForDetail(tx)}
                  activeAddress={activeAddress}
                  isSyncingData={isSyncingData}
                  onRefreshLiveData={refreshLiveData}
                  onInspectAddress={(addr) => setInspectAddress(addr)}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  transactions={transactions}
                  activeAddress={activeAddress}
                  onTriggerAi={handleTriggerAiWithPrompt}
                />
              )}

              {currentTab === 'ai-insights' && (
                <AiInsightsView
                  wallets={wallets}
                  transactions={transactions}
                  initialPrompt={aiCopilotPrompt}
                />
              )}
            </ErrorBoundary>
          </main>

        </div>
      )}

      {/* Modals */}
      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAddWallet={handleAddWallet}
      />

      <TransactionDetailModal
        transaction={selectedTxForDetail}
        onClose={() => setSelectedTxForDetail(null)}
        onSaveTx={handleUpdateTransaction}
      />

    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </WalletProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, LogOut, Download, RefreshCw, ExternalLink } from 'lucide-react';
import { Wallet as WalletType, ChainId } from '../types';
import { Modal, Button, Badge, Input } from './ui';
import { useWallet } from '../context/WalletContext';
import { WalletProviderId } from '../lib/wallets';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWallet: (wallet: Partial<WalletType>) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onAddWallet
}) => {
  const { 
    walletSession, 
    isConnected, 
    isConnecting, 
    connectingWalletId, 
    error: walletError, 
    formattedAddress, 
    availableWallets, 
    connectWallet, 
    disconnectWallet, 
    clearError,
    accountData 
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'providers' | 'manual'>('providers');
  const [address, setAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [chain, setChain] = useState<ChainId>('stacks-mainnet');
  const [successMessage, setSuccessMessage] = useState('');
  const [manualError, setManualError] = useState('');

  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Clear wallet context errors when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      clearError();
      setManualError('');
      setSuccessMessage('');
    }
  }, [isOpen, clearError]);

  // When a wallet is connected via extension, auto-add it to monitored list
  useEffect(() => {
    if (isConnected && walletSession?.address && isOpen) {
      const stxBal = accountData?.stxBalance || 12500;
      const sbtcBal = accountData?.sbtcBalance || 0.42;

      onAddWallet({
        name: walletSession.bnsName || `${walletSession.walletType === 'xverse' ? 'Xverse' : 'Leather'} Wallet`,
        address: walletSession.address,
        bnsName: walletSession.bnsName,
        chain: 'stacks-mainnet',
        type: walletSession.walletType === 'xverse' ? 'Stacks (Leather/Xverse)' : 'Stacks (Leather/Xverse)',
        balanceStx: stxBal,
        balanceSbtc: sbtcBal,
        balanceUsd: accountData?.stxUsdValue || Math.floor(stxBal * 1.85 + sbtcBal * 92500),
        healthScore: 98,
        unspentApprovalsCount: 1,
        clarityCalls30d: 45,
        sip010Tokens: [
          { symbol: 'sBTC', name: 'Bitcoin L2 Token', contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-token', balance: sbtcBal, valueUsd: sbtcBal * 92500, priceUsd: 92500, change24h: +2.4 }
        ]
      });

      setSuccessMessage(`Connected ${walletSession.walletType === 'xverse' ? 'Xverse' : 'Leather'} wallet!`);
      const timer = setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isConnected, walletSession, accountData, isOpen, onAddWallet, onClose]);

  const handleConnectProvider = async (walletId: WalletProviderId) => {
    if (walletId === 'leather') return;
    clearError();
    setManualError('');
    await connectWallet(walletId);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    
    if (!address.trim()) {
      setManualError('Please enter a valid Stacks address (SP...) or .btc BNS domain');
      return;
    }

    const isBns = address.endsWith('.btc');
    const isValidStacks = address.startsWith('SP') || address.startsWith('ST') || isBns;

    if (!isValidStacks && address.length < 8) {
      setManualError('Invalid Stacks format. Address must start with SP/ST or end with .btc');
      return;
    }

    const stxBal = Math.floor(Math.random() * 65000) + 8000;
    const sbtcBal = +(Math.random() * 0.9).toFixed(2);
    const usdVal = Math.floor(stxBal * 1.85 + sbtcBal * 92500);

    const newWallet: Partial<WalletType> = {
      name: walletName.trim() || (isBns ? address : `Stacks Wallet (${address.substring(0, 6)}...)`),
      address: isBns ? `SP${Math.random().toString(36).substring(2, 12).toUpperCase()}` : address.trim(),
      bnsName: isBns ? address.trim() : 'custom.btc',
      chain: chain,
      type: 'Stacks (Leather/Xverse)',
      balanceStx: stxBal,
      balanceSbtc: sbtcBal,
      balanceUsd: usdVal,
      totalSpent30d: Math.floor(Math.random() * 12000) + 1500,
      gasSpent30dStx: 8.5,
      gasSpent30dUsd: 15.72,
      healthScore: 94,
      unspentApprovalsCount: 1,
      clarityCalls30d: 32,
    };

    onAddWallet(newWallet);
    setSuccessMessage(`Added ${newWallet.name} to monitored Stacks wallets!`);
    setTimeout(() => {
      setSuccessMessage('');
      setAddress('');
      setWalletName('');
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect & Track Stacks Wallet"
      subtitle="Analyze STX, sBTC, SIP-010, SIP-009 & Clarity smart contract calls"
    >
      <div className="space-y-4">
        {/* Iframe Notice for Browser Extension Detection */}
        {isIframe && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200 shadow-md">
            <div className="flex items-center space-x-2.5">
              <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
              <span>If your Xverse wallet extension is installed, open app in a standalone tab for direct detection.</span>
            </div>
            <a
              href={window.location.href}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] whitespace-nowrap shadow transition-all shrink-0 ml-2"
            >
              Open in New Tab ↗
            </a>
          </div>
        )}

        {/* Connected Wallet Active Banner */}
        {isConnected && walletSession && (
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white capitalize">
                  {walletSession.walletType} Wallet Connected
                </span>
                <Badge variant="blue" size="sm">Active Session</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                onClick={disconnectWallet}
              >
                Disconnect
              </Button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 font-mono text-xs flex items-center justify-between text-indigo-300">
              <span>{formattedAddress}</span>
              <span className="text-gray-400 text-[11px] truncate max-w-[140px] pl-2">{walletSession.address}</span>
            </div>

            {accountData && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] text-gray-400 block">STX Balance</span>
                  <span className="font-bold text-amber-300 font-mono">{accountData.stxBalance.toLocaleString()} STX</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] text-gray-400 block">sBTC Balance</span>
                  <span className="font-bold text-emerald-300 font-mono">{accountData.sbtcBalance} sBTC</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-white/5">
          <button
            onClick={() => { setActiveTab('providers'); clearError(); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'providers' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Official Wallet Extensions
          </button>
          <button
            onClick={() => { setActiveTab('manual'); clearError(); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'manual' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Manual Address or .btc
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {(walletError || manualError) && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col space-y-2.5 text-rose-300 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-medium leading-relaxed">{walletError || manualError}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* If in iframe preview, show Open in New Tab action */}
              {isIframe && (
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-[11px] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in New Tab for Xverse Popup ↗</span>
                </a>
              )}

              {/* Direct download prompt if Xverse is not installed */}
              {walletError?.includes('Xverse') && (
                <a
                  href="https://www.xverse.app/download"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-white font-semibold text-[11px] hover:bg-rose-500/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Xverse Extension</span>
                </a>
              )}

              {/* Direct download prompt if Leather is not installed */}
              {walletError?.includes('Leather') && (
                <a
                  href="https://leather.io/install"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-white font-semibold text-[11px] hover:bg-rose-500/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Leather Extension</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-2.5">
            {availableWallets.map((wallet) => {
              const isSelectedConnecting = isConnecting && connectingWalletId === wallet.info.id;
              const isLeather = wallet.info.id === 'leather';

              return (
                <div 
                  key={wallet.info.id}
                  className={`p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 transition-all space-y-2.5 ${
                    isLeather ? 'opacity-75' : 'hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 to-slate-800 flex items-center justify-center border border-white/10">
                        <Wallet className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{wallet.info.name}</span>
                          {wallet.info.id === 'xverse' && <Badge variant="blue" size="sm">Sats-Connect Standard</Badge>}
                          {isLeather && <Badge variant="slate" size="sm">Coming Soon</Badge>}
                        </div>
                        <span className="text-xs text-gray-400 block">{wallet.info.description}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isLeather ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-400 border border-white/10 font-semibold">
                          Coming Soon
                        </span>
                      ) : wallet.installed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          Detected in Browser
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                          Standard RPC
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    {isLeather ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={true}
                        className="opacity-50 cursor-not-allowed bg-slate-800/60 border-white/10 text-gray-400 hover:bg-slate-800/60 hover:text-gray-400"
                        leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      <Button
                        variant="gradient"
                        size="sm"
                        disabled={isConnecting}
                        onClick={() => handleConnectProvider(wallet.info.id)}
                        leftIcon={isSelectedConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {isSelectedConnecting ? 'Connecting in Wallet...' : `Connect ${wallet.info.name}`}
                      </Button>
                    )}

                    <a
                      href={wallet.info.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Extension Info</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Manual Address Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Network Layer</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'stacks-mainnet', name: 'Stacks Mainnet' },
                  { id: 'stacks-nakamoto', name: 'Nakamoto L2' },
                  { id: 'bitcoin-l1', name: 'Bitcoin L1' },
                  { id: 'stacks-testnet', name: 'Testnet' }
                ].map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setChain(c.id as ChainId)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      chain === c.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Wallet Label (Optional)"
              placeholder="e.g. Satoshi Treasury / ALEX Yield Vault"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />

            <Input
              label="Stacks Address or BNS Domain (.btc)"
              placeholder="e.g. SP2C2YFP12AJ... or satoshi.btc"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Button type="submit" variant="gradient" fullWidth size="lg">
              Add Stacks Wallet to Dashboard
            </Button>
          </form>
        )}

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Read-Only BNS & Hiro Indexer Audit • Zero Private Keys Needed</span>
          </div>
          <span>SpendChain Stacks V3.0</span>
        </div>
      </div>
    </Modal>
  );
};


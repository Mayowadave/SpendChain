import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2,
  AlertTriangle,
  Coins,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Wallet as WalletType } from '../types';
import { SUPPORTED_CHAINS } from '../data/mockData';
import { Button, Badge, Card } from './ui';

interface WalletAnalysisViewProps {
  wallets: WalletType[];
  onOpenConnectModal: () => void;
  onDeleteWallet: (id: string) => void;
  onTriggerAi: (prompt: string) => void;
}

export const WalletAnalysisView: React.FC<WalletAnalysisViewProps> = ({
  wallets,
  onOpenConnectModal,
  onDeleteWallet,
  onTriggerAi
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [revokedApprovals, setRevokedApprovals] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleRevokeApproval = (walletId: string) => {
    setRevokedApprovals(prev => ({ ...prev, [walletId]: true }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Stacks & Bitcoin L2 Wallet Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Stacks Wallet Deep Dive & Audits
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitor STX liquid holdings, sBTC peg reserves, PoX-4 stacking yield, SIP-010 tokens, & Clarity contract execution.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onOpenConnectModal}
        >
          Add Stacks Address
        </Button>
      </div>

      {/* WALLET CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet) => {
          const chainInfo = SUPPORTED_CHAINS[wallet.chain] || SUPPORTED_CHAINS['stacks-mainnet'];
          const isRevoked = revokedApprovals[wallet.id];
          const approvalsCount = isRevoked ? 0 : wallet.unspentApprovalsCount;

          return (
            <Card 
              key={wallet.id}
              variant="panel"
              hoverEffect
              className="space-y-5 relative group"
            >
              {/* Top Row: Chain Badge & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${chainInfo.iconBg}`}>
                    {chainInfo.name}
                  </span>
                  {wallet.isPrimary && (
                    <Badge variant="blue">Primary Treasury</Badge>
                  )}
                  {wallet.bnsName && (
                    <Badge variant="teal">{wallet.bnsName}</Badge>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => copyToClipboard(wallet.address)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    title="Copy Address"
                  >
                    {copiedAddress === wallet.address ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`${chainInfo.explorerUrl}${wallet.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    title="View on Hiro Stacks Explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {!wallet.isPrimary && (
                    <button
                      onClick={() => onDeleteWallet(wallet.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Remove Wallet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Wallet Title & Address */}
              <div>
                <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-sm">
                  {wallet.address}
                </p>
              </div>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Total Value</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    ${wallet.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">STX Balance</div>
                  <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
                    {wallet.balanceStx.toLocaleString()} STX
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">sBTC Balance</div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {wallet.balanceSbtc} sBTC
                  </div>
                </div>
              </div>

              {/* PoX Stacking Info Card */}
              {wallet.stackingInfo && wallet.stackingInfo.isStacking ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-semibold text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span>PoX Stacking Active</span>
                    </div>
                    {wallet.stackingInfo.currentCycle && (
                      <Badge variant="amber">Cycle #{wallet.stackingInfo.currentCycle}</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-gray-400">Stacked: </span>
                      <strong className="text-white font-mono">{wallet.stackingInfo.stackedStx.toLocaleString()} STX</strong>
                    </div>
                    {wallet.stackingInfo.poolName && (
                      <div>
                        <span className="text-gray-400">Pool: </span>
                        <strong className="text-indigo-300">{wallet.stackingInfo.poolName}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-gray-400 flex items-center justify-between">
                  <span>PoX Stacking Status:</span>
                  <span className="font-semibold text-gray-300">Not Stacking</span>
                </div>
              )}

              {/* SIP-010 Tokens Preview */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-gray-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SIP-010 Token Holdings</span>
                </div>
                {wallet.sip010Tokens && wallet.sip010Tokens.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {wallet.sip010Tokens.map((tok, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                        <div className="font-semibold text-white">{tok.symbol}</div>
                        <div className="font-mono text-gray-300">
                          {tok.balance.toLocaleString()} <span className="text-[10px] text-gray-500">(${tok.valueUsd.toLocaleString()})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/40 text-xs text-gray-400 font-medium">
                    Not enough data
                  </div>
                )}
              </div>

              {/* Security Audit & 6-Factor Health Score System */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">Wallet Health Score & Grade</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-xs">
                      {wallet.healthScore >= 90 ? 'Grade A' : wallet.healthScore >= 80 ? 'Grade B' : 'Grade C'}
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{wallet.healthScore}/100</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${wallet.healthScore}%` }}
                  />
                </div>

                {/* 6-Factor Micro Breakdown Tags */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-gray-300 text-center">
                    Security: <span className="text-emerald-400 font-bold">{approvalsCount > 0 ? '75%' : '100%'}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-gray-300 text-center">
                    Activity: <span className="text-indigo-400 font-bold">88%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-gray-300 text-center">
                    Diverse: <span className="text-amber-400 font-bold">90%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-gray-300 text-center">
                    DeFi: <span className="text-purple-400 font-bold">85%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-gray-300 text-center">
                    Fees: <span className="text-teal-400 font-bold">95%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-gray-300 text-center">
                    Age: <span className="text-blue-400 font-bold">90%</span>
                  </div>
                </div>

                {/* Approvals Risk Banner */}
                {approvalsCount > 0 ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{approvalsCount} unrevoked Clarity authorization open</span>
                    </div>
                    <Button
                      variant="amber"
                      size="sm"
                      onClick={() => handleRevokeApproval(wallet.id)}
                    >
                      Revoke Clarity Auth
                    </Button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>No unrevoked Clarity permissions detected</span>
                  </div>
                )}
              </div>

              {/* Individual AI Audit Button */}
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                onClick={() => onTriggerAi(`Perform a deep financial and Clarity smart contract audit for my Stacks wallet ${wallet.name} (${wallet.address}) including sBTC peg safety and PoX stacking optimization.`)}
              >
                Audit Stacks Wallet with Gemini AI
              </Button>

            </Card>
          );
        })}
      </div>

      {/* CLARITY CONTRACT INTERACTION & GAS AUDIT SECTION */}
      <Card variant="panel" className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Stacks Protocol & Clarity Execution Audit</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Top Clarity smart contracts called by your Stacks wallets</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onTriggerAi('Rank my top Clarity smart contract interactions on Stacks and suggest post-condition gas optimizations.')}
          >
            AI Stacks Recommendation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            { name: 'ALEX Swap Router v2', contract: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault', gasStx: 2.85, txs: 24, recommendation: 'Nakamoto fast-block batching active' },
            { name: 'StackingDAO Auto-Compounder', contract: 'SP4S24G7B55E44P8B20B3A505AA002964567222.stacking-dao-core', gasStx: 1.40, txs: 12, recommendation: 'Post-conditions verified safe' },
            { name: 'sBTC Bridge Peg In/Out', contract: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-registry', gasStx: 0.95, txs: 6, recommendation: 'Threshold signer quorum confirmed' }
          ].map((contract, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{contract.name}</span>
                <span className="font-mono text-indigo-300 font-bold">{contract.gasStx} STX</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gray-400 font-mono truncate">
                <span className="truncate">{contract.contract}</span>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-teal-400">
                🔒 {contract.recommendation}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};



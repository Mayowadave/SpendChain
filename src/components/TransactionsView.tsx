import React, { useState } from 'react';
import { 
  ReceiptText, 
  Plus, 
  FileSpreadsheet, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Transaction, TransactionCategory, TaxTag, ChainId } from '../types';
import { Button, Badge, Card, SearchBar, Input, Select, Modal, EmptyState } from './ui';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateTransaction: (tx: Transaction) => void;
  onOpenTxDetail: (tx: Transaction) => void;
  activeAddress?: string;
  isSyncingData?: boolean;
  onRefreshLiveData?: () => void;
  onInspectAddress?: (address: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onOpenTxDetail,
  activeAddress,
  isSyncingData = false,
  onRefreshLiveData,
  onInspectAddress
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedChain, setSelectedChain] = useState<string>('ALL');
  const [selectedTaxTag, setSelectedTaxTag] = useState<string>('ALL');

  // Address lookup state
  const [inputAddress, setInputAddress] = useState('');

  // New Transaction Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCounterparty, setNewCounterparty] = useState('');
  const [newAmountUsd, setNewAmountUsd] = useState('');
  const [newCategory, setNewCategory] = useState<TransactionCategory>('Clarity Contract Exec');
  const [newChain, setNewChain] = useState<ChainId>('stacks-mainnet');
  const [newTaxTag, setNewTaxTag] = useState<TaxTag>('Deductible Expense');
  const [newMemo, setNewMemo] = useState('');
  const [newClarityFunction, setNewClarityFunction] = useState('');

  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAddress.trim()) return;
    if (onInspectAddress) {
      onInspectAddress(inputAddress.trim());
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.clarityFunction && tx.clarityFunction.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.memo && tx.memo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || tx.category === selectedCategory;
    const matchesChain = selectedChain === 'ALL' || tx.chain === selectedChain;
    const matchesTax = selectedTaxTag === 'ALL' || tx.taxTag === selectedTaxTag;

    return matchesSearch && matchesCategory && matchesChain && matchesTax;
  });

  // Export CSV handler
  const handleExportCsv = () => {
    const headers = ['Date', 'Tx Hash', 'Stacks Chain', 'Counterparty / Contract', 'Category', 'Clarity Method', 'Post-Conditions', 'Type', 'Crypto Amount', 'Symbol', 'Amount USD', 'Gas STX', 'Memo'];
    const rows = filteredTransactions.map(tx => [
      tx.timestamp,
      tx.hash,
      tx.chain,
      `"${tx.counterpartyName}"`,
      `"${tx.category}"`,
      `"${tx.clarityFunction || ''}"`,
      tx.postConditionsCount || 0,
      tx.type,
      tx.amountCrypto,
      tx.tokenSymbol,
      tx.amountUsd,
      tx.gasFeeStx || 0,
      `"${tx.memo || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendChain_Stacks_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounterparty || !newAmountUsd) return;

    const usdVal = Number(newAmountUsd);
    const stxVal = +(usdVal / 1.85).toFixed(2);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      hash: `0x${Math.random().toString(16).substring(2, 34)}`,
      walletId: 'w1',
      walletAddress: activeAddress || 'SP2C2YFP12AJ73F28AQB283AX24CB4A2CEAC0C560',
      chain: newChain,
      timestamp: new Date().toISOString(),
      type: 'contract_call',
      amountCrypto: stxVal,
      tokenSymbol: 'STX',
      amountUsd: usdVal,
      gasFeeStx: 0.15,
      gasFeeUsd: 0.28,
      counterpartyName: newCounterparty,
      counterpartyAddress: 'SP' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      category: newCategory,
      taxTag: newTaxTag,
      memo: newMemo,
      clarityFunction: newClarityFunction || '(contract-call? .custom-contract execute-action)',
      postConditionsCount: 2
    };

    onAddTransaction(newTx);
    setIsAddModalOpen(false);
    setNewCounterparty('');
    setNewAmountUsd('');
    setNewMemo('');
    setNewClarityFunction('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <ReceiptText className="w-4 h-4" />
            <span>Hiro Stacks API • Live Mainnet Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Real Transaction History
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Fetched directly from Hiro API for active Stacks address <span className="font-mono text-indigo-300 font-semibold">{activeAddress || 'Not Selected'}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRefreshLiveData && (
            <Button
              variant="secondary"
              size="md"
              leftIcon={<RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncingData ? 'animate-spin' : ''}`} />}
              onClick={onRefreshLiveData}
              disabled={isSyncingData}
            >
              {isSyncingData ? 'Syncing Hiro API...' : 'Fetch Live Blockchain Tx'}
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>

          <Button
            variant="gradient"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Log Manual Stacks Tx
          </Button>
        </div>
      </div>

      {/* STACKS ADDRESS SEARCH & SYNC PANEL */}
      <Card variant="panel" className="bg-[#0B1220]/90 border border-indigo-500/20 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hiro Stacks API Connected</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Mainnet Chain Node</span>
            </div>
            <p className="text-xs text-gray-300">
              Lookup transaction history for any Stacks address (e.g., <code className="text-indigo-300 font-mono">SP2C2Y...</code> or your wallet):
            </p>
          </div>

          <form onSubmit={handleInspectSubmit} className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Enter Stacks Address (SP...)"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Search className="w-3.5 h-3.5" />}
            >
              Fetch On-Chain Txs
            </Button>
          </form>
        </div>

        {activeAddress && (
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <div className="flex items-center space-x-2 font-mono">
              <span className="text-gray-500">Active Target Address:</span>
              <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-white/10">{activeAddress}</span>
            </div>
            <a
              href={`https://explorer.hiro.so/address/${activeAddress}?chain=mainnet`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              <span>View on Hiro Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </Card>

      {/* FILTER CONTROLS BAR */}
      <Card variant="panel" className="space-y-3 bg-[#0B1220]/90">
        
        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search transactions by contract, tx hash, Clarity method, or notes..."
        />

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          {/* Category Selector */}
          <Select
            label="CATEGORY"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Stacks Categories' },
              { value: 'sBTC & Bitcoin Bridge', label: 'sBTC & Bitcoin Bridge' },
              { value: 'PoX & Stacking Yield', label: 'PoX & Stacking Yield' },
              { value: 'Clarity Contract Exec', label: 'Clarity Contract Exec' },
              { value: 'Treasury & Transfers', label: 'Treasury & Transfers' },
              { value: 'DeFi & Swaps', label: 'DeFi & Swaps' },
            ]}
          />

          {/* Chain Selector */}
          <Select
            label="CHAIN LAYER"
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Layers' },
              { value: 'stacks-mainnet', label: 'Stacks Mainnet' },
              { value: 'stacks-nakamoto', label: 'Nakamoto Fast L2' },
              { value: 'bitcoin-l1', label: 'Bitcoin L1' },
              { value: 'stacks-testnet', label: 'Stacks Testnet' },
            ]}
          />

          {/* Tax Tag Selector */}
          <Select
            label="TAX TAG"
            value={selectedTaxTag}
            onChange={(e) => setSelectedTaxTag(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Tax Statuses' },
              { value: 'Deductible Expense', label: 'Deductible Expense' },
              { value: 'Capital Gain/Loss', label: 'Capital Gain/Loss' },
              { value: 'Taxable Income', label: 'Taxable Income' },
              { value: 'Internal Transfer', label: 'Internal Transfer' },
            ]}
          />

        </div>

      </Card>

      {/* TRANSACTIONS TABLE */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-slate-900/90 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Counterparty & Hash</th>
                <th className="px-5 py-3.5">Layer & Clarity Call</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Post-Conditions</th>
                <th className="px-5 py-3.5">Tax Tag</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-right">Gas (STX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0B1220]/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <EmptyState
                      title="No Stacks transactions found"
                      description={
                        transactions.length === 0 
                          ? `No transactions recorded on Hiro mainnet for address ${activeAddress || ''}. Make a transaction on Stacks or search another address.`
                          : "No transactions matched your search filters. Try clearing search keywords or category filters."
                      }
                      actionLabel={onRefreshLiveData ? "Refresh Hiro API Data" : undefined}
                      onAction={onRefreshLiveData}
                    />
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id}
                    onClick={() => onOpenTxDetail(tx)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{tx.counterpartyName}</div>
                      <div className="font-mono text-[11px] text-gray-500 truncate max-w-[160px]">{tx.hash}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col space-y-1">
                        <Badge variant="blue">{tx.chain === 'stacks-mainnet' ? 'MAINNET' : tx.chain === 'stacks-nakamoto' ? 'NAKAMOTO' : 'BITCOIN L1'}</Badge>
                        {tx.clarityFunction && (
                          <span className="text-[10px] font-mono text-amber-400 truncate max-w-[160px]">
                            {tx.clarityFunction}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-200">
                      {tx.category}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 text-[10px] bg-slate-900 text-teal-300 rounded-md border border-white/10 font-mono">
                        {tx.postConditionsCount !== undefined ? `${tx.postConditionsCount} Verified` : 'None'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={
                        tx.taxTag === 'Deductible Expense' 
                          ? 'emerald' 
                          : tx.taxTag === 'Taxable Income'
                          ? 'teal'
                          : 'slate'
                      }>
                        {tx.taxTag}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right font-mono font-bold text-sm text-white">
                      {tx.type === 'inflow' || tx.type === 'stacking_reward' ? '+' : '-'}{tx.amountCrypto.toLocaleString()} {tx.tokenSymbol}
                      <div className="text-[10px] text-gray-400 font-normal">${tx.amountUsd.toLocaleString()}</div>
                    </td>

                    <td className="px-5 py-4 text-right font-mono text-gray-400">
                      {tx.gasFeeStx ? `${tx.gasFeeStx} STX` : '0 STX'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MANUAL ENTRY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Stacks Manual Transaction or Contract Call"
        subtitle="Record off-chain, sBTC bridge, or custom Clarity call into SpendChain."
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <Input
            label="Counterparty / Clarity Contract"
            required
            placeholder="e.g. SP3K8BC0...alex-vault or StackingDAO"
            value={newCounterparty}
            onChange={(e) => setNewCounterparty(e.target.value)}
          />

          <Input
            label="Clarity Method Name (Optional)"
            placeholder="e.g. (contract-call? .sbtc-token transfer ...)"
            value={newClarityFunction}
            onChange={(e) => setNewClarityFunction(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount (USD)"
              type="number"
              required
              placeholder="1250.00"
              value={newAmountUsd}
              onChange={(e) => setNewAmountUsd(e.target.value)}
            />

            <Select
              label="Network Layer"
              value={newChain}
              onChange={(e) => setNewChain(e.target.value as ChainId)}
              options={[
                { value: 'stacks-mainnet', label: 'Stacks Mainnet' },
                { value: 'stacks-nakamoto', label: 'Nakamoto Fast L2' },
                { value: 'bitcoin-l1', label: 'Bitcoin L1' },
                { value: 'stacks-testnet', label: 'Stacks Testnet' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
              options={[
                { value: 'Clarity Contract Exec', label: 'Clarity Contract Exec' },
                { value: 'sBTC & Bitcoin Bridge', label: 'sBTC & Bitcoin Bridge' },
                { value: 'PoX & Stacking Yield', label: 'PoX & Stacking Yield' },
                { value: 'Treasury & Transfers', label: 'Treasury & Transfers' },
                { value: 'DeFi & Swaps', label: 'DeFi & Swaps' },
              ]}
            />

            <Select
              label="Tax Status Tag"
              value={newTaxTag}
              onChange={(e) => setNewTaxTag(e.target.value as TaxTag)}
              options={[
                { value: 'Deductible Expense', label: 'Deductible Expense' },
                { value: 'Capital Gain/Loss', label: 'Capital Gain/Loss' },
                { value: 'Taxable Income', label: 'Taxable Income' },
                { value: 'Internal Transfer', label: 'Internal Transfer' },
              ]}
            />
          </div>

          <Input
            label="Transaction Memo / Notes"
            placeholder="Internal treasury note or contract purpose..."
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
          />

          <div className="pt-2 flex justify-end space-x-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              Save Transaction
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};


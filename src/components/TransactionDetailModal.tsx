import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Upload, 
  Tag, 
  Layers, 
  CheckCircle2, 
  DollarSign, 
  Flame, 
  Paperclip,
  Share2
} from 'lucide-react';
import { Transaction, TransactionCategory, TaxTag } from '../types';
import { SUPPORTED_CHAINS } from '../data/mockData';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSaveTx: (updatedTx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onSaveTx
}) => {
  if (!transaction) return null;

  const [memo, setMemo] = useState(transaction.memo || '');
  const [category, setCategory] = useState<TransactionCategory>(transaction.category);
  const [taxTag, setTaxTag] = useState<TaxTag>(transaction.taxTag);
  const [copiedHash, setCopiedHash] = useState(false);
  const [hasReceipt, setHasReceipt] = useState(!!transaction.receiptUrl);
  const [saveToast, setSaveToast] = useState(false);

  const chainInfo = SUPPORTED_CHAINS[transaction.chain] || SUPPORTED_CHAINS['ethereum'];

  const copyHash = () => {
    navigator.clipboard.writeText(transaction.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleSave = () => {
    onSaveTx({
      ...transaction,
      memo,
      category,
      taxTag,
      receiptUrl: hasReceipt ? 'https://spendchain.app/receipts/mock-receipt.pdf' : undefined
    });
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 bg-[#0B1220] shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl text-xs font-bold ${transaction.type === 'inflow' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              {transaction.type === 'inflow' ? 'Inflow' : 'Outflow'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{transaction.counterpartyName}</h3>
              <p className="text-xs text-gray-400 font-mono">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Gas Highlight */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Transaction Amount</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
              ${transaction.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
              {transaction.amountCrypto} {transaction.tokenSymbol}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Gas Execution Fee</div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">
              ${transaction.gasFeeUsd.toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
              {chainInfo.name}
            </div>
          </div>
        </div>

        {/* Hash & Explorer Bar */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-gray-400 font-medium">Tx Hash:</span>
            <span className="font-mono text-gray-200 truncate max-w-[200px]">{transaction.hash}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={copyHash} className="p-1 text-gray-400 hover:text-white">
              {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <a 
              href={`${chainInfo.explorerUrl}${transaction.hash}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-1 text-gray-400 hover:text-white flex items-center space-x-1"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </a>
          </div>
        </div>

        {/* Editable Category & Tax Tag */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Taxonomy Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="SaaS & Infrastructure">SaaS & Infrastructure</option>
              <option value="DeFi & Swaps">DeFi & Swaps</option>
              <option value="Payroll & Grants">Payroll & Grants</option>
              <option value="CEX & Off-Ramp">CEX & Off-Ramp</option>
              <option value="Yield & Staking">Yield & Staking</option>
              <option value="Gas & Execution">Gas & Execution</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Tax Status Tag</label>
            <select
              value={taxTag}
              onChange={(e) => setTaxTag(e.target.value as TaxTag)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="Deductible Expense">Deductible Expense</option>
              <option value="Capital Gain/Loss">Capital Gain/Loss</option>
              <option value="Taxable Income">Taxable Income</option>
              <option value="Internal Transfer">Internal Transfer</option>
            </select>
          </div>
        </div>

        {/* Invoice Memo & Receipt */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Accounting Memo / Note</label>
          <textarea
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add business justification or invoice reference..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Receipt Attachment Toggle */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <Paperclip className="w-4 h-4 text-blue-400" />
            <span>PDF Receipt / Invoice Attached</span>
          </div>
          <button
            type="button"
            onClick={() => setHasReceipt(!hasReceipt)}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              hasReceipt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-gray-400'
            }`}
          >
            {hasReceipt ? 'Receipt Attached ✓' : '+ Attach Receipt'}
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between">
          {saveToast ? (
            <div className="text-xs text-emerald-400 flex items-center space-x-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved changes!</span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-500">Auto-saved to local ledger</span>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-gray-300 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Save Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

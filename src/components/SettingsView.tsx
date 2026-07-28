import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  Save, 
  Users, 
  FileSpreadsheet, 
  Zap,
  Globe
} from 'lucide-react';
import { AppSettings, ChainId } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [formState, setFormState] = useState<AppSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleChain = (chainId: ChainId) => {
    setFormState(prev => {
      const exists = prev.enabledChains.includes(chainId);
      const updated = exists
        ? prev.enabledChains.filter(c => c !== chainId)
        : [...prev.enabledChains, chainId];
      return { ...prev, enabledChains: updated };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Workspace & Accounting Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & Integrations
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure currency preferences, accounting tax formats, gas alert triggers, and team workspace parameters.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        
        {/* Workspace & Currency Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-[#0B1220]/80">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Workspace Identity & Base Currency</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Workspace / DAO Name</label>
              <input
                type="text"
                value={formState.teamName}
                onChange={(e) => setFormState({ ...formState, teamName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Reporting Display Currency</label>
              <select
                value={formState.currency}
                onChange={(e) => setFormState({ ...formState, currency: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="ETH">ETH (Ethereum Native)</option>
                <option value="SOL">SOL (Solana Native)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Monitored Blockchains */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-[#0B1220]/80">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Globe className="w-4 h-4 text-teal-400" />
            <span>Active Monitored Blockchains</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'ethereum', name: 'Ethereum Mainnet' },
              { id: 'arbitrum', name: 'Arbitrum One' },
              { id: 'base', name: 'Base Network' },
              { id: 'solana', name: 'Solana' },
              { id: 'optimism', name: 'Optimism' },
              { id: 'polygon', name: 'Polygon PoS' }
            ].map((chain) => {
              const isEnabled = formState.enabledChains.includes(chain.id as ChainId);
              return (
                <button
                  type="button"
                  key={chain.id}
                  onClick={() => handleToggleChain(chain.id as ChainId)}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isEnabled
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900/60 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{chain.name}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isEnabled ? 'bg-blue-500 border-blue-400' : 'border-gray-600'}`}>
                    {isEnabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accounting & Tax Presets */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-[#0B1220]/80">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Tax & Accounting Export Preset</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { id: 'quickbooks', name: 'QuickBooks Online', desc: 'Direct Chart of Accounts Sync' },
              { id: 'xero', name: 'Xero Accounting', desc: 'Bank Feed CSV Format' },
              { id: 'cointracker', name: 'CoinTracker / Koinly', desc: 'Crypto Tax Mapping' },
              { id: 'csv', name: 'Standard Raw CSV', desc: 'Custom Ledger Export' }
            ].map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => setFormState({ ...formState, accountingExportFormat: preset.id as any })}
                className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                  formState.accountingExportFormat === preset.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{preset.name}</div>
                <div className="text-[10px] text-gray-400">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gas Alert Threshold */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-[#0B1220]/80">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Gas Alert & AI Trigger Threshold</span>
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-300">
              Notify & Flag Single Transaction Gas Above: <span className="text-amber-400 font-mono font-bold">{formState.stxGasAlertThreshold} STX</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={formState.stxGasAlertThreshold}
              onChange={(e) => setFormState({ ...formState, stxGasAlertThreshold: Number(e.target.value) })}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>1 STX</span>
              <span>25 STX</span>
              <span>50 STX</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white text-xs font-semibold hover:opacity-95 transition-all shadow-xl shadow-blue-500/25 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Workspace Settings</span>
        </button>

      </form>

    </div>
  );
};

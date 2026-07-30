import React, { useState } from 'react';
import { ClarityContractDeployment } from '../../types';
import { Code, ExternalLink, ShieldCheck, Search, Blocks, Terminal } from 'lucide-react';

interface Props {
  contracts: ClarityContractDeployment[];
}

export const ClarityContractsSection: React.FC<Props> = ({ contracts }) => {
  const [query, setQuery] = useState('');

  const filtered = contracts.filter(c =>
    c.contractName.toLowerCase().includes(query.toLowerCase()) ||
    c.contractAddress.toLowerCase().includes(query.toLowerCase()) ||
    c.deployerAddress.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Newly Deployed Clarity Contracts</h2>
            <p className="text-xs text-gray-400">Recent smart contract deployments on Stacks Nakamoto mainnet</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter contracts by name..."
            className="w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 font-sans"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-[11px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/10">
              <th className="py-3.5 px-4 font-bold">Contract Name</th>
              <th className="py-3.5 px-4 font-bold">Category</th>
              <th className="py-3.5 px-4 font-bold">Block Height</th>
              <th className="py-3.5 px-4 font-bold">Deployer Address</th>
              <th className="py-3.5 px-4 font-bold">24H Calls</th>
              <th className="py-3.5 px-4 font-bold text-right">Explorer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-mono">
            {filtered.map(contract => (
              <tr key={contract.id} className="hover:bg-slate-800/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">{contract.contractName}</span>
                    {contract.verified && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/20 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-gray-300 text-[11px]">
                    {contract.category}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-gray-300 font-bold">
                  #{contract.blockHeight.toLocaleString()}
                </td>

                <td className="py-3.5 px-4 text-gray-400 truncate max-w-[180px]">
                  {contract.deployerAddress}
                </td>

                <td className="py-3.5 px-4 text-indigo-300 font-bold">
                  {contract.callsCount24h.toLocaleString()} calls
                </td>

                <td className="py-3.5 px-4 text-right">
                  <a
                    href={contract.explorerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-emerald-600 text-gray-400 hover:text-white transition-colors inline-flex items-center"
                    title="View Contract Code on Hiro Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

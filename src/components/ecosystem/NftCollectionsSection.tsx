import React, { useState } from 'react';
import { EcosystemNftCollection } from '../../types';
import { Image as ImageIcon, TrendingUp, TrendingDown, ExternalLink, Users, Sparkles } from 'lucide-react';

interface Props {
  nfts: EcosystemNftCollection[];
}

export const NftCollectionsSection: React.FC<Props> = ({ nfts }) => {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Trending Stacks NFT & Inscription Collections</h2>
            <p className="text-xs text-gray-400">Top digital artifacts, Ordinals, and Clarity NFT collections on Gamma.io</p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400">
          Source: Gamma.io Marketplace Index
        </span>
      </div>

      {/* Grid of Collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nfts.map(nft => {
          const isPositive = nft.dailyChangePercent >= 0;
          return (
            <div
              key={nft.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-pink-500/30 transition-all space-y-3 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${nft.logoBg} flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform`}>
                  {nft.symbol}
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-pink-300 transition-colors">{nft.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{nft.totalSupply.toLocaleString()} Items • {nft.ownersCount.toLocaleString()} Owners</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono">
                <div>
                  <span className="text-gray-500 block text-[10px]">Floor Price</span>
                  <span className="text-white font-bold">{nft.floorPriceStx} STX</span>
                  <span className="text-[10px] text-gray-400 block">${nft.floorPriceUsd.toFixed(0)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">24H Volume</span>
                  <span className="text-pink-300 font-bold">{nft.volume24hStx.toLocaleString()} STX</span>
                  <span className={`text-[10px] font-bold flex items-center space-x-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>{isPositive ? '+' : ''}{nft.dailyChangePercent}%</span>
                  </span>
                </div>
              </div>

              <a
                href={`https://gamma.io/collections/${nft.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center space-x-1 transition-colors border border-white/5"
              >
                <span>Trade on Gamma</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          );
        })}
      </div>

    </div>
  );
};

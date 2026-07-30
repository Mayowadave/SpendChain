import React, { useState } from 'react';
import { GlobalSearchHeader } from './ecosystem/GlobalSearchHeader';
import { NetworkOverviewCards } from './ecosystem/NetworkOverviewCards';
import { EcosystemHealthSection } from './ecosystem/EcosystemHealthSection';
import { TopProtocolsTable } from './ecosystem/TopProtocolsTable';
import { ProtocolDetailModal } from './ecosystem/ProtocolDetailModal';
import { LiveActivityFeed } from './ecosystem/LiveActivityFeed';
import { ClarityContractsSection } from './ecosystem/ClarityContractsSection';
import { Sip10TokensSection } from './ecosystem/Sip10TokensSection';
import { NftCollectionsSection } from './ecosystem/NftCollectionsSection';
import { EcosystemChartsSection } from './ecosystem/EcosystemChartsSection';
import { EcosystemAiCopilot } from './ecosystem/EcosystemAiCopilot';

import {
  INITIAL_NETWORK_STATS,
  ECOSYSTEM_HEALTH_DATA,
  TOP_PROTOCOLS,
  LIVE_ECOSYSTEM_EVENTS,
  CLARITY_CONTRACTS,
  SIP10_TOKENS,
  NFT_COLLECTIONS,
  ECOSYSTEM_CHART_DATA
} from '../services/stacksEcosystemService';

import { ProtocolDetail } from '../types';

interface Props {
  onTriggerAiCopilot?: (prompt: string) => void;
}

export const EcosystemExplorerView: React.FC<Props> = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolDetail | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All Risks');
  const [activeSectionTab, setActiveSectionTab] = useState<string>('overview');
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);

  const handleTriggerCopilot = (prompt: string) => {
    setCopilotInitialPrompt(prompt);
    setActiveSectionTab('ai-copilot');
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. Search Header & Global Filters */}
      <GlobalSearchHeader
        protocols={TOP_PROTOCOLS}
        contracts={CLARITY_CONTRACTS}
        tokens={SIP10_TOKENS}
        nfts={NFT_COLLECTIONS}
        onSelectProtocol={(p) => setSelectedProtocol(p)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedRisk={selectedRisk}
        onSelectRisk={(risk) => setSelectedRisk(risk)}
        activeSectionTab={activeSectionTab}
        onChangeSectionTab={(tab) => setActiveSectionTab(tab)}
      />

      {/* 2. Real-time Stacks Network Stats Cards (Always visible on overview) */}
      {(activeSectionTab === 'overview' || activeSectionTab === 'protocols') && (
        <NetworkOverviewCards stats={INITIAL_NETWORK_STATS} />
      )}

      {/* 3. Section Content Views */}
      {activeSectionTab === 'overview' && (
        <>
          <EcosystemHealthSection
            data={ECOSYSTEM_HEALTH_DATA}
            onTriggerAiCopilot={handleTriggerCopilot}
          />

          <TopProtocolsTable
            protocols={TOP_PROTOCOLS}
            selectedCategory={selectedCategory}
            selectedRisk={selectedRisk}
            onSelectProtocol={(p) => setSelectedProtocol(p)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LiveActivityFeed events={LIVE_ECOSYSTEM_EVENTS} />
            <ClarityContractsSection contracts={CLARITY_CONTRACTS} />
          </div>

          <EcosystemChartsSection chartData={ECOSYSTEM_CHART_DATA} />
        </>
      )}

      {activeSectionTab === 'protocols' && (
        <TopProtocolsTable
          protocols={TOP_PROTOCOLS}
          selectedCategory={selectedCategory}
          selectedRisk={selectedRisk}
          onSelectProtocol={(p) => setSelectedProtocol(p)}
        />
      )}

      {activeSectionTab === 'live-feed' && (
        <LiveActivityFeed events={LIVE_ECOSYSTEM_EVENTS} />
      )}

      {activeSectionTab === 'contracts' && (
        <ClarityContractsSection contracts={CLARITY_CONTRACTS} />
      )}

      {activeSectionTab === 'tokens' && (
        <Sip10TokensSection tokens={SIP10_TOKENS} />
      )}

      {activeSectionTab === 'nfts' && (
        <NftCollectionsSection nfts={NFT_COLLECTIONS} />
      )}

      {activeSectionTab === 'charts' && (
        <EcosystemChartsSection chartData={ECOSYSTEM_CHART_DATA} />
      )}

      {activeSectionTab === 'ai-copilot' && (
        <EcosystemAiCopilot initialPrompt={copilotInitialPrompt} />
      )}

      {/* 4. Protocol Detail Modal */}
      {selectedProtocol && (
        <ProtocolDetailModal
          protocol={selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
          onSelectProtocol={(p) => setSelectedProtocol(p)}
          allProtocols={TOP_PROTOCOLS}
          onTriggerAiCopilot={handleTriggerCopilot}
        />
      )}

    </div>
  );
};

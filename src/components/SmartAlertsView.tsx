import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  BellRing, 
  Plus, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  Settings, 
  Mail, 
  Send, 
  Webhook, 
  MessageSquare, 
  LayoutDashboard, 
  Filter, 
  Search, 
  X, 
  Play, 
  Clock, 
  Flame, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Image as ImageIcon, 
  Coins, 
  TrendingUp, 
  FileCode2, 
  Sliders, 
  Eye, 
  ChevronRight,
  RefreshCw,
  Zap,
  Bot
} from 'lucide-react';
import { Wallet, Transaction, SmartAlertRule, TriggeredAlert, NotificationChannelConfig, AlertEventType, NotificationChannelId } from '../types';
import { DEFAULT_ALERT_RULES, DEFAULT_NOTIFICATION_CHANNELS, INITIAL_TRIGGERED_ALERTS, CHANNEL_DISPATCHERS, getEventMetadata } from '../services/alertEngine';
import { Badge, Button, Card } from './ui';

interface SmartAlertsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onTriggerAi: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const SmartAlertsView: React.FC<SmartAlertsViewProps> = ({
  wallets,
  transactions,
  onTriggerAi,
  onNavigateTab
}) => {
  const [rules, setRules] = useState<SmartAlertRule[]>(DEFAULT_ALERT_RULES);
  const [channels, setChannels] = useState<NotificationChannelConfig[]>(DEFAULT_NOTIFICATION_CHANNELS);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>(INITIAL_TRIGGERED_ALERTS);

  const [activeTab, setActiveTab] = useState<'rules' | 'channels' | 'history'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventTypeFilter, setSelectedEventTypeFilter] = useState<string>('all');
  
  // Modal State for Rule Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SmartAlertRule | null>(null);

  // Form Fields
  const [ruleName, setRuleName] = useState('');
  const [eventType, setEventType] = useState<AlertEventType>('large_tx');
  const [thresholdValue, setThresholdValue] = useState<number>(250);
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannelId[]>(['dashboard', 'email']);

  // Channel Edit State
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [channelDestinations, setChannelDestinations] = useState<Record<string, string>>({
    email: 'alerts@spendchain.io',
    telegram: '@SpendChain_Alerts_Bot (Chat ID: 91827436)',
    webhook: 'https://api.spendchain.io/v1/webhooks/alerts',
    discord: 'https://discord.com/api/webhooks/123456789/xyz'
  });

  // Test Dispatch Logs
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchesType = selectedEventTypeFilter === 'all' || r.eventType === selectedEventTypeFilter;
      const matchesSearch = searchQuery === '' || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [rules, selectedEventTypeFilter, searchQuery]);

  const unreadCount = useMemo(() => {
    return triggeredAlerts.filter(a => !a.read).length;
  }, [triggeredAlerts]);

  // Handle Rule Toggle
  const toggleRuleEnabled = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  // Handle Delete Rule
  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Handle Open Modal for New Rule
  const handleOpenCreateModal = () => {
    setEditingRule(null);
    setRuleName('Custom Stacks Alert');
    setEventType('large_tx');
    setThresholdValue(250);
    setSelectedWallet('all');
    setSelectedChannels(['dashboard', 'email']);
    setIsModalOpen(true);
  };

  // Handle Open Modal for Editing Existing Rule
  const handleOpenEditModal = (rule: SmartAlertRule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setEventType(rule.eventType);
    setThresholdValue(rule.thresholdValue || 100);
    setSelectedWallet(rule.walletAddress || 'all');
    setSelectedChannels(rule.channels);
    setIsModalOpen(true);
  };

  // Handle Save Rule
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? {
        ...r,
        name: ruleName,
        eventType,
        thresholdValue,
        walletAddress: selectedWallet,
        channels: selectedChannels
      } : r));
    } else {
      const newRule: SmartAlertRule = {
        id: `rule-${Date.now()}`,
        name: ruleName,
        eventType,
        enabled: true,
        thresholdValue,
        walletAddress: selectedWallet,
        channels: selectedChannels,
        createdAt: new Date().toISOString().slice(0, 10),
        triggerCount: 0
      };
      setRules(prev => [newRule, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Toggle Notification Channel Config
  const toggleChannelConfig = (channelId: NotificationChannelId) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, enabled: !c.enabled } : c));
  };

  // Handle Destination Update
  const handleUpdateDestination = (channelId: string, value: string) => {
    setChannelDestinations(prev => ({ ...prev, [channelId]: value }));
  };

  // Handle Test Alert Dispatch
  const handleRunTestDispatch = () => {
    setIsTesting(true);
    setDispatchLogs([]);

    const testAlert: TriggeredAlert = {
      id: `trig-test-${Date.now()}`,
      ruleId: 'test-rule',
      ruleName: 'Simulated Security Alert Test',
      eventType: 'large_tx',
      title: '⚡ Simulated Large Transaction Test Alert',
      message: 'Test event generated on Stacks mainnet. Verifying multi-channel dispatch architecture.',
      severity: 'warning',
      timestamp: 'Just now',
      txHash: '0xtest998877665544332211',
      amountUsd: 950,
      read: false,
      channelDispatched: channels.filter(c => c.enabled).map(c => c.id)
    };

    const logs: string[] = [];
    const activeChannels = channels.filter(c => c.enabled);

    activeChannels.forEach(ch => {
      const dispatcher = CHANNEL_DISPATCHERS[ch.id];
      if (dispatcher) {
        const dest = channelDestinations[ch.id];
        const res = dispatcher.dispatch(testAlert, dest);
        logs.push(res.log);
      }
    });

    setTimeout(() => {
      setDispatchLogs(logs);
      setTriggeredAlerts(prev => [testAlert, ...prev]);
      setIsTesting(false);
    }, 800);
  };

  const markAllAsRead = () => {
    setTriggeredAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const clearAlertHistory = () => {
    setTriggeredAlerts([]);
  };

  // Helper icon lookup
  const renderEventIcon = (type: AlertEventType, className = "w-4 h-4") => {
    switch (type) {
      case 'receive_stx': return <ArrowDownLeft className={`${className} text-emerald-400`} />;
      case 'send_stx': return <ArrowUpRight className={`${className} text-rose-400`} />;
      case 'new_nft': return <ImageIcon className={`${className} text-purple-400`} />;
      case 'new_sip10': return <Coins className={`${className} text-amber-400`} />;
      case 'large_tx': return <TrendingUp className={`${className} text-rose-400`} />;
      case 'contract_interaction': return <FileCode2 className={`${className} text-indigo-400`} />;
      case 'gas_spike': return <Flame className={`${className} text-amber-400`} />;
      default: return <Bell className={`${className} text-gray-400`} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Extensible Event Monitoring & Multi-Channel Dispatch Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>Smart Alerts</span>
            {unreadCount > 0 && (
              <Badge variant="rose" size="md">{unreadCount} Unread</Badge>
            )}
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            Real-time rule triggers for STX transfers, NFT mints, SIP-010 tokens, whale transactions, Clarity calls, and gas spikes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="gradient"
            size="md"
            leftIcon={<Plus className="w-4 h-4 text-white" />}
            onClick={handleOpenCreateModal}
          >
            Create Alert Rule
          </Button>
        </div>
      </div>

      {/* SUMMARY STATS & CHANNEL ARCHITECTURE PREVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card variant="glass" className="p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Configured Rules</span>
            <Sliders className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {rules.length} <span className="text-xs font-normal text-emerald-400">({rules.filter(r => r.enabled).length} Active)</span>
          </div>
          <p className="text-[11px] text-gray-400 font-sans">
            Monitoring STX inflow, outflow, NFTs, tokens, and gas.
          </p>
        </Card>

        <Card variant="glass" className="p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Triggered Events</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {triggeredAlerts.length} <span className="text-xs font-normal text-gray-400">Total Logged</span>
          </div>
          <p className="text-[11px] text-gray-400 font-sans">
            {unreadCount} unread notification(s) requiring attention.
          </p>
        </Card>

        <Card variant="glass" className="p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Active Channels</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {channels.filter(c => c.enabled).length} / {channels.length}
          </div>
          <p className="text-[11px] text-gray-400 font-sans">
            Dashboard, Email, Telegram, Webhooks & Discord.
          </p>
        </Card>

        <Card variant="glass" className="p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Dispatch Test</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <button
            onClick={handleRunTestDispatch}
            disabled={isTesting}
            className="w-full py-1.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isTesting ? 'Testing...' : 'Simulate Alert Dispatch'}</span>
          </button>
          <p className="text-[11px] text-gray-400 font-sans">
            Verifies end-to-end multi-channel routing.
          </p>
        </Card>

      </div>

      {/* DISPATCH TEST LOGS DISPLAY (IF RECENTLY RUN) */}
      {dispatchLogs.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-2 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Multi-Channel Dispatch Simulator Results:</span>
            </span>
            <button onClick={() => setDispatchLogs([])} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 text-gray-300">
            {dispatchLogs.map((log, idx) => (
              <div key={idx} className="p-1.5 rounded bg-black/40 border border-white/5 text-[11px]">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB NAVIGATION HEADER */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/60 hover:bg-slate-800 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Alert Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'channels'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/60 hover:bg-slate-800 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Notification Channels ({channels.filter(c => c.enabled).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900/60 hover:bg-slate-800 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Triggered Log ({triggeredAlerts.length})</span>
          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ALERT RULES MANAGER */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          
          {/* Controls & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alert rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <select
                value={selectedEventTypeFilter}
                onChange={(e) => setSelectedEventTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Event Types</option>
                <option value="receive_stx">💰 STX Inflow Received</option>
                <option value="send_stx">💸 STX Outflow Sent</option>
                <option value="new_nft">🖼️ New SIP-009 NFT</option>
                <option value="new_sip10">🪙 New SIP-010 Token</option>
                <option value="large_tx">🚀 Large Transaction</option>
                <option value="contract_interaction">📄 Clarity Contract Call</option>
                <option value="gas_spike">⚡ Gas Spike</option>
              </select>
            </div>

          </div>

          {/* Rules List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRules.map((rule) => {
              const meta = getEventMetadata(rule.eventType);
              return (
                <Card 
                  key={rule.id} 
                  variant="glass" 
                  className={`p-5 space-y-4 border transition-all ${
                    rule.enabled 
                      ? 'border-white/15 bg-slate-900/90' 
                      : 'border-white/5 bg-slate-950/50 opacity-60'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-slate-950 border border-white/10">
                        {renderEventIcon(rule.eventType)}
                      </div>
                      <Badge variant={meta.badgeColor} size="sm">
                        {meta.label}
                      </Badge>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleRuleEnabled(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        rule.enabled ? 'bg-indigo-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Rule Title & Meta */}
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white">
                      {rule.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      {meta.description}
                    </p>
                  </div>

                  {/* Configured Details */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1.5 text-xs font-mono">
                    {rule.thresholdValue !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Trigger Threshold:</span>
                        <span className="font-bold text-amber-300">
                          {rule.eventType === 'gas_spike' ? `${rule.thresholdValue} STX Gas` : `$${rule.thresholdValue} USD`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Target Wallet:</span>
                      <span className="text-gray-200">
                        {rule.walletAddress === 'all' ? 'All Connected Wallets' : 'Primary Stacks Address'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Triggers Logged:</span>
                      <span className="text-indigo-400 font-bold">{rule.triggerCount} times</span>
                    </div>
                  </div>

                  {/* Configured Dispatch Channels */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-gray-400 font-mono block">Dispatch Channels:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.channels.map((ch) => (
                        <span key={ch} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 font-mono flex items-center space-x-1">
                          {ch === 'dashboard' && <LayoutDashboard className="w-3 h-3 text-indigo-400" />}
                          {ch === 'email' && <Mail className="w-3 h-3 text-emerald-400" />}
                          {ch === 'telegram' && <Send className="w-3 h-3 text-cyan-400" />}
                          {ch === 'webhook' && <Webhook className="w-3 h-3 text-amber-400" />}
                          {ch === 'discord' && <MessageSquare className="w-3 h-3 text-purple-400" />}
                          <span className="capitalize">{ch}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleOpenEditModal(rule)}
                      className="text-gray-400 hover:text-white flex items-center space-x-1 font-mono cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Rule</span>
                    </button>

                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-mono cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                </Card>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: NOTIFICATION CHANNELS CONFIGURATION (EXTENSIBLE ARCHITECTURE) */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Extensible Multi-Channel Notification Router</span>
              </h3>
              <p className="text-xs text-gray-300 mt-1 font-sans">
                Alerts dispatch simultaneously across active channels. Easily configure addresses, handles, or custom webhook endpoints.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5 text-indigo-400" />}
              onClick={() => alert("Extensible Channel Architecture: You can add custom REST endpoints, Slack webhooks, PagerDuty, or WebSockets directly to CHANNEL_DISPATCHERS in alertEngine.ts!")}
            >
              Add Channel Plugin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((chan) => (
              <Card 
                key={chan.id} 
                variant="glass" 
                className="p-5 border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-emerald-400">
                      {chan.id === 'dashboard' && <LayoutDashboard className="w-5 h-5 text-indigo-400" />}
                      {chan.id === 'email' && <Mail className="w-5 h-5 text-emerald-400" />}
                      {chan.id === 'telegram' && <Send className="w-5 h-5 text-cyan-400" />}
                      {chan.id === 'webhook' && <Webhook className="w-5 h-5 text-amber-400" />}
                      {chan.id === 'discord' && <MessageSquare className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                        <span>{chan.name}</span>
                        {chan.isFutureChannel && (
                          <Badge variant="purple" size="sm">Webhook / Future</Badge>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 font-sans">
                        {chan.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleChannelConfig(chan.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      chan.enabled ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        chan.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Destination Input Box */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <label className="text-[11px] font-mono text-gray-400 block">
                    Channel Destination / Endpoint:
                  </label>
                  <input
                    type="text"
                    value={channelDestinations[chan.id] || chan.destination || ''}
                    onChange={(e) => handleUpdateDestination(chan.id, e.target.value)}
                    placeholder="Enter email, handle, or webhook URL..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Status: {chan.enabled ? '🟢 Active & Ready' : '🔴 Paused'}</span>
                  <span className="text-emerald-400">Latency: ~120ms</span>
                </div>
              </Card>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: TRIGGERED ALERTS HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-gray-400 font-mono">
              Showing {triggeredAlerts.length} triggered alert logs across mainnet sessions
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white"
                onClick={markAllAsRead}
              >
                Mark All as Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-rose-400 hover:text-rose-300"
                onClick={clearAlertHistory}
              >
                Clear Log History
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {triggeredAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/5 space-y-3">
                <Bell className="w-8 h-8 text-gray-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No triggered alerts in history</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Alerts will appear here instantly when your configured rules trigger on Stacks mainnet.
                </p>
              </div>
            ) : (
              triggeredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-2 ${
                    alert.read 
                      ? 'bg-slate-950/60 border-white/5 opacity-75' 
                      : 'bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {renderEventIcon(alert.eventType)}
                      <h4 className="text-sm font-extrabold text-white">
                        {alert.title}
                      </h4>
                      <Badge 
                        variant={alert.severity === 'critical' ? 'rose' : alert.severity === 'warning' ? 'amber' : 'indigo'}
                        size="sm"
                      >
                        {alert.severity}
                      </Badge>
                    </div>

                    <span className="text-[11px] text-gray-400 font-mono">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono border-t border-white/5">
                    <span className="text-gray-400">
                      Dispatched to: <span className="text-cyan-300">{alert.channelDispatched.join(', ')}</span>
                    </span>

                    {alert.txHash && (
                      <span className="text-indigo-400">
                        Tx Hash: {alert.txHash.substring(0, 14)}...
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* CREATE / EDIT ALERT RULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0B1220] p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <span>{editingRule ? 'Edit Alert Rule' : 'Create New Alert Rule'}</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              
              {/* Rule Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 block">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whale Transfer Alert or High Gas Notice"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Event Type Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 block">
                  Event Trigger Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as AlertEventType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="receive_stx">💰 Wallet Receives STX (Inflow)</option>
                  <option value="send_stx">💸 Wallet Sends STX (Outflow)</option>
                  <option value="new_nft">🖼️ New SIP-009 NFT Mint/Transfer</option>
                  <option value="new_sip10">🪙 New SIP-010 Token Acquisition</option>
                  <option value="large_tx">🚀 Large Transaction (USD Threshold)</option>
                  <option value="contract_interaction">📄 Clarity Smart Contract Interaction</option>
                  <option value="gas_spike">⚡ Gas Fee Spike (STX Gas Threshold)</option>
                </select>
              </div>

              {/* Threshold Value (For large_tx, gas_spike, or send_stx) */}
              {(eventType === 'large_tx' || eventType === 'gas_spike' || eventType === 'send_stx') && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 block">
                    {eventType === 'gas_spike' ? 'Gas Threshold (in STX)' : 'Amount Threshold (in USD)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Target Wallet */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 block">
                  Target Wallet Address
                </label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Connected Wallets</option>
                  {wallets.map(w => (
                    <option key={w.address} value={w.address}>
                      {w.name} ({w.address.substring(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Notification Channels Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">
                  Dispatch Channels
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {channels.map((ch) => {
                    const isChecked = selectedChannels.includes(ch.id);
                    return (
                      <label 
                        key={ch.id}
                        className={`p-2.5 rounded-xl border text-xs font-mono flex items-center space-x-2 cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-indigo-600/20 border-indigo-500/40 text-white' 
                            : 'bg-slate-900 border-white/5 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChannels(prev => [...prev, ch.id]);
                            } else {
                              setSelectedChannels(prev => prev.filter(c => c !== ch.id));
                            }
                          }}
                          className="rounded border-white/10 text-indigo-600 focus:ring-0"
                        />
                        <span className="capitalize">{ch.name.split(' ')[0]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="md" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  size="md"
                >
                  {editingRule ? 'Save Rule' : 'Create Rule'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

import { 
  SmartAlertRule, 
  TriggeredAlert, 
  NotificationChannelConfig, 
  AlertEventType, 
  NotificationChannelId, 
  Transaction 
} from '../types';

export const DEFAULT_NOTIFICATION_CHANNELS: NotificationChannelConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Notification Center',
    enabled: true,
    isFutureChannel: false,
    description: 'Instant in-app alert banner & live notification drawer on the SpendChain dashboard.',
    iconName: 'LayoutDashboard'
  },
  {
    id: 'email',
    name: 'Email Notifications (SMTP Gateway)',
    enabled: true,
    isFutureChannel: false,
    destination: 'alerts@spendchain.io',
    description: 'Instant transactional email dispatch sent directly to your verified address.',
    iconName: 'Mail'
  },
  {
    id: 'telegram',
    name: 'Telegram Bot Handler',
    enabled: true,
    isFutureChannel: false,
    destination: '@SpendChain_Alerts_Bot (Chat ID: 91827436)',
    description: 'Direct push messages via our official Stacks L2 Telegram bot.',
    iconName: 'Send'
  },
  {
    id: 'webhook',
    name: 'Custom Webhook Gateway (REST / API)',
    enabled: false,
    isFutureChannel: true,
    destination: 'https://api.spendchain.io/v1/webhooks/alerts',
    description: 'Send JSON payloads to your custom server, Discord bot, or Slack channel.',
    iconName: 'Webhook'
  },
  {
    id: 'discord',
    name: 'Discord Channel Webhook',
    enabled: false,
    isFutureChannel: true,
    destination: 'https://discord.com/api/webhooks/123456789/xyz',
    description: 'Post rich embed cards directly into your DAO or community Discord channel.',
    iconName: 'MessageSquare'
  }
];

export const DEFAULT_ALERT_RULES: SmartAlertRule[] = [
  {
    id: 'rule-receive-stx',
    name: 'STX Funds Received Alert',
    eventType: 'receive_stx',
    enabled: true,
    walletAddress: 'all',
    channels: ['dashboard', 'email'],
    createdAt: '2026-07-20',
    lastTriggeredAt: '2 hours ago',
    triggerCount: 14
  },
  {
    id: 'rule-send-stx',
    name: 'STX Outflow Security Warning',
    eventType: 'send_stx',
    enabled: true,
    thresholdValue: 50,
    walletAddress: 'all',
    channels: ['dashboard', 'telegram'],
    createdAt: '2026-07-21',
    lastTriggeredAt: '1 day ago',
    triggerCount: 8
  },
  {
    id: 'rule-large-tx',
    name: 'Whale Transfer Alert (≥ $500 USD)',
    eventType: 'large_tx',
    enabled: true,
    thresholdValue: 500,
    walletAddress: 'all',
    channels: ['dashboard', 'email', 'telegram'],
    createdAt: '2026-07-15',
    lastTriggeredAt: '3 hours ago',
    triggerCount: 5
  },
  {
    id: 'rule-gas-spike',
    name: 'Gas Fee Spike (≥ 0.30 STX)',
    eventType: 'gas_spike',
    enabled: true,
    thresholdValue: 0.30,
    walletAddress: 'all',
    channels: ['dashboard', 'telegram'],
    createdAt: '2026-07-18',
    lastTriggeredAt: '5 hours ago',
    triggerCount: 11
  },
  {
    id: 'rule-contract-interact',
    name: 'Clarity Contract Call Event',
    eventType: 'contract_interaction',
    enabled: true,
    walletAddress: 'all',
    channels: ['dashboard'],
    createdAt: '2026-07-22',
    lastTriggeredAt: '30 mins ago',
    triggerCount: 29
  },
  {
    id: 'rule-new-nft',
    name: 'SIP-009 NFT Mint or Transfer',
    eventType: 'new_nft',
    enabled: true,
    walletAddress: 'all',
    channels: ['dashboard', 'telegram'],
    createdAt: '2026-07-25',
    lastTriggeredAt: '2 days ago',
    triggerCount: 3
  },
  {
    id: 'rule-new-sip10',
    name: 'New SIP-010 Token Acquisition',
    eventType: 'new_sip10',
    enabled: true,
    walletAddress: 'all',
    channels: ['dashboard', 'email'],
    createdAt: '2026-07-26',
    lastTriggeredAt: '4 days ago',
    triggerCount: 6
  }
];

export const INITIAL_TRIGGERED_ALERTS: TriggeredAlert[] = [
  {
    id: 'trig-101',
    ruleId: 'rule-large-tx',
    ruleName: 'Whale Transfer Alert (≥ $500 USD)',
    eventType: 'large_tx',
    title: '🚀 Large Transaction Executed ($1,450 USD)',
    message: 'A large transfer of 850 STX ($1,450 USD) was initiated to ALEX DEX Router on Stacks mainnet.',
    severity: 'critical',
    timestamp: '25 mins ago',
    txHash: '0xa182c9e7123bf02910d54c',
    amountUsd: 1450,
    read: false,
    channelDispatched: ['dashboard', 'email', 'telegram']
  },
  {
    id: 'trig-102',
    ruleId: 'rule-gas-spike',
    ruleName: 'Gas Fee Spike (≥ 0.30 STX)',
    eventType: 'gas_spike',
    title: '⚡ High Clarity Gas Fee Notice (0.45 STX)',
    message: 'Smart contract execution on Zest Protocol Lending consumed 0.45 STX ($0.77 USD) in execution gas.',
    severity: 'warning',
    timestamp: '1 hour ago',
    txHash: '0x8f19203a9482b1c31a4812',
    amountUsd: 0.77,
    read: false,
    channelDispatched: ['dashboard', 'telegram']
  },
  {
    id: 'trig-103',
    ruleId: 'rule-contract-interact',
    ruleName: 'Clarity Contract Call Event',
    eventType: 'contract_interaction',
    title: '📄 Clarity Smart Contract Invocation',
    message: 'Invoked `swap-exact-tokens` on `SP3K8BC0PPEVCVKS3VM1GXM5XVLGAEG2PGY2B54A.alex-vault`.',
    severity: 'info',
    timestamp: '2 hours ago',
    txHash: '0x3c21b9a84210e42d19',
    read: true,
    channelDispatched: ['dashboard']
  },
  {
    id: 'trig-104',
    ruleId: 'rule-receive-stx',
    ruleName: 'STX Funds Received Alert',
    eventType: 'receive_stx',
    title: '💰 Inflow Received (+250 STX)',
    message: 'Wallet received +250 STX ($425 USD) from StackingDAO PoX-4 Yield Pool.',
    severity: 'info',
    timestamp: '3 hours ago',
    txHash: '0x7b8192c019a2b84',
    amountUsd: 425,
    read: true,
    channelDispatched: ['dashboard', 'email']
  },
  {
    id: 'trig-105',
    ruleId: 'rule-new-nft',
    ruleName: 'SIP-009 NFT Mint or Transfer',
    eventType: 'new_nft',
    title: '🖼️ New SIP-009 NFT Mint Detected',
    message: 'Acquired #1428 Megapont Ape NFT on Gamma Marketplace.',
    severity: 'info',
    timestamp: '1 day ago',
    txHash: '0x5e192a8301c4e9',
    amountUsd: 120,
    read: true,
    channelDispatched: ['dashboard', 'telegram']
  },
  {
    id: 'trig-106',
    ruleId: 'rule-new-sip10',
    ruleName: 'New SIP-010 Token Acquisition',
    eventType: 'new_sip10',
    title: '🪙 New SIP-010 Fungible Token Added',
    message: 'Received 1,200 WELSH tokens in wallet from Velar Swap Pool.',
    severity: 'info',
    timestamp: '2 days ago',
    txHash: '0x1c928b371940a2',
    amountUsd: 85,
    read: true,
    channelDispatched: ['dashboard', 'email']
  }
];

// Extensible Notification Channel Dispatcher Architecture
export interface ChannelDispatcher {
  id: NotificationChannelId;
  dispatch: (alert: TriggeredAlert, destination?: string) => { success: boolean; log: string };
}

export const CHANNEL_DISPATCHERS: Record<NotificationChannelId, ChannelDispatcher> = {
  dashboard: {
    id: 'dashboard',
    dispatch: (alert) => ({
      success: true,
      log: `[Dashboard Channel] Rendered alert "${alert.title}" to active banner & drawer.`
    })
  },
  email: {
    id: 'email',
    dispatch: (alert, destination) => ({
      success: true,
      log: `[Email Channel] Dispatched SMTP payload to ${destination || 'alerts@spendchain.io'} for "${alert.title}".`
    })
  },
  telegram: {
    id: 'telegram',
    dispatch: (alert, destination) => ({
      success: true,
      log: `[Telegram Channel] Sent Telegram Bot message to ${destination || '@SpendChain_Alerts_Bot'} for "${alert.title}".`
    })
  },
  webhook: {
    id: 'webhook',
    dispatch: (alert, destination) => ({
      success: true,
      log: `[Webhook Gateway] POST 200 OK to ${destination || 'https://api.spendchain.io/v1/webhooks'}. Payload size: 412 bytes.`
    })
  },
  discord: {
    id: 'discord',
    dispatch: (alert, destination) => ({
      success: true,
      log: `[Discord Channel] Rich Embed posted to webhook ${destination || 'Discord Webhook'}.`
    })
  }
};

export function getEventMetadata(eventType: AlertEventType): {
  label: string;
  description: string;
  iconName: string;
  badgeColor: 'emerald' | 'rose' | 'purple' | 'amber' | 'indigo' | 'slate';
} {
  switch (eventType) {
    case 'receive_stx':
      return {
        label: 'Wallet Receives STX',
        description: 'Triggers whenever STX is credited to any connected wallet address.',
        iconName: 'ArrowDownLeft',
        badgeColor: 'emerald'
      };
    case 'send_stx':
      return {
        label: 'Wallet Sends STX',
        description: 'Triggers whenever STX outflow or transfer occurs.',
        iconName: 'ArrowUpRight',
        badgeColor: 'rose'
      };
    case 'new_nft':
      return {
        label: 'New SIP-009 NFT',
        description: 'Triggers when a digital artifact or NFT is minted, purchased, or received.',
        iconName: 'Image',
        badgeColor: 'purple'
      };
    case 'new_sip10':
      return {
        label: 'New SIP-010 Token',
        description: 'Triggers when a new fungible token balance is detected in your wallet.',
        iconName: 'Coins',
        badgeColor: 'amber'
      };
    case 'large_tx':
      return {
        label: 'Large Transaction',
        description: 'Triggers when a transaction value exceeds your custom USD or STX threshold.',
        iconName: 'TrendingUp',
        badgeColor: 'rose'
      };
    case 'contract_interaction':
      return {
        label: 'Smart Contract Call',
        description: 'Triggers when interacting with Clarity smart contract functions.',
        iconName: 'FileCode2',
        badgeColor: 'indigo'
      };
    case 'gas_spike':
      return {
        label: 'Gas Fee Spike',
        description: 'Triggers when transaction gas fee exceeds your maximum threshold.',
        iconName: 'Flame',
        badgeColor: 'amber'
      };
    default:
      return {
        label: 'Generic Alert',
        description: 'General wallet activity monitor.',
        iconName: 'Bell',
        badgeColor: 'slate'
      };
  }
}

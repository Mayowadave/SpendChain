import { ChainId } from '../../types';

export type WalletProviderId = 'xverse' | 'leather';

export interface WalletAccount {
  address: string; // Stacks address (e.g., SP...)
  publicKey?: string;
  bnsName?: string;
  walletType: WalletProviderId;
  chain: ChainId;
  connectedAt: number;
}

export interface WalletAdapterInfo {
  id: WalletProviderId;
  name: string;
  description: string;
  icon: string; // SVG path or emblem descriptor
  downloadUrl: string;
}

export interface WalletAdapter {
  info: WalletAdapterInfo;
  isInstalled: () => boolean;
  connect: () => Promise<WalletAccount>;
  disconnect: () => Promise<void>;
}

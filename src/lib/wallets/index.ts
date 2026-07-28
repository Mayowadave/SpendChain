import { WalletAdapter, WalletProviderId } from './types';
import { xverseAdapter } from './xverseAdapter';
import { leatherAdapter } from './leatherAdapter';

export * from './types';
export { xverseAdapter } from './xverseAdapter';
export { leatherAdapter } from './leatherAdapter';

const adapters: Record<WalletProviderId, WalletAdapter> = {
  xverse: xverseAdapter,
  leather: leatherAdapter,
};

export function getWalletAdapter(id: WalletProviderId): WalletAdapter {
  const adapter = adapters[id];
  if (!adapter) {
    throw new Error(`Unsupported wallet provider: ${id}`);
  }
  return adapter;
}

export function getAllWalletAdapters(): WalletAdapter[] {
  return [xverseAdapter, leatherAdapter];
}

export function formatAddress(address?: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

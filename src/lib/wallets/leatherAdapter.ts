import { WalletAdapter, WalletAccount } from './types';

export const leatherAdapter: WalletAdapter = {
  info: {
    id: 'leather',
    name: 'Leather Wallet',
    description: 'Formerly Hiro Wallet - The pioneer wallet built for Bitcoin L2s & Stacks',
    icon: 'leather',
    downloadUrl: 'https://leather.io/install',
  },

  isInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    let parentInjected = false;
    try {
      if (window.parent && window.parent !== window) {
        const p = window.parent as any;
        parentInjected = Boolean(p.LeatherProvider || p.HiroWalletProvider || p.StacksProvider);
      }
    } catch (e) {
      // Ignore cross-origin frame error
    }

    return Boolean(
      win.LeatherProvider ||
      win.HiroWalletProvider ||
      win.StacksProvider ||
      win.HiroWallet ||
      parentInjected
    );
  },

  async connect(): Promise<WalletAccount> {
    try {
      const win = window as any;
      const provider = win.LeatherProvider || win.HiroWalletProvider || win.StacksProvider;

      if (provider && typeof provider.request === 'function') {
        const res = await provider.request('getAddresses');
        const addresses = res?.result?.addresses || res?.addresses || [];
        const stacksAddr = addresses.find(
          (a: any) => (a.symbol === 'STX' || a.purpose === 'stacks' || a.address?.startsWith('SP') || a.address?.startsWith('ST'))
        ) || addresses[0];

        if (stacksAddr && stacksAddr.address) {
          return {
            address: stacksAddr.address,
            publicKey: stacksAddr.publicKey,
            walletType: 'leather',
            chain: 'stacks-mainnet',
            connectedAt: Date.now(),
          };
        }
      }

      if (!this.isInstalled()) {
        const isIframe = typeof window !== 'undefined' && window.self !== window.top;
        if (isIframe) {
          throw new Error('IFRAME_EXTENSION_RESTRICTED');
        }
        throw new Error('LEATHER_NOT_INSTALLED');
      }

      throw new Error('Please authorize the connection in your Leather wallet extension.');
    } catch (err: any) {
      if (err.message === 'LEATHER_NOT_INSTALLED' || err.message === 'IFRAME_EXTENSION_RESTRICTED' || err.message === 'USER_REJECTED') {
        throw err;
      }
      const msg = err.message || '';
      if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('declined')) {
        throw new Error('USER_REJECTED');
      }
      throw new Error(msg || 'Failed to connect to Leather wallet.');
    }
  },

  async disconnect(): Promise<void> {
    return Promise.resolve();
  },
};


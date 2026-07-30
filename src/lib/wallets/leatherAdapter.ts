import { WalletAdapter, WalletAccount } from './types';

const withTimeout = <T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMsg));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

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

    const hasLeather = Boolean(
      win.LeatherProvider ||
      win.HiroWalletProvider ||
      win.HiroWallet ||
      win.Leather ||
      win.StacksProvider?.isLeather ||
      win.StacksProvider?.isHiro ||
      win.LeatherProvider?.isLeather
    );

    if (hasLeather) return true;

    try {
      if (window.parent && window.parent !== window) {
        const p = window.parent as any;
        if (
          p.LeatherProvider ||
          p.HiroWalletProvider ||
          p.HiroWallet ||
          p.Leather ||
          p.StacksProvider?.isLeather ||
          p.StacksProvider?.isHiro
        ) {
          return true;
        }
      }
    } catch (e) {
      // Ignore cross-origin frame error
    }

    return false;
  },

  async connect(): Promise<WalletAccount> {
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (isIframe) {
      throw new Error('IFRAME_EXTENSION_RESTRICTED');
    }

    if (!this.isInstalled()) {
      throw new Error('LEATHER_NOT_INSTALLED');
    }

    try {
      const win = window as any;
      const provider = win.LeatherProvider || win.HiroWalletProvider || win.StacksProvider || win.btc || win.stx;

      if (provider && typeof provider.request === 'function') {
        const res: any = await withTimeout(provider.request('getAddresses'), 30000, 'WALLET_TIMEOUT');
        const addresses = res?.result?.addresses || res?.addresses || res?.result || [];
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

      throw new Error('WALLET_TIMEOUT');
    } catch (err: any) {
      if (err.message === 'LEATHER_NOT_INSTALLED' || err.message === 'IFRAME_EXTENSION_RESTRICTED' || err.message === 'USER_REJECTED' || err.message === 'WALLET_TIMEOUT') {
        throw err;
      }
      const msg = err.message || '';
      if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('declined')) {
        throw new Error('USER_REJECTED');
      }
      throw new Error('WALLET_TIMEOUT');
    }
  },

  async disconnect(): Promise<void> {
    return Promise.resolve();
  },
};



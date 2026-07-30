import { request as stacksRequest, authenticate, AppConfig, UserSession } from '@stacks/connect';
import { WalletAdapter, WalletAccount } from './types';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const leatherUserSession = new UserSession({ appConfig });

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
    description: 'Formerly Hiro Wallet - Built for Bitcoin L2s & Stacks Web3 Apps',
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

    const isUserRejection = (err: any) => {
      const msg = (err?.message || err?.error?.message || String(err)).toLowerCase();
      return (
        msg.includes('user rejected') ||
        msg.includes('user canceled') ||
        msg.includes('user cancelled') ||
        msg.includes('reject') ||
        msg.includes('declined')
      );
    };

    // --- STRATEGY 1: Direct Injected RPC Call (LeatherProvider / HiroWalletProvider / StacksProvider) ---
    if (typeof window !== 'undefined') {
      const win = window as any;
      const provider =
        win.LeatherProvider ||
        win.HiroWalletProvider ||
        win.StacksProvider ||
        win.btc ||
        win.stx;

      if (provider && typeof provider.request === 'function') {
        try {
          const res: any = await withTimeout(
            provider.request('getAddresses'),
            90000,
            'WALLET_TIMEOUT'
          );

          const addresses = res?.result?.addresses || res?.addresses || res?.result || [];
          const stacksAddr = Array.isArray(addresses)
            ? addresses.find(
                (a: any) =>
                  a.symbol === 'STX' ||
                  a.purpose === 'stacks' ||
                  a.address?.startsWith('SP') ||
                  a.address?.startsWith('ST')
              ) || addresses[0]
            : null;

          if (stacksAddr && stacksAddr.address) {
            return {
              address: stacksAddr.address,
              publicKey: stacksAddr.publicKey,
              walletType: 'leather',
              chain: 'stacks-mainnet',
              connectedAt: Date.now(),
            };
          }
        } catch (err: any) {
          if (isUserRejection(err)) {
            throw new Error('USER_REJECTED');
          }
          if (err?.message === 'WALLET_TIMEOUT') {
            throw err;
          }
          console.warn('Leather direct provider attempt note:', err);
        }
      }
    }

    // --- STRATEGY 2: Official @stacks/connect SDK Request ---
    try {
      const win = typeof window !== 'undefined' ? (window as any) : {};
      const providerObj = win.LeatherProvider || win.HiroWalletProvider || win.StacksProvider;

      if (providerObj) {
        const res: any = await withTimeout(
          stacksRequest({ provider: providerObj }, 'getAddresses'),
          90000,
          'WALLET_TIMEOUT'
        );

        const addresses = res?.addresses || res?.result?.addresses || [];
        const stacksAddr = addresses.find(
          (a: any) =>
            a.symbol === 'STX' ||
            a.purpose === 'stacks' ||
            a.address?.startsWith('SP') ||
            a.address?.startsWith('ST')
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
    } catch (err: any) {
      if (isUserRejection(err)) {
        throw new Error('USER_REJECTED');
      }
      if (err?.message === 'WALLET_TIMEOUT') {
        throw err;
      }
      console.warn('Leather @stacks/connect attempt note:', err);
    }

    // --- STRATEGY 3: @stacks/connect authenticate callback ---
    return new Promise((resolve, reject) => {
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('WALLET_TIMEOUT'));
        }
      }, 90000);

      try {
        const win = typeof window !== 'undefined' ? (window as any) : {};
        const providerObj = win.LeatherProvider || win.HiroWalletProvider || win.StacksProvider;

        authenticate(
          {
            appDetails: {
              name: 'SpendChain',
              icon: typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '',
            },
            userSession: leatherUserSession,
            onFinish: (payload: any) => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timer);

              const userData = leatherUserSession.loadUserData?.() || payload?.authResponsePayload;
              const mainnetAddr = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress;
              const address = typeof mainnetAddr === 'string' ? mainnetAddr : mainnetAddr?.address || '';

              if (address) {
                resolve({
                  address,
                  walletType: 'leather',
                  chain: 'stacks-mainnet',
                  connectedAt: Date.now(),
                });
              } else {
                reject(new Error('WALLET_TIMEOUT'));
              }
            },
            onCancel: () => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timer);
              reject(new Error('USER_REJECTED'));
            },
          },
          providerObj
        );
      } catch (err: any) {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        if (isUserRejection(err)) {
          reject(new Error('USER_REJECTED'));
        } else {
          reject(err);
        }
      }
    });
  },

  async disconnect(): Promise<void> {
    try {
      if (leatherUserSession.isUserSignedIn()) {
        leatherUserSession.signUserOut();
      }
    } catch (e) {
      // Ignore cleanup error
    }
    return Promise.resolve();
  },
};




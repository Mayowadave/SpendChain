import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';
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

export const xverseAdapter: WalletAdapter = {
  info: {
    id: 'xverse',
    name: 'Xverse Wallet',
    description: 'The leading Bitcoin & Stacks wallet for Web3 DeFi & Ordinals',
    icon: 'xverse',
    downloadUrl: 'https://www.xverse.app/download',
  },

  isInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    let parentInjected = false;
    try {
      if (window.parent && window.parent !== window) {
        const p = window.parent as any;
        parentInjected = Boolean(
          p.XverseProviders || p.BitcoinProvider || p.StacksProvider || p.satsConnect || p.Xverse
        );
      }
    } catch (e) {
      // Ignore cross-origin frame error
    }

    return Boolean(
      win.XverseProviders?.StacksProvider ||
      win.XverseProviders?.BitcoinProvider ||
      win.XverseProviders ||
      win.BitcoinProvider?.isXverse ||
      win.StacksProvider?.isXverse ||
      win.satsConnect ||
      win.BitcoinProvider ||
      win.StacksProvider ||
      win.Xverse ||
      win.btc ||
      win.stx ||
      parentInjected
    );
  },

  async connect(): Promise<WalletAccount> {
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (isIframe) {
      throw new Error('IFRAME_EXTENSION_RESTRICTED');
    }

    if (!this.isInstalled()) {
      throw new Error('XVERSE_NOT_INSTALLED');
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

    // --- STRATEGY 1: Direct Injected Window Providers (Instant extension popup) ---
    if (typeof window !== 'undefined') {
      const win = window as any;
      const providers = [
        win.XverseProviders?.BitcoinProvider,
        win.XverseProviders?.StacksProvider,
        win.BitcoinProvider,
        win.StacksProvider,
        win.btc,
        win.stx,
        win.Xverse,
      ].filter(Boolean);

      for (const provider of providers) {
        if (!provider || typeof provider.request !== 'function') continue;

        const methods = ['getAddresses', 'stx_getAddresses', 'stx_getAccounts', 'requestAccounts'];
        for (const method of methods) {
          try {
            const directPromise = provider.request(method, {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks],
              message: 'Authorize SpendChain to access your Stacks account for read-only analytics.',
            });

            const directRes: any = await withTimeout(directPromise, 40000, 'WALLET_TIMEOUT');

            const directAddresses: any[] = 
              Array.isArray(directRes?.result?.addresses) ? directRes.result.addresses :
              Array.isArray(directRes?.result) ? directRes.result :
              Array.isArray(directRes?.addresses) ? directRes.addresses :
              Array.isArray(directRes) ? directRes : [];

            const stacksObj = directAddresses.find(
              (addr: any) =>
                addr.purpose === 'stacks' ||
                addr.purpose === AddressPurpose.Stacks ||
                addr.symbol === 'STX' ||
                addr.address?.startsWith('SP') ||
                addr.address?.startsWith('ST')
            ) || directAddresses.find((addr: any) => addr.address?.startsWith('SP') || addr.address?.startsWith('ST'));

            if (stacksObj && stacksObj.address) {
              return {
                address: stacksObj.address,
                publicKey: stacksObj.publicKey,
                walletType: 'xverse',
                chain: 'stacks-mainnet',
                connectedAt: Date.now(),
              };
            }
          } catch (err: any) {
            if (isUserRejection(err)) {
              throw new Error('USER_REJECTED');
            }
          }
        }
      }
    }

    // --- STRATEGY 2: sats-connect (Official Library Request) ---
    try {
      const satsPromise = request('getAddresses', {
        purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks],
        message: 'Authorize SpendChain to access your Stacks account for read-only analytics & tax ledger tracking.',
      });

      const response: any = await withTimeout(satsPromise, 40000, 'WALLET_TIMEOUT');

      if (response?.error) {
        const errCode = response.error.code;
        if (errCode === RpcErrorCode.USER_REJECTION || errCode === -31001 || isUserRejection(response.error)) {
          throw new Error('USER_REJECTED');
        }
      }

      const addresses: any[] = 
        Array.isArray(response?.result?.addresses) ? response.result.addresses :
        Array.isArray(response?.result) ? response.result :
        Array.isArray(response?.addresses) ? response.addresses :
        Array.isArray(response) ? response :
        [];

      if (addresses.length > 0) {
        const stacksAddressObj = addresses.find(
          (addr: any) =>
            addr.purpose === AddressPurpose.Stacks ||
            addr.purpose === 'stacks' ||
            addr.symbol === 'STX' ||
            addr.address?.startsWith('SP') ||
            addr.address?.startsWith('ST')
        ) || addresses.find((addr: any) => addr.address?.startsWith('SP') || addr.address?.startsWith('ST')) || addresses[0];

        if (stacksAddressObj && stacksAddressObj.address) {
          return {
            address: stacksAddressObj.address,
            publicKey: stacksAddressObj.publicKey,
            walletType: 'xverse',
            chain: 'stacks-mainnet',
            connectedAt: Date.now(),
          };
        }
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg === 'USER_REJECTED' || isUserRejection(err)) {
        throw new Error('USER_REJECTED');
      }
      if (msg === 'WALLET_TIMEOUT') {
        throw err;
      }
      console.warn('sats-connect attempt note:', msg);
    }

    throw new Error('WALLET_TIMEOUT');
  },

  async disconnect(): Promise<void> {
    return Promise.resolve();
  },
};






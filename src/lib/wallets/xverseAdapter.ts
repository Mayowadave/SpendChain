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

    const hasXverse = Boolean(
      win.XverseProviders?.StacksProvider ||
      win.XverseProviders?.BitcoinProvider ||
      win.XverseProviders ||
      win.Xverse ||
      win.satsConnect ||
      win.BitcoinProvider?.isXverse ||
      win.StacksProvider?.isXverse
    );

    if (hasXverse) return true;

    try {
      if (window.parent && window.parent !== window) {
        const p = window.parent as any;
        if (
          p.XverseProviders ||
          p.Xverse ||
          p.satsConnect ||
          p.BitcoinProvider?.isXverse ||
          p.StacksProvider?.isXverse
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

    // --- PRIMARY: Official sats-connect Request ---
    try {
      const response: any = await withTimeout(
        request('getAddresses', {
          purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks],
          message: 'Authorize SpendChain to access your Stacks account for read-only analytics & tax ledger tracking.',
        }),
        60000,
        'WALLET_TIMEOUT'
      );

      if (response?.status === 'error' || response?.error) {
        const errObj = response.error || response;
        const errCode = errObj.code;
        if (errCode === RpcErrorCode.USER_REJECTION || errCode === -31001 || isUserRejection(errObj)) {
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
      if (err?.message === 'USER_REJECTED' || isUserRejection(err)) {
        throw new Error('USER_REJECTED');
      }
      if (err?.message === 'WALLET_TIMEOUT') {
        throw err;
      }
      console.warn('sats-connect attempt note:', err);
    }

    // --- SECONDARY FALLBACK: Single direct call to window provider ---
    if (typeof window !== 'undefined') {
      const win = window as any;
      const provider =
        win.XverseProviders?.BitcoinProvider ||
        win.BitcoinProvider ||
        win.XverseProviders?.StacksProvider ||
        win.StacksProvider ||
        win.Xverse;

      if (provider && typeof provider.request === 'function') {
        try {
          const directRes: any = await withTimeout(
            provider.request('getAddresses', {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks],
              message: 'Authorize SpendChain',
            }),
            30000,
            'WALLET_TIMEOUT'
          );

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
          if (err?.message === 'WALLET_TIMEOUT') {
            throw err;
          }
        }
      }
    }

    throw new Error('WALLET_TIMEOUT');
  },

  async disconnect(): Promise<void> {
    return Promise.resolve();
  },
};






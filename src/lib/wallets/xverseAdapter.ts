import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';
import { WalletAdapter, WalletAccount } from './types';

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
    try {
      const response: any = await request('getAddresses', {
        purposes: [AddressPurpose.Stacks],
        message: 'Authorize SpendChain to access your Stacks account for read-only analytics & tax ledger tracking.',
      });

      // Safely extract addresses array from all sats-connect / Xverse response formats
      const addresses: any[] = 
        Array.isArray(response?.result?.addresses) ? response.result.addresses :
        Array.isArray(response?.result) ? response.result :
        Array.isArray(response?.addresses) ? response.addresses :
        Array.isArray(response) ? response :
        [];

      const isSuccess = response?.status === 'success' || addresses.length > 0;

      if (isSuccess && addresses.length > 0) {
        const stacksAddressObj = addresses.find(
          (addr: any) =>
            addr.purpose === AddressPurpose.Stacks ||
            addr.purpose === 'stacks' ||
            addr.address?.startsWith('SP') ||
            addr.address?.startsWith('ST') ||
            addr.symbol === 'STX'
        ) || addresses[0];

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

      // Direct window provider fallback if sats-connect result format differs
      if (typeof window !== 'undefined') {
        const win = window as any;
        const provider = win.XverseProviders?.StacksProvider || win.XverseProviders?.BitcoinProvider || win.BitcoinProvider || win.StacksProvider;
        if (provider && typeof provider.request === 'function') {
          try {
            const directRes = await provider.request('getAddresses');
            const directAddresses: any[] = 
              Array.isArray(directRes?.result?.addresses) ? directRes.result.addresses :
              Array.isArray(directRes?.result) ? directRes.result :
              Array.isArray(directRes?.addresses) ? directRes.addresses : [];

            const directStacksObj = directAddresses.find(
              (addr: any) =>
                addr.purpose === 'stacks' ||
                addr.purpose === AddressPurpose.Stacks ||
                addr.address?.startsWith('SP') ||
                addr.address?.startsWith('ST')
            ) || directAddresses[0];

            if (directStacksObj && directStacksObj.address) {
              return {
                address: directStacksObj.address,
                publicKey: directStacksObj.publicKey,
                walletType: 'xverse',
                chain: 'stacks-mainnet',
                connectedAt: Date.now(),
              };
            }
          } catch (directErr) {
            console.warn('Xverse direct provider fallback error:', directErr);
          }
        }
      }

      // Handle explicit errors returned in response object
      const errCode = response?.error?.code;
      const errMsg = response?.error?.message || '';

      if (
        errCode === RpcErrorCode.USER_REJECTION ||
        errMsg.toLowerCase().includes('reject') ||
        errMsg.toLowerCase().includes('cancel') ||
        errMsg.toLowerCase().includes('declined')
      ) {
        throw new Error('USER_REJECTED');
      }

      if (errMsg) {
        throw new Error(errMsg);
      }

      const isIframe = typeof window !== 'undefined' && window.self !== window.top;
      if (!this.isInstalled()) {
        if (isIframe) {
          throw new Error('IFRAME_EXTENSION_RESTRICTED');
        } else {
          throw new Error('XVERSE_NOT_INSTALLED');
        }
      }

      throw new Error('No Stacks address returned from Xverse wallet.');
    } catch (err: any) {
      if (err.message === 'USER_REJECTED') {
        throw err;
      }
      
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('user rejected') ||
        msg.toLowerCase().includes('user cancelled') ||
        msg.toLowerCase().includes('declined')
      ) {
        throw new Error('USER_REJECTED');
      }

      const isIframe = typeof window !== 'undefined' && window.self !== window.top;
      if (!this.isInstalled() || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('provider')) {
        if (isIframe) {
          throw new Error('IFRAME_EXTENSION_RESTRICTED');
        } else {
          throw new Error('XVERSE_NOT_INSTALLED');
        }
      }

      throw new Error(msg || 'Failed to connect to Xverse wallet.');
    }
  },

  async disconnect(): Promise<void> {
    return Promise.resolve();
  },
};


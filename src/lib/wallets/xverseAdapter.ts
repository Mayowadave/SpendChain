import { getAddress, AddressPurpose, BitcoinNetworkType } from 'sats-connect';
import { request as stacksRequest, authenticate, AppConfig, UserSession } from '@stacks/connect';
import { WalletAdapter, WalletAccount } from './types';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const xverseUserSession = new UserSession({ appConfig });

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

    // --- STRATEGY 1: Canonical sats-connect `getAddress` (Primary Xverse PC Chrome Extension popup) ---
    try {
      const getAddressPromise = new Promise<WalletAccount>((resolve, reject) => {
        let finished = false;

        const timeoutId = setTimeout(() => {
          if (!finished) {
            finished = true;
            reject(new Error('WALLET_TIMEOUT'));
          }
        }, 90000);

        try {
          getAddress({
            payload: {
              purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks],
              message: 'Authorize SpendChain to access your Stacks account for read-only analytics & tax ledger tracking.',
              network: {
                type: BitcoinNetworkType.Mainnet,
              },
            },
            onFinish: (response: any) => {
              if (finished) return;
              finished = true;
              clearTimeout(timeoutId);

              const addresses: any[] =
                Array.isArray(response?.addresses) ? response.addresses :
                Array.isArray(response?.result?.addresses) ? response.result.addresses :
                Array.isArray(response?.result) ? response.result : [];

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
                  resolve({
                    address: stacksAddressObj.address,
                    publicKey: stacksAddressObj.publicKey,
                    walletType: 'xverse',
                    chain: 'stacks-mainnet',
                    connectedAt: Date.now(),
                  });
                  return;
                }
              }
              reject(new Error('NO_STACKS_ADDRESS'));
            },
            onCancel: () => {
              if (finished) return;
              finished = true;
              clearTimeout(timeoutId);
              reject(new Error('USER_REJECTED'));
            },
          });
        } catch (err) {
          if (finished) return;
          finished = true;
          clearTimeout(timeoutId);
          reject(err);
        }
      });

      return await getAddressPromise;
    } catch (err: any) {
      if (err?.message === 'USER_REJECTED' || isUserRejection(err)) {
        throw new Error('USER_REJECTED');
      }
      console.warn('sats-connect getAddress attempt note:', err);
    }

    // --- STRATEGY 2: Direct Window Provider Call (window.XverseProviders / window.BitcoinProvider) ---
    if (typeof window !== 'undefined') {
      const win = window as any;
      const providers = [
        win.XverseProviders?.BitcoinProvider,
        win.BitcoinProvider,
        win.XverseProviders?.StacksProvider,
        win.StacksProvider,
        win.Xverse,
      ].filter(Boolean);

      for (const provider of providers) {
        if (!provider || typeof provider.request !== 'function') continue;

        const methods = ['stx_getAddresses', 'getAddresses', 'requestAccounts'];
        for (const method of methods) {
          try {
            const directRes: any = await new Promise((resolve, reject) => {
              const timer = setTimeout(() => reject(new Error('WALLET_TIMEOUT')), 15000);
              provider
                .request(method, {
                  purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment, AddressPurpose.Stacks],
                  message: 'Authorize SpendChain',
                })
                .then((res: any) => {
                  clearTimeout(timer);
                  resolve(res);
                })
                .catch((e: any) => {
                  clearTimeout(timer);
                  reject(e);
                });
            });

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

    // --- STRATEGY 3: Official @stacks/connect SDK Request ---
    try {
      const win = typeof window !== 'undefined' ? (window as any) : {};
      const providerObj = win.XverseProviders?.BitcoinProvider || win.XverseProviders?.StacksProvider || win.BitcoinProvider;

      if (providerObj) {
        const res: any = await stacksRequest({ provider: providerObj }, 'getAddresses');

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
            walletType: 'xverse',
            chain: 'stacks-mainnet',
            connectedAt: Date.now(),
          };
        }
      }
    } catch (err: any) {
      if (isUserRejection(err)) {
        throw new Error('USER_REJECTED');
      }
    }

    // --- STRATEGY 4: @stacks/connect authenticate callback ---
    return new Promise((resolve, reject) => {
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('WALLET_TIMEOUT'));
        }
      }, 40000);

      try {
        const win = typeof window !== 'undefined' ? (window as any) : {};
        const providerObj = win.XverseProviders?.BitcoinProvider || win.XverseProviders?.StacksProvider || win.BitcoinProvider;

        authenticate(
          {
            appDetails: {
              name: 'SpendChain',
              icon: typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '',
            },
            userSession: xverseUserSession,
            onFinish: (payload: any) => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timer);

              const userData = xverseUserSession.loadUserData?.() || payload?.authResponsePayload;
              const mainnetAddr = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress;
              const address = typeof mainnetAddr === 'string' ? mainnetAddr : mainnetAddr?.address || '';

              if (address) {
                resolve({
                  address,
                  walletType: 'xverse',
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
      if (xverseUserSession.isUserSignedIn()) {
        xverseUserSession.signUserOut();
      }
    } catch (e) {
      // Ignore cleanup error
    }
    return Promise.resolve();
  },
};








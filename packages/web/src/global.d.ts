import type { ExternalProvider, Web3Provider } from '@ethersproject/providers'
declare global {
  interface Window {
    ethereum: ExternalProvider & {
      // enable: () => Promise<any>
    }
    provider: Web3Provider
  }
}

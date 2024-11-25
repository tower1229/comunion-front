import { storage } from '@comunion/utils'
import {
  configureChains,
  createConfig,
  watchNetwork,
  watchAccount,
  switchNetwork,
  disconnect
} from '@wagmi/core'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { ethers, getDefaultProvider } from 'ethers'
import { defineStore } from 'pinia'
import { STORE_KEY_TOKEN, allNetworks, supportedNetworks } from '@/constants'
import allChains from '@/utils/wagmiChains'

export type WalletState = {
  // wallet address
  address?: string
  chainInfo?: { id: number } & Record<string, any>
  web3modal?: Web3Modal
  wallet?: any
}
// hack
let _openNetworkSwitcher: () => void | undefined

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    address: undefined,
    chainInfo: undefined,
    web3modal: undefined,
    wallet: undefined
  }),
  getters: {
    connected: state => !!state.address,
    chainId: state => state.chainInfo?.id,
    explorerUrl: state => state.chainInfo?.blockExplorers.default.url,
    isNetworkSupported: state => {
      let status = false
      supportedNetworks.forEach(item => {
        if (item.chainId === state.chainInfo?.id) {
          status = true
        }
      })
      return status
    }
  },
  actions: {
    init() {
      // begin
      return new Promise((resolve, reject) => {
        if (this.web3modal) {
          resolve(this.web3modal)
        }
        const chains = supportedNetworks
          .map(item => item.wagmiChainName)
          .map(key => key && (allChains as any)[key])
          .filter(net => !!net)
        console.log('chains======', supportedNetworks, allChains, chains)
        if (chains.length) {
          const projectId = import.meta.env.VITE_WEB3MODAL_PROJECT_ID
          // Wagmi Core Client
          const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
          const wagmiConfig = createConfig({
            autoConnect: true,
            connectors: w3mConnectors({ projectId, chains }),
            publicClient
          })

          const ethereumClient = new EthereumClient(wagmiConfig, chains)
          this.web3modal = new Web3Modal(
            {
              projectId
            },
            ethereumClient
          )
          // this.wallet = new ethers.providers.Web3Provider(window.ethereum)

          watchAccount(account => {
            if (this.address && account.address !== this.address) {
              storage('session').clear()
              storage('local').remove(STORE_KEY_TOKEN)
              this.disconnectWallet()
            } else {
              this.address = account.address
            }
          })
          watchNetwork(network => {
            this.chainInfo = network.chain
          })

          resolve(this.web3modal)
        } else {
          console.warn('wallet init error, check the chains list', supportedNetworks, allChains)
          reject()
        }
      })
    },
    async switchNetwork(chain: { chainId?: number; chainName?: string }) {
      let chainId = chain.chainId
      if (!chainId) {
        const targetChain: any = supportedNetworks.find(
          e => e.name.toLowerCase() === chain.chainName?.toLowerCase()
        )
        if (targetChain) {
          chainId = targetChain.chainId
        }
      }
      return chainId && this.connected
        ? switchNetwork({
            chainId
          })
        : null
    },
    async ensureWalletConnected(force = false) {
      return (
        !this.connected &&
        (await this.web3modal?.openModal({
          route: 'ConnectWallet'
        }))
      )
    },
    setDefaultChainByChainId(chainId: number) {
      const targetName = supportedNetworks.find(e => e.chainId === chainId)?.wagmiChainName
      const targetNet = targetName ? (allChains as any)[targetName] : null
      if (targetNet) {
        this.web3modal?.setDefaultChain(targetNet)
      } else {
        console.warn('no support default net: ', chainId)
      }
    },
    disconnectWallet() {
      this.address = undefined
      this.chainInfo = undefined
      disconnect()
    },
    getRpcProvider(chainId: number, key: string) {
      getDefaultProvider
      const networkInfo = allNetworks.find(network => network.chainId === chainId)
      if (!networkInfo) return
      let rpc = networkInfo.rpcUrl
      if ([1, 5].includes(chainId)) {
        rpc += key
      }
      const provider = new ethers.providers.JsonRpcProvider(rpc)
      return provider
    },
    // open network switcher
    openNetworkSwitcher() {
      _openNetworkSwitcher?.()
    },
    // set network switcher function
    setOpenNetworkSwitcher(fn: () => void) {
      _openNetworkSwitcher = fn
    }
  }
})

export type WalletStore = ReturnType<typeof useWalletStore>

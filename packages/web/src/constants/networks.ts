import { type Router, findRouterByChainId } from './routers'
import avalanche from '@/assets/networks/avalanche.svg'
import binance from '@/assets/networks/binance.svg'
import ethereum from '@/assets/networks/ethereum.svg'
import fantom from '@/assets/networks/fantom.svg'
import noavalanche from '@/assets/networks/noavalanche.svg'
import nobinance from '@/assets/networks/nobinance.svg'
import noethereum from '@/assets/networks/noethereum.svg'
import nofantom from '@/assets/networks/nofantom.svg'
import nopolygon from '@/assets/networks/nopolygon.svg'
import nosyscoin from '@/assets/networks/nosyscoin.svg'
import polygon from '@/assets/networks/polygon.svg'
import rolluxTestnet from '@/assets/networks/rollux-testnet.svg'
import rollux from '@/assets/networks/rollux.svg'
import syscoin from '@/assets/networks/syscoin.svg'

/**
 * https://chainlist.org/
 */

export type ChainNetworkType = {
  logo: string
  nologo?: string
  chainId: number
  name: string
  shortName?: string
  wagmiChainName?: string
  currencySymbol: string
  rpcUrl: string
  explorerUrl: string
  routers?: Router[]
  chain_contracts?: Array<{
    project: number
    address: string
    abi: string
  }>
  coingeckoId?: string
  coingeckoPlatformId?: string
  defillamaId?: string
}

/**
 * All networks we want to support
 * (Ethereum、BNB Smart Chain、Avalanche、Fantom Opera) use
 */
export const allNetworks: ChainNetworkType[] = [
  // mainnet
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 1,
    name: 'Ethereum',
    shortName: 'Ethereum',
    wagmiChainName: 'mainnet',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
    coingeckoId: 'ethereum',
    coingeckoPlatformId: 'ethereum'
  },
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 10,
    name: 'Optimism',
    shortName: 'Optimism',
    wagmiChainName: 'optimism',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    coingeckoId: 'optimism',
    coingeckoPlatformId: 'optimistic-ethereum'
  },
  {
    logo: binance,
    nologo: nobinance,
    chainId: 56,
    name: 'Binance Smart Chain',
    shortName: 'BSC',
    wagmiChainName: 'bsc',
    currencySymbol: 'BNB',
    rpcUrl: 'https://bsc.blockpi.network/v1/rpc/public',
    explorerUrl: 'https://bscscan.com',
    coingeckoId: 'binancecoin',
    coingeckoPlatformId: 'binance-smart-chain',
    defillamaId: 'bsc'
  },
  {
    logo: syscoin,
    nologo: nosyscoin,
    chainId: 57,
    name: 'Syscoin',
    shortName: 'Syscoin',
    wagmiChainName: 'syscoin',
    currencySymbol: 'SYS',
    rpcUrl: 'https://rpc.syscoin.org',
    explorerUrl: 'https://explorer.syscoin.org',
    coingeckoId: 'syscoin',
    coingeckoPlatformId: 'syscoin'
  },
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 100,
    name: 'Gnosis Chain',
    shortName: 'Gnosis',
    wagmiChainName: 'gnosis',
    currencySymbol: 'xDAI',
    rpcUrl: 'https://rpc.gnosischain.com',
    explorerUrl: 'https://gnosisscan.io',
    coingeckoId: 'gnosis',
    coingeckoPlatformId: 'xdai',
    defillamaId: 'xdai'
  },
  {
    logo: polygon,
    nologo: nopolygon,
    chainId: 137,
    name: 'Polygon',
    shortName: 'Polygon',
    wagmiChainName: 'polygon',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    coingeckoId: 'matic-network',
    coingeckoPlatformId: 'polygon-pos'
  },
  {
    logo: fantom,
    nologo: nofantom,
    chainId: 250,
    name: 'Fantom',
    shortName: 'Fantom',
    wagmiChainName: 'fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com',
    coingeckoId: 'fantom',
    coingeckoPlatformId: 'fantom'
  },
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 288,
    name: 'BOBA NETWORK',
    shortName: 'BOBA',
    wagmiChainName: 'boba',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.boba.network',
    explorerUrl: 'https://bobascan.com',
    coingeckoId: 'boba-network',
    coingeckoPlatformId: 'boba'
  },
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    wagmiChainName: 'arbitrum',
    currencySymbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io/',
    coingeckoId: 'arbitrum',
    coingeckoPlatformId: 'arbitrum-one',
    defillamaId: 'arbitrum'
  },
  {
    logo: avalanche,
    nologo: noavalanche,
    chainId: 43114,
    name: 'Avalanche',
    shortName: 'Avalanche',
    wagmiChainName: 'avalanche',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    coingeckoId: 'avalanche-2',
    coingeckoPlatformId: 'avalanche',
    defillamaId: 'avax'
  },
  // testnet
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 5,
    name: 'Goerli',
    shortName: 'Goerli',
    wagmiChainName: 'goerli',
    currencySymbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3',
    explorerUrl: 'https://goerli.etherscan.io'
  },
  {
    logo: binance,
    nologo: nobinance,
    chainId: 97,
    name: 'BNB Chain Testnet',
    shortName: 'BNB Testnet',
    wagmiChainName: 'bscTestnet',
    currencySymbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com'
  },
  {
    logo: fantom,
    nologo: nofantom,
    chainId: 4002,
    name: 'Fantom Testnet',
    shortName: 'Fantom Testnet',
    wagmiChainName: 'fantomTestnet',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.testnet.fantom.network',
    explorerUrl: 'https://testnet.ftmscan.com'
  },
  {
    logo: avalanche,
    nologo: noavalanche,
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    shortName: 'Avalanche Testnet',
    wagmiChainName: 'avalancheFuji',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://cchain.explorer.avax-test.network'
  },
  {
    logo: polygon,
    nologo: nopolygon,
    chainId: 80001,
    name: 'Mumbai',
    shortName: 'Mumbai',
    wagmiChainName: 'polygonMumbai',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    explorerUrl: 'https://mumbai.polygonscan.com'
  },
  {
    logo: rollux,
    nologo: nosyscoin,
    chainId: 2814,
    name: 'Rollux OPv1 Private',
    shortName: 'Rollux Private',
    currencySymbol: 'RSYS',
    rpcUrl: 'https://testnet.rollux.com:2814',
    explorerUrl: 'https://explorer.testnet.rollux.com'
  },
  {
    logo: syscoin,
    nologo: nosyscoin,
    chainId: 5700,
    name: 'Syscoin Tanenbaum Testnet',
    shortName: 'Syscoin Testnet',
    currencySymbol: 'tSYS',
    rpcUrl: 'https://rpc.tanenbaum.io',
    explorerUrl: 'https://tanenbaum.io'
  },
  {
    logo: rolluxTestnet,
    nologo: nosyscoin,
    chainId: 57000,
    name: 'Rollux Testnet',
    shortName: 'Rollux Testnet',
    currencySymbol: 'TSYS',
    rpcUrl: 'https://rpc-tanenbaum.rollux.com',
    explorerUrl: 'https://rollux.tanenbaum.io'
  }
].map(item => ({ ...item, routers: findRouterByChainId(item.chainId) }))

export const supportedChainIds = import.meta.env.VITE_SUPPORTED_CHAIN_ID?.split(',').map(id =>
  Number(id)
) ?? [43114]

/**
 * Current supported networks
 */
export const supportedNetworks: ChainNetworkType[] = allNetworks.filter(network =>
  supportedChainIds.includes(network.chainId)
)

export const getNetByChainId = (chainId: number) => {
  return allNetworks.find(item => item.chainId === chainId)
}

export const getNetByChainName = (chainName: string) => {
  return allNetworks.find(item => item.name.toLowerCase() === chainName.toLowerCase())
}

export const infuraKey = '65b449dc78314fe583ece8797faccc0a'

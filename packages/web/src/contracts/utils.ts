import { type WalletClient, getWalletClient, type PublicClient, getPublicClient } from '@wagmi/core'
import { providers } from 'ethers'

import { type HttpTransport } from 'viem'

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = await getWalletClient({ chainId })
  if (!walletClient) return undefined
  return walletClientToSigner(walletClient)
}

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = getPublicClient({ chainId })
  return publicClientToProvider(publicClient)
}

export const AVAX_USDC_ADDR: Record<number, string> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  5: '0xEFcEcEcD651470ad5369Ec91D54A8907Bd69326f',
  56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  97: '0x1A1c3a5233A0650db9d5a4Be552C6b8fB0936F70',
  2814: '0xEDD8b1e92c6584AFc0A4509f1122244195e0157B',
  4002: '0x9d3e631f3a800890d8573b7845C20E08eCa2c141',
  43113: '0x8f81b9B08232F8E8981dAa87854575d7325A9439',
  43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  80001: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23',
  137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  250: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  57: '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c'
}

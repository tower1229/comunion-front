import { Contract } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const BountyFactoryStoreAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[],"name":"primary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"bounty","type":"address"}],"name":"push","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useBountyFactoryStoreContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: BountyFactoryStoreAddresses }
): {
  getContract: () => Promise<Contract>
  primary: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  push: (bounty: string, pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  transferPrimary: (
    recipient: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: BountyFactoryStoreAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    primary: wrapTransaction({ ...getContractArgs.value, ...params }, 'primary'),
    push: wrapTransaction({ ...getContractArgs.value, ...params }, 'push'),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary')
  }
}

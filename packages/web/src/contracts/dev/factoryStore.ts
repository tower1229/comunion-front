import { Contract } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const FactoryStoreAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[],"name":"children","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"childAddr","type":"address"}],"name":"isChild","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"primary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"child","type":"address"}],"name":"push","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useFactoryStoreContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: FactoryStoreAddresses }
): {
  getContract: () => Promise<Contract>
  children: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  isChild: (
    childAddr: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  primary: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  push: (child: string, pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
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
      addresses: FactoryStoreAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    children: wrapTransaction({ ...getContractArgs.value, ...params }, 'children'),
    isChild: wrapTransaction({ ...getContractArgs.value, ...params }, 'isChild'),
    primary: wrapTransaction({ ...getContractArgs.value, ...params }, 'primary'),
    push: wrapTransaction({ ...getContractArgs.value, ...params }, 'push'),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary')
  }
}

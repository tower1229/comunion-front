import { Contract } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const SecondaryAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[],"name":"primary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useSecondaryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: SecondaryAddresses }
): {
  getContract: () => Promise<Contract>
  primary: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
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
      addresses: SecondaryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    primary: wrapTransaction({ ...getContractArgs.value, ...params }, 'primary'),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary')
  }
}

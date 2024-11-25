import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const BountyStoreAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[],"name":"applicants","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getApplicant","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint8","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getDepositLocker","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getDepositUnlocker","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"primary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"pushApplicant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint8","name":"_status","type":"uint8"}],"name":"putApplicant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"putApplicantAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint8","name":"_status","type":"uint8"}],"name":"putApplicantStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_bool","type":"bool"}],"name":"putDepositLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_bool","type":"bool"}],"name":"putDepositUnlocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'

export function useBountyStoreContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: BountyStoreAddresses }
): {
  getContract: () => Promise<Contract>
  applicants: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  getApplicant: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** amount */ number | BigNumber, /** status */ number]>
  getDepositLocker: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  getDepositUnlocker: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  primary: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  pushApplicant: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  putApplicant: (
    _address: string,
    _amount: number | BigNumber,
    _status: number,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  putApplicantAmount: (
    _address: string,
    _amount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  putApplicantStatus: (
    _address: string,
    _status: number,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  putDepositLocker: (
    _address: string,
    _bool: any,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  putDepositUnlocker: (
    _address: string,
    _bool: any,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transfer: (
    _to: string,
    _amount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  transferPrimary: (
    recipient: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferToken: (
    _token: string,
    _to: string,
    _amount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: BountyStoreAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    applicants: wrapTransaction({ ...getContractArgs.value, ...params }, 'applicants'),
    getApplicant: wrapTransaction({ ...getContractArgs.value, ...params }, 'getApplicant'),
    getDepositLocker: wrapTransaction({ ...getContractArgs.value, ...params }, 'getDepositLocker'),
    getDepositUnlocker: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'getDepositUnlocker'
    ),
    primary: wrapTransaction({ ...getContractArgs.value, ...params }, 'primary'),
    pushApplicant: wrapTransaction({ ...getContractArgs.value, ...params }, 'pushApplicant'),
    putApplicant: wrapTransaction({ ...getContractArgs.value, ...params }, 'putApplicant'),
    putApplicantAmount: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'putApplicantAmount'
    ),
    putApplicantStatus: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'putApplicantStatus'
    ),
    putDepositLocker: wrapTransaction({ ...getContractArgs.value, ...params }, 'putDepositLocker'),
    putDepositUnlocker: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'putDepositUnlocker'
    ),
    transfer: wrapTransaction({ ...getContractArgs.value, ...params }, 'transfer'),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary'),
    transferToken: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferToken')
  }
}

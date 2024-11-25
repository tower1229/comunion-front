import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const BountyAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"applyFor","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"approveApplicant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"close","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getStore","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"depositToken","type":"address"},{"internalType":"bool","name":"depositTokenIsNative","type":"bool"},{"internalType":"uint256","name":"founderDepositAmount","type":"uint256"},{"internalType":"uint256","name":"applicantDepositMinAmount","type":"uint256"},{"internalType":"uint256","name":"applyDeadline","type":"uint256"}],"internalType":"struct Parameters","name":"_paras","type":"tuple"}],"name":"init","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"lock","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"parameters","outputs":[{"components":[{"internalType":"address","name":"depositToken","type":"address"},{"internalType":"bool","name":"depositTokenIsNative","type":"bool"},{"internalType":"uint256","name":"founderDepositAmount","type":"uint256"},{"internalType":"uint256","name":"applicantDepositMinAmount","type":"uint256"},{"internalType":"uint256","name":"applyDeadline","type":"uint256"}],"internalType":"struct Parameters","name":"_paras","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"postUpdate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"releaseMyDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"state","outputs":[{"internalType":"uint8","name":"_bountyStatus","type":"uint8"},{"internalType":"uint256","name":"_applicantCount","type":"uint256"},{"internalType":"uint256","name":"_depositBalance","type":"uint256"},{"internalType":"uint256","name":"_founderDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applicantDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applicantDepositMinAmount","type":"uint256"},{"internalType":"bool","name":"_depositLock","type":"bool"},{"internalType":"uint256","name":"_timeLock","type":"uint256"},{"internalType":"uint8","name":"_myRole","type":"uint8"},{"internalType":"uint256","name":"_myDepositAmount","type":"uint256"},{"internalType":"uint8","name":"_myStatus","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newBounty","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newStore","type":"address"}],"name":"transferStore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"unapproveApplicant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"vaultAccount","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whoAmI","outputs":[{"internalType":"uint8","name":"_role","type":"uint8"},{"internalType":"uint256","name":"_depositAmount","type":"uint256"},{"internalType":"uint8","name":"_applicantStatus","type":"uint8"}],"stateMutability":"view","type":"function"}]'

export function useBountyContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: BountyAddresses }
): {
  getContract: () => Promise<Contract>
  applyFor: (
    _amount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  approveApplicant: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  close: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  deposit: (
    _amount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  getStore: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  init: (
    _paras: [
      depositToken: string,
      depositTokenIsNative: any,
      founderDepositAmount: number | BigNumber,
      applicantDepositMinAmount: number | BigNumber,
      applyDeadline: number | BigNumber
    ],
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  lock: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  parameters: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** _paras */ [
        /** depositToken */ string,
        /** depositTokenIsNative */ any,
        /** founderDepositAmount */ number | BigNumber,
        /** applicantDepositMinAmount */ number | BigNumber,
        /** applyDeadline */ number | BigNumber
      ]
    ]
  >
  postUpdate: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  release: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  releaseMyDeposit: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  state: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** _bountyStatus */ number,
      /** _applicantCount */ number | BigNumber,
      /** _depositBalance */ number | BigNumber,
      /** _founderDepositAmount */ number | BigNumber,
      /** _applicantDepositAmount */ number | BigNumber,
      /** _applicantDepositMinAmount */ number | BigNumber,
      /** _depositLock */ any,
      /** _timeLock */ number | BigNumber,
      /** _myRole */ number,
      /** _myDepositAmount */ number | BigNumber,
      /** _myStatus */ number
    ]
  >
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferPrimary: (
    newBounty: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferStore: (
    newStore: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  unapproveApplicant: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  unlock: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  vaultAccount: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
  whoAmI: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [/** _role */ number, /** _depositAmount */ number | BigNumber, /** _applicantStatus */ number]
  >
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: BountyAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    applyFor: wrapTransaction({ ...getContractArgs.value, ...params }, 'applyFor'),
    approveApplicant: wrapTransaction({ ...getContractArgs.value, ...params }, 'approveApplicant'),
    close: wrapTransaction({ ...getContractArgs.value, ...params }, 'close'),
    deposit: wrapTransaction({ ...getContractArgs.value, ...params }, 'deposit'),
    getStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStore'),
    init: wrapTransaction({ ...getContractArgs.value, ...params }, 'init'),
    lock: wrapTransaction({ ...getContractArgs.value, ...params }, 'lock'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    parameters: wrapTransaction({ ...getContractArgs.value, ...params }, 'parameters'),
    postUpdate: wrapTransaction({ ...getContractArgs.value, ...params }, 'postUpdate'),
    release: wrapTransaction({ ...getContractArgs.value, ...params }, 'release'),
    releaseMyDeposit: wrapTransaction({ ...getContractArgs.value, ...params }, 'releaseMyDeposit'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    state: wrapTransaction({ ...getContractArgs.value, ...params }, 'state'),
    transferOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferOwnership'
    ),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary'),
    transferStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferStore'),
    unapproveApplicant: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'unapproveApplicant'
    ),
    unlock: wrapTransaction({ ...getContractArgs.value, ...params }, 'unlock'),
    vaultAccount: wrapTransaction({ ...getContractArgs.value, ...params }, 'vaultAccount'),
    whoAmI: wrapTransaction({ ...getContractArgs.value, ...params }, 'whoAmI')
  }
}

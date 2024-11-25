import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const CrowdfundingFactoryAddresses: Record<number, string> = {
  5: '0x8ab5971f601087e88a0c3Fd0c12AC5314a10091e',
  43113: '0xa021452136D1F002aC194cEcd1BA8f64800C1160',
  97: '0x30FCf17e77B767c098182075F1BB3Cfb50f1a9D3',
  4002: '0x1813E37D76316eCE03D3f7a9D908052D061355Fb',
  80001: '0x9582559C0101F7F6a764Aa06d6Ab75268c9c1102',
  2814: '0x914B75c95f3c1A090A2F255be95Bdb2B10CBD770',
  5700: '0x001547114664D1050271943eaC4657bE2c15EFcC',
  57000: '0xCad5f778b1285bFD01bD0bc754cdd325a82df396'
}

const abi =
  '[{"inputs":[{"internalType":"address","name":"_router","type":"address"}],"name":"addToDexRouters","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"children","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sellTokenAddress","type":"address"},{"internalType":"address","name":"buyTokenAddress","type":"address"},{"internalType":"uint8","name":"sellTokenDecimals","type":"uint8"},{"internalType":"uint8","name":"buyTokenDecimals","type":"uint8"},{"internalType":"bool","name":"buyTokenIsNative","type":"bool"},{"internalType":"uint256","name":"raiseTotal","type":"uint256"},{"internalType":"uint256","name":"buyPrice","type":"uint256"},{"internalType":"uint16","name":"swapPercent","type":"uint16"},{"internalType":"uint16","name":"sellTax","type":"uint16"},{"internalType":"uint256","name":"maxBuyAmount","type":"uint256"},{"internalType":"uint256","name":"minBuyAmount","type":"uint256"},{"internalType":"uint16","name":"maxSellPercent","type":"uint16"},{"internalType":"address","name":"teamWallet","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"address","name":"router","type":"address"},{"internalType":"uint256","name":"dexInitPrice","type":"uint256"}],"internalType":"struct Parameters","name":"paras","type":"tuple"}],"name":"createCrowdfundingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStore","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isChild","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_router","type":"address"}],"name":"isDexRouters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_router","type":"address"}],"name":"removeFromDexRouters","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_transferSigner","type":"address"}],"name":"setTransferSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newFactory","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newStore","type":"address"}],"name":"transferStore","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useCrowdfundingFactoryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: CrowdfundingFactoryAddresses }
): {
  getContract: () => Promise<Contract>
  addToDexRouters: (
    _router: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  children: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  createCrowdfundingContract: (
    paras: [
      sellTokenAddress: string,
      buyTokenAddress: string,
      sellTokenDecimals: number,
      buyTokenDecimals: number,
      buyTokenIsNative: any,
      raiseTotal: number | BigNumber,
      buyPrice: number | BigNumber,
      swapPercent: any,
      sellTax: any,
      maxBuyAmount: number | BigNumber,
      minBuyAmount: number | BigNumber,
      maxSellPercent: any,
      teamWallet: string,
      startTime: number | BigNumber,
      endTime: number | BigNumber,
      router: string,
      dexInitPrice: number | BigNumber
    ],
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  fee: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  feeTo: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  feeToSetter: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
  getStore: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  isChild: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  isDexRouters: (
    _router: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  removeFromDexRouters: (
    _router: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  setFeeTo: (
    _feeTo: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  setFeeToSetter: (
    _feeToSetter: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  setTransferSigner: (
    _transferSigner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferPrimary: (
    newFactory: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferSigner: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
  transferStore: (
    newStore: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: CrowdfundingFactoryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    addToDexRouters: wrapTransaction({ ...getContractArgs.value, ...params }, 'addToDexRouters'),
    children: wrapTransaction({ ...getContractArgs.value, ...params }, 'children'),
    createCrowdfundingContract: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'createCrowdfundingContract'
    ),
    fee: wrapTransaction({ ...getContractArgs.value, ...params }, 'fee'),
    feeTo: wrapTransaction({ ...getContractArgs.value, ...params }, 'feeTo'),
    feeToSetter: wrapTransaction({ ...getContractArgs.value, ...params }, 'feeToSetter'),
    getStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStore'),
    isChild: wrapTransaction({ ...getContractArgs.value, ...params }, 'isChild'),
    isDexRouters: wrapTransaction({ ...getContractArgs.value, ...params }, 'isDexRouters'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    removeFromDexRouters: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'removeFromDexRouters'
    ),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    setFeeTo: wrapTransaction({ ...getContractArgs.value, ...params }, 'setFeeTo'),
    setFeeToSetter: wrapTransaction({ ...getContractArgs.value, ...params }, 'setFeeToSetter'),
    setTransferSigner: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'setTransferSigner'
    ),
    transferOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferOwnership'
    ),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary'),
    transferSigner: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferSigner'),
    transferStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferStore')
  }
}

import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const CrowdfundingAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"name":"buy","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[{"internalType":"uint256","name":"_depositAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStore","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sellTokenAddress","type":"address"},{"internalType":"address","name":"buyTokenAddress","type":"address"},{"internalType":"uint8","name":"sellTokenDecimals","type":"uint8"},{"internalType":"uint8","name":"buyTokenDecimals","type":"uint8"},{"internalType":"bool","name":"buyTokenIsNative","type":"bool"},{"internalType":"uint256","name":"raiseTotal","type":"uint256"},{"internalType":"uint256","name":"buyPrice","type":"uint256"},{"internalType":"uint16","name":"swapPercent","type":"uint16"},{"internalType":"uint16","name":"sellTax","type":"uint16"},{"internalType":"uint256","name":"maxBuyAmount","type":"uint256"},{"internalType":"uint256","name":"minBuyAmount","type":"uint256"},{"internalType":"uint16","name":"maxSellPercent","type":"uint16"},{"internalType":"address","name":"teamWallet","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"address","name":"router","type":"address"},{"internalType":"uint256","name":"dexInitPrice","type":"uint256"}],"internalType":"struct Parameters","name":"_parameters","type":"tuple"}],"name":"init","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"maxBuyAmount","outputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSellAmount","outputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"parameters","outputs":[{"internalType":"address","name":"_sellTokenAddress","type":"address"},{"internalType":"address","name":"_buyTokenAddress","type":"address"},{"internalType":"uint8","name":"_buyTokenDecimals","type":"uint8"},{"internalType":"uint256","name":"_buyPrice","type":"uint256"},{"internalType":"uint16","name":"_swapPercent","type":"uint16"},{"internalType":"uint256","name":"_maxBuyAmount","type":"uint256"},{"internalType":"uint256","name":"_minBuyAmount","type":"uint256"},{"internalType":"uint16","name":"_maxSellPercent","type":"uint16"},{"internalType":"uint256","name":"_dexInitPrice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"remove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"name":"sell","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"state","outputs":[{"internalType":"uint256","name":"_raiseTotal","type":"uint256"},{"internalType":"uint256","name":"_raiseAmount","type":"uint256"},{"internalType":"uint256","name":"_swapPoolAmount","type":"uint256"},{"internalType":"uint256","name":"_buyTokenBalance","type":"uint256"},{"internalType":"enum Crowdfunding.Status","name":"_status","type":"uint8"},{"internalType":"uint256","name":"_dexInitPrice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newCrowdfunding","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newStore","type":"address"}],"name":"transferStore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_router","type":"address"},{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"transferToLiquidity","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"result","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_endTime","type":"uint256"}],"name":"updateParas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vaultAccount","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'

export function useCrowdfundingContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: CrowdfundingAddresses }
): {
  getContract: () => Promise<Contract>
  buy: (
    _buyAmount: number | BigNumber,
    _sellAmount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  cancel: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  deposit: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** _depositAmount */ number | BigNumber]>
  getStore: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  init: (
    _parameters: [
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
  maxBuyAmount: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** _buyAmount */ number | BigNumber, /** _sellAmount */ number | BigNumber]>
  maxSellAmount: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** _buyAmount */ number | BigNumber, /** _sellAmount */ number | BigNumber]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  parameters: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** _sellTokenAddress */ string,
      /** _buyTokenAddress */ string,
      /** _buyTokenDecimals */ number,
      /** _buyPrice */ number | BigNumber,
      /** _swapPercent */ any,
      /** _maxBuyAmount */ number | BigNumber,
      /** _minBuyAmount */ number | BigNumber,
      /** _maxSellPercent */ any,
      /** _dexInitPrice */ number | BigNumber
    ]
  >
  remove: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  sell: (
    _buyAmount: number | BigNumber,
    _sellAmount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  state: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** _raiseTotal */ number | BigNumber,
      /** _raiseAmount */ number | BigNumber,
      /** _swapPoolAmount */ number | BigNumber,
      /** _buyTokenBalance */ number | BigNumber,
      /** _status */ number,
      /** _dexInitPrice */ number | BigNumber
    ]
  >
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferPrimary: (
    newCrowdfunding: string,
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
  transferToLiquidity: (
    _router: string,
    _amountA: number | BigNumber,
    _data: string,
    _signature: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** success */ any, /** result */ string]>
  updateParas: (
    _endTime: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  vaultAccount: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: CrowdfundingAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    buy: wrapTransaction({ ...getContractArgs.value, ...params }, 'buy'),
    cancel: wrapTransaction({ ...getContractArgs.value, ...params }, 'cancel'),
    deposit: wrapTransaction({ ...getContractArgs.value, ...params }, 'deposit'),
    getStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStore'),
    init: wrapTransaction({ ...getContractArgs.value, ...params }, 'init'),
    maxBuyAmount: wrapTransaction({ ...getContractArgs.value, ...params }, 'maxBuyAmount'),
    maxSellAmount: wrapTransaction({ ...getContractArgs.value, ...params }, 'maxSellAmount'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    parameters: wrapTransaction({ ...getContractArgs.value, ...params }, 'parameters'),
    remove: wrapTransaction({ ...getContractArgs.value, ...params }, 'remove'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    sell: wrapTransaction({ ...getContractArgs.value, ...params }, 'sell'),
    state: wrapTransaction({ ...getContractArgs.value, ...params }, 'state'),
    transferOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferOwnership'
    ),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary'),
    transferStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferStore'),
    transferToLiquidity: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferToLiquidity'
    ),
    updateParas: wrapTransaction({ ...getContractArgs.value, ...params }, 'updateParas'),
    vaultAccount: wrapTransaction({ ...getContractArgs.value, ...params }, 'vaultAccount')
  }
}

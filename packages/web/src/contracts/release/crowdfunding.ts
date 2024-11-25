import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const CrowdfundingAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[],"name":"account","outputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_founder","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"name":"buy","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"buyTokenIsNative","outputs":[{"internalType":"bool","name":"isNative","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[{"internalType":"uint256","name":"_depositAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStore","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sellTokenAddress","type":"address"},{"internalType":"address","name":"buyTokenAddress","type":"address"},{"internalType":"uint8","name":"sellTokenDecimals","type":"uint8"},{"internalType":"uint8","name":"buyTokenDecimals","type":"uint8"},{"internalType":"bool","name":"buyTokenIsNative","type":"bool"},{"internalType":"uint256","name":"raiseTotal","type":"uint256"},{"internalType":"uint256","name":"buyPrice","type":"uint256"},{"internalType":"uint16","name":"swapPercent","type":"uint16"},{"internalType":"uint16","name":"sellTax","type":"uint16"},{"internalType":"uint256","name":"maxBuyAmount","type":"uint256"},{"internalType":"uint16","name":"maxSellPercent","type":"uint16"},{"internalType":"address","name":"teamWallet","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"}],"internalType":"struct Parameters","name":"_parameters","type":"tuple"}],"name":"init","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"maxBuyAmount","outputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSellAmount","outputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"parameters","outputs":[{"components":[{"internalType":"address","name":"sellTokenAddress","type":"address"},{"internalType":"address","name":"buyTokenAddress","type":"address"},{"internalType":"uint8","name":"sellTokenDecimals","type":"uint8"},{"internalType":"uint8","name":"buyTokenDecimals","type":"uint8"},{"internalType":"bool","name":"buyTokenIsNative","type":"bool"},{"internalType":"uint256","name":"raiseTotal","type":"uint256"},{"internalType":"uint256","name":"buyPrice","type":"uint256"},{"internalType":"uint16","name":"swapPercent","type":"uint16"},{"internalType":"uint16","name":"sellTax","type":"uint16"},{"internalType":"uint256","name":"maxBuyAmount","type":"uint256"},{"internalType":"uint16","name":"maxSellPercent","type":"uint16"},{"internalType":"address","name":"teamWallet","type":"address"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"}],"internalType":"struct Parameters","name":"_paras","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"remove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_buyAmount","type":"uint256"},{"internalType":"uint256","name":"_sellAmount","type":"uint256"}],"name":"sell","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"state","outputs":[{"internalType":"uint256","name":"_raiseTotal","type":"uint256"},{"internalType":"uint256","name":"_raiseAmount","type":"uint256"},{"internalType":"uint256","name":"_swapPoolAmount","type":"uint256"},{"internalType":"uint256","name":"_sellTokenDeposit","type":"uint256"},{"internalType":"uint256","name":"_sellTokenAmount","type":"uint256"},{"internalType":"uint256","name":"_myBuyTokenAmount","type":"uint256"},{"internalType":"uint256","name":"_mySellTokenAmount","type":"uint256"},{"internalType":"uint256","name":"_buyTokenBalance","type":"uint256"},{"internalType":"uint256","name":"_sellTokenBalance","type":"uint256"},{"internalType":"enum Crowdfunding.Status","name":"_status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newCrowdfunding","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newStore","type":"address"}],"name":"transferStore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_buyPrice","type":"uint256"},{"internalType":"uint16","name":"_swapPercent","type":"uint16"},{"internalType":"uint256","name":"_maxBuyAmount","type":"uint256"},{"internalType":"uint16","name":"_maxSellPercent","type":"uint16"},{"internalType":"uint256","name":"_endTime","type":"uint256"}],"name":"updateParas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vaultAccount","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'

export function useCrowdfundingContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: CrowdfundingAddresses }
): {
  getContract: () => Promise<Contract>
  account: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** _owner */ string, /** _factory */ string, /** _founder */ string]>
  buy: (
    _buyAmount: number | BigNumber,
    _sellAmount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  buyTokenIsNative: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** isNative */ any]>
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
      maxSellPercent: any,
      teamWallet: string,
      startTime: number | BigNumber,
      endTime: number | BigNumber
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
      /** _paras */ [
        /** sellTokenAddress */ string,
        /** buyTokenAddress */ string,
        /** sellTokenDecimals */ number,
        /** buyTokenDecimals */ number,
        /** buyTokenIsNative */ any,
        /** raiseTotal */ number | BigNumber,
        /** buyPrice */ number | BigNumber,
        /** swapPercent */ any,
        /** sellTax */ any,
        /** maxBuyAmount */ number | BigNumber,
        /** maxSellPercent */ any,
        /** teamWallet */ string,
        /** startTime */ number | BigNumber,
        /** endTime */ number | BigNumber
      ]
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
      /** _sellTokenDeposit */ number | BigNumber,
      /** _sellTokenAmount */ number | BigNumber,
      /** _myBuyTokenAmount */ number | BigNumber,
      /** _mySellTokenAmount */ number | BigNumber,
      /** _buyTokenBalance */ number | BigNumber,
      /** _sellTokenBalance */ number | BigNumber,
      /** _status */ number
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
  updateParas: (
    _buyPrice: number | BigNumber,
    _swapPercent: any,
    _maxBuyAmount: number | BigNumber,
    _maxSellPercent: any,
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
    account: wrapTransaction({ ...getContractArgs.value, ...params }, 'account'),
    buy: wrapTransaction({ ...getContractArgs.value, ...params }, 'buy'),
    buyTokenIsNative: wrapTransaction({ ...getContractArgs.value, ...params }, 'buyTokenIsNative'),
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
    updateParas: wrapTransaction({ ...getContractArgs.value, ...params }, 'updateParas'),
    vaultAccount: wrapTransaction({ ...getContractArgs.value, ...params }, 'vaultAccount')
  }
}

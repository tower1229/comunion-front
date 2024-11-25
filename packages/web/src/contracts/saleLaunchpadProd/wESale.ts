import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const WESaleAddresses: Record<number, string> = {}

const abi =
  '[{"inputs":[],"name":"FEE","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"URGENT_DIVEST_FEE","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_canUpdate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_isCancel","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_isEnded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_isFailed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_isLive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_isNative","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_isStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimInvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"divest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"founderDivest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"presaleAmount","type":"uint256"},{"internalType":"uint256","name":"investAmount","type":"uint256"}],"name":"getAmount","outputs":[{"internalType":"uint256","name":"_presaleAmount","type":"uint256"},{"internalType":"uint256","name":"_investAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCanClaimTotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getClaimedTotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_router","type":"address"},{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"getHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"investor","type":"address"}],"name":"getInvestOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTransferLiquidityInvestAmount","outputs":[{"internalType":"uint256","name":"_investTransferLPAmount","type":"uint256"},{"internalType":"uint256","name":"_investTransferTeamAmount","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"investAmount","type":"uint256"}],"name":"invest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"investToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"parameters","outputs":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint24","name":"liquidityRate","type":"uint24"},{"internalType":"uint256","name":"minInvest","type":"uint256"},{"internalType":"uint256","name":"maxInvest","type":"uint256"},{"internalType":"uint256","name":"softCap","type":"uint256"},{"internalType":"uint256","name":"hardCap","type":"uint256"},{"internalType":"address","name":"router","type":"address"},{"internalType":"uint256","name":"dexInitPrice","type":"uint256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"endedAt","type":"uint256"},{"internalType":"uint24","name":"firstRelease","type":"uint24"},{"internalType":"uint24","name":"cycle","type":"uint24"},{"internalType":"uint24","name":"cycleRelease","type":"uint24"},{"internalType":"uint24","name":"investTokenDecimals","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presaleToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"teamWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalInvest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPresale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"transferLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unlockedAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_endedAt","type":"uint256"}],"name":"updateEndedAt","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useWESaleContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: WESaleAddresses }
): {
  getContract: () => Promise<Contract>
  FEE: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  URGENT_DIVEST_FEE: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  _canUpdate: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  _isCancel: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  _isEnded: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  _isFailed: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  _isLive: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  _isNative: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  _isStarted: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  cancel: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  claimInvest: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  claimPresale: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  divest: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  eip712Domain: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** fields */ any,
      /** name */ string,
      /** version */ string,
      /** chainId */ number | BigNumber,
      /** verifyingContract */ string,
      /** salt */ any,
      /** extensions */ any
    ]
  >
  factory: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  founderDivest: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  getAmount: (
    presaleAmount: number | BigNumber,
    investAmount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** _presaleAmount */ number | BigNumber, /** _investAmount */ number | BigNumber]>
  getCanClaimTotal: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber, /**  */ number | BigNumber]>
  getClaimedTotal: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber]>
  getHash: (
    _router: string,
    _amountA: number | BigNumber,
    _data: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  getInvestOf: (
    investor: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber]>
  getTotalReleased: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber]>
  getTransferLiquidityInvestAmount: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** _investTransferLPAmount */ number | BigNumber,
      /** _investTransferTeamAmount */ number | BigNumber,
      /** _fee */ number | BigNumber
    ]
  >
  invest: (
    investAmount: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  investToken: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  parameters: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<
    [
      /** price */ number | BigNumber,
      /** liquidityRate */ any,
      /** minInvest */ number | BigNumber,
      /** maxInvest */ number | BigNumber,
      /** softCap */ number | BigNumber,
      /** hardCap */ number | BigNumber,
      /** router */ string,
      /** dexInitPrice */ number | BigNumber,
      /** startedAt */ number | BigNumber,
      /** endedAt */ number | BigNumber,
      /** firstRelease */ any,
      /** cycle */ any,
      /** cycleRelease */ any,
      /** investTokenDecimals */ any
    ]
  >
  presaleToken: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  teamWallet: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
  totalInvest: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber]>
  totalPresale: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber]>
  transferLiquidity: (
    _amountA: number | BigNumber,
    _data: string,
    _signature: string,
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
  unlockedAt: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ number | BigNumber]>
  updateEndedAt: (
    _endedAt: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: WESaleAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    FEE: wrapTransaction({ ...getContractArgs.value, ...params }, 'FEE'),
    URGENT_DIVEST_FEE: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'URGENT_DIVEST_FEE'
    ),
    _canUpdate: wrapTransaction({ ...getContractArgs.value, ...params }, '_canUpdate'),
    _isCancel: wrapTransaction({ ...getContractArgs.value, ...params }, '_isCancel'),
    _isEnded: wrapTransaction({ ...getContractArgs.value, ...params }, '_isEnded'),
    _isFailed: wrapTransaction({ ...getContractArgs.value, ...params }, '_isFailed'),
    _isLive: wrapTransaction({ ...getContractArgs.value, ...params }, '_isLive'),
    _isNative: wrapTransaction({ ...getContractArgs.value, ...params }, '_isNative'),
    _isStarted: wrapTransaction({ ...getContractArgs.value, ...params }, '_isStarted'),
    cancel: wrapTransaction({ ...getContractArgs.value, ...params }, 'cancel'),
    claimInvest: wrapTransaction({ ...getContractArgs.value, ...params }, 'claimInvest'),
    claimPresale: wrapTransaction({ ...getContractArgs.value, ...params }, 'claimPresale'),
    divest: wrapTransaction({ ...getContractArgs.value, ...params }, 'divest'),
    eip712Domain: wrapTransaction({ ...getContractArgs.value, ...params }, 'eip712Domain'),
    factory: wrapTransaction({ ...getContractArgs.value, ...params }, 'factory'),
    founderDivest: wrapTransaction({ ...getContractArgs.value, ...params }, 'founderDivest'),
    getAmount: wrapTransaction({ ...getContractArgs.value, ...params }, 'getAmount'),
    getCanClaimTotal: wrapTransaction({ ...getContractArgs.value, ...params }, 'getCanClaimTotal'),
    getClaimedTotal: wrapTransaction({ ...getContractArgs.value, ...params }, 'getClaimedTotal'),
    getHash: wrapTransaction({ ...getContractArgs.value, ...params }, 'getHash'),
    getInvestOf: wrapTransaction({ ...getContractArgs.value, ...params }, 'getInvestOf'),
    getTotalReleased: wrapTransaction({ ...getContractArgs.value, ...params }, 'getTotalReleased'),
    getTransferLiquidityInvestAmount: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'getTransferLiquidityInvestAmount'
    ),
    invest: wrapTransaction({ ...getContractArgs.value, ...params }, 'invest'),
    investToken: wrapTransaction({ ...getContractArgs.value, ...params }, 'investToken'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    parameters: wrapTransaction({ ...getContractArgs.value, ...params }, 'parameters'),
    presaleToken: wrapTransaction({ ...getContractArgs.value, ...params }, 'presaleToken'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    teamWallet: wrapTransaction({ ...getContractArgs.value, ...params }, 'teamWallet'),
    totalInvest: wrapTransaction({ ...getContractArgs.value, ...params }, 'totalInvest'),
    totalPresale: wrapTransaction({ ...getContractArgs.value, ...params }, 'totalPresale'),
    transferLiquidity: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferLiquidity'
    ),
    transferOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferOwnership'
    ),
    unlockedAt: wrapTransaction({ ...getContractArgs.value, ...params }, 'unlockedAt'),
    updateEndedAt: wrapTransaction({ ...getContractArgs.value, ...params }, 'updateEndedAt')
  }
}

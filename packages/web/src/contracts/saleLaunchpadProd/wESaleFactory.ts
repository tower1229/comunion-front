import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const WESaleFactoryAddresses: Record<number, string> = {
  57: '0x0a07F78022bB5f0cdD34c003Ca4E9001c8471092',
  570: '0xB411Ffc1c566dBB37c30D79Bce4E535948D355a2'
}

const abi =
  '[{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_teamWallet","type":"address"},{"internalType":"address","name":"_presaleToken","type":"address"},{"internalType":"address","name":"_investToken","type":"address"},{"components":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint24","name":"liquidityRate","type":"uint24"},{"internalType":"uint256","name":"minInvest","type":"uint256"},{"internalType":"uint256","name":"maxInvest","type":"uint256"},{"internalType":"uint256","name":"softCap","type":"uint256"},{"internalType":"uint256","name":"hardCap","type":"uint256"},{"internalType":"address","name":"router","type":"address"},{"internalType":"uint256","name":"dexInitPrice","type":"uint256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"endedAt","type":"uint256"},{"internalType":"uint24","name":"firstRelease","type":"uint24"},{"internalType":"uint24","name":"cycle","type":"uint24"},{"internalType":"uint24","name":"cycleRelease","type":"uint24"},{"internalType":"uint24","name":"investTokenDecimals","type":"uint24"}],"internalType":"struct Parameters","name":"_parameters","type":"tuple"}],"name":"createSale","outputs":[{"internalType":"address","name":"wesale","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_transferSigner","type":"address"}],"name":"setTransferSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_version","type":"string"}],"name":"setVersion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'

export function useWESaleFactoryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: WESaleFactoryAddresses }
): {
  getContract: () => Promise<Contract>
  DEFAULT_ADMIN_ROLE: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  createSale: (
    _teamWallet: string,
    _presaleToken: string,
    _investToken: string,
    _parameters: [
      price: number | BigNumber,
      liquidityRate: any,
      minInvest: number | BigNumber,
      maxInvest: number | BigNumber,
      softCap: number | BigNumber,
      hardCap: number | BigNumber,
      router: string,
      dexInitPrice: number | BigNumber,
      startedAt: number | BigNumber,
      endedAt: number | BigNumber,
      firstRelease: any,
      cycle: any,
      cycleRelease: any,
      investTokenDecimals: any
    ],
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/** wesale */ string]>
  feeTo: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  getRoleAdmin: (
    role: any,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  grantRole: (
    role: any,
    account: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  hasRole: (
    role: any,
    account: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  renounceRole: (
    role: any,
    account: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  revokeRole: (
    role: any,
    account: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  setFeeTo: (
    _feeTo: string,
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
  setVersion: (
    _version: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  supportsInterface: (
    interfaceId: any,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferSigner: (
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ string]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: WESaleFactoryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    DEFAULT_ADMIN_ROLE: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'DEFAULT_ADMIN_ROLE'
    ),
    createSale: wrapTransaction({ ...getContractArgs.value, ...params }, 'createSale'),
    feeTo: wrapTransaction({ ...getContractArgs.value, ...params }, 'feeTo'),
    getRoleAdmin: wrapTransaction({ ...getContractArgs.value, ...params }, 'getRoleAdmin'),
    grantRole: wrapTransaction({ ...getContractArgs.value, ...params }, 'grantRole'),
    hasRole: wrapTransaction({ ...getContractArgs.value, ...params }, 'hasRole'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    renounceRole: wrapTransaction({ ...getContractArgs.value, ...params }, 'renounceRole'),
    revokeRole: wrapTransaction({ ...getContractArgs.value, ...params }, 'revokeRole'),
    setFeeTo: wrapTransaction({ ...getContractArgs.value, ...params }, 'setFeeTo'),
    setTransferSigner: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'setTransferSigner'
    ),
    setVersion: wrapTransaction({ ...getContractArgs.value, ...params }, 'setVersion'),
    supportsInterface: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'supportsInterface'
    ),
    transferOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferOwnership'
    ),
    transferSigner: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferSigner')
  }
}

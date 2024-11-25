import { ethers } from 'ethers'
import { pegasysABI } from '@/constants/dexAbi/pegasys'
import { UniswapV2Router02ABI } from '@/constants/dexAbi/uniswap'

export const encodeDataUniswap = (params: {
  contractAddress: string
  functionName: string
  params: any[]
}) => {
  const contract = new ethers.Contract(params.contractAddress, UniswapV2Router02ABI)
  const encodedData = contract.interface.encodeFunctionData(params.functionName, params.params)

  return {
    encodedData
  }
}

export const encodeDataPegasys = (params: {
  contractAddress: string
  functionName: string
  params: any[]
}) => {
  const contract = new ethers.Contract(params.contractAddress, pegasysABI)
  const encodedData = contract.interface.encodeFunctionData(params.functionName, params.params)

  return {
    encodedData
  }
}

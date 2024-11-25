import { message } from '@comunion/components'
import { Contract } from 'ethers'
import { getEthersSigner } from './utils'
import { useContractStore } from '@/stores/contract'

export function wrapTransaction(
  contractArgs: GetContractArgs,
  functionName: string
): () => Promise<any> {
  const contractStore = useContractStore()
  return async (...fnArgs: any[]) => {
    let waitingText = ''
    let overrides = fnArgs.pop()
    if (Object.prototype.toString.call(overrides) === '[object Object]') {
      waitingText = fnArgs.pop()
    } else {
      waitingText = overrides
      overrides = {}
    }
    const pengdingText = fnArgs.pop()
    if (pengdingText) {
      contractStore.startContract(pengdingText)
    }
    console.log(contractArgs, functionName)
    return getContract(contractArgs).then((contract: any) => {
      const fn = contract[functionName]
      const tx = fn(...fnArgs, overrides)
      console.log(tx.await, 6666666)
      return tx
        .then((res: any) => {
          if (waitingText) {
            contractStore.endContract('success', {
              success: true,
              hash: res.hash,
              text: waitingText,
              promiseFn: res.wait
            })
          }
          return res
        })
        .catch((e: any) => {
          console.log(`functionName: ${functionName}, args: ${fnArgs}`, e, 'here here')

          // console.log(contract.interface.decodeErrorResult(e.data.message, e.data.data))
          if (pengdingText || waitingText) {
            contractStore.endContract('failed', { success: false })
          }
          if (e.data?.message) {
            message.error(e.data.message)
          }
          return null
        })
    })
  }
}

export type GetContractArgs = {
  addresses: Record<number, string>
  abi: string
  chainId?: number
  wallet?: any
}
export async function getContract(args: GetContractArgs) {
  // getEthersSigner
  const signer = await getEthersSigner(args)
  console.log('signer=====', signer)
  if (!signer) {
    throw new Error('Wallet is not initialized')
  }
  if (!args.chainId) {
    throw new Error('No network selected')
  }
  const address = args.addresses[args.chainId]

  if (!address) {
    console.warn('Not supported network', args.addresses, args.chainId)
    throw new Error('Not supported network')
  }
  console.log(signer, address, args.wallet)
  return new Contract(
    address,
    args.abi.replace(/\\t/g, '').replace(/\\r/g, '').replace(/\\n/g, '').replace(/\\"/g, '"'),
    signer
  )
}

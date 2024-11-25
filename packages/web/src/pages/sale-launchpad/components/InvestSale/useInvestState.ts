import { BigNumber, ethers } from 'ethers'
import { reactive, onMounted } from 'vue'
import { useWESaleContract } from '@/contracts'
import { useWalletStore } from '@/stores'

export default function useInvestState(chainId: number, addresses: Record<number, string>) {
  const saleContract = useWESaleContract({ chainId, addresses })
  const walletStore = useWalletStore()
  const investState = reactive({
    isStarted: false,
    isCancel: false,
    isEnd: false,
    isLive: false,
    isFailed: false,
    isTransed: false,
    investedAmount: ethers.utils.parseUnits('0', 18),
    canClaimTotal: ethers.utils.parseUnits('0', 18),
    canClaim: ethers.utils.parseUnits('0', 18),
    unlockAt: 0,
    totalPreSale: ethers.utils.parseUnits('0', 18)
  })

  async function setInvestState() {
    const [isStarted, isFailed, isLive, isEnd, isCancel, isUnlock, investedAmount, totalPreSale] =
      await Promise.all([
        saleContract._isStarted('', ''),
        saleContract._isFailed('', ''),
        saleContract._isLive('', ''),
        saleContract._isEnded('', ''),
        saleContract._isCancel('', ''),
        saleContract.unlockedAt('', ''),
        saleContract.getInvestOf(walletStore.address!, '', ''),
        saleContract.totalPresale('', '')
      ])

    ;[investState.isStarted] = [isStarted].flat()
    ;[investState.isFailed] = [isFailed].flat()
    ;[investState.isLive] = [isLive].flat()
    ;[investState.isEnd] = [isEnd].flat()
    ;[investState.isCancel] = [isCancel].flat()
    ;[investState.unlockAt] = [isUnlock].flat() as number[]
    ;[investState.investedAmount] = [investedAmount].flat() as BigNumber[]
    ;[investState.totalPreSale] = [totalPreSale].flat() as BigNumber[]
    investState.isTransed = investState.unlockAt > 0

    if (!investState.investedAmount.isZero() && investState.isTransed) {
      const [canClaimTotal, canClaim] = await saleContract.getCanClaimTotal('', '')
      investState.canClaimTotal = canClaimTotal as BigNumber
      investState.canClaim = canClaim as BigNumber
    }
  }

  console.log('investState:', investState)

  onMounted(() => setInvestState())

  return { investState, setInvestState }
}

import { UButton, UCard, UInputNumberGroup, UModal, UTooltip, message } from '@comunion/components'
import { ExchangeOutlined, QuestionFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { BigNumber, Contract, ethers } from 'ethers'
import { defineComponent, computed, PropType, ref, onMounted, watch, inject, Ref } from 'vue'
import { CoinType } from '../[id]'
import { CrowdfundingStatus } from '../utils'
import CoinIcon from '@/components/CoinIcon'
import { findRouterByAddress } from '@/constants'
import {
  useErc20Contract,
  useCrowdfundingContract,
  useCrowdfundingFactoryContract
} from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { StartupDetail } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'
import { checkSupportNetwork } from '@/utils/wallet'

export const renderUnit = (symbol: string) => {
  return (
    <div
      class={[
        'u-h5 flex justify-center items-center border rounded-r-sm bg-purple w-30',
        { 'text-color1': symbol, 'text-color3': !symbol }
      ]}
    >
      <CoinIcon symbol={symbol} class="h-4 mr-2 w-4" />
      <span>{symbol || 'Token'}</span>
    </div>
  )
}

export const InvestFair = defineComponent({
  name: 'InvestFair',
  props: {
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'Crowdfunding@get-crowdfunding-info'>>>,
      required: true
    },
    buyCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    },
    sellCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    },
    startup: {
      type: Object as PropType<StartupDetail>,
      require: true
    }
  },
  emits: ['refreshCoin', 'refreshData'],
  setup(props, ctx) {
    const crowdfundingContract = useCrowdfundingFactoryContract()
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const contractStore = useContractStore()
    const cancelModal = ref(false)
    const removeModal = ref(false)
    const fromValue = ref<string>('')
    const toValue = ref<string>('')
    const raiseState = ref<{
      raiseAmount: number
      raiseGoal: number
      raisePercent: number
      swapAmount: number | '--'
    }>({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0,
      swapAmount: 0
    })

    const fundingContractStateSecound = ref()
    let fundingContract = useCrowdfundingContract({
      chainId: walletStore.chainId!,
      addresses: { [walletStore.chainId!]: props.info.crowdfunding_contract! }
    })
    const maxBuy = ref<number | string>(0)
    const maxSell = ref<number | string>(0)
    const mode = ref<'buy' | 'sell'>('buy')
    const tokenContract = useErc20Contract()

    const chainInfo = getChainInfoByChainId(props.info.chain_id!)

    const getMin = (first: number | string, second: number | string) => {
      return ethers.FixedNumber.from(first).subUnsafe(ethers.FixedNumber.from(second)).isNegative()
        ? first
        : second
    }

    const getBuyCoinDecimal = () => {
      return props.info.buy_token_decimals || 18
    }

    const maxBuyAmount = computed(() => {
      return (
        formatToFloor(
          getMin(
            maxBuy.value || 0,
            !props.buyCoinInfo.balance || props.buyCoinInfo.balance === '--'
              ? 0
              : props.buyCoinInfo.balance
          ).toString(),
          getBuyCoinDecimal()
        ) || '0'
      )
    })

    const maxSellAmount = computed(() => {
      return (
        formatToFloor(
          getMin(maxSell.value || 0, props.sellCoinInfo.balance || 0).toString(),
          props.sellCoinInfo.decimal!
        ) || '0'
      )
    })

    const activeInput = ref<'from' | 'to'>('from')
    watch(
      () => fromValue.value,
      value => {
        if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
          fromValue.value = value.replace(/^0/, '')
        }
        if (value === '0' && activeInput.value === 'from') {
          clearToValue()
        }
      }
    )

    watch(
      () => toValue.value,
      value => {
        if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
          toValue.value = value.replace(/^0/, '')
        }
        if (value === '0' && activeInput.value === 'to') {
          clearFromValue()
        }
      }
    )

    const handleFromInput = (value: string) => {
      activeInput.value = 'from'
      changeFromValue(value)
    }

    const handleToInput = (value: string) => {
      activeInput.value = 'to'
      changeToValue(value)
    }

    const getPercent = (value: number | string | undefined) => {
      return typeof value === 'undefined'
        ? ethers.FixedNumber.from(1)
        : ethers.FixedNumber.from(1).subUnsafe(
            ethers.FixedNumber.from(value).divUnsafe(ethers.FixedNumber.from(100))
          )
    }

    const changeFromValue = (value: string) => {
      if (Number(value) === 0) toValue.value = '0'
      if (!value) return
      if (mode.value === 'buy') {
        toValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .mulUnsafe(ethers.FixedNumber.from(props.info.buy_price))
            .toString(),
          props.sellCoinInfo.decimal!
        )
      } else {
        toValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .divUnsafe(ethers.FixedNumber.from(props.info.buy_price))
            .mulUnsafe(getPercent(props.info.sell_tax))
            .toString(),
          getBuyCoinDecimal()
        )
      }
    }

    const changeToValue = (value: string) => {
      if (Number(value) === 0) fromValue.value = '0'
      if (!value) return
      console.log('changeToValue value===>', value)
      if (mode.value === 'buy') {
        fromValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .divUnsafe(ethers.FixedNumber.from(props.info.buy_price))
            .toString(),
          getBuyCoinDecimal()
        )
      } else {
        fromValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .mulUnsafe(ethers.FixedNumber.from(props.info.buy_price))
            .divUnsafe(getPercent(props.info.sell_tax))
            .toString(),
          props.sellCoinInfo.decimal!
        )
      }
    }

    const clearFromValue = () => {
      fromValue.value = ''
    }

    const clearToValue = () => {
      toValue.value = ''
    }

    const addInvestRecord = async (txHash: string, access: 1 | 2) => {
      // await services['Crowdfunding@invest-crowdfunding']({
      //   crowdfunding_id: props.info.crowdfunding_id!,
      //   tx_hash: txHash,
      //   access,
      //   buy_token_symbol: props.buyCoinInfo.symbol!,
      //   buy_token_amount: mode.value === 'buy' ? Number(fromValue.value) : Number(toValue.value),
      //   sell_token_symbol: props.sellCoinInfo.symbol!,
      //   sell_token_amount: mode.value === 'buy' ? Number(toValue.value) : Number(fromValue.value),
      //   price: Number(props.info.buy_price)
      // })
    }

    const buyIsMainCoin = computed(() => {
      return props.info.buy_token_contract === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    })

    const changeMode = () => {
      if (mode.value === 'buy') {
        mode.value = 'sell'
      } else {
        mode.value = 'buy'
      }
      clearFromValue()
      clearToValue()
    }

    const countDownTime = computed(() => {
      const countDown = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }

      const numberClass = 'u-h4 rounded-sm px-1 min-w-10 text-center py-2'

      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return {
          status: CrowdfundingStatus.CANCELED,
          label: 'Cancelled',
          value: countDown,
          class: `${numberClass} bg-[rgba(245,246,250,1)] text-black text-opacity-10`
        }
      }

      const dateNow = ref<dayjs.Dayjs>(dayjs.utc())

      const timer: any = () => {
        dateNow.value = dayjs.utc()
        if (dateNow.value.isAfter(dayjs(Number(props.info.end_time)).utc())) {
          return null
        }
        return setTimeout(timer, 1000)
      }
      // before start
      if (dateNow.value.isBefore(dayjs(Number(props.info.start_time)).utc())) {
        timer()
        const diffDuration = dayjs.duration(
          dayjs(Number(props.info.start_time)).utc().diff(dateNow.value)
        )
        const [hours, minutes, seconds] = diffDuration.format('HH-mm-ss').split('-')
        const days = Math.floor(diffDuration.asDays())
        return {
          status: CrowdfundingStatus.UPCOMING,
          label: 'Launchpad Starts In',
          value: {
            days,
            hours,
            minutes,
            seconds
          },
          class: `${numberClass} bg-[rgba(83,49,244,0.06)] text-primary`
        }
      }

      // ended
      if (dateNow.value.isAfter(dayjs(Number(props.info.end_time)).utc())) {
        return {
          status: CrowdfundingStatus.ENDED,
          label: 'Launchpad Has Ended',
          value: countDown,
          class: `${numberClass} bg-[rgba(242,159,57,0.06)] text-warning`
        }
      }

      // after start and before end
      timer()
      const diffDuration = dayjs.duration(
        dayjs(Number(props.info.end_time)).utc().diff(dateNow.value)
      )
      const days = Math.floor(diffDuration.asDays())
      const [hours, minutes, seconds] = diffDuration.format('HH-mm-ss').split('-')
      return {
        status: CrowdfundingStatus.LIVE,
        label: 'Launchpad Ends In',
        value: {
          days,
          hours,
          minutes,
          seconds
        },
        class: `${numberClass} bg-[rgba(83,49,244,0.06)] text-primary`
      }
    })

    const canLiquidity = computed(() => {
      return (
        countDownTime.value.status === CrowdfundingStatus.ENDED &&
        props.info.dex_router !== '0x0000000000000000000000000000000000000000' &&
        Number(props.info.raise_balance) > 0
      )
    })

    const transferLiquidity = async () => {
      const { provider } = await fundingContract.getContract()
      const blockNumber = await provider.getBlockNumber()
      const block = await provider.getBlock(blockNumber)

      const blockTimeStamp = block.timestamp * 1000
      const endTime = Number(props.info.end_time)

      if (blockTimeStamp <= endTime) {
        message.info(
          'Please wait for the time of next block minted to retry if you fail to transfer liquidity.'
        )
      }

      const router = findRouterByAddress(props.info.dex_router!)
      if (!router || !props.info.chain_id) return
      await checkSupportNetwork(props.info.chain_id)
      console.log('transferLiquidity', router, props.info.dex_router)

      const { data, error } = await services['Crowdfunding@get-crowdfunding-transfer-lp-sign']({
        crowdfunding_id: props.info.id
      })
      if (error) return

      const fee = await crowdfundingContract.fee('get fee', 'waiting')

      const parameters: any = await fundingContract.parameters('get parameters', 'waiting')
      const dexInitPrice = parameters[8]
      const buyTokenDecimals = parameters[2]
      const swapAmount = ethers.utils.parseUnits(
        String(raiseState.value.swapAmount),
        buyTokenDecimals
      )

      const amountB = swapAmount.sub(swapAmount.mul(fee).div(10000))
      const amountA = amountB.mul(dexInitPrice).div(BigNumber.from(10).pow(buyTokenDecimals))

      const res = await fundingContract.transferToLiquidity(
        router.address,
        amountA,
        data.data,
        data.sign,
        `Transferring liquidity into ${findRouterByAddress(props.info.dex_router!)?.dex}`,
        'Transaction Submitted'
      )

      console.log('contractRes=', res)
      if (res) ctx.emit('refreshData')
    }

    const founderOperation = computed(() => {
      return countDownTime.value.status === CrowdfundingStatus.ENDED ? 'Remove' : 'Cancel'
    })

    const disableRemoveOrCancel = computed(() => {
      if (founderOperation.value === 'Remove') {
        return fundingContractStateSecound.value?.[4] === CrowdfundingStatus.ENDED
      } else {
        return countDownTime.value.status !== CrowdfundingStatus.UPCOMING
      }
    })

    const disableRemoveOrCancelReason = computed(() => {
      let reason = ''
      if (disableRemoveOrCancel.value) {
        if (founderOperation.value !== 'Remove') {
          reason = 'This Launchpad cannot be cancelled when it is in living.'
        }
      }

      return reason
    })

    const removeCrowdfunding = async () => {
      try {
        removeModal.value = false
        const pendingText = 'Waiting to submit all contents to blockchain for removing'
        const waitingText = 'Waiting to confirm.'
        const contractRes: any = await fundingContract.remove(pendingText, waitingText)
        if (!contractRes) {
          console.warn('fundingContract.remove error')
        }
        // await services['Crowdfunding@remove-crowdfunding']({
        //   crowdfunding_id: props.info.crowdfunding_id!,
        //   tx_hash: contractRes.hash
        // })
        fundingContractStateSecound.value = false
        // refresh date
        ctx.emit('refreshData')
      } catch (error) {
        console.log('error', error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const cancelCrowdfunding = async () => {
      cancelModal.value = false
      const pendingText = 'Waiting to submit all contents to blockchain for canceling'
      const waitingText = 'Waiting to confirm.'
      // Contract
      const contractRes: any = await fundingContract.cancel(pendingText, waitingText)
      // api
      if (contractRes && contractRes.hash) {
        ctx.emit('refreshData')
        // services['Crowdfunding@cancell-crowdfunding']({
        //   crowdfunding_id: props.info.crowdfunding_id!,
        //   tx_hash: contractRes.hash
        // })
        //   .then(() => {
        //   })
        //   .catch(() => {
        //     contractStore.endContract('failed', { success: false })
        //   })
      }
    }

    const removeOrCancel = async () => {
      try {
        if (props.info.chain_id) {
          await checkSupportNetwork(props.info.chain_id, () => {
            // update fundingContract
            fundingContract = useCrowdfundingContract({
              chainId: walletStore.chainId!,
              addresses: { [walletStore.chainId!]: props.info.crowdfunding_contract! }
            })
            if (founderOperation.value === 'Remove') {
              removeModal.value = true
            } else {
              cancelModal.value = true
            }
          })
        } else {
          console.warn('missing param: props.info.chain_id')
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    const buyFromMainCoin = async (sellAmount: number | BigNumber) => {
      const buyPendingText = 'The transaction of buying is processing.'
      const waitingText = 'Waiting to confirm.'
      try {
        const buyAmount = ethers.utils.parseUnits(
          fromValue.value.toString(),
          props.info.buy_token_decimals
        )
        // main coin buy token
        const contractRes: any = await fundingContract.buy(
          buyAmount,
          sellAmount,
          buyPendingText,
          waitingText,
          {
            value: buyAmount
          }
        )
        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 1)
        }
      } catch (error) {
        console.log('error===>', error)
      }
    }

    const buyFromTokenCoin = async (sellAmount: number | BigNumber) => {
      try {
        const buyPendingText = 'The transaction of buying is processing.'
        const waitingText = 'Waiting to confirm.'
        const approvePendingText = 'The transaction of buying is processing.'
        const buyAmount = ethers.utils.parseUnits(fromValue.value)
        contractStore.startContract(approvePendingText)
        const buyTokenRes = await tokenContract(props.info.buy_token_contract!)
        const approveRes: Contract = await buyTokenRes.approve(
          props.info.crowdfunding_contract,
          ethers.utils.parseUnits(fromValue.value.toString(), props.info.buy_token_decimals)
        )
        await approveRes.wait()

        const contractRes: any = await fundingContract.buy(
          buyAmount,
          sellAmount,
          buyPendingText,
          waitingText
        )

        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 1)
        }
      } catch (error) {
        console.error(error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const sellToMainCoin = async () => {
      try {
        const fromAmount = ethers.utils.parseUnits(fromValue.value, props.sellCoinInfo.decimal!)
        const toAmount = ethers.utils.parseUnits(
          formatToFloor(
            ethers.FixedNumber.from(fromValue.value)
              .divUnsafe(ethers.FixedNumber.from(props.info.buy_price))
              .toString(),
            getBuyCoinDecimal()
          )
        )

        const sellPendingText = 'The selling transaction is processing.'
        const waitingText = 'Waiting to confirm.'
        const approvePendingText = 'The transaction of selling is processing.'
        contractStore.startContract(approvePendingText)

        const sellTokenRes = await tokenContract(props.info.sell_token_contract!)

        const approveRes: Contract = await sellTokenRes.approve(
          props.info.crowdfunding_contract,
          fromAmount
        )
        await approveRes.wait()
        const contractRes: any = await fundingContract.sell(
          toAmount,
          fromAmount,
          sellPendingText,
          waitingText
        )

        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 2)
        }
      } catch (error) {
        console.error('error', error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const sellToTokenCoin = async () => {
      try {
        const fromAmount = ethers.utils.parseUnits(fromValue.value, props.sellCoinInfo.decimal!)
        const toAmount = ethers.utils.parseUnits(
          formatToFloor(
            ethers.FixedNumber.from(fromValue.value)
              .divUnsafe(ethers.FixedNumber.from(props.info.buy_price))
              .toString(),
            getBuyCoinDecimal()
          )
        )

        const sellPendingText = 'The selling transaction is processing.'
        const waitingText = 'Waiting to confirm.'

        const approvePendingText = 'The transaction of selling is processing.'
        contractStore.startContract(approvePendingText)
        const sellTokenRes = await tokenContract(props.info.sell_token_contract!)
        const approveRes: Contract = await sellTokenRes.approve(
          props.info.crowdfunding_contract,
          fromAmount
        )
        await approveRes.wait()

        const contractRes: any = await fundingContract.sell(
          toAmount,
          fromAmount,
          sellPendingText,
          waitingText
        )

        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 2)
        }
      } catch (error) {
        console.error('error', error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const buyOrSell = async () => {
      const isSupport = props.info.chain_id ? await checkSupportNetwork(props.info.chain_id) : false
      if (!isSupport) {
        return console.warn('chain id is not match!')
      }
      if (mode.value === 'buy') {
        const sellAmount = ethers.utils.parseUnits(toValue.value, props.info.sell_token_decimals)
        if (buyIsMainCoin.value) {
          await buyFromMainCoin(sellAmount)
        } else {
          // other coin buy
          console.log('bushi zhubi ')
          await buyFromTokenCoin(sellAmount)
        }
      } else {
        if (buyIsMainCoin.value) {
          await sellToMainCoin()
        } else {
          await sellToTokenCoin()
        }
      }
      initPage()
    }

    const disabledBuyOrSell = computed(() => {
      return (
        countDownTime.value.status !== CrowdfundingStatus.LIVE ||
        Number(fromValue.value) <= 0 ||
        (mode.value === 'buy' && raiseState.value.raisePercent >= 100) ||
        (mode.value === 'buy' && Number(fromValue.value) > Number(maxBuyAmount.value)) ||
        (mode.value === 'sell' && Number(fromValue.value) > Number(maxSellAmount.value)) ||
        (mode.value === 'buy' && Number(fromValue.value) < Number(props.info.min_buy_amount))
      )
    })

    const disabledBuyReason = computed(() => {
      let reason = ''
      if (countDownTime.value.status === CrowdfundingStatus.UPCOMING) {
        reason = 'This launchpad is not opened yet.'
      } else if (countDownTime.value.status === CrowdfundingStatus.ENDED) {
        reason = 'This launchpad has ended.'
      } else if (mode.value === 'buy' && raiseState.value.raisePercent >= 100) {
        reason = `The launchpad has reached goal.`
      } else if (!(Number(fromValue.value) > 0)) {
        reason = `Enter a ${mode.value} amount.`
      } else if (
        mode.value === 'buy' &&
        Number(fromValue.value) > Number(props.info.max_buy_amount!)
      ) {
        reason = `Cannot buy more than maximum buy amounty.`
      } else if (
        mode.value === 'buy' &&
        Number(fromValue.value) > Number(props.buyCoinInfo.balance || 0)
      ) {
        reason = `Cannot buy more than your balance.`
      } else if (mode.value === 'sell' && Number(fromValue.value) > Number(maxSellAmount.value)) {
        reason = `Cannot sell more than maximum sell amounty.`
      }
      return reason
    })

    const setMaxBalance = () => {
      if (mode.value === 'buy') {
        fromValue.value = maxBuyAmount.value
      } else {
        fromValue.value = maxSellAmount.value
      }
      console.log('maxBuyAmount.value===>', maxBuyAmount.value, fromValue.value)
      changeFromValue(fromValue.value)
    }

    const getMaxAmount = async () => {
      if (walletStore.connected) {
        const buyRes = await fundingContract.maxBuyAmount('', '')
        if (buyRes) {
          maxBuy.value = ethers.utils.formatUnits(buyRes[0], props.buyCoinInfo.decimal)
          console.log('maxBuy.value==>', maxBuy.value)
          const sellRes = await fundingContract.maxSellAmount('', '')
          maxSell.value = ethers.utils.formatUnits(sellRes[1], props.sellCoinInfo.decimal)
          console.log('maxSell.value==>', maxSell.value)
        }
      }
    }

    const getFundingState = async (chainID?: number) => {
      // console.log('props.info', props.info)
      if (props.info.chain_id == chainID) {
        const fundingContractState = await fundingContract.state('', '')
        fundingContractStateSecound.value = fundingContractState
        raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
        raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
        raiseState.value.raisePercent = Number(
          formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
        )
        raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
      } else {
        raiseState.value.raiseGoal = Number(formatToFloor(Number(props.info.raise_goal), 8))
        raiseState.value.raiseAmount = Number(formatToFloor(Number(props.info.raise_balance), 8))
        raiseState.value.raisePercent = Number(
          formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
        )
        raiseState.value.swapAmount = '--'
      }
    }

    watch(
      () => walletStore.chainId,
      chainID => {
        getFundingState(chainID)
      },
      {
        immediate: true
      }
    )

    watch(
      () => props.buyCoinInfo,
      () => getMaxAmount(),
      {
        deep: true
      }
    )

    const raiseStateInject = inject<Ref<any>>('raiseState')
    watch(
      () => raiseState.value,
      () => {
        raiseStateInject && (raiseStateInject.value = raiseState.value)
      },
      { immediate: true, deep: true }
    )

    onMounted(() => {
      getMaxAmount()
    })

    const initPage = () => {
      fromValue.value = '0.0'
      toValue.value = '0.0'
      getMaxAmount()
      ctx.emit('refreshCoin')
      // window.location.reload()
    }

    const netWorkChange = async (value: number) => {
      await walletStore.ensureWalletConnected()
      await walletStore.switchNetwork({ chainId: value })
    }

    const numberTip = (data: number | '--', symbol = '') => {
      const divClass = 'u-h3'
      const isEmpty = data === '--'
      const defaultText = isEmpty
        ? data
        : Number(data).toLocaleString().includes('.')
        ? Number(data).toLocaleString()
        : Number(data).toLocaleString() + '.00'
      return isEmpty ? (
        <div>{defaultText}</div>
      ) : (
        <UTooltip>
          {{
            trigger: () =>
              data > 1000000 ? (
                <div class={divClass}>{(data / 1000000).toFixed(1).replace(/\.0$/, '')}M</div>
              ) : data > 1000 ? (
                <div class={divClass}>{(data / 1000).toFixed(1).replace(/\.0$/, '')}K</div>
              ) : (
                // <div class={divClass}>{data.toFixed(1).replace(/\.0$/, '')} </div>
                <div class={divClass}>{data.toFixed(2).replace(/\.00$/, '')} </div>
              ),
            default: () => <div>{defaultText + ' ' + symbol}</div>
          }}
        </UTooltip>
      )
    }

    const isInCrowdChain = computed(() => {
      return walletStore.chainId === props.info.chain_id
    })

    const operationLogic = () => {
      if (!isInCrowdChain.value) {
        const convertChainTo = getChainInfoByChainId(props.info.chain_id!)
        return (
          <UButton
            tag="div"
            type="primary"
            size="small"
            class="w-full"
            onClick={() => netWorkChange(props.info.chain_id!)}
          >
            Switch to {convertChainTo?.name}
          </UButton>
        )
      }
      if (!walletStore.address) {
        return (
          <UButton
            tag="div"
            type="primary"
            size="small"
            class="w-full"
            onClick={() => walletStore.ensureWalletConnected()}
          >
            Connect
          </UButton>
        )
      }

      return (
        <>
          {props.info.comer_id === userStore.profile?.id &&
            (disableRemoveOrCancelReason.value ? (
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton
                      tag="div"
                      type="primary"
                      class="basis-1/3"
                      size="small"
                      style={{
                        '--n-color-disabled': '#E0E0E0',
                        '--n-opacity-disabled': 1,
                        '--n-border-disabled': '1px solid #E0E0E0'
                      }}
                      onClick={removeOrCancel}
                      disabled={disableRemoveOrCancel.value}
                    >
                      {founderOperation.value}
                    </UButton>
                  ),
                  default: () => <div class="max-w-90">{disableRemoveOrCancelReason.value}</div>
                }}
              </UTooltip>
            ) : canLiquidity.value ? (
              disableRemoveOrCancel.value ? (
                <UTooltip>
                  {{
                    trigger: () => (
                      <UButton
                        type="primary"
                        class="basis-1/3"
                        size="small"
                        tag="div"
                        style={{
                          '--n-color-disabled': '#E0E0E0',
                          '--n-opacity-disabled': 1,
                          '--n-border-disabled': '1px solid #E0E0E0'
                        }}
                        disabled
                      >
                        Transfer Liquidity
                      </UButton>
                    ),
                    default: () => <div>Liquidity has been transferred.</div>
                  }}
                </UTooltip>
              ) : (
                <UButton
                  type="primary"
                  class="basis-1/3"
                  size="small"
                  style={{
                    '--n-color-disabled': '#E0E0E0',
                    '--n-opacity-disabled': 1,
                    '--n-border-disabled': '1px solid #E0E0E0'
                  }}
                  onClick={transferLiquidity}
                >
                  Transfer Liquidity
                </UButton>
              )
            ) : (
              <UButton
                type="primary"
                class="basis-1/3"
                size="small"
                style={{
                  '--n-color-disabled': '#E0E0E0',
                  '--n-opacity-disabled': 1,
                  '--n-border-disabled': '1px solid #E0E0E0'
                }}
                onClick={removeOrCancel}
                disabled={disableRemoveOrCancel.value}
              >
                {founderOperation.value}
              </UButton>
            ))}

          {/* if has disabledBuyReason, show tooltip */}
          {disabledBuyReason.value ? (
            <UTooltip>
              {{
                trigger: () => (
                  <UButton
                    type="primary"
                    class="flex-1"
                    size="small"
                    tag="div"
                    style={{
                      '--n-color-disabled': '#E0E0E0',
                      '--n-opacity-disabled': 1,
                      '--n-border-disabled': '1px solid #E0E0E0'
                    }}
                    onClick={buyOrSell}
                    disabled={disabledBuyOrSell.value}
                  >
                    {mode.value === 'buy' ? 'Buy' : 'Sell'}
                  </UButton>
                ),
                default: () => <div class="max-w-90">{disabledBuyReason.value}</div>
              }}
            </UTooltip>
          ) : (
            <UButton
              type="primary"
              class="flex-1"
              size="small"
              style={{
                '--n-color-disabled': '#E0E0E0',
                '--n-opacity-disabled': 1,
                '--n-border-disabled': '1px solid #E0E0E0'
              }}
              onClick={buyOrSell}
              disabled={disabledBuyOrSell.value}
            >
              {mode.value === 'buy' ? 'Buy' : 'Sell'}
            </UButton>
          )}
        </>
      )
    }

    ctx.expose({
      raiseState,
      getFundingState
    })

    return () => (
      <UCard>
        <div class="flex mb-10 <lg:block">
          <div>
            <div class="flex mb-4 items-center">
              <span class="mr-4 text-color1 u-h3">{mode.value === 'buy' ? 'Invest' : 'Sell'}</span>
              <span class="flex leading-snug items-center">
                <img src={chainInfo?.logo} class="h-4 w-4" />
                <span class="ml-2 text-color2 u-h6">{chainInfo?.name}</span>
              </span>
            </div>
            <div class="text-primary u-h6">
              Rate：1 {props.buyCoinInfo.symbol || 'Token'} = {props.info.buy_price}{' '}
              {props.sellCoinInfo.symbol || props.info.sell_token_symbol || 'Token'}
            </div>
          </div>
          <div class="flex-1">{/* placehoder */}</div>
          <div>
            <div class="text-right mb-4 text-color3 u-h5 <lg:my-4 <lg:text-left">
              {countDownTime.value.label}
            </div>
            <div class="flex items-center">
              <span class={`${countDownTime.value.class} ml-2 <lg:ml-0`}>
                {countDownTime.value.value.days}
              </span>
              <span class={`${countDownTime.value.class} ml-2`}>
                {countDownTime.value.value.hours}
              </span>
              <span class={`${countDownTime.value.class} ml-2`}>
                {countDownTime.value.value.minutes}
              </span>
              <span class={`${countDownTime.value.class} ml-2`}>
                {countDownTime.value.value.seconds}
              </span>
            </div>
          </div>
        </div>

        <div class="flex mb-10 items-end <lg:block">
          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 justify-between">
              <span class="text-color3 u-h7">From</span>
              <span class="text-primary1 u-num1">
                Balance :
                {(mode.value === 'buy' ? props.buyCoinInfo.balance : props.sellCoinInfo.balance) ||
                  '--'}
              </span>
            </div>
            {/* TODO max bug */}
            <UInputNumberGroup
              v-model:value={fromValue.value}
              style={{ 'n-input-disabled': 'border: 0' }}
              v-slots={{
                suffix: () => (
                  <div
                    class="cursor-pointer text-primary u-label1"
                    onClick={isInCrowdChain.value ? setMaxBalance : undefined}
                  >
                    MAX
                  </div>
                )
              }}
              type="withUnit"
              inputProps={{
                // onInput: changeFromValue,

                disabled: !isInCrowdChain.value,
                placeholder: '0.0',
                precision: mode.value === 'buy' ? getBuyCoinDecimal() : props.sellCoinInfo.decimal,
                max: mode.value === 'buy' ? maxBuyAmount.value : maxSellAmount.value
              }}
              renderUnit={() =>
                renderUnit(
                  (mode.value === 'buy' ? props.buyCoinInfo.symbol : props.sellCoinInfo.symbol) ||
                    ''
                )
              }
              onInput={handleFromInput}
            />
          </div>

          <div
            class="bg-purple-light rounded-full cursor-pointer flex h-8 mx-4 mb-[2px] w-8 justify-center items-center <lg:mx-auto <lg:my-5"
            style={{ transform: 'rotate(90deg)' }}
            onClick={changeMode}
          >
            <ExchangeOutlined />
          </div>

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 justify-between">
              <span class="text-color3 u-h7">To</span>
              <span class="text-primary1 u-num1">
                Balance :
                {(mode.value === 'buy' ? props.sellCoinInfo.balance : props.buyCoinInfo.balance) ||
                  '--'}
              </span>
            </div>
            <div>
              <UInputNumberGroup
                v-model:value={toValue.value}
                inputProps={{
                  // onInput: changeToValue,
                  disabled: !isInCrowdChain.value,
                  placeholder: '0.0',
                  precision:
                    mode.value === 'sell' ? getBuyCoinDecimal() : props.sellCoinInfo.decimal,
                  max: mode.value === 'buy' ? maxSellAmount.value : maxBuyAmount.value
                }}
                v-slots={{
                  suffix: () => null
                }}
                type="withUnit"
                renderUnit={() =>
                  renderUnit(
                    (mode.value === 'buy' ? props.sellCoinInfo.symbol : props.buyCoinInfo.symbol) ||
                      ''
                  )
                }
                onInput={handleToInput}
              />
            </div>
          </div>
        </div>

        <div class="mb-4 text-color2 u-h5">Launchpad Detail</div>
        <div class="flex <lg:block">
          <div class="flex-1 grid gap-4 grid-cols-2 overflow-hidden u-h7">
            <div class="rounded-sm flex flex-col bg-[rgba(83,49,244,0.06)] h-19 pl-4 justify-center">
              <div class="flex text-primary  items-end">
                <span class="mr-1">
                  {numberTip(raiseState.value.raiseAmount, props.buyCoinInfo.symbol)}
                </span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="mt-1 text-color3 u-h7">Raised</div>
            </div>
            <div class="rounded-sm flex flex-col bg-[rgba(83,49,244,0.06)] h-19 pl-4 justify-center">
              <div class="flex text-primary items-end">
                <span class="mr-1">{numberTip(raiseState.value.raisePercent, '%')}</span>%
              </div>
              <div class="mt-1 text-color3 u-h7">Progress</div>
            </div>
            <div class="rounded-sm flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-19 pl-4 justify-center">
              <div class="flex text-primary items-end">
                <span class="mr-1">
                  {numberTip(raiseState.value.raiseGoal, props.buyCoinInfo.symbol)}
                </span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="mt-1 text-color3 u-h7">Raise Goal</div>
            </div>
            <div class="rounded-sm flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-19 pl-4 justify-center">
              <div class="flex text-primary items-end">
                <span class="mr-1">
                  {numberTip(raiseState.value.swapAmount, props.buyCoinInfo.symbol)}
                </span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="mt-1 text-color3 u-h7">Available Swap</div>
            </div>
          </div>
          <div class="px-6 w-[300px] overflow-hidden <lg:w-auto <lg:px-0">
            <div class="flex mb-4 u-h6 <lg:my-5">
              <span class="flex flex-1 text-color1 overflow-hidden items-center">
                Swap %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                    default: () => (
                      <div class="max-w-90">
                        Part of the funds raised will go into the swap pool as a fixed-price
                        exchangeable currency, and part will go directly to the team wallet
                      </div>
                    )
                  }}
                </UTooltip>
              </span>
              <span class="text-color2">{props.info.swap_percent} %</span>
            </div>
            <div class="flex mb-4 u-h6">
              <span class="flex flex-1 text-color1 overflow-hidden items-center">
                Minimum buy：
              </span>
              <span class="text-color2">
                {props.info.min_buy_amount} {props.buyCoinInfo.symbol}
              </span>
            </div>
            <div class="flex mb-4 u-h6">
              <span class="flex flex-1 text-color1 overflow-hidden items-center">
                Maximum buy：
              </span>
              <span class="text-color2">
                {props.info.max_buy_amount} {props.buyCoinInfo.symbol}
              </span>
            </div>
            <div class="flex mb-4 u-h6">
              <span class="flex flex-1 text-color1 overflow-hidden items-center">
                Sell tax %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                    default: () => (
                      <div class="max-w-90">
                        When selling tokens, a {props.info.sell_tax} % fee needs to be deducted as
                        sell tax
                      </div>
                    )
                  }}
                </UTooltip>
              </span>
              <span class="text-color2">{props.info.sell_tax} %</span>
            </div>
            <div class="flex u-h6">
              <span class="flex flex-1 text-color1 overflow-hidden items-center">
                Maximum sell % ：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                    default: () => (
                      <div class="max-w-90">The maximum sellable percentage of tokens you own</div>
                    )
                  }}
                </UTooltip>
              </span>
              <span class="text-color2">{props.info.max_sell_percent} %</span>
            </div>
          </div>
        </div>

        <div class="flex mt-10  gap-4 items-center">{operationLogic()}</div>

        <UModal v-model:show={cancelModal.value} maskClosable={false}>
          <UCard
            style={{ width: '540px', '--n-title-text-color': '#000' }}
            size="huge"
            closable={true}
            onClose={() => (cancelModal.value = false)}
            title="Cancel the launchpad?"
          >
            <div class="min-h-20 text-color2 u-h6">
              The dCrowdfungding will be closed at once you click 'Yes'.
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (cancelModal.value = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={cancelCrowdfunding}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
        <UModal v-model:show={removeModal.value} maskClosable={false}>
          <UCard
            style={{ width: '540px', '--n-title-text-color': '#000' }}
            size="huge"
            closable={true}
            onClose={() => (removeModal.value = false)}
            title="Remove the launchpad?"
          >
            <div class="min-h-20 text-color2 u-h6">
              All fundings will be sent to team wallet at once you click 'Yes'.
            </div>

            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (removeModal.value = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={removeCrowdfunding}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </UCard>
    )
  }
})

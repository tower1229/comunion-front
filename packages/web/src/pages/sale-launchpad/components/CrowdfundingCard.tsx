import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { SaleCrowdfundingStatus } from '../utils'
import { useErc20Contract } from '@/contracts'
import { useWalletStore } from '@/stores'
import { SaleCrowdfundingItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'

export const CrowdfundingCard = defineComponent({
  name: 'CrowdfundingCard',
  props: {
    info: {
      type: Object as PropType<SaleCrowdfundingItem>,
      required: true
    },
    onClick: {
      type: Function as PropType<() => void>
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const chainID = walletStore.chainId
    const sellTokenSymbol = ref()
    const buyTokenSymbol = ref()
    const tokenContract = useErc20Contract()
    const raiseState = ref({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0
    })

    const logo = computed(() => {
      return getChainInfoByChainId(props.info.chain_id)?.logo
    })

    const getFundingState = async () => {
      raiseState.value.raiseGoal = Number(formatToFloor(Number(props.info.soft_cap), 8))
      raiseState.value.raiseAmount = Number(
        formatToFloor(Number(props.info.invest_token_balance), 8)
      )
      raiseState.value.raisePercent = Math.round(
        Number(formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4))
      )
      // }
    }

    const buyIsMainCoin = computed(() => {
      return props.info.invest_token_contract === '0x0000000000000000000000000000000000000000'
    })
    // get buy token and sell token
    const getTokenName = async () => {
      if (props.info.chain_id == chainID) {
        const sellRes = await tokenContract(props.info.presale_token_contract)
        sellTokenSymbol.value = await sellRes.symbol()

        if (buyIsMainCoin.value) {
          buyTokenSymbol.value = getChainInfoByChainId(props.info.chain_id)?.currencySymbol
        } else {
          const buyTokenRes = await tokenContract(props.info.invest_token_contract)
          buyTokenSymbol.value = await buyTokenRes.symbol()
        }
      } else {
        sellTokenSymbol.value = props.info.presale_token_symbol
        buyTokenSymbol.value = props.info.invest_token_symbol
      }
    }
    const timeLabel = computed(() => {
      if (props.info.status === SaleCrowdfundingStatus.CANCELED) {
        return 'Cancelled'
      }
      if (dayjs().isAfter(+props.info.ended_at * 1000)) {
        return 'Ended'
      }
      if (dayjs.utc().isBefore(dayjs(+props.info.started_at * 1000).utc())) {
        return 'Upcoming'
      }
      return 'Live'
    })
    const Time = computed(() => {
      if (props.info.status === SaleCrowdfundingStatus.CANCELED) {
        return <div class="text-color3">Cancelled</div>
      }
      if (dayjs().isAfter(+props.info.ended_at * 1000)) {
        return <div class="text-color3">Ended</div>
      }

      let diffDuration
      if (dayjs.utc().isBefore(dayjs(+props.info.started_at * 1000).utc())) {
        diffDuration = dayjs.duration(dayjs(+props.info.started_at * 1000).diff(dayjs.utc().utc()))
        const days = Math.floor(diffDuration.asDays())
        const [hours, minutes, seconds] = dayjs
          .duration(dayjs(+props.info.started_at * 1000).diff(dayjs.utc().utc()))
          .format('HH-mm-ss')
          .split('-')
        return (
          <div class="flex items-center">
            <span class="flex-1">Starts In：</span>
            <span class="text-primary">
              {days}:{hours}:{minutes}:{seconds}
            </span>
          </div>
        )
      }

      diffDuration = dayjs.duration(
        dayjs(+props.info.ended_at * 1000)
          .utc()
          .diff(dayjs.utc())
      )
      const days = Math.floor(diffDuration.asDays())
      const [hours, minutes, seconds] = diffDuration.format('HH-mm-ss').split('-')
      return (
        <div class="flex items-center">
          <span class="flex-1">Ends In：</span>
          <span class="text-primary">
            {days}:{hours}:{minutes}:{seconds}
          </span>
        </div>
      )
    })

    onMounted(() => {
      getTokenName()
      getFundingState()
    })

    return () => (
      <div
        class="bg-white border border-color-border rounded-sm cursor-pointer  top-0 overflow-hidden relative hover:bg-color-hover"
        style="transition:all ease .3s"
        onClick={() => props.onClick?.()}
      >
        <UTag
          type="filled"
          bgColor="#fff"
          class="border top-4 right-4 absolute !border-color-border !text-color2"
        >
          {timeLabel.value}
        </UTag>
        <ULazyImage src={props.info.poster} class=" h-10.75rem w-full" />
        <div class="p-6">
          <div class="flex mb-2 items-center">
            <span class="flex-1 mr-4 text-color1 truncate u-h3" title={props.info.title}>
              {props.info.title}
            </span>
            <img class="w-[22px]" src={logo.value} />
          </div>
          <div class="flex mb-2">
            <div class="flex-1 text-0.75rem">
              <div class="text-grey3  leading-6">Soft/Hard</div>
              <div class="text-primary">
                <span class="mr-1 u-h3">
                  {props.info.soft_cap}
                  {props.info.invest_token_symbol}
                </span>
                -
                <span class="u-h3">
                  {props.info.hard_cap}
                  {props.info.invest_token_symbol}
                </span>
              </div>
            </div>
          </div>

          <UProgress
            showIndicator={false}
            percentage={raiseState.value.raisePercent}
            color="#00BFA5"
            height={6}
            class="mb-2"
          />

          <div class="flex mb-2 items-center">
            <div class="flex-1 u-h7">
              <span class="text-color1">{raiseState.value.raiseAmount}</span>
              <span class="ml-1 text-color3">{buyTokenSymbol.value}</span>
            </div>
            <div class="text-right text-color1 u-num2">{raiseState.value.raisePercent} %</div>
          </div>
          <div class="flex mt-3 justify-between u-h6">
            <span class="text-color3">Rate:</span>
            <span class="text-right text-color1">
              1 {buyTokenSymbol.value} = {props.info.presale_price}{' '}
              {props.info.presale_token_symbol}
            </span>
          </div>
          <div class="flex mt-2 justify-between ">
            <span class="text-color3">Liquidity %:</span>
            <span class="text-right text-color1">{props.info.liquidity_rate * 100}</span>
          </div>
        </div>
        <div class="border-[#F5F6FA] border-t-1 py-3 px-6 text-color3 u-h6">{Time.value}</div>
      </div>
    )
  }
})

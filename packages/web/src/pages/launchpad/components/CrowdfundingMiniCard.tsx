import { UTag } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CrowdfundingStatus } from '../utils'
import StartupLogo from '@/components/StartupLogo'
import { useErc20Contract } from '@/contracts'
import { useWalletStore } from '@/stores'
import { CrowdfundingItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'

export default defineComponent({
  name: 'CrowdfundingMiniCard',
  props: {
    info: {
      type: Object as PropType<CrowdfundingItem>,
      required: true
    }
  },
  setup(props) {
    const sellTokenSymbol = ref()
    const buyTokenSymbol = ref()

    const raiseState = ref({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0,
      swapAmount: 0
    })

    const router = useRouter()

    const toDetail = async (crowdfundingId: number) => {
      router.push('/launchpad/' + crowdfundingId)
    }

    // console.log(props.info.chainId, props.info.crowdfundingContract)

    const walletStore = useWalletStore()
    const chainID = walletStore.chainId
    raiseState.value.raiseGoal = Number(formatToFloor(Number(props.info.raise_goal), 8))
    raiseState.value.raiseAmount = Number(formatToFloor(Number(props.info.raise_balance), 8))
    raiseState.value.raisePercent = Number(
      formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
    )
    raiseState.value.swapAmount = Number(props.info.swap_percent)

    const buyIsMainCoin = computed(() => {
      return props.info.buy_token_contract === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    })
    // get buy token and sell token
    const getTokenName = async () => {
      if (props.info.chainId == chainID) {
        if (walletStore.connected) {
          const tokenContract = useErc20Contract()
          const sellRes = await tokenContract(props.info.sell_token_contract)
          sellTokenSymbol.value = await sellRes.symbol()

          if (buyIsMainCoin.value) {
            buyTokenSymbol.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
          } else {
            const buyTokenRes = await tokenContract(props.info.buy_token_contract)
            buyTokenSymbol.value = await buyTokenRes.symbol()
          }
        }
      } else {
        sellTokenSymbol.value = props.info.sell_token_symbol
        buyTokenSymbol.value = props.info.buy_token_symbol
      }
    }

    const timeLabel = computed(() => {
      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return 'Cancelled'
      }
      if (dayjs().isAfter(+props.info.end_time) || props.info.status === CrowdfundingStatus.ENDED) {
        return 'Ended'
      }
      if (dayjs.utc().isBefore(dayjs(+props.info.start_time).utc())) {
        return 'Upcoming'
      }
      return 'Live'
    })

    onMounted(() => {
      getTokenName()
    })

    return () => (
      <div
        class="rounded-sm cursor-pointer flex py-4 px-4 items-center hover:bg-color-hover"
        onClick={() => toDetail(props.info.id)}
      >
        <StartupLogo src={props.info.poster} class="h-15 mr-4 w-15" />

        <div class="flex-1 overflow-hidden">
          <div class="flex mb-2 items-center">
            <div class="text-color1 truncate u-h4 <lg:flex-1">{props.info.title || '--'}</div>
            <UTag class="ml-4 text-color2 whitespace-nowrap">{timeLabel.value}</UTag>
          </div>
          <div class="text-color3 u-h6">
            <span>Raise Goal：</span>
            <span class="text-primary">
              <span class="u-num1">{raiseState.value.raiseGoal}</span>
              <span> {buyTokenSymbol.value}</span>
            </span>
            <strong class="mx-2 overflow-hidden <lg:h-0 <lg:block">·</strong>
            <span>Progress：</span>
            <span class=" text-primary">
              <span class="u-num1">{raiseState.value.raiseAmount}</span>
              <span> {buyTokenSymbol.value}</span>({raiseState.value.raisePercent} %)
            </span>
          </div>
        </div>
      </div>
    )
  }
})

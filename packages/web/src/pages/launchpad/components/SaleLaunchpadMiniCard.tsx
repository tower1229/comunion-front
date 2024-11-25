import { UTag } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { useErc20Contract } from '@/contracts'
import { SaleCrowdfundingStatus } from '@/pages/sale-launchpad/utils'
import { useWalletStore } from '@/stores'
import { SaleCrowdfundingItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'

export default defineComponent({
  name: 'SaleLaunchpadMiniCard',
  props: {
    info: {
      type: Object as PropType<SaleCrowdfundingItem>,
      required: true
    }
  },
  setup(props) {
    const sellTokenSymbol = ref()
    const buyTokenSymbol = ref()

    const raiseState = ref({
      raiseAmount: 0,
      soft_cap: 0,
      hard_cap: 0,
      raisePercent: 0
    })

    const router = useRouter()

    const toDetail = async (crowdfundingId: number) => {
      router.push('/sale-launchpad/' + crowdfundingId)
    }

    // console.log(props.info.chainId, props.info.crowdfundingContract)

    const walletStore = useWalletStore()
    const chainID = walletStore.chainId
    raiseState.value.soft_cap = Number(formatToFloor(Number(props.info.soft_cap), 8))
    raiseState.value.hard_cap = Number(formatToFloor(Number(props.info.hard_cap), 8))
    raiseState.value.raiseAmount = Number(formatToFloor(Number(props.info.invest_token_balance), 8))
    raiseState.value.raisePercent = Number(
      formatToFloor((raiseState.value.raiseAmount / raiseState.value.soft_cap) * 100, 4)
    )

    const buyIsMainCoin = computed(() => {
      return props.info.invest_token_contract === '0x0000000000000000000000000000000000000000'
    })
    // get buy token and sell token
    const getTokenName = async () => {
      if (props.info.chainId == chainID) {
        if (walletStore.connected) {
          const tokenContract = useErc20Contract()
          const sellRes = await tokenContract(props.info.presale_token_contract)
          sellTokenSymbol.value = await sellRes.symbol()

          if (buyIsMainCoin.value) {
            buyTokenSymbol.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
          } else {
            const buyTokenRes = await tokenContract(props.info.invest_token_contract)
            buyTokenSymbol.value = await buyTokenRes.symbol()
          }
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
      if (
        dayjs().isAfter(+props.info.ended_at * 1000) ||
        props.info.status === SaleCrowdfundingStatus.ENDED
      ) {
        return 'Ended'
      }
      if (dayjs.utc().isBefore(dayjs(+props.info.started_at * 1000).utc())) {
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
              <span class="u-num1">{raiseState.value.soft_cap}</span>
              <span> {buyTokenSymbol.value}</span>
            </span>
            -
            <span class="text-primary">
              <span class="u-num1">{raiseState.value.hard_cap}</span>
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

import { UCard, UTooltip, UInputNumberGroup, UButton } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, computed, ref, watch, type PropType } from 'vue'
import { CoinType } from '../../[id]'
import { SaleCrowdfundingStatus } from '../../utils'
import Founder from './Founder'
import Investor from './Investor'
import useInvestState from './useInvestState'
import useLaunchpadCountdown from './useLaunchpadCountdown'
import CoinIcon from '@/components/CoinIcon'
import { ServiceReturn } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'

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

function CrowdProfile(props: {
  raised: number
  progress: number
  soft: number
  hard: number
  symbol: string
}) {
  return (
    <div class="flex-1 grid gap-4 grid-cols-2 overflow-hidden u-h7">
      <div class="rounded-sm flex flex-col bg-[rgba(83,49,244,0.06)] h-19 pl-4 justify-center">
        <div class="flex text-primary  items-end">
          <span class="mr-1">{numberTip(props.raised, props.symbol)}</span>
          {props.symbol}
        </div>
        <div class="mt-1 text-color3 u-h7">Raised</div>
      </div>
      <div class="rounded-sm flex flex-col bg-[rgba(83,49,244,0.06)] h-19 pl-4 justify-center">
        <div class="flex text-primary items-end">
          <span class="mr-1">{numberTip(props.progress, '%')}</span>%
        </div>
        <div class="mt-1 text-color3 u-h7">Progress</div>
      </div>
      <div class="rounded-sm flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-19 pl-4 justify-center">
        <div class="flex text-primary items-end">
          <span class="mr-1">{numberTip(props.soft, props.symbol)}</span>
          {props.symbol}
        </div>
        <div class="mt-1 text-color3 u-h7">Soft Cap</div>
      </div>
      <div class="rounded-sm flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-19 pl-4 justify-center">
        <div class="flex text-primary items-end">
          <span class="mr-1">{numberTip(props.hard, props.symbol)}</span>
          {props.symbol}
        </div>
        <div class="mt-1 text-color3 u-h7">Hard Cap</div>
      </div>
    </div>
  )
}

function Countdown(props: {
  status: SaleCrowdfundingStatus
  class: string
  days: string
  hours: string
  minutes: string
  seconds: string
}) {
  console.log(props.status, 999)
  const descMap = {
    [SaleCrowdfundingStatus.CANCELED]: 'Cancelled',
    [SaleCrowdfundingStatus.ENDED]: 'Launchpad Has Ended',
    [SaleCrowdfundingStatus.LIVE]: 'Launchpad Ends In',
    [SaleCrowdfundingStatus.UPCOMING]: 'Launchpad Starts In'
  }
  return (
    <>
      <div class="text-right mb-4 text-color3 u-h5 <lg:my-4 <lg:text-left">
        {descMap[props.status]}
      </div>
      <div class="flex items-center">
        <span class={`${props.class} ml-2 <lg:ml-0`}>{props.days}</span>
        <span class={`${props.class} ml-2`}>{props.hours}</span>
        <span class={`${props.class} ml-2`}>{props.minutes}</span>
        <span class={`${props.class} ml-2`}>{props.seconds}</span>
      </div>
    </>
  )
}

export default defineComponent({
  name: 'InvestFair',
  props: {
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'SaleLaunchpad@get-sale-launchpad-info'>>>,
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
  setup(props, ctx) {
    const chainInfo = getChainInfoByChainId(props.info.chain_id!)
    const userStore = useUserStore()
    const amount = ref(0)

    const walletStore = useWalletStore()

    const { investState, setInvestState } = useInvestState(walletStore.chainId!, {
      [walletStore.chainId!]: props.info.contract_address!
    })

    const countdown = useLaunchpadCountdown(
      Number(props.info.started_at) * 1000,
      Number(props.info.ended_at) * 1000,
      props.info.status!
    )

    const isFounder = computed(() => {
      return userStore.profile?.id === props.info.comer_id
    })

    const isInCrowdChain = computed(() => {
      return walletStore.chainId === props.info.chain_id
    })

    const netWorkChange = async (value: number) => {
      await walletStore.ensureWalletConnected()
      await walletStore.switchNetwork({ chainId: value })
    }

    const getFundingState = async (chainID?: number) => {
      // console.log('props.info', props.info)
      // if (props.info.chain_id == chainID) {
      //   const fundingContractState = await fundingContract.state('', '')
      //   fundingContractStateSecound.value = fundingContractState
      //   raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
      //   raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
      //   raiseState.value.raisePercent = Number(
      //     formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
      //   )
      //   raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
      // } else {
      //   raiseState.value.raiseGoal = Number(formatToFloor(Number(props.info.raise_goal), 8))
      //   raiseState.value.raiseAmount = Number(formatToFloor(Number(props.info.raise_balance), 8))
      //   raiseState.value.raisePercent = Number(
      //     formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
      //   )
      //   raiseState.value.swapAmount = '--'
      // }
    }

    function genCycleState(
      unlockat: number, // ms
      firstRelease: number, // percent
      cyclePeriod: number, // ms
      tokenCycle: number // percent
    ) {
      const dateNow = dayjs.utc()
      const dateEnd = dayjs(+unlockat).utc()

      const totalCycle = Math.ceil((100 - firstRelease) / tokenCycle)
      const currentCycle = Math.floor((dateNow.unix() - dateEnd.unix()) / cyclePeriod)
      const remainingDaysNextCycle = cyclePeriod - ((dateNow.unix() - dateEnd.unix()) % cyclePeriod)
      return { totalCycle, currentCycle, remainingDaysNextCycle }
    }

    function getMaxCanInvest() {
      if (!props.buyCoinInfo.balance) return 0
      if (!props.info.max_invest_amount) return 0

      const restInvestAmount =
        +props.info.max_invest_amount - +ethers.utils.formatUnits(investState.investedAmount)

      return Math.min(+props.buyCoinInfo.balance, restInvestAmount)
    }

    watch(
      () => props.info,
      () => setInvestState()
    )

    watch(
      () => amount.value,
      value => {
        if (value > getMaxCanInvest()) {
          amount.value = getMaxCanInvest()
        }
      }
    )

    ctx.expose({
      getFundingState
    })

    return () => {
      const { totalCycle, currentCycle, remainingDaysNextCycle } = genCycleState(
        investState.unlockAt! * 1000,
        props.info.first_release! * 100,
        props.info.cycle! * 1000,
        props.info.cycle_release! * 100
      )

      return (
        <UCard>
          <div class="flex mb-10 <lg:block">
            <div>
              <div class="flex mb-4 items-center">
                <span class="flex leading-snug items-center">
                  <img src={chainInfo?.logo} class="h-4 w-4" />
                  <span class="ml-2 text-color2 u-h6">{chainInfo?.name}</span>
                </span>
              </div>
              <div class=" text-primary u-h6">
                Rate：1 {props.buyCoinInfo.symbol || 'Token'} = {props.info.presale_price}{' '}
                {props.sellCoinInfo.symbol || props.info.sell_token_symbol || 'Token'}
              </div>
            </div>
            <div class="flex-1">{/* placehoder */}</div>
            <div>
              <Countdown {...countdown} />
            </div>
          </div>

          {!isFounder.value && (
            <div class="flex-1 mb-10 overflow-hidden">
              <div class="flex mb-2 justify-between">
                <span class="text-color3 u-h7" />
                <span class="text-primary1 u-num1">
                  Balance :{props.buyCoinInfo.balance || '--'}
                </span>
              </div>
              <div>
                <UInputNumberGroup
                  v-model:value={amount.value}
                  inputProps={{
                    disabled: false,
                    placeholder: '0.0',
                    precision: props.buyCoinInfo.decimal,
                    max: Math.min(
                      +props.buyCoinInfo.balance! || 0,
                      props.info.max_invest_amount || 0
                    )
                  }}
                  v-slots={{
                    suffix: () => (
                      <div
                        class="cursor-pointer text-primary u-label1"
                        onClick={() => {
                          amount.value = getMaxCanInvest()
                        }}
                      >
                        MAX
                      </div>
                    )
                  }}
                  type="withUnit"
                  renderUnit={() => (
                    <div
                      class={[
                        'u-h5 flex justify-center items-center border rounded-r-sm bg-purple w-30',
                        { 'text-color1': 'symbol', 'text-color3': '!symbol' }
                      ]}
                    >
                      <CoinIcon symbol={props.buyCoinInfo.symbol} class="h-4 mr-2 w-4" />
                      <span>{props.buyCoinInfo.symbol || 'Token'}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          <div class="flex <lg:block">
            <CrowdProfile
              raised={+props.info.invest_token_balance!}
              progress={(+props.info.invest_token_balance! / +props.info.soft_cap!) * 100}
              soft={+props.info.soft_cap!}
              hard={+props.info.hard_cap!}
              symbol={props.info.invest_token_symbol!}
            />
            <div class="px-6  overflow-hidden <lg:w-auto <lg:px-0">
              <div class="flex mb-4 u-h6 <lg:my-5">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Minimum buy：
                </span>
                <span class="text-color2">
                  {props.info.min_invest_amount} {props.buyCoinInfo.symbol}
                </span>
              </div>
              <div class="flex mb-4 u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Maximum buy：
                </span>
                <span class="text-color2">
                  {props.info.max_invest_amount} {props.buyCoinInfo.symbol}
                </span>
              </div>
              <div class="flex mb-4 u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Liquidity %：
                </span>
                {props.info.liquidity_rate ? (
                  <span class="text-color2">{+props.info.liquidity_rate! * 100} %</span>
                ) : (
                  '--'
                )}
              </div>
              <div class="flex mb-4 u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Current Vest Cycle：
                </span>
                <span class="text-color2">
                  {props.info.first_release === 1 || !investState.isTransed
                    ? '--'
                    : `${currentCycle}/${totalCycle}`}
                </span>
              </div>
              <div class="flex u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Remaining Vesting Cycle：
                </span>
                <span class="text-color2">
                  {props.info.first_release === 1 || !investState.isTransed
                    ? '--'
                    : `in ${Math.ceil(remainingDaysNextCycle / 1000 / 60 / 60 / 24)} days`}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-8 actions">
            {!walletStore.address ? (
              <UButton
                tag="div"
                type="primary"
                size="small"
                class="w-full"
                onClick={() => walletStore.ensureWalletConnected()}
              >
                Connect
              </UButton>
            ) : !isInCrowdChain.value ? (
              <UButton
                tag="div"
                type="primary"
                size="small"
                class="w-full"
                onClick={() => netWorkChange(props.info.chain_id!)}
              >
                Switch to {getChainInfoByChainId(props.info.chain_id!)?.name}
              </UButton>
            ) : isFounder.value ? (
              <Founder {...props} investState={investState} />
            ) : (
              <Investor {...props} amount={amount.value} investState={investState} />
            )}
          </div>
        </UCard>
      )
    }
  }
})

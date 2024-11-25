import { USpin, UTooltip } from '@comunion/components'
import { SettingOutlined } from '@comunion/icons'
import { fetchBalance } from '@wagmi/core'
import { ethers } from 'ethers'
import { defineComponent, onMounted, ref, computed, onBeforeUnmount, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CrowdfundingInfo } from './components/CrowdfundingInfo'
// import { IBORateHistory } from './components/IBORateHistory'
import EditDialog from './components/EditDialog'
import InvestSale from './components/InvestSale/index'
import { InvestmentRecords, InvestmentsRecordsExpose } from './components/InvestmentRecords'
import { TokenInformation } from './components/TokenInformation'
import { ShareButtonGroup, ShareButtonClass } from '@/components/Share'
import StartupCard from '@/components/StartupCard'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import {
  useWalletStore,
  useSocketStore,
  SocketMsgType,
  useUserStore,
  useGlobalConfigStore
} from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'

export type CoinType = {
  name?: string
  symbol?: string
  address?: string
  balance?: string
  decimal?: number
  supply?: string
}

const CrowdfundingDetail = defineComponent({
  name: 'CrowdfundingDetail',
  setup(props) {
    const route = useRoute()
    const globalConfigStore = useGlobalConfigStore()
    const walletStore = useWalletStore()
    const SocketStore = useSocketStore()
    const userStore = useUserStore()

    const investRecordsRef = ref<InvestmentsRecordsExpose>()
    const investRef = ref()
    const crowdfundingInfo = ref<ServiceReturn<'SaleLaunchpad@get-sale-launchpad-info'>>()
    const startupInfo = ref()
    const buyCoinInfo = ref<CoinType>({ name: '', address: '' })
    const sellCoinInfo = ref<CoinType>({ name: '', address: '' })
    const pageLoading = ref(false)

    const getCrowdfundingInfo = async (crowdfundingId: number) => {
      pageLoading.value = true
      const { error, data } = await services['SaleLaunchpad@get-sale-launchpad-info']({
        sale_launchpad_id: crowdfundingId
      })
      pageLoading.value = false
      if (!error) {
        crowdfundingInfo.value = data
        startupInfo.value = {
          ...data.startup,
          title: data?.startup?.name,
          tag: data?.startup?.tags?.map(e => e.tag?.name)
        }
        // getStartupInfo(data!.startup_id!)
      }
    }

    const buyIsMainCoin = computed(() => {
      return (
        crowdfundingInfo.value?.invest_token_contract ===
        '0x0000000000000000000000000000000000000000'
      )
    })

    const isInCrowdChain = computed(() => {
      return walletStore.chainId === crowdfundingInfo.value?.chain_id
    })

    const setCoinInfo = async () => {
      if (crowdfundingInfo.value && walletStore.connected) {
        const tokenContract = useErc20Contract()
        const sellTokenRes = await tokenContract(crowdfundingInfo.value.presale_token_contract!)
        if (isInCrowdChain.value) {
          const [name, decimal, supply, symbol, balance] = await Promise.all([
            sellTokenRes.name(),
            sellTokenRes.decimals(),
            sellTokenRes.totalSupply(),
            sellTokenRes.symbol(),
            sellTokenRes.balanceOf(walletStore.address)
          ])
          sellCoinInfo.value.name = name
          sellCoinInfo.value.decimal = decimal
          sellCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
          sellCoinInfo.value.symbol = symbol || crowdfundingInfo.value?.sell_token_symbol
          sellCoinInfo.value.balance = ethers.utils.formatUnits(balance, decimal)
        } else {
          sellCoinInfo.value.name = crowdfundingInfo.value?.presale_token_name || '--'
          sellCoinInfo.value.decimal = crowdfundingInfo.value?.presale_token_decimals
          sellCoinInfo.value.supply = (crowdfundingInfo.value?.presale_token_supply || 0).toString()
          sellCoinInfo.value.symbol = crowdfundingInfo.value?.presale_token_symbol || '--'
          sellCoinInfo.value.balance =
            '--' || (crowdfundingInfo.value?.presale_token_balance || 0).toString()
        }

        const buyTokenRes = await tokenContract(crowdfundingInfo.value.invest_token_contract!)
        if (isInCrowdChain.value) {
          if (buyIsMainCoin.value) {
            buyCoinInfo.value.symbol = getChainInfoByChainId(
              crowdfundingInfo.value!.chain_id!
            )?.currencySymbol
            buyCoinInfo.value.balance =
              (await fetchBalance({ address: walletStore.address as any })).formatted || '--'
          } else {
            const [buyName, buyDecimal, buySymbol, buyBalance] = await Promise.all([
              await buyTokenRes.name(),
              await buyTokenRes.decimals(),
              await buyTokenRes.symbol(),
              await buyTokenRes.balanceOf(walletStore.address)
            ])
            buyCoinInfo.value.name = buyName
            buyCoinInfo.value.decimal = buyDecimal
            buyCoinInfo.value.symbol = buySymbol
            buyCoinInfo.value.balance = ethers.utils.formatUnits(buyBalance, buyDecimal)
          }
        } else {
          buyCoinInfo.value.name = crowdfundingInfo.value?.invest_token_symbol || '--'
          buyCoinInfo.value.decimal = crowdfundingInfo.value?.invest_token_decimals || 0
          buyCoinInfo.value.symbol = crowdfundingInfo.value?.invest_token_symbol || '--'
          buyCoinInfo.value.balance =
            '--' || String(crowdfundingInfo.value.invest_token_balance || '--')
        }
      }
    }

    watch(
      () => isInCrowdChain.value,
      () => setCoinInfo()
    )

    const initPage = async () => {
      setCoinInfo()
      investRecordsRef.value?.getInvestRecord()
      SettingVisible.value = false
    }

    const paramCrowdfundingId = Number(route.params.id)
    provide('paramCrowdfundingId', paramCrowdfundingId)

    onMounted(() => {
      getCrowdfundingInfo(paramCrowdfundingId).then(setCoinInfo)
    })

    onBeforeUnmount(() => {
      SocketStore.unsubscribe('crowdfunding', 2)
    })
    // socket subscribe
    SocketStore.init().then((socket: any) => {
      SocketStore.subscribe(
        'sale_launchpad',
        2,
        (msg: SocketMsgType) => {
          if (msg.topic === 'subscribe' && msg.data.target_id === paramCrowdfundingId) {
            console.warn('socket get detail change, do update...', paramCrowdfundingId)
            getCrowdfundingInfo(paramCrowdfundingId).then(() => {
              investRef.value?.getFundingState(walletStore.chainId)
              setCoinInfo()
            })
            // ref components data refresh
            investRecordsRef.value?.getInvestRecord()
          }
          // paramCrowdfundingId
        },
        paramCrowdfundingId
      )
    })

    const raiseState = ref<any>()

    provide(
      'startupInfo',
      computed(() => startupInfo.value)
    )

    provide('raiseState', raiseState)
    //
    const isFounder = computed(() => {
      return userStore.profile?.id === crowdfundingInfo.value?.comer_id
    })
    const SettingVisible = ref(false)

    return {
      pageLoading,
      crowdfundingInfo,
      buyCoinInfo,
      sellCoinInfo,
      initPage,
      getCrowdfundingInfo,
      onRefreshData: () => getCrowdfundingInfo(paramCrowdfundingId).then(setCoinInfo),
      startupInfo,
      investRecordsRef,
      investRef,
      raiseState,
      isInCrowdChain,
      isFounder,
      SettingVisible,
      globalConfigStore
    }
  },
  render() {
    return (
      <USpin show={this.pageLoading}>
        <div class="flex gap-6 relative <lg:pt-10 <lg:block">
          {this.startupInfo && this.startupInfo.name && (
            <ShareButtonGroup
              class="top-0 left-[100%] absolute <lg:left-auto <lg:right-0"
              generate={{
                banner: this.startupInfo.banner,
                logo: this.startupInfo.logo,
                name: this.startupInfo.name + '-Launchpad',
                infos: [
                  {
                    count: this.raiseState?.raiseGoal,
                    unit: this.buyCoinInfo.symbol,
                    label: 'Raise Goal'
                  },
                  {
                    count: `${this.raiseState?.raisePercent} %`,
                    label: 'Progress'
                  }
                ]
              }}
              route={window.location.href}
              title={this.startupInfo?.name + '--Launchpad | WELaunch'}
              description={`Check out the launchpad on WELaunch, a next generation all-in-one decentralized economy BUIDLing and Launch Network`}
              text={`${this.startupInfo?.name} just launched a #presale #launchpad for ${this.raiseState?.raiseGoal} ${this.buyCoinInfo.symbol}, check it out on #WELaunch Network: `}
              tipPlacement="right"
            >
              {this.isFounder && this.globalConfigStore.isLargeScreen && (
                <UTooltip
                  placement="left"
                  v-slots={{
                    trigger: () => (
                      <div
                        class={`${ShareButtonClass}`}
                        onClick={() => (this.SettingVisible = true)}
                      >
                        <SettingOutlined />
                      </div>
                    ),
                    default: () => `Setting`
                  }}
                ></UTooltip>
              )}
            </ShareButtonGroup>
          )}

          <div class="w-86 overflow-hidden <lg:w-auto">
            {this.startupInfo && <StartupCard startup={this.startupInfo} class="mb-6" />}

            {this.crowdfundingInfo && (
              <TokenInformation
                class="mb-6"
                sellCoinInfo={this.sellCoinInfo}
                info={this.crowdfundingInfo}
              />
            )}

            {this.globalConfigStore.isLargeScreen ? (
              <InvestmentRecords
                class="mb-6"
                ref={(ref: any) => (this.investRecordsRef = ref)}
                buyTokenName={this.buyCoinInfo.symbol}
                sellTokenName={this.sellCoinInfo.symbol}
              />
            ) : null}

            {/* <IBORateHistory /> */}
          </div>

          <div class="flex-1 relative overflow-hidden">
            {this.crowdfundingInfo && (
              <InvestSale
                ref={ref => (this.investRef = ref)}
                class="mb-6"
                startup={this.startupInfo}
                buyCoinInfo={this.buyCoinInfo}
                sellCoinInfo={this.sellCoinInfo}
                info={this.crowdfundingInfo}
                // onRefreshCoin={this.initPage}
                onRefreshData={this.onRefreshData}
              />
            )}

            {this.crowdfundingInfo && (
              <CrowdfundingInfo info={this.crowdfundingInfo} class="<lg:mb-6" />
            )}
            {this.globalConfigStore.isLargeScreen ? null : (
              <InvestmentRecords
                class="mb-6"
                ref={(ref: any) => (this.investRecordsRef = ref)}
                buyTokenName={this.buyCoinInfo.symbol}
                sellTokenName={this.sellCoinInfo.symbol}
              />
            )}
          </div>
        </div>
        {this.isFounder && this.crowdfundingInfo && (
          <EditDialog
            show={this.SettingVisible}
            info={this.crowdfundingInfo}
            onClose={() => (this.SettingVisible = false)}
            onUpdate={() => {
              this.onRefreshData()
              this.SettingVisible = false
            }}
          />
        )}
      </USpin>
    )
  }
})

export default CrowdfundingDetail

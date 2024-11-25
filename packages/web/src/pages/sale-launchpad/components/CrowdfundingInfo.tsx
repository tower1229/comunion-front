import { UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, ref, computed } from 'vue'
import { CoinType } from '../[id]'
import { findRouterByAddress, allNetworks } from '@/constants'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { getChainInfoByChainId } from '@/utils/etherscan'

export const CrowdfundingInfo = defineComponent({
  name: 'CrowdfundingInfo',
  props: {
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'SaleLaunchpad@get-sale-launchpad-info'>>>,
      required: true
    }
  },
  setup(props) {
    const buyCoinInfo = ref<CoinType>({})
    const sellCoinInfo = ref<CoinType>({})

    const tokenContract = useErc20Contract()

    const buyIsMainCoin = computed(() => {
      return props.info.buy_token_contract === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    })

    const getTokenInfo = async (sellTokenContract: string) => {
      const sellRes = await tokenContract(sellTokenContract)
      // const [name, decimal, supply, symbol] = await Promise.all([
      return await Promise.all([
        sellRes.name(),
        sellRes.decimals(),
        sellRes.totalSupply(),
        sellRes.symbol()
      ])
    }

    const getSellTokenInfo = async () => {
      try {
        const [name, decimal, supply, symbol] = await getTokenInfo(
          props.info.presale_token_contract!
        )
        sellCoinInfo.value.name = name
        sellCoinInfo.value.decimal = decimal
        sellCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
        sellCoinInfo.value.symbol = symbol
      } catch (error) {
        sellCoinInfo.value.name = props.info.sell_token_name || '--'
        sellCoinInfo.value.decimal = props.info.sell_token_decimals
        sellCoinInfo.value.supply = props.info.sell_token_supply?.toString() || '--'
        sellCoinInfo.value.symbol = props.info.sell_token_symbol
      }
    }

    const getBuyTokenInfo = async () => {
      if (buyIsMainCoin) {
        buyCoinInfo.value.symbol = getChainInfoByChainId(props.info.chain_id!)?.currencySymbol
      } else {
        try {
          const [name, decimal, supply, symbol] = await getTokenInfo(
            props.info.invest_token_contract!
          )
          buyCoinInfo.value.name = name
          buyCoinInfo.value.decimal = decimal
          buyCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
          buyCoinInfo.value.symbol = symbol
        } catch (error) {
          buyCoinInfo.value.symbol = 'Token'
        }
      }
    }
    const bigNumberUnit = (data: any) => {
      return Number(data).toLocaleString().replace('.00', '')
    }
    const youtubeId = computed(() => {
      if (props.info.youtube) {
        // const { search } = new URL(props.info.youtube)
        // return search.replace('?v=', '')
      }
      return ''
    })

    getBuyTokenInfo()
    getSellTokenInfo()

    const isManualListing = props.info.dex_router === '0x0000000000000000000000000000000000000000'
    const blockchainExplorerUrl = computed(
      () =>
        allNetworks.find(item => {
          return item.chainId === props.info.chain_id
        })?.explorerUrl
    )

    return () => (
      <UCard>
        <div class="mb-4 text-color1 u-h4">{props.info.title}</div>

        {props.info.youtube && (
          <div class="mb-6">
            <iframe
              class="rounded-sm"
              width="100%"
              height="320"
              src={`https://www.youtube.com/embed/${youtubeId.value}`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        )}
        {props.info.detail && (
          <div class="mb-6">
            <div class="mb-1 u-title2">Launchpad detail：</div>
            <a class="text-primary u-h5" target="__blank" href={props.info.detail}>
              {props.info.detail}
            </a>
          </div>
        )}
        <div class="mb-6 u-h6" v-html={props.info.description}></div>
        <div class="grid text-color2 gap-y-6 grid-cols-[260px,1fr] u-h6 <lg:grid-cols-[1fr,1fr]">
          <div class="text-color1">Launchpad Address :</div>
          <div class="text-primary">
            <a
              target="_blank"
              href={`${blockchainExplorerUrl.value}/address/${props.info.contract_address}`}
            >
              {props.info.contract_address}
            </a>
          </div>
          <div class="text-color1">Team Wallet Address :</div>
          <div class="text-primary">
            <a
              target="_blank"
              href={`${blockchainExplorerUrl.value}/address/${props.info.team_wallet}`}
            >
              {props.info.team_wallet}
            </a>
          </div>
          <div class="text-color1">Token Contract :</div>
          <div class="text-primary">
            <a
              target="_blank"
              href={`${blockchainExplorerUrl.value}/address/${props.info.presale_token_contract}`}
            >
              {props.info.presale_token_contract}
            </a>
          </div>
          <div class="text-color1">Token Name :</div>
          <div>{sellCoinInfo.value.name}</div>
          <div class="text-color1">Token Symbol :</div>
          <div>{sellCoinInfo.value.symbol}</div>
          <div class="text-color1">Token Decimals :</div>
          <div>{sellCoinInfo.value.decimal}</div>
          <div class="text-color1">Total Supply :</div>
          <div>
            {bigNumberUnit(sellCoinInfo.value.supply)} {sellCoinInfo.value.symbol}
          </div>

          <div class="text-color1">Soft Cap :</div>
          <div>{props.info.soft_cap}</div>
          <div class="text-color1">Hard Cap :</div>
          <div>{props.info.hard_cap}</div>

          <div class="text-color1">Token For Launchpad :</div>
          <div>
            {bigNumberUnit(+props.info.hard_cap! * +props.info.presale_price!)}{' '}
            {sellCoinInfo.value.symbol}
          </div>
          <div class="text-color1">Rate :</div>
          <div>
            1 {buyCoinInfo.value.symbol} = {bigNumberUnit(props.info.presale_price)}{' '}
            {sellCoinInfo.value.symbol}
          </div>
          <div class="text-color1">Liquidity :</div>
          <div>{props.info.liquidity_rate! * 100} %</div>

          <div class="text-color1">Minimum Buy :</div>
          <div>{props.info.min_invest_amount}</div>

          <div class="text-color1">Maximum Buy :</div>
          <div>{props.info.max_invest_amount}</div>

          <div class="text-color1">Start Time :</div>
          <div>{dayjs.utc(+(props.info.started_at || 0) * 1000).format('YYYY-MM-DD HH:mm')}</div>
          <div class="text-color1">End Time :</div>
          <div>{dayjs.utc(+(props.info.ended_at || 0) * 1000).format('YYYY-MM-DD HH:mm')}</div>
          <div class="text-color1">Listing Option :</div>
          <div>{isManualListing ? 'Manual Listing' : 'Auto Listing'}</div>
          {!isManualListing && (
            <>
              <div class="text-color1">Router :</div>
              <div>{findRouterByAddress(props.info.dex_router!)?.dex}</div>
              <div class="text-color1">Listing Rate :</div>
              <div>
                {`1 ${buyCoinInfo.value.symbol} = ${props.info.dex_init_price} ${sellCoinInfo.value.symbol}`}
              </div>
            </>
          )}

          {+props.info.first_release! !== 1 && (
            <>
              <div class="text-color1">First release for presale (%): </div>
              <div>{+props.info.first_release! * 100}</div>
              <div class="text-color1">Vesting period each cycle (days): </div>
              <div>{props.info.cycle! / 60 / 60 / 24}</div>
              <div class="text-color1">Presale token release each cycle (%) </div>
              <div>{+props.info.cycle_release! * 100}</div>
            </>
          )}
        </div>
      </UCard>
    )
  }
})

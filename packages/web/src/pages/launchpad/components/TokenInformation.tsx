import { UCard, UAddress } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { CoinType } from '../[id]'
import { allNetworks } from '@/constants'
import { ServiceReturn } from '@/services'
import './TokenInformation.css'

export const TokenInformation = defineComponent({
  name: 'TokenInformation',
  props: {
    sellCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    },
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'Crowdfunding@get-crowdfunding-info'>>>,
      required: true
    }
  },
  setup(props, ctx) {
    const blockchainExplorerUrl = computed(
      () =>
        allNetworks.find(item => {
          return item.chainId === props.info.chain_id
        })?.explorerUrl
    )

    return {
      blockchainExplorerUrl
    }
  },
  render() {
    const bigNumberUnit = (data: any) => {
      return Number(data).toLocaleString().replace('.00', '')
    }

    return (
      <UCard title="Token Information">
        <div class="token-info-item">
          <span class="token-info-item-label">Totally Supply：</span>
          <span class="text-color2  truncate">
            {this.sellCoinInfo.supply ? bigNumberUnit(this.sellCoinInfo.supply) : '--'}
            {this.sellCoinInfo.symbol}
          </span>
        </div>
        <div class="token-info-item">
          <span class="token-info-item-label">Token Name：</span>
          <span class="text-color2  truncate">{this.sellCoinInfo.name || '--'}</span>
        </div>
        <div class="token-info-item">
          <span class="token-info-item-label">Token Symbol：</span>
          <span class="text-color2  truncate">{this.sellCoinInfo.symbol || '--'}</span>
        </div>
        <div class="mb-0 token-info-item">
          <div class="token-info-item-label">Token Contract：</div>
          <UAddress
            class="token-info-item-address"
            address={this.info.sell_token_contract || '--'}
            autoSlice={true}
            blockchainExplorerUrl={`${this.blockchainExplorerUrl}/address/`}
          />
        </div>
      </UCard>
    )
  }
})

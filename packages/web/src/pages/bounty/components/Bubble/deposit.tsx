import { format } from 'timeago.js'
import { defineComponent, PropType, computed } from 'vue'
import Bubble from './core'
import { BountyDepositRecord } from '@/types'

export default defineComponent({
  props: {
    depositInfo: {
      type: Object as PropType<BountyDepositRecord>,
      required: true
    },
    tokenSymbol: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const depositFn = computed(() => {
      let operator = '+'
      const tokenName = props.tokenSymbol || '--'
      const amount = String(props.depositInfo?.amount || 0)

      if (props.depositInfo?.mode === 2) {
        operator = '-'
      }
      return () => (
        <div
          class={`flex font-medium ${
            props.depositInfo?.mode === 1 ? 'text-success' : 'text-warning'
          } items-center`}
        >
          {`${operator}${
            amount.split('.')[1] && amount.split('.')[1].length > 4
              ? amount.split('.')[0] + '.' + amount.split('.')[1].substring(0, 4) + '...'
              : amount
          }${tokenName}`}
        </div>
      )
    })

    return { depositFn }
  },
  render() {
    return (
      <Bubble
        avatar={this.depositInfo.comer?.avatar}
        comerId={this.depositInfo.comer?.id}
        v-slots={{
          default: () => (
            <div class="flex flex-1 items-center">
              <div class="flex-1 mx-4 overflow-hidden">
                <p class=" mb-2 truncate u-h4">{this.depositInfo.comer?.name}</p>
                <p class="text-grey3 u-num2 !font-400">
                  {format(Number(this.depositInfo.created_at), 'comunionTimeAgo')}
                </p>
              </div>
              {this.depositFn()}
            </div>
          )
        }}
      />
    )
  }
})

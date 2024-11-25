import { UCard } from '@comunion/components'
import { UrlOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { ServiceReturn } from '@/services'

export const StrategyInformation = defineComponent({
  name: 'StrategyInformation',
  props: {
    proposalInfo: {
      type: Object as PropType<ServiceReturn<'Proposal@get-proposal-info'>>,
      required: true
    },
    blockExploreUrl: {
      type: String
    }
  },
  emits: ['showStrategyDetail'],
  setup(props) {
    const strategy = computed(() => {
      return props.proposalInfo?.startup?.governance_setting?.strategies
    })

    return {
      strategy
    }
  },
  render() {
    return (
      <UCard title="Information">
        <div class="grid gap-y-4 grid-cols-2 justify-between u-h5">
          <div class="text-color1">Strategie(s) :</div>
          <div
            class={['text-right u-h6 text-color3 hover:text-primary cursor-pointer']}
            onClick={() => this.$emit('showStrategyDetail')}
          >
            {this.strategy?.strategy_name}
          </div>
          <div class="text-color1">Voting system :</div>
          <div class="text-right text-color3 u-h6">{this.proposalInfo?.vote_system}</div>
          <div class="text-color1">Start date :</div>
          <div class="text-right text-color3 u-h6">
            {dayjs(+this.proposalInfo!.start_time!)
              .utc()
              .format()}
          </div>
          <div class="text-color1">End date :</div>
          <div class="text-right text-color3 u-h6">
            {dayjs(+this.proposalInfo!.end_time!)
              .utc()
              .format()}
          </div>
          <div class="text-color1">Block height :</div>
          <div class="flex text-color3 justify-end items-center u-h6">
            {this.proposalInfo?.block_number?.toLocaleString()}
            {this.blockExploreUrl && (
              <a
                href={`${this.blockExploreUrl}/block/${this.proposalInfo?.block_number}`}
                target="__blank"
                class="ml-2 leading-4"
              >
                <UrlOutlined class="text-primary" />
              </a>
            )}
          </div>
        </div>
      </UCard>
    )
  }
})

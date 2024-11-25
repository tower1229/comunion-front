import { UCard, UProgress } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { ServiceReturn } from '@/services'

export const CurrentResult = defineComponent({
  name: 'CurrentResult',
  props: {
    proposalInfo: {
      type: Object as PropType<NonNullable<ServiceReturn<'Proposal@get-proposal-info'>>>,
      required: true
    },
    voteSymbol: {
      type: String,
      required: true
    }
  },
  render() {
    const votes = computed(() => {
      let num = 0
      this.proposalInfo.choices?.forEach(item => {
        num += Number(item.vote_total || 0)
      })
      return num
    })
    return (
      <UCard title="Current results">
        {(this.proposalInfo.choices || []).map((choiceOption: any) => (
          <div>
            <div class="flex mb-2 justify-between u-h6">
              <span>{choiceOption.item_name}</span>
              <span class="text-color3">
                {choiceOption.vote_total}
                <span class="mx-2">{this.voteSymbol}</span>{' '}
                {((Number(choiceOption.vote_total) / votes.value || 0) * 100).toFixed(2)}%
              </span>
            </div>
            <UProgress
              color="#5331F4"
              showIndicator={false}
              percentage={(Number(choiceOption.vote_total) / votes.value || 0) * 100}
              height={8}
              class="mb-4"
            />
          </div>
        ))}
      </UCard>
    )
  }
})

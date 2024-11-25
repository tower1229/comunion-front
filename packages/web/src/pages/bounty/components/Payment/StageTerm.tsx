import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, PropType, computed, ref, inject, ComputedRef } from 'vue'
import { PayDailog } from '../Dialog'
import PayedMask from './PayedMask'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { BountyPaymentTerms, BountyInfo } from '@/types'
import { textToHtml } from '@/utils/format'

export default defineComponent({
  name: 'StageTerm',
  props: {
    item: {
      type: Object as PropType<BountyPaymentTerms>
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  emits: ['pay'],
  setup(props) {
    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    const visible = ref<boolean>(false)
    const flagStr = computed(() => {
      if (props.item?.sort_index) {
        if (props.item.sort_index > 3) {
          return `${props.item.sort_index}th`
        } else if (props.item.sort_index === 3) {
          return '3rd'
        } else if (props.item.sort_index === 2) {
          return '2nd'
        } else if (props.item.sort_index === 1) {
          return '1st'
        }
      }
      return 'err'
    })

    const payBtnAbled = computed(() => {
      return (bountyDetail?.value.status || 0) === BOUNTY_STATUS.WORKSTARTED
    })

    const tooltip = computed(() => {
      if (!payBtnAbled.value) {
        if ((bountyDetail?.value.status || 0) >= BOUNTY_STATUS.COMPLETED) {
          return 'The pay button is unavailable when the bounty completed'
        } else {
          return 'The pay button will be actived after the applicant is approvied.'
        }
      }
      return null
    })

    return {
      flagStr,
      visible,
      bountyDetail,
      payBtnAbled,
      tooltip
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }

    return (
      <>
        <PayDailog
          detailChainId={this.detailChainId}
          onTriggerDialog={triggerDialog}
          visible={this.visible}
          paymentInfo={this.item}
        />

        <div class="border rounded-sm bg-[#F5F6FA] border-[#D5CFF4] mb-6 py-6 px-16 relative">
          {this.item?.status === 1 && <PayedMask />}

          <span class="rounded-br-md bg-[#D5CFF4] text-primary py-1 px-4 top-[-1px] left-[-1px] absolute u-h4">
            {this.flagStr}
          </span>

          <div class="flex items-center">
            <p class="flex-1 text-primary">
              <span class="u-h2">{this.item?.token1_amount || 0}</span>
              <span class="ml-2 u-h6">{this.item?.token1_symbol}</span>
              {this.item?.token2_amount && this.item?.token2_amount > 0 && (
                <span>
                  <span class="font-sans mx-2 text-24px">+</span>
                  <span class="u-h2">{this.item?.token2_amount}</span>
                  <span class="ml-2 u-h6">{this.item?.token2_symbol}</span>
                </span>
              )}
            </p>

            {this.bountyDetail?.my_role === USER_ROLE.FOUNDER &&
              (this.payBtnAbled ? (
                <UButton
                  class={`h-9 w-30  font-semibold  -mr-8 px-8 text-primary border-1 border-[#5331F4] border-solid rounded-sm !hover:text-primary`}
                  type="default"
                  size="small"
                  onClick={triggerDialog}
                >
                  Pay
                </UButton>
              ) : (
                <UTooltip>
                  {{
                    trigger: () => (
                      <div>
                        <UButton
                          disabled
                          class={`h-9 w-30  font-semibold  -mr-8 px-8 text-[#FFFFFF]`}
                          color={'rgba(0,0,0,0.1)'}
                          type="default"
                          size="small"
                        >
                          Pay
                        </UButton>
                      </div>
                    ),
                    default: () => this.tooltip
                  }}
                </UTooltip>
              ))}
          </div>

          <div class=" mt-4 text-thin text-color2" v-html={textToHtml(this.item?.terms)}></div>
        </div>
      </>
    )
  }
})

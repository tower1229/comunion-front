import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, PropType, computed, inject, ComputedRef } from 'vue'
import PayedMask from '../Payment/PayedMask'
import Text from '../Text'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { BountyInfo } from '@/types'

export { default as ProjectCardWithDialog } from './WapperWithDialog'

export type BountyProjectCardType = {
  sort_index?: number
  status?: number
  token1_symbol?: string
  token2_symbol?: string
  token1_amount?: number
  token2_amount?: number
  terms?: string
}

export const ProjectCard = defineComponent({
  name: 'ProjectCard',
  props: {
    info: {
      type: Object as PropType<BountyProjectCardType>
    }
  },
  emits: ['pay'],
  setup(props) {
    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    const index = computed(() => {
      if (props.info?.sort_index) {
        if (props.info.sort_index > 3) {
          return `${props.info.sort_index}TH`
        } else if (props.info.sort_index === 3) {
          return '3RD'
        } else if (props.info.sort_index === 2) {
          return '2ND'
        } else if (props.info.sort_index === 1) {
          return '1ST'
        }
      }
      return 'err'
    })

    const wrapperClass = computed(() => {
      const str =
        'flex flex-col relative items-center w-63 bg-purple border-purple border-1 border-solid rounded-8px mt-10px ml-2 mr-6'

      return `${str} h-57`
    })

    const payBtnAbled = computed(() => {
      return (bountyDetail?.value.status || 0) >= BOUNTY_STATUS.WORKSTARTED
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
      index,
      payBtnAbled,
      wrapperClass,
      bountyDetail,
      tooltip
    }
  },
  render() {
    const handlePay = () => {
      this.$emit('pay', this.info)
    }
    return (
      <div class="bg-purple border-purple border-solid rounded-sm border-1 mt-2 relative">
        <div class="bg-purple-light rounded-br-md flex h-7 text-primary w-11.5 z-1 absolute justify-center items-center u-h5 ">
          {this.index}
        </div>

        <div class="rounded-sm flex flex-col h-full w-full items-center relative overflow-hidden">
          {this.info?.status === 1 && <PayedMask />}
          <div class="flex flex-1 items-end">
            <div>
              {this.info?.token1_symbol && (
                <Text
                  class="my-8 w-full"
                  half={true}
                  unit={this.info.token1_symbol}
                  value={`${this.info.token1_amount || 0}`}
                  enhance={36}
                  digit={3}
                  unitClass="text-color1"
                />
              )}
              {this.info?.token2_amount && this.info.token2_amount > 0 && (
                <Text
                  class="-mt-5 mb-8 w-full"
                  half={true}
                  unit={this.info.token2_symbol}
                  value={`${this.info.token2_amount}`}
                  plus={true}
                  enhance={36}
                  digit={3}
                  unitClass="text-color1"
                />
              )}
              {/* {this.info?.terms && (
                <div class="my-6 max-w-4/5 overflow-hidden" style={{ maxHeight: `${90}px` }}>
                  <div class=" text-primary2" v-html={this.info.terms}></div>
                </div>
              )} */}
              {this.bountyDetail?.my_role === USER_ROLE.FOUNDER && (
                <div class="flex my-8 ">
                  {!this.payBtnAbled ? (
                    <UTooltip
                      trigger="hover"
                      placement="top"
                      v-slots={{
                        trigger: () => (
                          <div class="w-full">
                            <UButton
                              secondary={!this.payBtnAbled}
                              disabled
                              class="bg-white flex-1 w-full"
                              type="default"
                              size="small"
                              onClick={handlePay}
                            >
                              Pay
                            </UButton>
                          </div>
                        ),
                        default: () => this.tooltip
                      }}
                    />
                  ) : (
                    <UButton
                      secondary={!this.payBtnAbled}
                      disabled={!this.payBtnAbled}
                      class="bg-white flex-1"
                      type="default"
                      size="small"
                      onClick={handlePay}
                    >
                      Pay
                    </UButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

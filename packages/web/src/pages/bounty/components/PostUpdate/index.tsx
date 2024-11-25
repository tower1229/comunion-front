import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed, PropType } from 'vue'
import { PostUpdateDialog } from '../Dialog'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { BountyInfo } from '@/types'

export default defineComponent({
  name: 'PostUpdate',
  props: {
    disabled: {
      type: Boolean,
      require: true,
      default: () => false
    },
    gapValue: {
      type: Number,
      required: true,
      default: 0
    },
    bountyContractInfo: {
      type: Object
    },
    postUpdate: {
      type: Function,
      require: true,
      default: () => false
    },
    bountyDetail: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  emits: ['updateStatus'],
  setup(props, ctx) {
    const visible = ref<boolean>(false)

    const disabled = computed(() => {
      if (props.bountyDetail.my_role === USER_ROLE.FOUNDER) {
        return props.bountyDetail.status > BOUNTY_STATUS.WORKSTARTED
      } else if (props.bountyDetail.my_role === USER_ROLE.APPLICANT) {
        return props.bountyDetail.status !== BOUNTY_STATUS.WORKSTARTED
      }
      return true
    })

    const tooltip = computed(() => {
      if (disabled.value) {
        if (props.bountyDetail.status >= BOUNTY_STATUS.COMPLETED) {
          return 'The update button is unavailable when the bounty completed'
        } else {
          return 'The update button can only be available to be approved applicant.'
        }
      }
      return null
    })

    return {
      visible,
      disabled,
      tooltip
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <div class="<lg:flex <lg:justify-end">
        <PostUpdateDialog
          gapValue={this.gapValue}
          postUpdate={this.postUpdate}
          visible={this.visible}
          bountyDetail={this.bountyDetail}
          onTriggerDialog={flag => {
            triggerDialog()
            this.$emit('updateStatus', flag)
          }}
        />
        {this.tooltip ? (
          // <UButton
          //   type="primary"
          //   size="small"
          //   class="w-35"
          //   onClick={triggerDialog}
          //   disabled={this.disabled}
          //   color={this.disabled ? 'rgba(0,0,0,0.1)' : ''}
          // >
          //   Post update
          // </UButton>
          <UTooltip
            trigger="hover"
            placement="top"
            v-slots={{
              trigger: () => (
                <div>
                  <UButton
                    type="primary"
                    size="small"
                    class="w-35"
                    disabled={this.disabled}
                    color={'rgba(0,0,0,0.1)'}
                  >
                    Post update
                  </UButton>
                </div>
              ),
              default: () => this.tooltip
            }}
          />
        ) : (
          <UButton
            type="primary"
            size="small"
            class="w-35"
            onClick={triggerDialog}
            disabled={this.disabled}
            color={this.disabled ? 'rgba(0,0,0,0.1)' : ''}
          >
            Post update
          </UButton>
        )}
      </div>
    )
  }
})

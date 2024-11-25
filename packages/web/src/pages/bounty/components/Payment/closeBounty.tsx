import { UButton } from '@comunion/components'
import { useDialog } from 'naive-ui'
import { defineComponent, ref, computed, PropType, inject, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { services } from '@/services'
import { BountyInfo } from '@/types'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    },
    bountyDetail: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  setup(props) {
    const dialog = useDialog()
    const route = useRoute()
    const visibleFailCloseBounty = ref<boolean>(false)
    const visibleConfirmCloseBounty = ref<boolean>(false)
    const refreshData = inject<ComputedRef<() => void>>('refreshData')

    const disabled = computed(() => {
      return props.bountyDetail.status === BOUNTY_STATUS.COMPLETED
    })

    const closeDesc = computed(() => {
      if (props.bountyDetail.status === BOUNTY_STATUS.COMPLETED) {
        return 'Completed'
      } else {
        return 'Close bounty'
      }
    })
    return {
      visibleFailCloseBounty,
      visibleConfirmCloseBounty,
      disabled,
      closeDesc,
      route,
      dialog,
      refreshData
    }
  },
  render() {
    const closeBounty = async () => {
      const founderDepositAmount = this.bountyDetail.founder_deposit
      const applicantDepositAmount = this.bountyDetail.applicant_deposit

      if (Number(founderDepositAmount) === 0 && Number(applicantDepositAmount) === 0) {
        this.visibleConfirmCloseBounty = true
      } else {
        this.visibleFailCloseBounty = true
      }
    }

    const closeFailDialog = () => {
      this.visibleFailCloseBounty = false
    }

    const closeConfirmDialog = () => {
      this.visibleConfirmCloseBounty = false
    }

    const closeBountySubmit = async () => {
      const { error } = await services['Bounty@close-bounty']({
        bounty_id: this.bountyDetail.id
      })
      if (error) {
        console.warn('bounty close fail by error', error)
      }
      closeConfirmDialog()
      this.refreshData && this.refreshData()
    }

    return (
      <>
        <BasicDialog
          visible={this.visibleFailCloseBounty}
          title="Failed to close bounty"
          content="The bounty cannot be closed until you release all deposits."
          onTriggerDialog={closeFailDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton type="primary" class="w-164px" size="small" onClick={closeFailDialog}>
                  OK
                </UButton>
              </div>
            )
          }}
        />

        <BasicDialog
          visible={this.visibleConfirmCloseBounty}
          title="Close the bounty?"
          content="The bounty will be closed once you click 'Yes'."
          onTriggerDialog={closeConfirmDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 gap-2 justify-end">
                <UButton class="w-164px" size="small" onClick={closeConfirmDialog}>
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={closeBountySubmit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />

        <UButton
          ghost
          class={`${this.$attrs.class}`}
          disabled={this.disabled}
          onClick={closeBounty}
          size="small"
        >
          {this.closeDesc}
        </UButton>
      </>
    )
  }
})

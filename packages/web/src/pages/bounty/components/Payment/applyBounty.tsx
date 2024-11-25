import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed, inject, ComputedRef } from 'vue'
import { ApplyDialog } from '../Dialog'
import { APPLICANT_STATUS, BOUNTY_STATUS } from '@/constants'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  name: 'applyBounty',
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    detailChainId: {
      type: Number,
      default: () => 0
    },
    applicantDepositMinAmount: {
      type: Number,
      default: () => 0
    },
    applicantApplyStatus: {
      type: Number,
      required: true
    },
    bountyExpired: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const applyBountyDialogVisible = ref<boolean>(false)

    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    const ApplicantApplyDesc = computed(() => {
      if (bountyDetail?.value.status === BOUNTY_STATUS.COMPLETED) {
        return 'Completed'
      }
      switch (true) {
        case props.applicantApplyStatus === APPLICANT_STATUS.APPLIED:
          return 'Awaiting approval'

        case props.applicantApplyStatus === APPLICANT_STATUS.APPROVED:
          return 'Started working'
        default:
          return 'Apply'
      }
    })
    return {
      applyBountyDialogVisible,
      ApplicantApplyDesc
    }
  },
  render() {
    const applyBounty = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (isSupport) {
        this.applyBountyDialogVisible = !this.applyBountyDialogVisible
      }
    }
    return (
      <>
        <ApplyDialog
          title="Apply"
          detailChainId={this.detailChainId}
          visible={this.applyBountyDialogVisible}
          onTriggerDialog={applyBounty}
          deposit={this.applicantDepositMinAmount}
        />
        {this.disabled && this.ApplicantApplyDesc === 'Apply' ? (
          <UTooltip
            trigger="hover"
            placement="top"
            v-slots={{
              trigger: () => (
                <div class="w-[100%]">
                  <UButton
                    type="primary"
                    class={`${this.disabled && 'text-white w-[100%]'} ${this.$attrs.class}`}
                    disabled
                  >
                    {this.ApplicantApplyDesc}
                  </UButton>
                </div>
              ),
              default: () =>
                this.bountyExpired
                  ? 'This expired bounty cannot be applied for.'
                  : 'This bounty has been won by another applicant.'
            }}
          />
        ) : (
          <UButton
            type="primary"
            class={`${this.disabled && 'text-white'} ${this.$attrs.class}`}
            onClick={applyBounty}
            disabled={this.disabled}
          >
            {this.ApplicantApplyDesc}
          </UButton>
        )}
        {/* <UButton
          type="primary"
          class={`${this.disabled && 'text-white'} ${this.$attrs.class}`}
          onClick={applyBounty}
          disabled={this.disabled}
        >
          {this.ApplicantApplyDesc}
        </UButton> */}
      </>
    )
  }
})

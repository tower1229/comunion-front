import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed, PropType } from 'vue'
import { useRoute } from 'vue-router'
import {
  BountyContractReturnType,
  useBountyContractWrapper
} from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { useWalletStore, useUserStore } from '@/stores'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

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
    const route = useRoute()
    const visible = ref<boolean>(false)
    const walletConnectd = useWalletStore().connected
    const userStore = useUserStore()
    const dontContract = computed(() => {
      return (
        props.bountyDetail.founder_deposit === 0 &&
        props.bountyDetail.my_deposit === 0 &&
        props.bountyDetail.status === 0
      )
    })

    const disabled = computed(() => {
      return (
        !!props.bountyDetail.is_lock ||
        props.bountyDetail.status >= BOUNTY_STATUS.COMPLETED ||
        props.bountyDetail.status === BOUNTY_STATUS.COMPLETED ||
        dontContract.value ||
        (props.bountyDetail.founder_deposit == 0 && props.bountyDetail.applicant_deposit == 0)
      )
    })
    const disabledText = computed(() => {
      if (props.bountyDetail.founder_deposit == 0 && props.bountyDetail.applicant_deposit == 0) {
        return 'Not any deposit is in the contract.'
      }
      return null
    })
    return {
      visible,
      disabled,
      route,
      disabledText,
      walletConnectd,
      userStore
    }
  },
  render() {
    const triggerDialog = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.visible = !this.visible
    }
    const handleReleaseDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      if (!this.walletConnectd) {
        return this.userStore.logout()
      }
      const { bountyContract } = await useBountyContractWrapper(this.bountyDetail)

      const response = (await bountyContract.release(
        'The deposits are releasing.',
        'Successfully release.'
      )) as unknown as BountyContractReturnType

      triggerDialog()
      if (!response) {
        console.warn('handleReleaseDeposit error')
      }
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release the deposit?"
          content="All deposits will be released at once you click 'Yes'."
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton
                  type="default"
                  class="mr-16px w-164px"
                  size="small"
                  onClick={triggerDialog}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={handleReleaseDeposit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        {this.disabledText ? (
          <UTooltip>
            {{
              trigger: () => (
                <div class={`${this.$attrs.class}`}>
                  <UButton
                    class={`${this.$attrs.class} w-full`}
                    type="primary"
                    disabled={true}
                    size="small"
                  >
                    Release
                  </UButton>
                </div>
              ),
              default: () => this.disabledText
            }}
          </UTooltip>
        ) : (
          <UButton
            class={`${this.$attrs.class}`}
            type="primary"
            disabled={this.disabled}
            onClick={triggerDialog}
            size="small"
          >
            Release
          </UButton>
        )}
      </>
    )
  }
})

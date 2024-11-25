import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { AddDepositDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    },
    bountyDetail: {
      type: Object,
      required: true,
      default: () => null
    }
  },
  setup(props) {
    const visible = ref<boolean>(false)
    const bountyInfo = computed(() => {
      return props.bountyDetail
    })

    const dontContract = computed<boolean>(() => {
      return (
        bountyInfo.value.founder_deposit === 0 &&
        bountyInfo.value.my_deposit === 0 &&
        bountyInfo.value.status === 0
      )
    })

    const disabled = computed(() => {
      return bountyInfo.value.status !== BOUNTY_STATUS.READYTOWORK || dontContract.value
    })

    const disableMessage = ref('The deposit is locked and cannot be increased')

    return {
      visible,
      disabled,
      disableMessage
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
    return (
      <>
        <AddDepositDialog
          detailChainId={this.detailChainId}
          visible={this.visible}
          onTriggerDialog={triggerDialog}
        />
        {this.disabled ? (
          <UTooltip
            trigger="hover"
            placement="top"
            v-slots={{
              trigger: () => (
                <div class="flex-1">
                  <UButton class={`w-full ${this.$attrs.class}`} ghost disabled size="small">
                    + Deposit
                  </UButton>
                </div>
              ),
              default: () => this.disableMessage
            }}
          />
        ) : (
          <UButton class={`${this.$attrs.class}`} ghost onClick={triggerDialog} size="small">
            + Deposit
          </UButton>
        )}
      </>
    )
  }
})

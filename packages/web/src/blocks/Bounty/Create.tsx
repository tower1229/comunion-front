import { message, UButton, UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateBountyForm from './CreateForm'
import { CreateBountyFormRef } from './typing.d'
import { useWalletStore } from '@/stores'

export type CreateBountyRef = {
  show: () => void
  close: () => void
  createBountyFormRef: any
}

const CreateBountyBlock = defineComponent({
  name: 'CreateBountyBlock',
  setup() {
    const createBountyFormRef = ref<CreateBountyFormRef>()
    const visible = ref(false)
    const walletStore = useWalletStore()

    const show = async () => {
      await walletStore.ensureWalletConnected()
      if (!walletStore.isNetworkSupported) {
        message.warning('Please switch to the supported network to create a bounty')
        // not supported network, try to switch
        walletStore.openNetworkSwitcher()
      } else {
        visible.value = true
      }
    }

    const close = () => {
      visible.value = false
    }

    const closeBounty = () => {
      createBountyFormRef.value?.showLeaveTipModal?.()
    }

    const footer = () => {
      return (
        <div class="bg-purple text-right pr-16 pb-4">
          {createBountyFormRef.value?.bountyInfo?.current === 1 && (
            <UButton class="mr-4 w-40" type="primary" ghost onClick={closeBounty}>
              Cancel
            </UButton>
          )}
          {(createBountyFormRef.value?.bountyInfo?.current as number) > 1 && (
            <UButton
              class="mr-4 w-40"
              type="primary"
              ghost
              onClick={createBountyFormRef.value?.toPreviousStep}
            >
              Previous Step
            </UButton>
          )}
          {(createBountyFormRef.value?.bountyInfo?.current as number) < 3 && (
            <UButton type="primary" class="w-40" onClick={createBountyFormRef.value?.toNext}>
              Next
            </UButton>
          )}
          {createBountyFormRef.value?.bountyInfo?.current === 3 && (
            <UButton
              type="primary"
              class="w-40"
              disabled={!createBountyFormRef.value?.bountyInfo.agreement}
              onClick={createBountyFormRef.value?.onSubmit}
            >
              Submit
            </UButton>
          )}
        </div>
      )
    }

    return { show, close, visible, footer, createBountyFormRef }
  },
  render() {
    return (
      <UDrawer
        style={{}}
        title="Create Bounty"
        maskClosable={false}
        v-model:show={this.visible}
        v-slots={{
          whiteBoard: this.footer
        }}
      >
        {this.visible && (
          <CreateBountyForm
            ref={(ref: any) => (this.createBountyFormRef = ref)}
            onCancel={this.close}
          />
        )}
      </UDrawer>
    )
  }
})

export default CreateBountyBlock

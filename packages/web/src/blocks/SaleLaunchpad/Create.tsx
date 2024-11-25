import { message, UButton, UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateCrowdfundingForm from './CreateForm'
import { CrowdfundingFormRef } from './typing.d'
import { useWalletStore } from '@/stores'

export type CreateSaleLaunchRef = {
  show: () => void
  close: () => void
}

export default defineComponent({
  name: 'CreateSaleLaunchBlock',
  setup() {
    const createCrowdfundingFormRef = ref<CrowdfundingFormRef>()
    const visible = ref(false)
    const walletStore = useWalletStore()

    const show = async () => {
      await walletStore.ensureWalletConnected()
      if (!walletStore.isNetworkSupported) {
        message.warning('Please switch to the supported network to create a Dcrowdfunding')
        // not supported network, try to switch
        walletStore.openNetworkSwitcher()
      } else {
        visible.value = true
      }
    }

    const close = () => {
      visible.value = false
    }

    const closeCrowdfunding = () => {
      createCrowdfundingFormRef.value?.showLeaveTipModal?.()
    }

    const stepOptions = [
      { name: 'Verify Token' },
      { name: 'The Launchpad Information ' },
      { name: 'Add Additional Information ' },
      { name: 'Review Your Information' }
    ]

    const footer = () => {
      return (
        <div class="bg-purple text-right pr-16 pb-4">
          {createCrowdfundingFormRef.value?.crowdfundingInfo?.current === 1 && (
            <UButton class="mr-4 w-40" type="primary" ghost onClick={closeCrowdfunding}>
              Cancel
            </UButton>
          )}
          {(createCrowdfundingFormRef.value?.crowdfundingInfo?.current as number) > 1 && (
            <UButton
              class="mr-4 w-40"
              type="primary"
              ghost
              onClick={createCrowdfundingFormRef.value?.toPreviousStep}
            >
              Previous Step
            </UButton>
          )}
          {(createCrowdfundingFormRef.value?.crowdfundingInfo?.current as number) <
            stepOptions.length && (
            <UButton type="primary" class="w-40" onClick={createCrowdfundingFormRef.value?.toNext}>
              Next
            </UButton>
          )}
          {createCrowdfundingFormRef.value?.crowdfundingInfo?.current === stepOptions.length && (
            <UButton
              type="primary"
              class="w-40"
              onClick={createCrowdfundingFormRef.value?.onSubmit}
            >
              Submit
            </UButton>
          )}
        </div>
      )
    }

    return { show, close, visible, footer, createCrowdfundingFormRef, stepOptions }
  },
  render() {
    return (
      <UDrawer
        title="Create Launchpad"
        maskClosable={false}
        v-model:show={this.visible}
        v-slots={{
          whiteBoard: this.footer
        }}
      >
        {this.visible && (
          <CreateCrowdfundingForm
            ref={(ref: any) => (this.createCrowdfundingFormRef = ref)}
            stepOptions={this.stepOptions}
            onCancel={this.close}
          />
        )}
      </UDrawer>
    )
  }
})

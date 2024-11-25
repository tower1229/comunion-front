import { message, UButton, UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateProposalForm from './CreateForm'
import { CreateProposalFormRef, ProposalInfo } from './typing.d'
import { useWalletStore } from '@/stores'

export type CreateProposalRef = {
  show: (proposalInfo?: ProposalInfo) => void
  close: () => void
  createCreateProposalInfo: any
}

const CreateProposalBlock = defineComponent({
  name: 'CreateProposalBlock',
  setup() {
    const createCreateProposalInfo = ref<CreateProposalFormRef>()
    const visible = ref(false)
    const walletStore = useWalletStore()
    const defaultProposalInfo = ref()

    const show = async (proposalInfo?: ProposalInfo) => {
      defaultProposalInfo.value = proposalInfo
      await walletStore.ensureWalletConnected()
      if (!walletStore.isNetworkSupported) {
        message.warning('Please switch to the supported network to create a proposal')
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
      createCreateProposalInfo.value?.showLeaveTipModal?.()
    }

    const stepOptions = [{ name: '' }, { name: '' }]

    const footer = () => {
      return (
        <div class="bg-purple flex pr-16 pb-4 justify-end items-center">
          {createCreateProposalInfo.value?.proposalInfo.current === 1 && (
            <UButton class="mr-4 w-40" type="primary" ghost onClick={closeCrowdfunding}>
              Cancel
            </UButton>
          )}
          {(createCreateProposalInfo.value?.proposalInfo.current as number) > 1 && (
            <UButton
              class="mr-4 w-40"
              type="primary"
              ghost
              onClick={createCreateProposalInfo.value?.toPreviousStep}
            >
              Previous Step
            </UButton>
          )}
          {(createCreateProposalInfo.value?.proposalInfo.current as number) <
            stepOptions.length && (
            <UButton type="primary" class="w-40" onClick={createCreateProposalInfo.value?.toNext}>
              Next
            </UButton>
          )}
          {createCreateProposalInfo.value?.proposalInfo.current === stepOptions.length && (
            <UButton
              type="primary"
              class="w-40"
              onClick={createCreateProposalInfo.value?.onSubmit}
              disabled={!createCreateProposalInfo.value?.proposalInfo.vote_choices?.[0].value}
              loading={createCreateProposalInfo.value?.submitLoading}
            >
              Submit
            </UButton>
          )}
        </div>
      )
    }

    return {
      show,
      close,
      visible,
      footer,
      createCreateProposalInfo,
      stepOptions,
      defaultProposalInfo
    }
  },
  render() {
    return (
      <UDrawer
        title="Create Proposal"
        maskClosable={false}
        v-model:show={this.visible}
        v-slots={{
          whiteBoard: this.footer
        }}
      >
        {this.visible && (
          <CreateProposalForm
            ref={(ref: any) => (this.createCreateProposalInfo = ref)}
            stepOptions={this.stepOptions}
            defaultProposalInfo={this.defaultProposalInfo}
            onCancel={this.close}
          />
        )}
      </UDrawer>
    )
  }
})

export default CreateProposalBlock

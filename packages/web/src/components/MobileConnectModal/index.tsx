import { UButton, UModal, UCard } from '@comunion/components'
import { defineComponent, watch } from 'vue'
import { useUserStore, useWalletStore, useGlobalConfigStore } from '@/stores'

export default defineComponent({
  name: 'MobileConnectModal',
  setup(props) {
    const globalConfigStore = useGlobalConfigStore()
    const walletStore = useWalletStore()
    const userStore = useUserStore()

    watch(
      () => userStore.logged,
      () => {
        if (userStore.logged) {
          globalConfigStore.mobileConnectModal = false
        }
      }
    )

    return {
      globalConfigStore,
      walletStore,
      userStore
    }
  },
  render() {
    return (
      <UModal v-model:show={this.globalConfigStore.mobileConnectModal} maskClosable={false}>
        <UCard
          style={{
            '--n-title-text-color': '#000',
            'max-width': '80vw'
          }}
          size="huge"
          title="Connect to welaunch"
        >
          <div class="flex mt-4 justify-center">
            <UButton
              size="large"
              type="primary"
              onClick={() => {
                this.walletStore.address &&
                  this.userStore.loginWithWalletAddress(this.walletStore.address)
              }}
            >
              Confirm
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

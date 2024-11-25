import { UButton, UModal, UCard } from '@comunion/components'
import { defineComponent, watch } from 'vue'
import { useUserStore, useWalletStore, useGlobalConfigStore } from '@/stores'

export default defineComponent({
  name: 'MobileSwitchNetTip',
  setup(props) {
    const globalConfigStore = useGlobalConfigStore()
    const walletStore = useWalletStore()
    const userStore = useUserStore()

    watch(
      () => userStore.logged,
      () => {
        if (userStore.logged) {
          globalConfigStore.mobileSwitchNetTip = false
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
      <UModal v-model:show={this.globalConfigStore.mobileSwitchNetTip} maskClosable={false}>
        <UCard
          style={{
            '--n-title-text-color': '#000',
            'max-width': '80vw'
          }}
          size="huge"
        >
          <div class="min-h-20 text-color2 u-h6">
            <div class="mb-2">
              If you encounter an error when switching chains, you can try the following steps:
            </div>
            <ul class="list-disc">
              <li>Disconnect your wallet from welaunch.</li>
              <li>Switch to the desired chain in the wallet app.</li>
              <li>Use Welaunch to reconnect your wallet to the web. </li>
            </ul>
          </div>
          <div class="flex mt-4 justify-center">
            <UButton
              size="large"
              type="primary"
              onClick={() => {
                this.globalConfigStore.mobileSwitchNetTip = false
              }}
            >
              OK
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

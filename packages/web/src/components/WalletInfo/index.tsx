import { shortenAddress } from '@comunion/utils'
import { defineComponent } from 'vue'
import styles from './index.module.css'
import { useWalletStore } from '@/stores'

const WalletInfo = defineComponent({
  name: 'WalletInfo',
  setup() {
    const walletStore = useWalletStore()
    return () => (
      <div class="bg-white border border-solid border-color-border rounded cursor-pointer py-1 px-2">
        {walletStore.connected ? (
          <div class="flex items-center">
            <div class={styles.connectedDot}></div>
            <div class="text-xs">
              <div class="text-grey3">
                {walletStore.address ? shortenAddress(walletStore.address) : ''}
              </div>
              <div class="text-grey3">{walletStore.chainInfo?.name} connected</div>
            </div>
          </div>
        ) : (
          <div class="flex py-1.5 items-center" onClick={() => walletStore.ensureWalletConnected()}>
            <div class={styles.unconnectedDot}></div>
            <span class="text-grey3">unconnected</span>
          </div>
        )}
      </div>
    )
  }
})

export default WalletInfo

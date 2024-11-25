import { UTransactionContainer, UTransactionWaiting } from '@comunion/components'
import { defineComponent } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TheFooter from './blocks/TheFooter'
import TheHeader from './blocks/TheHeader'

import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
    const route = useRoute()
    const walletStore = useWalletStore()
    const contractStore = useContractStore()

    return () => (
      <div class="bg-white flex flex-col h-full min-h-screen text-[14px] relative <lg:pt-16">
        <TheHeader />
        <div class="flex-1 u-page-container relative">
          {/* Header */}
          {/* TransactionWaiting */}
          <UTransactionContainer>
            {contractStore.transacations.map(transaction => {
              return (
                <UTransactionWaiting
                  key={transaction.hash}
                  {...transaction}
                  blockchainExplorerUrl={walletStore.explorerUrl}
                  onClose={() => contractStore.closeTransaction(transaction)}
                />
              )
            })}
          </UTransactionContainer>
          {/* Body */}
          <RouterView key={route.fullPath} />
        </div>
        {/* Footer */}
        <TheFooter />
      </div>
    )
  }
})

export default DefaultLayout

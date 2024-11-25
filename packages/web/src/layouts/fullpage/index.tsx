import { UTransactionContainer, UTransactionWaiting } from '@comunion/components'
import { defineComponent, watchEffect } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TheFooter from '../default/blocks/TheFooter'
import TheHeader from '../default/blocks/TheHeader'

import { useCheckUserProfile } from '@/hooks'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

import './style.css'

const FullpageLayout = defineComponent({
  name: 'FullpageLayout',
  setup() {
    const route = useRoute()
    const walletStore = useWalletStore()
    const contractStore = useContractStore()

    watchEffect(() => {
      useCheckUserProfile({
        flag: 'FullpageLayout'
      })
    })

    return () => (
      <div class="bg-white flex flex-col text-[14px] relative fullpage">
        <TheHeader />
        <div class="flex-1 overflow-auto relative">
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
          {/* Footer */}
          <TheFooter />
        </div>
      </div>
    )
  }
})

export default FullpageLayout

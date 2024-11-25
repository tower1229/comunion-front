import type { VueComponentPropsType } from '@comunion/utils'
import { defineComponent, ref } from 'vue'
import {
  UTransactionWaiting,
  UTransactionContainer,
  UTransactionWaitingPropsType,
  UButton
} from '@/comps/index'

type TransactionType = VueComponentPropsType<UTransactionWaitingPropsType>

const TransactionWaitingPage = defineComponent({
  name: 'TransactionWaitingPage',
  setup() {
    const transactions = ref<TransactionType[]>([])

    function addTransaction() {
      transactions.value.push({
        hash: `0x${Math.random().toString(16).slice(2, 10)}`,
        status: 'pending',
        text: 'Waiting for transaction to be mined'
      })
    }

    function finishTransaction(success: boolean) {
      const transaction = transactions.value[0]
      if (transaction) {
        transaction.status = success ? 'success' : 'failed'
      }
    }

    function onClose(transaction: TransactionType) {
      const index = transactions.value.indexOf(transaction)
      if (index !== -1) {
        transactions.value.splice(index, 1)
      }
    }

    return () => (
      <div class="pr-6 relative">
        <div class="flex my-4 gap-4 items-center">
          <UButton type="primary" onClick={addTransaction}>
            Add
          </UButton>
          <UButton type="primary" onClick={() => finishTransaction(true)}>
            Success
          </UButton>
          <UButton type="primary" onClick={() => finishTransaction(false)}>
            Failed
          </UButton>
        </div>
        <UTransactionContainer>
          {transactions.value.map(t => (
            <UTransactionWaiting key={t.hash} {...t} onClose={() => onClose(t)} />
          ))}
        </UTransactionContainer>
      </div>
    )
  }
})

export default TransactionWaitingPage

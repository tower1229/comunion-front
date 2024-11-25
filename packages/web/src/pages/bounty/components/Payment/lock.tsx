import { UButton } from '@comunion/components'
import { defineComponent, ref, computed, inject, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { useWalletStore, useUserStore } from '@/stores'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const walletConnected = useWalletStore().connected
    const userStore = useUserStore()
    const route = useRoute()
    const visible = ref<boolean>(false)
    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    const is_lock = computed(() => bountyDetail?.value.is_lock)
    const isCompleted = computed(() => (bountyDetail?.value.status || 0) >= BOUNTY_STATUS.COMPLETED)

    return {
      visible,
      bountyDetail,
      is_lock,
      isCompleted,
      route,
      walletConnected,
      userStore
    }
  },
  render() {
    if (!this.bountyDetail) {
      return null
    }

    const triggerDialog = () => {
      this.visible = !this.visible
    }
    const handleUnLockDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      if (!this.walletConnected) {
        return this.userStore.logout()
      }
      const { bountyContract } = await useBountyContractWrapper(this.bountyDetail as BountyInfo)
      await bountyContract.unlock(
        'Unlock the deposits from bounty contract.',
        'Successfully unlock.'
      )
      // const { error } = await services['bounty@bounty-applicants-unlock']({
      //   bountyID: parseInt(this.route.params.id as string)
      // })
      // if (!error) {
      //   triggerDialog()
      // }
      triggerDialog()
    }

    const handleLockDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      // if (this.gap < 0) {
      //   return
      // }
      if (!this.walletConnected) {
        return this.userStore.logout()
      }
      const { bountyContract } = await useBountyContractWrapper(this.bountyDetail as BountyInfo)
      await bountyContract.lock('Lock the deposits into bounty contract.', 'Successfully lock.')
      // services['bounty@bounty-applicant-lock']({
      //   bountyID: parseInt(this.route.params.id as string)
      // })
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Unlock the deposit?"
          content="Make sure that you have received rewards before unlocking the deposit."
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton
                  type="default"
                  class="mr-16px w-164px"
                  size="small"
                  onClick={triggerDialog}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={handleUnLockDeposit}>
                  {this.is_lock ? 'Yes' : 'Submit'}
                </UButton>
              </div>
            )
          }}
        />
        {this.is_lock ? (
          <UButton
            disabled={this.isCompleted}
            type="primary"
            class={`${this.$attrs.class}`}
            onClick={triggerDialog}
          >
            UnLock
          </UButton>
        ) : (
          <UButton
            disabled={this.isCompleted}
            type="primary"
            class={`${this.$attrs.class}`}
            onClick={handleLockDeposit}
          >
            Lock
          </UButton>
        )}
      </>
    )
  }
})

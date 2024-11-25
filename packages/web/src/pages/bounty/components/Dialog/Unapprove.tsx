import { UButton } from '@comunion/components'
import { defineComponent, PropType, ComputedRef, inject } from 'vue'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import Basic from './basic'
import { useWalletStore, useUserStore } from '@/stores'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

export type VisibleMap = {
  visibleUnapproveConfirm: boolean
  visibleUnapproveFail: boolean
}

export const UnapprovePromptSet = defineComponent({
  props: {
    visibleMap: {
      type: Object as PropType<VisibleMap>,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const walletConnected = useWalletStore().connected
    const userStore = useUserStore()

    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    return {
      bountyDetail,
      walletConnected,
      userStore
    }
  },
  render() {
    if (!this.bountyDetail) {
      return null
    }

    const address = this.bountyDetail.approved?.comer?.address
    const closeUnapproveConfirm = () => {
      this.visibleMap!.visibleUnapproveConfirm = false
    }
    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        closeUnapproveConfirm()
        return
      }

      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      if (!address) {
        return
      }
      if (!this.walletConnected) {
        return this.userStore.logout()
      }

      const { bountyContract } = await useBountyContractWrapper(this.bountyDetail as BountyInfo)
      await bountyContract.unapproveApplicant(address, '', '')
      // const { error } = await services['bounty@bounty-founder-unapprove']({
      //   bountyID: this.route.params.id as string,
      //   applicantComerID: this.profile?.comerID
      // })
      // if (!error) {
      //   closeUnapproveConfirm()
      //   return
      // }
      closeUnapproveConfirm()
      this.visibleMap!.visibleUnapproveFail = true
    }

    const closeUnapproveFail = () => {
      this.visibleMap!.visibleUnapproveFail = false
    }

    return (
      <>
        <Basic
          title="Unapprove the applicant ?"
          content="You will stop to cooperate with the applicant, meanwhile the bounty will be closed"
          visible={this.visibleMap?.visibleUnapproveConfirm}
          onTriggerDialog={closeUnapproveConfirm}
          v-slots={{
            btns: () => (
              <div class="flex justify-end">
                <UButton class="mr-16px w-164px" type="default" onClick={userBehavier('cancel')}>
                  Cancel
                </UButton>
                <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                  Submit
                </UButton>
              </div>
            )
          }}
        />
        <Basic
          title="Unapprove failed"
          content=" You have to release all deposits before you do unapprove"
          visible={this.visibleMap?.visibleUnapproveFail}
          onTriggerDialog={closeUnapproveFail}
          v-slots={{
            btns: () => (
              <div class="flex justify-end">
                <UButton class="w-164px" type="primary" onClick={closeUnapproveFail}>
                  OK
                </UButton>
              </div>
            )
          }}
        />
      </>
    )
  }
})

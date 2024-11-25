import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, inject, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import {
  BountyContractReturnType,
  useBountyContractWrapper
} from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { useWalletStore, useUserStore } from '@/stores'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const route = useRoute()
    const visible = ref<boolean>(false)
    const userStore = useUserStore()
    const walletStore = useWalletStore()
    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    return {
      visible,
      bountyDetail,
      chainId: walletStore.chainId,
      walletConnectd: walletStore.connected,
      userStore,
      route
    }
  },
  render() {
    if (!this.bountyDetail) {
      return null
    }

    const handleReleaseMyDeposit = async () => {
      const isSupport = this.bountyDetail?.chain_id
        ? await checkSupportNetwork(this.bountyDetail.chain_id)
        : false
      if (!isSupport) {
        return console.warn('chain id not match')
      }
      if (!this.walletConnectd) {
        return this.userStore.logout()
      }
      const { bountyContract } = await useBountyContractWrapper(this.bountyDetail as BountyInfo)
      const response = (await bountyContract.releaseMyDeposit(
        'Waiting to submit all contents to blockchain for release my deposit',
        'Release my deposit succeedes'
      )) as unknown as BountyContractReturnType
      // await services['bounty@bounty-release-my-deposit']({
      //   bountyID: this.route.params.id as string,
      //   chainID: this.chainId,
      //   txHash: response.hash
      // })

      triggerDialog()
      if (!response) {
        return console.warn('releaseMyDeposit error')
      }
    }
    const triggerDialog = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.visible = !this.visible
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release your deposits ?"
          content="All deposits will be released to your wallet, meanwhile your application will be canceled."
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
                <UButton
                  type="primary"
                  class="w-164px"
                  size="small"
                  onClick={handleReleaseMyDeposit}
                >
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        {this.disabled ? (
          <UTooltip
            trigger="hover"
            placement="top"
            v-slots={{
              trigger: () => (
                <div class={`w-[100%]`}>
                  <UButton
                    type={'tertiary'}
                    class={`w-[100%] ${this.$attrs.class}`}
                    disabled={this.disabled}
                  >
                    Release my deposit
                  </UButton>
                </div>
              ),
              default: () => 'Not any deposit is in the contract.'
            }}
          />
        ) : (
          // <UButton type={'tertiary'} class={`${this.$attrs.class}`} disabled={this.disabled}>
          //   Release my deposit
          // </UButton>
          <UButton
            type={'primary'}
            class={`${this.$attrs.class}`}
            onClick={triggerDialog}
            disabled={this.disabled}
          >
            Release my deposit
          </UButton>
        )}
      </>
    )
  }
})

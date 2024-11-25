import { UButton, UCard, UModal, UTooltip, message } from '@comunion/components'
import { BigNumber } from 'ethers'
import { defineComponent, PropType, ref } from 'vue'
import { CoinType } from '../../[id]'
import useInvestState from './useInvestState'
import { findRouterByAddress } from '@/constants'
import { useWESaleContract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  name: 'Founder',
  props: {
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'SaleLaunchpad@get-sale-launchpad-info'>>>,
      required: true
    },
    buyCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    },
    sellCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    },
    startup: {
      type: Object as PropType<StartupDetail>,
      require: true
    },
    investState: {
      type: Object as PropType<ReturnType<typeof useInvestState>['investState']>,
      require: true
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const router = findRouterByAddress(props.info.dex_router!)
    const isAutoListing = Boolean(router)
    const saleContract = useWESaleContract({
      chainId: walletStore.chainId!,
      addresses: { [walletStore.chainId!]: props.info.contract_address! }
    })

    const cancelModal = ref(false)

    const investState = props.investState!

    function cancel() {
      saleContract.cancel('Cancelling launchpad.', 'Cancelling launchpad.')
    }

    async function transfer() {
      const { provider } = await saleContract.getContract()
      const blockNumber = await provider.getBlockNumber()
      const block = await provider.getBlock(blockNumber)
      const blockTimeStamp = block.timestamp * 1000

      if (blockTimeStamp <= Number(props.info.end_time)) {
        message.info(
          'Please wait for the time of next block minted to retry if you fail to transfer liquidity.'
        )
        return
      }

      if (!isAutoListing || !walletStore.chainId) return

      await checkSupportNetwork(walletStore.chainId)

      const { error, data } = await services['SaleLaunchpad@get-sale-launchpad-transfer-lp-sign']({
        sale_launchpad_id: props.info.id
      })

      if (error) return

      const parameters: any = await saleContract.parameters('get parameters', 'waiting')
      const router = parameters[6]
      const dexInitPrice = parameters[7]
      const buyTokenDecimals = parameters[13]

      const [amountB] = await saleContract.getTransferLiquidityInvestAmount('get amount', 'waiting')

      const amountA = (amountB as BigNumber)
        .mul(dexInitPrice)
        .div(BigNumber.from(10).pow(buyTokenDecimals))

      await saleContract.transferLiquidity(
        amountA,
        data.data,
        data.sign,
        `Transferring liquidity into ${findRouterByAddress(router)?.dex}`,
        'Transaction Submitted'
      )
    }

    function remove() {
      const pendingText = 'Waiting to submit all contents to blockchain for removing'
      const waitingText = 'Waiting to confirm.'
      saleContract.claimInvest(pendingText, waitingText)
    }

    function withdrawDeposit() {
      saleContract.founderDivest('Withdrawing deposit in progress', 'Withdrawing deposit')
    }

    return () => (
      <div class="flex gap-4 justify-between <lg:px-0">
        {investState.isFailed ? (
          <div class="flex flex-col h-[70px] w-full justify-center">
            {investState.totalPreSale.isZero() ? (
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton class="flex-1" size="small" tag="div" type="primary" disabled>
                      Withdraw deposit
                    </UButton>
                  ),
                  default: () => <div>You have withdrawn the deposit.</div>
                }}
              </UTooltip>
            ) : (
              <UButton class="flex-1" size="small" type="primary" onClick={() => withdrawDeposit()}>
                Withdraw deposit
              </UButton>
            )}
            <span class="mt-2 text-center text-gray-500">Since the soft cap was not reached</span>
          </div>
        ) : investState.isCancel ? (
          <UButton class="flex-1" size="small" onClick={cancel} disabled={true}>
            Cancelled
          </UButton>
        ) : investState.isEnd ? (
          <>
            <UButton
              class="flex-2 w-50"
              size="small"
              onClick={cancel}
              disabled={investState.isTransed}
            >
              Cancel
            </UButton>
            {investState.isTransed ? (
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton class="flex-1" tag="div" size="small" type="primary" disabled>
                      {isAutoListing ? 'Transfer Liquidity' : 'Remove'}
                    </UButton>
                  ),
                  default: () => (
                    <div>
                      {isAutoListing
                        ? 'Liquidity has been transferred.'
                        : 'The pool has been removed to the team wallet.'}
                    </div>
                  )
                }}
              </UTooltip>
            ) : (
              <UButton
                class="flex-1"
                size="small"
                type="primary"
                onClick={() => (isAutoListing ? transfer() : remove())}
              >
                {isAutoListing ? 'Transfer Liquidity' : 'Remove'}
              </UButton>
            )}
          </>
        ) : (
          investState.isStarted && (
            <>
              <UButton
                class="flex-2 w-50"
                size="small"
                onClick={() => {
                  cancelModal.value = true
                }}
              >
                Cancel
              </UButton>
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton class="flex-1" size="small" type="primary" disabled tag="div">
                      {isAutoListing ? 'Transfer Liquidity' : 'Remove'}
                    </UButton>
                  ),
                  default: () => <div>Liquidity should transfer after launchpad ended.</div>
                }}
              </UTooltip>
            </>
          )
        )}
        <UModal v-model:show={cancelModal.value} maskClosable={false}>
          <UCard
            style={{ width: '540px', '--n-title-text-color': '#000' }}
            size="huge"
            closable={true}
            onClose={() => (cancelModal.value = false)}
            title="Cancel the launchpad？"
          >
            <div class="min-h-20 text-color2 u-h6">
              The launchpad will close and the presale tokens will be refunded to your wallet as
              soon as you click yes.
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => {
                  cancelModal.value = false
                }}
              >
                Cancel
              </UButton>
              <UButton
                type="primary"
                class="w-41"
                onClick={() => {
                  cancelModal.value = false
                  cancel()
                }}
              >
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

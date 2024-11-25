import { UButton, UCard, UModal, UTooltip } from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, PropType, ref } from 'vue'
import { CoinType } from '../../[id]'
import useInvestState from './useInvestState'
import { useWESaleContract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'

export default defineComponent({
  name: 'Investor',
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
    amount: {
      type: Number,
      require: true
    },
    investState: {
      type: Object as PropType<ReturnType<typeof useInvestState>['investState']>,
      require: true
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const confirmModal = ref(false)

    const saleContract = useWESaleContract({
      chainId: walletStore.chainId!,
      addresses: { [walletStore.chainId!]: props.info.contract_address! }
    })

    const investState = props.investState!

    async function buy() {
      await saleContract.invest(
        ethers.utils.parseUnits(String(props.amount), props.buyCoinInfo.decimal),
        'The transaction of buying is processing',
        'Waiting to confirm',
        {
          value: ethers.utils.parseEther(String(props.amount))
        }
      )
    }

    async function claim() {
      saleContract.claimPresale('Your purchased tokens are being claimed.', 'Claiming tokens')
    }

    async function withdrawContribution() {
      saleContract.divest(
        'Withdrawal Contribution are being processed.',
        'Contribution is being withdrawn.'
      )
    }

    async function emergencyWithdraw() {
      saleContract.divest('Emergencyt withdrawals are being processed.', 'Emergencyt Withdrawing')
    }

    return () => (
      <div class="flex justify-between gap-4 mt-10 <lg:px-0">
        {investState.isFailed ? (
          <div class="w-full h-[70px] flex flex-col justify-center">
            {investState.investedAmount.isZero() ? (
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton class="flex-1" type="primary" tag="div" disabled>
                      Withdraw Contribution
                    </UButton>
                  ),
                  default: () => <div>You have not contributed.</div>
                }}
              </UTooltip>
            ) : (
              <UButton class="flex-1" type="primary" onClick={withdrawContribution}>
                Withdraw Contribution
              </UButton>
            )}

            <span class="text-center mt-2 text-gray-500">Since the soft cap was not reached</span>
          </div>
        ) : investState.isCancel ? (
          <div class="w-full h-[70px] flex flex-col justify-center">
            {investState.investedAmount.isZero() ? (
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton class="flex-1" size="small" tag="div" type="primary" disabled>
                      Withdraw Contribution
                    </UButton>
                  ),
                  default: () => <div>You have not contributed.</div>
                }}
              </UTooltip>
            ) : (
              <UButton class="flex-1" size="small" type="primary" onClick={withdrawContribution}>
                Withdraw Contribution
              </UButton>
            )}

            <span class="text-center mt-2 text-gray-500">
              Since the founder cancelled the presale
            </span>
          </div>
        ) : investState.isEnd ? (
          investState.isTransed ? (
            !investState.canClaim.isZero() ? (
              <UButton class="flex-1" size="small" onClick={claim} type="primary">
                Claim ( {ethers.utils.formatUnits(investState.canClaim)} {props.sellCoinInfo.symbol}
                )
              </UButton>
            ) : (
              <UTooltip>
                {{
                  trigger: () => (
                    <UButton
                      class="flex-1"
                      size="small"
                      tag="div"
                      onClick={claim}
                      type="primary"
                      disabled
                    >
                      Claim
                    </UButton>
                  ),
                  default: () => <div>You have no tokens to claim.</div>
                }}
              </UTooltip>
            )
          ) : (
            // TODO: hover提示下面文案:
            <UTooltip>
              {{
                trigger: () => (
                  <UButton
                    class="flex-1"
                    size="small"
                    onClick={claim}
                    type="primary"
                    disabled
                    tag="div"
                  >
                    Claim
                  </UButton>
                ),
                default: () => (
                  <div>
                    When the creator finishes the launchpad, you can start the first claim, please
                    be patient
                  </div>
                )
              }}
            </UTooltip>
          )
        ) : (
          <>
            <UButton
              class="flex-1"
              size="small"
              type="primary"
              onClick={buy}
              disabled={
                !props.amount ||
                !props.buyCoinInfo.balance ||
                +props.amount < +props.info.min_invest_amount! ||
                +props.amount > +props.info.max_invest_amount! ||
                +props.amount > +props.buyCoinInfo.balance
              }
            >
              Buy with {props.buyCoinInfo.symbol}
            </UButton>
            {!investState.investedAmount.isZero() && (
              <UButton class="flex-1" size="small" onClick={() => (confirmModal.value = true)}>
                Emergency Withdraw
              </UButton>
            )}
          </>
        )}
        <UModal v-model:show={confirmModal.value} maskClosable={false}>
          <UCard
            style={{ width: '540px', '--n-title-text-color': '#000' }}
            size="huge"
            closable={true}
            onClose={() => (confirmModal.value = false)}
            title="Confirm Emergency Withdraw"
          >
            <div class="min-h-20 text-color2 u-h6">
              Emergency withdrawal takes your contribution (with 10% penalty) out of Presale Pool
              and cancels your participation in the presale.
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (confirmModal.value = false)}
              >
                Cancel
              </UButton>
              <UButton
                type="primary"
                class="w-41"
                onClick={() => {
                  confirmModal.value = false
                  emergencyWithdraw()
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

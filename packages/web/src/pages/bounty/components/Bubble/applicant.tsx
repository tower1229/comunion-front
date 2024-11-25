import { UButton, UTooltip } from '@comunion/components'
import { format } from 'timeago.js'
import { defineComponent, PropType, ref, computed, inject, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import {
  useBountyContractWrapper,
  BountyContractReturnType
} from '../../hooks/useBountyContractWrapper'
import Basic from '../Dialog/basic'
import styles from './applicant.module.css'
import Bubble from './core'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { useUserStore, useWalletStore } from '@/stores'
import { BountyInfo, BountyApplicant } from '@/types'
import { textToHtml } from '@/utils/format'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  name: 'ApplicantBubble',
  props: {
    applicant: {
      type: Object as PropType<BountyApplicant>,
      required: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup(props) {
    const route = useRoute()
    const visible = ref<boolean>(false)
    const userStore = useUserStore()
    const walletConnected = useWalletStore().connected

    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')
    const paramBountyId = inject<ComputedRef<number>>('paramBountyId')

    const formatDate = computed(() => {
      return format(new Date(Number(props.applicant?.apply_at)), 'comunionTimeAgo')
    })

    const approveDisabled = computed(() => {
      return (
        bountyDetail?.value.my_role !== USER_ROLE.FOUNDER ||
        bountyDetail?.value.status >= BOUNTY_STATUS.WORKSTARTED ||
        props.applicant?.status !== 1
      )
    })

    const bountyStatus = computed(() => bountyDetail?.value.status)
    const bountyRole = computed(() => bountyDetail?.value.my_role)

    return {
      bountyRole,
      visible,
      profile: userStore.profile,
      formatDate,
      // getApprovedPeople,
      approveDisabled,
      // get,
      bountyStatus,
      route,
      paramBountyId,
      bountyDetail,
      walletConnected
    }
  },
  render() {
    if (!this.bountyDetail) {
      return null
    }

    const triggerDialog = () => {
      this.visible = !this.visible
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }

      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        console.warn('checkSupportNetwork: detailChainId not Support', this.detailChainId)
        return
      }
      if (this.walletConnected) {
        const { bountyContract } = await useBountyContractWrapper(this.bountyDetail as BountyInfo)
        const response = (await bountyContract.approveApplicant(
          this.applicant?.comer?.address || '',
          'Approve for the applicant to work for this bounty.',
          `Successfully approve ${this.applicant?.comer?.name || 'applicant'}.`
        )) as unknown as BountyContractReturnType
        // const { error } = await services['bounty@bounty-founder-approve']({
        //   bountyID: paramBountyId,
        //   applicantComerID: this.applicant?.comer?.id,
        //   txHash: response?.hash || ''
        // })

        console.warn('approveApplicant', response)

        if (response) {
          // this.get(this.route.params.id as string)
          // this.getApprovedPeople(this.route.params.id as string)
          return triggerDialog()
        }
      }
    }
    return (
      <>
        <Basic
          title="Approve the applicant?"
          content="Other applicant's deposits will be released at once you approve the applicant"
          visible={this.visible}
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex justify-end">
                <UButton class="mr-16px w-164px" type="default" onClick={userBehavier('cancel')}>
                  Cancel
                </UButton>
                <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />

        <Bubble
          class="mb-10"
          avatar={this.applicant?.comer?.avatar}
          comerId={this.applicant?.comer?.id}
          v-slots={{
            default: () => (
              <div class="flex-1 ml-4">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="mb-2 text-color1 u-h4">{this.applicant?.comer?.name}</p>
                    <p class="text-color3 u-h7">{this.formatDate}</p>
                  </div>
                  {this.bountyRole === USER_ROLE.FOUNDER &&
                    this.bountyDetail?.status &&
                    this.bountyDetail?.status < BOUNTY_STATUS.WORKSTARTED &&
                    (this.approveDisabled ? (
                      <UTooltip>
                        {{
                          trigger: () => (
                            <div>
                              <UButton
                                disabled
                                color={'rgba(0,0,0,0.1)'}
                                class="w-30"
                                type="primary"
                                size="small"
                                onClick={triggerDialog}
                              >
                                Approve
                              </UButton>
                            </div>
                          ),
                          default: () =>
                            'The applicant has canceled to apply for bounty who cannot be approved.'
                        }}
                      </UTooltip>
                    ) : (
                      <UButton class="w-30" type="primary" size="small" onClick={triggerDialog}>
                        Approve
                      </UButton>
                    ))}
                </div>
                <div class={`bg-purple rounded mt-2 p-4 ${styles.approve} <lg:-ml-14`}>
                  <div
                    class="max-h-20 text-color2 overflow-auto u-h5"
                    v-html={textToHtml(this.applicant?.description)}
                  ></div>
                </div>
              </div>
            )
          }}
        />
      </>
    )
  }
})

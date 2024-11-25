import { UTooltip } from '@comunion/components'
import { LockKeyOutlined, UnlockKeyOutlined } from '@comunion/icons'
import { pluralize } from 'inflected'
import { defineComponent, computed, ref, PropType, inject, ComputedRef } from 'vue'
import { ProjectCardWithDialog } from '../ProjectCard'
import ProjectCarousel from '../ProjectCarousel'
import Text from '../Text'
import ReleaseApplicant from './ReleaseApplicant'
import StageTerm from './StageTerm'
import AddDeposit from './addDeposit'
import ApplyBounty from './applyBounty'
import CloseBounty from './closeBounty'
import Lock from './lock'
import ReleaseDeposit from './releaseDeposit'
import PaymentCard from '@/components/CustomCard'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE, PERIOD_OPTIONS } from '@/constants'
import './index.module.css'
import { BountyInfo } from '@/types'

const getPeriodByType = (type: number) => {
  const targetIndex = PERIOD_OPTIONS.findIndex(opt => opt.value === type)
  if (targetIndex !== -1) {
    return PERIOD_OPTIONS[targetIndex].type
  }
  return ''
}

export default defineComponent({
  name: 'Payment',
  props: {
    bountyDetail: {
      type: Object as PropType<BountyInfo>,
      required: true
    },
    bountyExpired: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const detailChainId = computed(() => props.bountyDetail?.chain_id || 0)
    const payMode = computed<'stage' | 'period'>(() => {
      return props.bountyDetail.payment_mode === 1 ? 'stage' : 'period'
    })

    const bountyApplicantAmount = computed(() => {
      return props.bountyDetail.applicant_deposit
    })

    const currentClientTime = ref(0)

    const timer = () => {
      currentClientTime.value = Date.now()
      setTimeout(timer, 1000)
    }

    timer()

    type rewordsInfo = {
      token1_amount: number
      token1_symbol: string
      token2_amount: number
      token2_symbol: string
    }
    const rewordsInfo = inject<ComputedRef<rewordsInfo>>('rewordsInfo')

    return {
      payMode,
      bountyApplicantAmount,
      currentClientTime,
      detailChainId,
      rewordsInfo
    }
  },
  render() {
    const periodType = getPeriodByType(this.bountyDetail?.payment_mode || 1)

    const periodTermsLength = this.bountyDetail.terms?.length || 0

    return (
      <>
        <div class="flex <lg:block">
          <PaymentCard class="flex-1 mr-6 <lg:mb-6" title="Rewards">
            <div class="flex flex-col h-38 mt-2 items-center">
              <div class="flex flex-1 items-end">
                <div>
                  <Text
                    value={`${this.rewordsInfo?.token1_amount || 0}`}
                    unit={this.rewordsInfo?.token1_symbol}
                    enhance={24}
                    digit={4}
                  />
                  <Text
                    value={`${this.rewordsInfo?.token2_amount || 0}`}
                    class="mt-10"
                    unit={this.rewordsInfo?.token2_symbol || 'TOKEN'}
                    plus={true}
                    enhance={24}
                    digit={4}
                  />
                </div>
              </div>
            </div>
            {(this.bountyDetail.my_role != USER_ROLE.FOUNDER ||
              this.bountyDetail.my_role === USER_ROLE.FOUNDER) && (
              <div class="flex mt-6">
                {this.bountyDetail.my_role != USER_ROLE.FOUNDER && (
                  <ApplyBounty
                    class="flex-1"
                    disabled={
                      this.bountyDetail.my_status === APPLICANT_STATUS.APPLIED ||
                      this.bountyDetail.status >= BOUNTY_STATUS.WORKSTARTED ||
                      Number(this.bountyDetail?.apply_deadline) <= this.currentClientTime
                    }
                    bountyExpired={this.bountyExpired}
                    detailChainId={this.detailChainId}
                    applicantApplyStatus={this.bountyDetail.my_status as number}
                    applicantDepositMinAmount={this.bountyDetail.applicant_min_deposit}
                  />
                )}
                {this.bountyDetail.my_role === USER_ROLE.FOUNDER && (
                  <CloseBounty
                    class="flex-1"
                    detailChainId={this.detailChainId}
                    bountyDetail={this.bountyDetail}
                  />
                )}
              </div>
            )}
          </PaymentCard>
          <PaymentCard
            class="flex-1"
            lock={!!this.bountyDetail.is_lock}
            v-slots={{
              title: () => (
                <div
                  class={`flex items-center overflow-hidden border-b p-4 ${
                    this.bountyDetail.is_lock
                      ? 'bg-[#fbeaea] border-error'
                      : 'bg-purple border-b border-color-border'
                  }`}
                >
                  <div class="flex-1 text-color1 u-h4">Deposit</div>
                  {this.bountyDetail.is_lock ? (
                    <UTooltip>
                      {{
                        trigger: () => <LockKeyOutlined />,
                        default: () => (
                          <div>
                            <p>The deposit is locked ！</p>
                            <p>
                              1.The deposit can be unlocked by approved appicant and be released by
                              founder.
                            </p>
                            <p>
                              2.The approved applicant need to post update at least 1 time within 5
                              days in the working for bounty
                            </p>
                          </div>
                        )
                      }}
                    </UTooltip>
                  ) : (
                    <UnlockKeyOutlined />
                  )}
                </div>
              )
            }}
          >
            <div class="flex flex-col h-38 items-center">
              <div class="flex flex-1 items-end">
                <div>
                  <p class="h-6 px-1 text-grey3 u-body4">Founder </p>
                  <Text
                    textColor="text-warning"
                    value={`${this.bountyDetail.founder_deposit || 0}`}
                    unit={this.bountyDetail.deposit_contract_token_symbol}
                    enhance={24}
                    digit={4}
                  />
                  <p class="h-6 mt-4 px-1 text-grey3 u-body4">Applicant </p>
                  <Text
                    textColor="text-warning"
                    value={`${this.bountyApplicantAmount}`}
                    enhance={24}
                    digit={4}
                    unit={this.bountyDetail.deposit_contract_token_symbol}
                  />
                </div>
              </div>
            </div>
            <div class="flex mt-6">
              {/* viewer */}
              {this.bountyDetail.my_role != USER_ROLE.FOUNDER && (
                <>
                  {this.bountyDetail.status < BOUNTY_STATUS.WORKSTARTED && (
                    <ReleaseApplicant
                      class="flex-1"
                      detailChainId={this.detailChainId}
                      disabled={this.bountyDetail.my_status !== APPLICANT_STATUS.APPLIED}
                    />
                  )}
                  {this.bountyDetail.status >= BOUNTY_STATUS.WORKSTARTED &&
                    this.bountyDetail.my_status !== APPLICANT_STATUS.APPROVED &&
                    this.bountyDetail.my_status !== APPLICANT_STATUS.UNAPPROVED && (
                      <ReleaseApplicant
                        class="flex-1"
                        detailChainId={this.detailChainId}
                        disabled={true}
                      />
                    )}
                  {(this.bountyDetail.my_status === APPLICANT_STATUS.APPROVED ||
                    this.bountyDetail.my_status === APPLICANT_STATUS.UNAPPROVED) && (
                    <Lock detailChainId={this.detailChainId} class="flex-1" />
                  )}
                </>
              )}
              {/* FOUNDER */}
              {this.bountyDetail.my_role === USER_ROLE.FOUNDER && (
                <>
                  {this.bountyDetail.approved?.status === APPLICANT_STATUS.APPROVED &&
                  Number(this.bountyDetail.expired_time) > 0 &&
                  this.currentClientTime - Number(this.bountyDetail.expired_time) >= 0 &&
                  this.bountyDetail.is_lock ? (
                    <Lock detailChainId={this.detailChainId} class="flex-1" />
                  ) : (
                    <div class="flex flex-1 gap-4">
                      <AddDeposit
                        detailChainId={this.detailChainId}
                        bountyDetail={this.bountyDetail}
                        class="flex-1"
                      />
                      <ReleaseDeposit
                        detailChainId={this.detailChainId}
                        bountyDetail={this.bountyDetail}
                        class="flex-1"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </PaymentCard>
        </div>
        <div class="flex mt-10 mb-6 justify-between items-center">
          <div class=" font-medium text-color3">Terms</div>
          {this.payMode === 'stage' && (
            <div class="mt-2 u-h7 <lg:mt-0">
              <span class="text-color3">Total Stage: </span>
              <span class="text-primary ">{this.bountyDetail.terms?.length || 0}</span>
            </div>
          )}

          {this.payMode === 'period' && (
            <div class="mt-2 u-h7 <lg:mt-0">
              <span class="text-color3">Total Period: </span>
              <span class="text-primary">
                {`${periodTermsLength} ${
                  periodTermsLength > 1 ? pluralize(periodType) : periodType
                }`}
              </span>
              <span class=" ml-10 text-grey3">Daily working: </span>
              <span class="text-primary">
                {`${this.bountyDetail?.period?.hours_per_day || 0} ${
                  (this.bountyDetail?.period?.hours_per_day || 0) > 1 ? pluralize('Hour') : 'Hour'
                }`}
              </span>
            </div>
          )}
        </div>

        {this.payMode === 'stage' &&
          this.bountyDetail.terms &&
          this.bountyDetail.terms.map(item => (
            <StageTerm item={item} detailChainId={this.detailChainId} />
          ))}

        {this.payMode === 'period' && (
          <ProjectCarousel total={this.bountyDetail.terms?.length || 0}>
            {this.bountyDetail.terms &&
              this.bountyDetail.terms.map(term => <ProjectCardWithDialog info={term} />)}
          </ProjectCarousel>
        )}

        {this.payMode === 'period' && (
          <div
            class={`border-solid border-color-border border-width-1px rounded-sm mt-24px max-h-258px p-24px overflow-hidden`}
          >
            <p class="mb-6 text-color3 u-h3">Target</p>
            <p
              class="font-[14px] text-color max-h-[162px] overflow-y-scroll"
              innerHTML={this.bountyDetail?.period?.terms}
            />
          </div>
        )}
      </>
    )
  }
})

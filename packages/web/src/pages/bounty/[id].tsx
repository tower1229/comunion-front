import { UCard, USpin, UTooltip } from '@comunion/components'
import { PeriodOutlined, StageOutlined, ClockOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { pluralize } from 'inflected'
import { defineComponent, computed, ref, watch, provide, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ActivityBubble, ApplicantBubble, DepositBubble } from './components/Bubble'
import Info from './components/Info/'
import Payment from './components/Payment'
import PersonalCard from './components/PersonalCard'
import PostUpdate from './components/PostUpdate'
import StartupCard from './components/StartupCard'
import useBounty from './hooks/useBounty'
import { useBountyContractWrapper } from './hooks/useBountyContractWrapper'
import { ShareButtonGroup } from '@/components/Share'
import { BOUNTY_STATUS, PERIOD_OPTIONS, USER_ROLE } from '@/constants'
import { useSocketStore, SocketMsgType, useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  name: 'BountyDetail',
  setup() {
    const route = useRoute()

    const paramBountyId = Number(route.params.id)
    const SocketStore = useSocketStore()
    const walletStore = useWalletStore()
    const loading = ref<boolean>(false)

    const bountySection = useBounty(paramBountyId)

    const bountyContract = ref()
    const postUpdate = ref<any>()
    const gapValue = ref<number>(0)
    const gapUnit = ref<string>('day')
    const chainInfo = computed(() =>
      bountySection.detail.value?.chain_id
        ? getChainInfoByChainId(bountySection.detail.value.chain_id)
        : null
    )

    const bountyExpired = computed(() => {
      const time = dayjs().utcOffset(0).unix()
      const expiresIn = dayjs.utc(bountySection.detail.value?.apply_deadline || '').unix()
      const notApplicant =
        !bountySection.applicants.value || bountySection.applicants.value.length == 0
      const isExpires = expiresIn > 0 && time > 0 && time >= expiresIn
      if (isExpires && notApplicant) {
        return true
      }
      return false
    })

    const rewordsInfo = computed(() =>
      Array.isArray(bountySection.detail.value?.terms)
        ? bountySection.detail.value?.terms.reduce(
            (pre: any, cur: any) => {
              return {
                token1_amount: Number(pre.token1_amount) + Number(cur.token1_amount),
                token1_symbol: cur.token1_symbol,
                token2_amount: Number(pre.token2_amount) + Number(cur.token2_amount),
                token2_symbol: cur.token2_symbol
              }
            },
            {
              token1_amount: 0,
              token1_symbol: '--',
              token2_amount: 0,
              token2_symbol: '--'
            }
          )
        : bountySection.detail.value?.period || {
            token1_amount: 0,
            token1_symbol: '--',
            token2_amount: 0,
            token2_symbol: '--'
          }
    )

    provide('paramBountyId', paramBountyId)
    provide(
      'bountyDetail',
      computed(() => bountySection.detail.value)
    )
    provide('refreshData', bountySection.reload)
    provide('rewordsInfo', rewordsInfo)

    watch(
      () => bountySection.detail.value,
      async detail => {
        if (!detail) {
          loading.value = true
        } else {
          loading.value = false

          if (detail?.contract_address && !postUpdate.value && walletStore.connected) {
            const { bountyContract } = await useBountyContractWrapper(detail)
            postUpdate.value = bountyContract.postUpdate
          }
          if (detail?.expired_time) {
            const expiredDate = new Date(Number(detail.expired_time))
            const days = dayjs(expiredDate).diff(dayjs(new Date()), 'day')
            if (days > 0) {
              gapUnit.value = 'day'
              gapValue.value = days
            } else {
              const hourse = dayjs(new Date(expiredDate)).diff(dayjs(new Date()), 'hour')
              if (hourse > 0) {
                gapUnit.value = 'hour'
                gapValue.value = hourse
              } else {
                gapUnit.value = 'minute'
                gapValue.value = dayjs(new Date(expiredDate)).diff(dayjs(new Date()), 'minute')
              }
            }
          }
        }
      },
      {
        immediate: true
      }
    )

    onBeforeUnmount(() => {
      SocketStore.unsubscribe('bounty', 2)
    })
    // socket subscribe
    SocketStore.init().then((socket: any) => {
      SocketStore.subscribe(
        'bounty',
        2,
        (msg: SocketMsgType) => {
          console.log('subscribe bounty', msg, paramBountyId)
          if (msg.topic === 'subscribe' && msg.data.target_id === paramBountyId) {
            console.warn('socket get detail change, do update...', paramBountyId)
            bountySection.reload()
          }
          // paramBountyId
        },
        paramBountyId
      )
    })

    return {
      bountyContract,
      postUpdate,
      bountySection,
      loading,
      gapValue,
      gapUnit,
      chainInfo,
      bountyExpired,
      rewordsInfo
    }
  },
  render() {
    const getPeriodByType = (type: number) => {
      const targetIndex = PERIOD_OPTIONS.findIndex(opt => opt.value === type)
      if (targetIndex !== -1) {
        return PERIOD_OPTIONS[targetIndex].type.toUpperCase()
      }
      return ''
    }

    const totalDeposit =
      Number(this.bountySection.detail.value?.founder_deposit) +
      Number(this.bountySection.detail.value?.applicant_deposit)

    return (
      <USpin show={this.loading}>
        <div class="flex gap-6 relative <lg:pt-10 <lg:block">
          {this.bountySection.detail.value?.startup &&
            this.bountySection.detail.value.startup.name && (
              <ShareButtonGroup
                class="top-0 left-[100%] absolute <lg:left-auto <lg:right-0"
                generate={{
                  banner: this.bountySection.detail.value.startup.banner,
                  logo: this.bountySection.detail.value.startup.logo,
                  name: this.bountySection.detail.value.startup.name + '-Bounty',
                  infos: [
                    {
                      count: this.rewordsInfo?.token1_amount || 0,
                      unit: this.rewordsInfo?.token1_symbol,
                      label: 'Rewards'
                    },
                    {
                      count: totalDeposit,
                      unit: this.bountySection.detail.value.deposit_contract_token_symbol,
                      label: 'Deposit'
                    }
                  ]
                }}
                route={window.location.href}
                title={this.bountySection.detail.value.startup?.name + '--Bounty | WELaunch'}
                description={`Check out the bounty on WELaunch, a next generation all-in-one decentralized economy BUIDLing and Launch Network`}
                text={`${
                  this.bountySection.detail.value.startup.name
                } just posted a #bounty that pays out ${this.rewordsInfo?.token1_amount || 0} ${
                  this.rewordsInfo?.token1_symbol
                }${
                  this.rewordsInfo?.token2_amount
                    ? '+' + this.rewordsInfo?.token2_amount + ' ' + this.rewordsInfo?.token2_symbol
                    : ''
                }, check out this #rewards on #WELaunch Network: `}
                tipPlacement="right"
              />
            )}

          <div class="w-86 overflow-hidden <lg:w-auto">
            {this.bountySection.startup.value && (
              <StartupCard startup={this.bountySection.startup.value} class="mb-6" />
            )}
            <UCard title="Founder" class="mb-6">
              {this.bountySection.founder.value && (
                <PersonalCard profile={this.bountySection.founder.value} />
              )}
            </UCard>
            <UCard
              title="Approved"
              class="mb-6"
              // v-slots={{
              //   'header-extra': () => (
              //     <>
              //       {this.bountySection.detail.value.my_role === USER_ROLE.FOUNDER &&
              //         (this.bountySection.approved.value?.comer_id || 0) > 0 && <Unapprove />}
              //     </>
              //   )
              // }}
            >
              {(this.bountySection.approved.value?.comer_id || 0) > 0 && (
                <PersonalCard profile={this.bountySection.approved.value?.comer} />
              )}
            </UCard>
            <UCard title="Deposit records" class="<lg:mb-6">
              {this.bountySection.deposit_records.value &&
                this.bountySection.deposit_records.value.length > 0 && (
                  <>
                    {this.bountySection.deposit_records.value.map((item, index) => (
                      <DepositBubble
                        class={`mb-4`}
                        depositInfo={item}
                        key={item.id}
                        tokenSymbol={
                          ' ' +
                          (this.bountySection.detail.value?.deposit_contract_token_symbol || '')
                        }
                      />
                    ))}
                  </>
                )}
            </UCard>
          </div>
          <div class=" flex-1 overflow-hidden">
            {this.bountySection.detail.value && (
              <Info bountyDetail={this.bountySection.detail.value} class="mb-6" />
            )}
            <UCard
              title="payment"
              class="mb-6"
              v-slots={{
                header: () => (
                  <div class="flex justify-between <lg:block">
                    <p class="flex items-center">
                      <span class="flex-1 mr-6 text-color2 u-h5">Payment</span>
                      {this.bountySection.detail.value?.payment_mode === 1 ? (
                        <>
                          <StageOutlined class="h-4 w-4" />
                          <p class="font-medium text-primary ml-2">Stage</p>
                        </>
                      ) : (
                        <>
                          <PeriodOutlined class="h-4 text-primary w-4" />
                          <p class="font-medium text-primary ml-2">
                            Period:{' '}
                            {getPeriodByType(
                              this.bountySection.detail.value?.period?.period_type || 1
                            )}
                          </p>
                        </>
                      )}
                    </p>
                    <div class="flex items-center <lg:justify-end">
                      <img src={this.chainInfo?.logo} class="h-4 w-4" />{' '}
                      <span class="font-thin  ml-2 tracking-normal text-color2">
                        {this.chainInfo?.name}
                      </span>
                    </div>
                  </div>
                )
              }}
            >
              {this.bountySection.detail.value && (
                <Payment
                  bountyDetail={this.bountySection.detail.value}
                  bountyExpired={this.bountyExpired}
                />
              )}
            </UCard>
            <UCard
              title="Activities"
              class="mb-6"
              v-slots={{
                'header-extra': () => {
                  return (
                    <div class="flex items-center <lg:block">
                      {this.bountySection.detail.value &&
                        this.bountySection.detail.value.status !== undefined &&
                        this.bountySection.detail.value.status >= BOUNTY_STATUS.WORKSTARTED && (
                          <>
                            {/* just applicant show countdown tips */}
                            {this.bountySection.detail.value.my_role !== USER_ROLE.FOUNDER &&
                              (this.gapValue >= 0 ? (
                                <UTooltip
                                  trigger="hover"
                                  placement="bottom"
                                  v-slots={{
                                    trigger: () => (
                                      <div class="flex items-center">
                                        <ClockOutlined
                                          class={`${
                                            this.gapValue >= 0 ? 'text-color3' : 'text-error'
                                          } w-4 h-4 mr-2.5`}
                                        />
                                        <p class="flex mr-4 text-grey3 items-center ">
                                          Founder can unlock after
                                          <span class="mx-1 text-primary">{this.gapValue}</span>
                                          {this.gapValue > 1
                                            ? `${pluralize(this.gapUnit)}`
                                            : this.gapUnit}
                                        </p>
                                      </div>
                                    ),
                                    default: () => (
                                      <div class="w-84">
                                        Post an update at least every 5 days, otherwise you will
                                        lose the permission to lock the deposit, and the founder can
                                        unlock.
                                      </div>
                                    )
                                  }}
                                />
                              ) : (
                                <p class="flex text-error mr-4 items-center <lg:mr-0">
                                  Founder can already unlock deposits
                                </p>
                              ))}
                          </>
                        )}
                      {this.bountySection.detail.value && (
                        <PostUpdate
                          gapValue={this.gapValue}
                          postUpdate={this.postUpdate}
                          bountyDetail={this.bountySection.detail.value}
                        />
                      )}
                    </div>
                  )
                }
              }}
            >
              {this.bountySection.post_updates.value &&
                this.bountySection.post_updates.value.length > 0 && (
                  <>
                    {this.bountySection.post_updates.value.map(activity => (
                      <ActivityBubble activity={activity} />
                    ))}
                  </>
                )}
            </UCard>
            <UCard title="Applicants">
              {this.bountySection.applicants.value &&
                this.bountySection.applicants.value.length > 0 && (
                  <>
                    {this.bountySection.applicants.value.map(applicant => (
                      <ApplicantBubble
                        detailChainId={this.bountySection.detail.value?.chain_id || 0}
                        applicant={applicant}
                      />
                    ))}
                  </>
                )}
            </UCard>
          </div>
        </div>
      </USpin>
    )
  }
})

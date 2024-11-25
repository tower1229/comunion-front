import { USpin, UTooltip, UButton } from '@comunion/components'
import { CheckFilled, PlusFilled, SettingOutlined } from '@comunion/icons'
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Bounty from './components/bounties'
import Connection from './components/connection'
import Launchpad from './components/crowdfunding'
import Finance from './components/finance'
import Governance from './components/governance'
import Overview from './components/overview'
import Profile from './components/profile'
import SaleLaunchpad from './components/saleLaunchpad'
import Security from './components/security'
import Team from './components/team'
import { useStartup } from './hooks/useStartup'
import { useStartupProfile } from './hooks/useStartupProfile'
import { BootTheTask } from '@/components/BootTheTask'
// import Empty from '@/components/Empty'
import { ShareButtonGroup, ShareButtonClass } from '@/components/Share'
import { startupSortItemList } from '@/pages/project/setting/components/sequence/BasicSortable'
import { services } from '@/services'
import { useUserStore, useGlobalConfigStore } from '@/stores'

export default defineComponent({
  name: 'startupDetail',
  setup() {
    const globalConfigStore = useGlobalConfigStore()
    const profile = useStartupProfile()
    const { toggleFollowStartup, getUserIsFollow } = profile
    const userIsFollow = ref<boolean>(false)
    const userStore = useUserStore()
    const loading = ref<boolean>(false)

    const route = useRoute()
    if (!route.params.id) {
      return null
    }

    // console.log(userStore.profile)
    const paramStartupId = Number(route.params.id)

    const startup = useStartup(paramStartupId)
    const dataCount = ref<any>({
      bounty_count: 0,
      crowdfunding_count: 0,
      governance_count: 0,
      other_dapp_count: 0
    })

    services['Startup@get-startup-relation-count']({
      startup_id: paramStartupId
    }).then(res => {
      if (!res.error) {
        dataCount.value = res.data
      }
    })

    const selectedTags = ref<string[]>([])

    const TAG_LABEL_MAP: any = {
      Bounty: 'bounty_count',
      Launchpad: 'crowdfunding_count',
      Governance: 'governance_count',
      SaleLaunchpad: 'sale_launchpad_count',
      'Other dapp': 'other_dapp_count'
    }
    const countKeys = Object.keys(dataCount.value)

    const canShowByTagName = (tagName: string) => {
      const tags = selectedTags.value
      if (!tags.length || tags.indexOf('All') > -1 || tags.indexOf(tagName) > -1) {
        const label = TAG_LABEL_MAP[tagName]
        if (label) {
          return dataCount.value[label] > 0
        } else {
          return false
        }
      }
      return false
    }

    const hasDataToShow = computed(() => {
      const tags = selectedTags.value
      if (!tags.length || tags.indexOf('All') > -1) {
        return !!countKeys.filter(key => {
          return dataCount.value[key] > 0
        }).length
      } else {
        return !!tags.filter(tag => {
          const label = TAG_LABEL_MAP[tag]
          if (label) {
            return dataCount.value[label] > 0
          } else {
            return false
          }
        }).length
      }
    })

    if (userStore.token) {
      getUserIsFollow(paramStartupId)
        .then(res => {
          userIsFollow.value = !!res
        })
        .catch(() => {
          userIsFollow.value = false
        })
    }

    const isAdmin = computed(() => {
      const adminList = (
        startup.detail.value?.team?.filter(item => {
          return item.position === 'Admin'
        }) || []
      ).map(e => e.comer_id)

      return (
        userStore.profile?.id &&
        (userStore.profile?.id === startup.detail.value?.comer_id ||
          adminList?.includes(userStore.profile?.id))
      )
    })

    const router = useRouter()
    const goSetting = () => {
      router.push({ path: `/project/setting/${startup.detail.value?.id}` })
    }

    return {
      loading,
      startup: startup.detail,
      paramStartupId,
      dataCount,
      selectedTags,
      hasDataToShow,
      canShowByTagName,
      userIsFollow,
      toggleFollowStartup,
      isAdmin,
      goSetting,
      globalConfigStore
    }
  },
  render() {
    const handleFollowStartup = (type: string) => {
      this.loading = true
      this.toggleFollowStartup(type, this.paramStartupId)
        .then(() => {
          this.userIsFollow = !this.userIsFollow
        })
        .finally(() => (this.loading = false))
    }

    const componentsMap: any = {
      Bounty: <Bounty startupId={this.paramStartupId} id="BountyId" />,
      Launchpad: <Launchpad startupId={this.paramStartupId} id="CrowdfundingId" />,
      SaleLaunchpad: <SaleLaunchpad startupId={this.paramStartupId} id="SaleLaunchpadId" />,
      Governance: <Governance startupId={this.paramStartupId} id="GovernanceId" />
    }

    const _tabSequence: number[] = this.startup?.tab_sequence
      ? this.startup.tab_sequence.split(',').map(n => Number(n))
      : [2, 3, 4, 5, 6]

    const handleTargetClick = (domId: string) => {
      const dom = document.getElementById(domId)
      if (dom) {
        console.log(dom.offsetTop, document.documentElement.scrollTop)
        document.documentElement.scrollTop = dom.offsetTop + 100
      }
    }

    return (
      <USpin show={this.loading}>
        <div class="flex items-center <lg:hidden">
          <div class="flex-1">{/* placeholder */}</div>
          <div class="flex gap-4">
            {this.canShowByTagName('Bounty') && (
              <UButton
                class="mb-4 text-color2 !font-normal"
                text
                onClick={() => handleTargetClick('BountyId')}
              >
                Bounty
              </UButton>
            )}
            {this.canShowByTagName('Launchpad') && (
              <UButton
                class="mb-4 text-color2 !font-normal"
                text
                onClick={() => handleTargetClick('CrowdfundingId')}
              >
                Launchpad
              </UButton>
            )}
            {this.canShowByTagName('SaleLaunchpad') && (
              <UButton
                class="mb-4 text-color2 !font-normal"
                text
                onClick={() => handleTargetClick('SaleLaunchpadId')}
              >
                SaleLaunchpad
              </UButton>
            )}
            {this.canShowByTagName('Governance') && (
              <UButton
                class="mb-4 text-color2 !font-normal"
                text
                onClick={() => handleTargetClick('GovernanceId')}
              >
                Proposal
              </UButton>
            )}
          </div>
        </div>
        <div class="flex gap-6 relative <lg:pt-10 <lg:block">
          {this.startup && this.startup.name && (
            <ShareButtonGroup
              class="top-0 right-[100%] absolute <lg:right-0"
              generate={{
                banner: this.startup.banner,
                logo: this.startup.logo,
                name: this.startup.name,
                infos: [
                  {
                    count: this.dataCount.bounty_count,
                    label: 'Bounty'
                  },
                  {
                    count: this.dataCount.crowdfunding_count,
                    label: 'Launchpad'
                  },
                  {
                    count: this.dataCount.sale_launchpad_count,
                    label: 'SaleLaunchpad'
                  },
                  {
                    count: this.dataCount.governance_count,
                    label: 'Proposal'
                  }
                ]
              }}
              route={window.location.href}
              title={this.startup.name + '--Project | WELaunch'}
              description={`Check out the project on WELaunch, a next generation all-in-one decentralized economy BUIDLing and Launch Network`}
              text={'Check out this #NFT #DAO #Web3 project on #WELaunch Network: '}
              copyText={`Check out this #NFT #DAO #Web3 project "${this.startup.name}" on #WELaunch Network: ${window.location.href}`}
            >
              {this.isAdmin && this.globalConfigStore.isLargeScreen && (
                <UTooltip
                  placement="left"
                  v-slots={{
                    trigger: () => (
                      <div class={`${ShareButtonClass}`} onClick={this.goSetting}>
                        <SettingOutlined />
                      </div>
                    ),
                    default: () => `Setting`
                  }}
                ></UTooltip>
              )}

              <UTooltip
                placement="left"
                v-slots={{
                  trigger: () =>
                    this.userIsFollow ? (
                      <div
                        class={`${ShareButtonClass} hover:text-primary`}
                        onClick={() => handleFollowStartup('unfollow')}
                      >
                        <CheckFilled class="h-[18px] mt-[3px] w-[18px]" />
                      </div>
                    ) : (
                      <div
                        class={`${ShareButtonClass} hover:text-primary`}
                        onClick={() => handleFollowStartup('follow')}
                      >
                        <PlusFilled class="h-[18px] mt-[3px] w-[18px]" />
                      </div>
                    ),
                  default: () => `${this.userIsFollow ? 'Unconnect' : 'Connect'}`
                }}
              ></UTooltip>
            </ShareButtonGroup>
          )}
          <div class="w-86 overflow-hidden <lg:w-auto">
            {this.startup && <Profile startup={this.startup} />}
            <Overview content={this.startup?.overview || ''} />
            <Team startupId={this.paramStartupId} teamDetail={this.startup?.team || []} />
            {(this.startup?.kyc || this.startup?.contract_audit) && (
              <Security
                kyc={this.startup?.kyc || ''}
                contractAudit={this.startup?.contract_audit || ''}
              />
            )}
            <Finance startup={this.startup} />
            <Connection startupId={this.paramStartupId} />
          </div>
          <div class="flex-1 overflow-hidden">
            {/* <Filter
              tabSequence={this.startup?.tab_sequence}
              onSelectedTagChange={tags => (this.selectedTags = tags)}
            /> */}
            {_tabSequence.map(sequence => {
              const targetIndex = startupSortItemList.findIndex(item => item.id === sequence)
              if (targetIndex === -1) {
                return null
              }
              const widgetName = startupSortItemList[targetIndex].name
              console.log(widgetName, this.canShowByTagName(widgetName), 899)
              return this.canShowByTagName(widgetName) ? componentsMap[widgetName] : null
            })}

            {!this.hasDataToShow &&
              (this.isAdmin ? (
                <BootTheTask
                  taskList={[1, 2, 3]}
                  noData={!this.hasDataToShow}
                  projectData={this.startup}
                />
              ) : (
                <BootTheTask
                  founder={false}
                  taskList={[2]}
                  noData={!this.hasDataToShow}
                  projectData={this.startup}
                />
                // <UCard>
                //   <Empty />
                // </UCard>
              ))}
          </div>
        </div>
      </USpin>
    )
  }
})

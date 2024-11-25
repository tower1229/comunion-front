import { defineComponent, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Bio from './components/bio'
import Bounty from './components/bounty'
import Comer from './components/comer'
import Connection from './components/connection'
import FairLaunchpad from './components/crowdfunding'
import Education from './components/education'
import Language from './components/language'
import Proposal from './components/proposal'
import SaleLaunchpad from './components/saleLaunchpad'
import Skill from './components/skill'
import Social from './components/social'
import Startup from './components/startup'
import { useModuleTag } from './hooks/useModuleTag'
import { useProfile } from './hooks/useProfile'
import { BootTheTask } from '@/components/BootTheTask'
import Empty from '@/components/Empty'
import { ShareButtonGroup } from '@/components/Share'

export default defineComponent({
  name: 'Builder',
  setup() {
    const BioRef = ref()
    const ComerRef = ref()
    const SocialRef = ref()
    const SkillRef = ref()
    const LanguageRef = ref()
    const EducationRef = ref()
    const route = useRoute()
    const instance = useProfile(route.query.id)

    const moduleCount = useModuleTag()
    const nothingToShow = computed(() => {
      return (
        moduleCount.postedCount.bounty_count === 0 &&
        moduleCount.postedCount.crowdfunding_count === 0 &&
        moduleCount.postedCount.governance_count === 0 &&
        moduleCount.postedCount.startup_count === 0 &&
        moduleCount.participatedCount.bounty_count === 0 &&
        moduleCount.participatedCount.crowdfunding_count === 0 &&
        moduleCount.participatedCount.sale_launchpad_count === 0 &&
        moduleCount.participatedCount.governance_count === 0 &&
        moduleCount.participatedCount.startup_count === 0
      )
    })

    const systemTasks = computed(() => {
      return ['All', 'Projects', 'Bounty', 'FairLaunchpad', 'SaleLaunchpad', 'Proposal'].filter(
        itemName => {
          return (
            (itemName === 'Projects' &&
              (moduleCount.postedCount.startup_count !== 0 ||
                moduleCount.participatedCount.startup_count !== 0)) ||
            (itemName === 'Bounty' &&
              (moduleCount.postedCount.bounty_count !== 0 ||
                moduleCount.participatedCount.bounty_count !== 0)) ||
            (itemName === 'FairLaunchpad' &&
              (moduleCount.postedCount.crowdfunding_count !== 0 ||
                moduleCount.participatedCount.crowdfunding_count !== 0)) ||
            (itemName === 'SaleLaunchpad' &&
              (moduleCount.postedCount.sale_launchpad_count !== 0 ||
                moduleCount.participatedCount.sale_launchpad_count !== 0)) ||
            (itemName === 'Proposal' &&
              (moduleCount.postedCount.governance_count !== 0 ||
                moduleCount.participatedCount.governance_count !== 0))
          )
        }
      )
    })

    const editAll = () => {
      const profile = instance.profile
      if (!profile.value?.name || !profile.value?.location) {
        ComerRef.value.editMode = true
      }
      if (!profile.value?.info?.bio) {
        BioRef.value.editMode = true
      }
      if (!(profile.value?.skills && profile.value?.skills?.length > 0)) {
        SkillRef.value.editMode = true
      }
      if (!(profile.value?.languages && profile.value?.languages?.length > 0)) {
        LanguageRef.value.editMode = true
      }
      if (!(profile.value?.socials && profile.value?.socials?.length > 0)) {
        SocialRef.value.editMode = true
      }
      EducationRef.value.editMode = true
    }

    watch(
      () => instance.profile.value?.id,
      comerId => {
        if (comerId) {
          moduleCount.getData(comerId as number)
        }
      },
      { immediate: true }
    )

    return {
      profile: instance.profile,
      systemTasks,
      viewMode: instance.viewMode,
      refreshData: () => instance.getProfileData(true),
      moduleCount,
      nothingToShow,
      editAll,
      BioRef,
      ComerRef,
      SocialRef,
      SkillRef,
      LanguageRef,
      EducationRef,
      loading: instance.loading
    }
  },
  render() {
    const componentsMap: any = {
      Projects: (
        <Startup
          moduleCount={this.moduleCount}
          comerId={this.profile?.id as number}
          viewMode={this.viewMode}
        />
      ),
      Bounty: <Bounty moduleCount={this.moduleCount} comerId={this.profile?.id as number} />,
      FairLaunchpad: (
        <FairLaunchpad moduleCount={this.moduleCount} comerId={this.profile?.id as number} />
      ),
      SaleLaunchpad: (
        <SaleLaunchpad moduleCount={this.moduleCount} comerId={this.profile?.id as number} />
      ),
      Proposal: <Proposal moduleCount={this.moduleCount} comerId={this.profile?.id as number} />
    }

    return (
      <div class="flex gap-6 relative <lg:pt-10 <lg:block">
        {this.profile?.name && (
          <ShareButtonGroup
            class="top-0 right-[100%] absolute <lg:right-0"
            generate={{
              banner: this.profile.banner,
              logo: this.profile.avatar,
              name: this.profile.name,
              noShadow: true
            }}
            route={`https://${import.meta.env.VITE_HOST}/profile/${this.profile.custom_domain}`}
            title={this.profile.name + '--Builder | WELaunch'}
            description={`Check out the Web3Profile on WELaunch, a next generation all-in-one decentralized economy BUIDLing and Launch Network`}
            text={`Connect this #Web3Profile on #WELaunch Network:`}
            copyText={`Connect this #Web3Profile on #WELaunch Network: https://${
              import.meta.env.VITE_HOST
            }/profile/${this.profile.custom_domain}`}
          />
        )}
        <div class="w-86 overflow-hidden <lg:w-auto">
          {this.profile && (
            <>
              <Comer
                ref={(ref: any) => (this.ComerRef = ref)}
                comerId={this.profile.id}
                avatar={this.profile.avatar}
                name={this.profile.name}
                location={this.profile.location}
                timeZone={this.profile.time_zone}
                cover={this.profile.banner}
                custom_domain={this.profile.custom_domain}
                viewMode={this.viewMode}
                onDone={this.refreshData}
                comerAccounts={this.profile.accounts}
              />
              <Bio
                ref={(ref: any) => (this.BioRef = ref)}
                content={this.profile?.info && this.profile?.info?.bio}
                viewMode={this.viewMode}
                onDone={this.refreshData}
              />
              <Social
                ref={(ref: any) => (this.SocialRef = ref)}
                viewMode={this.viewMode}
                profile={this.profile}
                onDone={this.refreshData}
              />
              <Skill
                ref={(ref: any) => (this.SkillRef = ref)}
                skills={(this.profile?.skills || []).map((item: any) => item.tag.name) as string[]}
                viewMode={this.viewMode}
                onDone={this.refreshData}
              />
              <Language
                ref={(ref: any) => (this.LanguageRef = ref)}
                viewMode={this.viewMode}
                list={this.profile?.languages as any}
                onDone={this.refreshData}
              />
              <Education
                ref={(ref: any) => (this.EducationRef = ref)}
                viewMode={this.viewMode}
                list={
                  Array.isArray(this.profile.educations)
                    ? this.profile.educations.map(item => {
                        return { ...item, graduated_at: Number(item.graduated_at) }
                      })
                    : []
                }
                onDone={this.refreshData}
              />
              <Connection viewMode={this.viewMode} profile={this.profile} />
            </>
          )}
        </div>
        <div class="flex-1 overflow-hidden">
          {this.profile && (
            <>
              {/* <Filter
                tasks={this.systemTasks}
                onTabChange={handleTabChange}
                onSelectedTagChange={handleSelectedTagChange}
              /> */}

              {this.nothingToShow || !this.profile?.id ? (
                this.viewMode ? (
                  <Empty />
                ) : (
                  <BootTheTask
                    onEditAll={this.editAll}
                    profile={this.profile}
                    noData={this.nothingToShow}
                    taskList={[4, 5]}
                    viewMode={this.viewMode}
                  />
                )
              ) : (
                <>{this.systemTasks.map(task => componentsMap[task] || null)}</>
              )}
            </>
          )}
        </div>
      </div>
    )
  }
})

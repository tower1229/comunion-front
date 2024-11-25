import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import iconBounty from './assets/icon-bounty.png'
import iconCrowdfunding from './assets/icon-crowdfunding.png'
import iconProject from './assets/icon-project.png'
import ProfileHeader from './components/ProfileHeader'
import Comer from './components/comer'
import styles from './index.module.css'
import { useModuleTag } from '@/pages/builder/hooks/useModuleTag'
import { useProfile } from '@/pages/builder/hooks/useProfile'
import { services } from '@/services'

export default defineComponent({
  name: 'Profile',
  setup() {
    const route = useRoute()
    const instance = ref<any>({})

    const moduleCount = useModuleTag()

    console.log(route.params.name)
    if (!route.params.name) {
      return null
    }

    const fetData = () => {
      services['Comer@get-comer-by-custom-domain']({
        custom_domain: route.params.name as string
      }).then(res => {
        if (res && res.data) {
          instance.value = useProfile(res.data.id)

          moduleCount.getData(res.data.id as number)
        }
      })
    }

    fetData()

    return {
      instance,
      moduleCount
    }
  },
  render() {
    const showList = [
      {
        icon: iconProject,
        title: 'Project',
        count: this.moduleCount.postedCount.startup_count
      },
      {
        icon: iconBounty,
        title: 'Bounty',
        count: this.moduleCount.postedCount.bounty_count
      },
      {
        icon: iconCrowdfunding,
        title: 'Launchpad',
        count: this.moduleCount.postedCount.crowdfunding_count
      }
    ]

    return (
      <div>
        <ProfileHeader profile={this.instance.profile} />
        <div class={`py-18 xl:py-36 ${styles.profilePage}`}>
          <div class="m-auto max-w-165">
            {this.instance.profile && <Comer profile={this.instance.profile} />}
            <ul class={styles.showList}>
              {showList.map(item => (
                <li class={`flex items-center`}>
                  <img src={item.icon} alt="icon" class="h-9 w-9" />
                  <div class="flex-1 ml-4 text-color1 u-h3">{item.title}</div>
                  <span class="text-color2 u-h4">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
})

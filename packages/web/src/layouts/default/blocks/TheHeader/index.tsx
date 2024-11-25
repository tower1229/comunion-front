import { UTooltip } from '@comunion/components'
import { ShareOutlined } from '@comunion/icons'
import { defineComponent, ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import WalletAddress from '../Address'
import CreateBlock from '../Create'
import NetworkSwitcher from '../Network'
import MobileNav from './MobileNav'
import ULogo from '@/components/ULogo'
import { useGlobalConfigStore, useUserStore, useWalletStore } from '@/stores'

const indexUrl = import.meta.env.VITE_COMUNION_HOMEPAGE_URL

const TheHeader = defineComponent({
  name: 'TheHeader',
  setup(props, ctx) {
    const router = useRouter()
    const globalConfigStore = useGlobalConfigStore()
    const userStore = useUserStore()
    const walletStore = useWalletStore()
    const currentRoute = ref('')

    const navigations = computed(() => {
      const FinanceSubMenu = [
        {
          name: 'Fair Launchpads',
          url: '/launchpad/list',
          isActive: currentRoute.value.indexOf('/launchpad') !== -1
        },
        {
          name: 'Sale Launchpads',
          url: '/sale-launchpad/list',
          isActive: currentRoute.value.indexOf('/sale-launchpad') !== -1
        }
      ]

      const ProjectSubMenu = [
        {
          name: 'Project',
          url: '/project/list',
          isActive: currentRoute.value.indexOf('/project') !== -1
        },
        {
          name: 'Governance',
          url: '/governance/list',
          isActive: currentRoute.value.indexOf('/governance') !== -1
        }
      ]

      const MarketplaceSubMenu = [
        {
          name: 'Bounty',
          url: '/bounty/list',
          isActive: currentRoute.value.indexOf('/bounty') !== -1
        }
      ]

      return [
        {
          name: 'Project',
          isActive: ProjectSubMenu.filter(e => e.isActive).length > 0,
          subMenu: ProjectSubMenu
        },
        {
          name: 'Launchpad',
          isActive: FinanceSubMenu.filter(e => e.isActive).length > 0,
          subMenu: FinanceSubMenu
        },
        {
          name: 'Marketplace',
          isActive: MarketplaceSubMenu.filter(e => e.isActive).length > 0,
          subMenu: MarketplaceSubMenu
        },
        {
          name: 'Chart',
          icon: (
            <ShareOutlined
              class={globalConfigStore.isLargeScreen ? 'h-3.5 w-3.5' : 'h-4 w-4 text-color2'}
            />
          ),
          link: '//wechart.io'
        }
      ]
    })

    const MainMenuActive = ref(0)
    const MainMenuActiveBackup = ref(0)

    watch(
      () => router.currentRoute.value.path,
      newValue => {
        currentRoute.value = newValue
        setTimeout(() => {
          MainMenuActive.value = navigations.value.findIndex(item => item.isActive)
          MainMenuActiveBackup.value = MainMenuActive.value
        })
      },
      { immediate: true }
    )

    const timerHandler = ref()

    const stickyStyle = ref({})
    const fixedLogoStyle = ref({})

    const onScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) {
        stickyStyle.value = {
          background: 'rgba(255, 255, 255, .8)',
          boxShadow: '0px 6px 8px rgba(215, 220, 222, 0.2)',
          backdropFilter: 'blur(3.5px)'
        }
      } else {
        stickyStyle.value = {}
      }

      if (scrollTop > 20) {
        fixedLogoStyle.value = {
          top: '12px'
        }
      } else {
        fixedLogoStyle.value = {}
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll, true)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll, true)
    })

    const handleClickLevelOne = (item: any) => {
      if (item.subMenu && item.subMenu[0].url) {
        timerHandler.value && clearTimeout(timerHandler.value)
        router.push(item.subMenu[0].url)
      }
    }

    return {
      navigations,
      MainMenuActive,
      MainMenuActiveBackup,
      timerHandler,
      stickyStyle,
      fixedLogoStyle,
      handleClickLevelOne,
      globalConfigStore,
      loginWithWalletAddress: () =>
        walletStore.address && userStore.loginWithWalletAddress(walletStore.address)
    }
  },
  render() {
    const handleMouseleave = () => {
      if (this.MainMenuActive !== this.MainMenuActiveBackup) {
        this.timerHandler = setTimeout(() => (this.MainMenuActive = this.MainMenuActiveBackup), 800)
      }
    }

    const subMenuStyle = this.navigations[this.MainMenuActive]?.subMenu ? this.stickyStyle : {}

    return (
      <>
        <div
          class={`px-10 relative top-0 z-3000 <lg:fixed left-0 right-0 <lg:flex items-center <lg:px-4 <lg:py-2 bg-color-body`}
        >
          <div
            class="cursor-pointer flex transition-all top-5 left-4 z-10 fixed items-center <lg:static"
            style={this.fixedLogoStyle}
            onClick={() => window.open(indexUrl, '_self')}
            // onClick={() => this.loginWithWalletAddress()}
          >
            <ULogo height={this.globalConfigStore.isLargeScreen ? 28 : 36} />
            <span class="font-600 text-lg ml-1 text-[#636366] hidden 1366:block">WELaunch</span>
          </div>
          <div class="flex-1 hidden <lg:block">
            <MobileNav class="h-10 ml-2 w-10" navigations={this.navigations} />
          </div>
          <div class="mt-0.5 u-page-container <lg:hidden">
            <div class="flex border-[#F1F0F0] border-b-1 h-16 text-color2 inline-flex items-center">
              {this.navigations.map((item, index) =>
                item.subMenu ? (
                  <span
                    key={item.name}
                    class={`u-h5 font-bold cursor-pointer px-1 not-last:mr-4 hover:text-color1 ${
                      item.isActive ? 'text-color1' : ''
                    }`}
                    onClick={() => this.handleClickLevelOne(item)}
                    onMouseenter={() => {
                      this.timerHandler && clearTimeout(this.timerHandler)
                      this.MainMenuActive = index
                    }}
                    onMouseleave={() => handleMouseleave()}
                  >
                    <span>{item.name}</span>
                  </span>
                ) : (
                  <span
                    key={item.name}
                    class={`flex items-center u-h5 font-bold cursor-pointer px-1 not-last:mr-4`}
                    onClick={() => item.link && window.open(item.link)}
                  >
                    <span class="mr-1">{item.name}</span>
                    {item.icon}
                  </span>
                )
              )}
            </div>
          </div>

          <div class="flex ml-auto top-4 right-4 gap-x-2.5 absolute items-center <lg:static">
            {this.globalConfigStore.isLargeScreen ? <CreateBlock /> : null}
            <NetworkSwitcher />
            <WalletAddress />
            {this.globalConfigStore.isLargeScreen ? null : <CreateBlock />}
          </div>
        </div>
        {/* subMenu */}
        <div class="h-12 mb-16 top-0 z-9 sticky <lg:hidden" style={subMenuStyle}>
          <div
            class="u-page-container overflow-hidden"
            onMouseenter={() => this.timerHandler && clearTimeout(this.timerHandler)}
            onMouseleave={() => handleMouseleave()}
          >
            <div class="flex border-[#F1F0F0] border-b-1 inline-flex items-center">
              {this.navigations[this.MainMenuActive]?.subMenu?.map(nav =>
                nav.url ? (
                  <RouterLink
                    key={nav.name}
                    class={`h-12 leading-12 not-last:mr-4 px-1 u-h5 font-semibold text-color2 hover:text-primary ${
                      nav.isActive ? 'text-primary' : ''
                    }`}
                    activeClass={`!text-primary`}
                    to={nav.url || ''}
                  >
                    {nav.name}
                  </RouterLink>
                ) : (
                  <UTooltip placement="bottom">
                    {{
                      trigger: () => (
                        <span
                          key={nav.name}
                          class={`h-12 leading-12 not-last:mr-4 px-1 u-h5 text-color2 cursor-pointer`}
                        >
                          {nav.name}
                        </span>
                      ),
                      default: () => 'Coming soon'
                    }}
                  </UTooltip>
                )
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
})

export default TheHeader

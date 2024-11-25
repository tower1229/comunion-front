import { UDrawer } from '@comunion/components'
import { MenuOutlined, CloseOutlined } from '@comunion/icons'
import { defineComponent, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import ShareOutlined from '@/assets/shareOutlined.svg'

export default defineComponent({
  name: 'DefaultHeader',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const path = computed(() => route.path)
    const visibleMobileMenu = ref(false)

    const menus = computed(() => [
      {
        name: 'Home',
        route: '/'
      },
      {
        name: 'Partner',
        route: '/Partner'
      },
      {
        name: 'Docs',
        link: 'https://docs.weconomy.network/'
      },
      {
        name: 'Media Kit',
        link: 'https://drive.google.com/drive/folders/1jkjbfJTOydaAwniMYHMo4LliF5_eyK6E?usp=sharing'
      },
      {
        name: 'Contact',
        route: '/Contact'
      }
    ])

    const handleClick = (item: any) => {
      if (item.link) {
        window.open(item.link)
      } else if (item.route) {
        router.push(item.route)
      }
    }

    return {
      path,
      menus,
      handleClick,
      visibleMobileMenu
    }
  },
  render() {
    return (
      <div class="bg-color-body top-0 z-10 overflow-hidden sticky">
        <div class="flex h-8 my-6 <lg:px-4">
          <div class="flex-1">
            <img src={logo} class="h-full" />
          </div>
          <MenuOutlined class="h-8 w-8 lg:hidden" onClick={() => (this.visibleMobileMenu = true)} />
        </div>
        <ul class="border-color-border flex border-t-1 border-b-1 font-600 h-13 text-color2 gap-10 items-center <lg:hidden">
          {this.menus.map(item => (
            <li
              class={
                'cursor-pointer text-color2 hover:text-primary <lg:flex-1 <lg:text-center' +
                (this.path === item.route ? ' !text-color1' : '')
              }
              onClick={() => this.handleClick(item)}
            >
              {item.name}
              {item.link ? (
                <img
                  src={ShareOutlined}
                  class="h-3 -mt-0.5 ml-1 text-color3 w-3 inline-block align-middle"
                />
              ) : null}
            </li>
          ))}
        </ul>
        <UDrawer
          class="mobileMenuWrap"
          width={'100%' as any}
          placement="left"
          maskClosable={false}
          v-model:show={this.visibleMobileMenu}
        >
          <div>
            <div class="flex h-8 my-6 <lg:px-4">
              <div class="flex-1">
                <img src={logo} class="h-full" />
              </div>
              <CloseOutlined
                class="h-8 text-[#0000004D] w-8"
                onClick={() => (this.visibleMobileMenu = false)}
              />
            </div>
            <ul class="font-600 mt-15 text-lg px-4 text-color2">
              {this.menus.map(item => (
                <li
                  class={
                    'cursor-pointer text-color2 hover:text-primary py-3' +
                    (this.path === item.route ? ' !text-color1' : '')
                  }
                  onClick={() => {
                    this.visibleMobileMenu = false
                    this.handleClick(item)
                  }}
                >
                  {item.name}
                  {item.link ? (
                    <img
                      src={ShareOutlined}
                      class="h-3 -mt-0.5 ml-1 text-color3 w-3 inline-block align-middle"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </UDrawer>
      </div>
    )
  }
})

import { UButton } from '@comunion/components'
import { useMediaQuery } from '@vueuse/core'
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/textLogo.svg'
import MobileConnectModal from '@/components/MobileConnectModal'
import { useWalletStore, useUserStore, useGlobalConfigStore } from '@/stores'

export default defineComponent({
  name: 'Header',
  setup() {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const globalConfigStore = useGlobalConfigStore()
    const router = useRouter()
    const isLargeScreen = useMediaQuery('(min-width: 1024px)')

    const { path } = useRoute()
    const headerClass = ref<string>('flex justify-between')
    const scrollFn = () => {
      if (document.scrollingElement && document.scrollingElement.scrollTop > 1200) {
        // headerClass.value = 'transform translate-y-962px w-full bg-[#ededf2]'
        headerClass.value = 'sticky top-0px z-10'
      } else {
        headerClass.value = 'sticky top-0px z-10'
      }
    }
    onMounted(() => {
      scrollFn()
      document.addEventListener('scroll', scrollFn)
    })

    onUnmounted(() => {
      document.addEventListener('scroll', scrollFn)
    })

    const loading = ref(false)
    const walletLogin = async () => {
      loading.value = true
      try {
        walletStore.ensureWalletConnected().then(() => {
          loading.value = false
        })
        const unsubscribe = watch(
          () => walletStore.address,
          () => {
            if (walletStore.address && !userStore.logged) {
              if (isLargeScreen.value) {
                userStore.loginWithWalletAddress(walletStore.address)
              } else {
                globalConfigStore.mobileConnectModal = true
              }
              unsubscribe()
              loading.value = false
            }
          }
        )
      } catch (error) {
        // do nothing
        loading.value = false
      }
    }

    return {
      headerClass,
      router,
      path,
      loading,
      walletLogin
    }
  },
  render() {
    return (
      <>
        <div
          class={`${this.headerClass} h-15 flex justify-between px-10 <sm:px-[4%]`}
          style={{
            background: 'rgba(255, 255, 255, .8)',
            boxShadow: '0px 6px 8px rgba(215, 220, 222, 0.2)',
            backdropFilter: 'blur(3.5px)'
          }}
        >
          <div class="flex w-32 items-center <sm:w-30">
            <img src={logo} class="w-full" />
          </div>

          <div class="flex items-center">
            <UButton
              strong
              round
              type="primary"
              size="small"
              style={{
                '--n-border-radius': '2px'
              }}
              loading={this.loading}
              onClick={this.walletLogin}
            >
              Connect Account
            </UButton>
          </div>
        </div>
        <MobileConnectModal />
      </>
    )
  }
})

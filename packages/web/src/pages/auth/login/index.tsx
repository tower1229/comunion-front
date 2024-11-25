import { defineComponent, watchEffect, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import Background from '@/components/widgets/background'
import Benefits from '@/components/widgets/benefits'
import BgImage from '@/components/widgets/bgImage'
import Comunion from '@/components/widgets/comunion'
import Ecomomy from '@/components/widgets/ecomomy'
import Future from '@/components/widgets/future'
import Header from '@/components/widgets/header'
import Innovative from '@/components/widgets/innovative'
import Overview from '@/components/widgets/overview'
import Revolutionary from '@/components/widgets/revolutionary'
import { useOnLoggedIn } from '@/hooks'
import { useUserStore, useWalletStore } from '@/stores'
import { UserResponse } from '@/types'

export default defineComponent({
  setup() {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const { path, query } = useRoute()
    const loading = ref(false)

    const { ensureWalletConnected } = walletStore
    const inviteCode = computed(() => query.inviteCode)
    const walletLogin = async () => {
      loading.value = true
      try {
        await ensureWalletConnected(true)
      } catch (error) {
        // do nothing
      }
      loading.value = false
    }
    const fromInvite = () => {
      switch (path) {
        case '/invite':
          if (inviteCode.value) {
            userStore.setInvitationCode(inviteCode.value as string)
            walletLogin()
          }
          break
        default:
          break
      }
    }
    watchEffect(() => {
      if (userStore.profile) {
        useOnLoggedIn({ token: userStore.token, ...userStore.profile } as UserResponse)
      }
    })
    onMounted(() => {
      fromInvite()
    })
    return {
      loading,
      ensureWalletConnected,
      walletLogin,
      inviteCode
    }
  },
  render() {
    const currentYear = new Date().getFullYear()
    return (
      <div class="bg-[#ededf2]">
        <BgImage />
        <Background />
        <Header />
        <Overview />
        <Comunion />
        <Ecomomy />
        <Revolutionary />
        <Future />
        <Benefits />
        <Innovative />

        <div class="mx-auto max-w-1120px py-6 <sm:w-[90%]">
          Powered by
          <a class="text-primary px-1" href="//weconomy.network" target="_blank">
            WEconomy.network
          </a>
          ©{currentYear}
        </div>
      </div>
    )
  }
})

import { UButton } from '@comunion/components'
import { DisConnectFilled, SignOutFilled, UserFilled } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import { useMediaQuery } from '@vueuse/core'
import { defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeaderDropdown from '../../components/HeaderDropdown'
import MobileConnectModal from '@/components/MobileConnectModal'
import { useUserStore, useWalletStore, useGlobalConfigStore } from '@/stores'

const WalletAddress = defineComponent({
  name: 'HeaderAddress',
  setup(props, ctx) {
    const globalConfigStore = useGlobalConfigStore()
    const router = useRouter()
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const isLargeScreen = useMediaQuery('(min-width: 1024px)')

    const connectWallet = () => {
      if (walletStore.connected && walletStore.address) {
        return
      }

      walletStore.ensureWalletConnected()
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
          }
        }
      )

      // userStore.loginWithWalletAddress()
    }

    const onClick = (v: string) => {
      switch (v) {
        case 'logout':
          userStore.logout(false, false)
          break
        case 'dashboard':
          router.push('/builder')
          break
        case 'referral':
          router.push('/referral')
          break
        case 'disconnect':
          walletStore.disconnectWallet()
          break
        default:
          break
      }
    }

    return () => {
      // userStore.
      const btn = (
        <UButton size="small" onClick={connectWallet} class="h-8 !font-normal">
          {walletStore.connected && walletStore.address
            ? shortenAddress(walletStore.address)
            : 'Connect Wallet'}
        </UButton>
      )

      return (
        <>
          {walletStore.connected ? (
            <HeaderDropdown
              placement="bottom-end"
              onSelect={onClick}
              options={[
                {
                  key: 'dashboard',
                  icon: () => <UserFilled class="!text-primary" />,
                  label: () => <span>Dashboard</span>
                },
                // {
                //   key: 'referral',
                //   icon: () => <HeadInviteFilled class="!text-primary" />,
                //   label: () => <span>My Referral</span>
                // },
                ...(globalConfigStore.isLargeScreen
                  ? [
                      {
                        key: 'disconnect',
                        icon: () => <DisConnectFilled class="bg-purple rounded-3xl text-primary" />,
                        label: () => <div class="flex items-center">Disconnect</div>
                      }
                    ]
                  : []),
                {
                  key: 'logout',
                  icon: () => <SignOutFilled class="rounded-3xl !text-primary" />,
                  label: () => <span>Sign out</span>
                }
              ]}
            >
              {btn}
            </HeaderDropdown>
          ) : (
            btn
          )}
          {/* mobile modal */}
          <MobileConnectModal />
        </>
      )
    }
  }
})

export default WalletAddress

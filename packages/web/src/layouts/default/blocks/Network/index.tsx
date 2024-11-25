import { UButton } from '@comunion/components'
import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent, computed, ref, watchEffect } from 'vue'
import HeaderDropdown from '../../components/HeaderDropdown'
import notsupport from '@/assets/networks/notsupport.svg'
import MobileSwitchNetTip from '@/components/MobileSwitchNetTip'
import { ChainNetworkType, supportedNetworks } from '@/constants'
import { useWalletStore, useGlobalConfigStore } from '@/stores'

const NetworkSwitcher = defineComponent({
  name: 'NetworkSwitcher',
  setup(props, ctx) {
    const globalConfigStore = useGlobalConfigStore()

    const btnRef = ref<HTMLButtonElement>()
    const walletStore = useWalletStore()
    const networkCache = ref<ChainNetworkType>()
    const currentNetwork = computed(() => {
      return supportedNetworks.find(network => network.chainId === walletStore.chainId ?? 1)
    })
    watchEffect(() => {
      if (currentNetwork.value?.chainId) {
        networkCache.value = currentNetwork.value
      }
      if (!networkCache.value) {
        networkCache.value = supportedNetworks[0]
      }
    })

    async function onSelectNetwork(chainId: number) {
      walletStore
        .ensureWalletConnected()
        .then(res => {
          console.log('onSelectNetwork ensureWalletConnected res', res)
          walletStore.switchNetwork({ chainId })
          if (!globalConfigStore.isLargeScreen) {
            setTimeout(() => {
              globalConfigStore.mobileSwitchNetTip = true
            }, 1000)
          }
        })
        .catch(err => {
          console.log('onSelectNetwork ensureWalletConnected err', err)
        })
    }

    walletStore.setOpenNetworkSwitcher(() => {
      btnRef.value?.click()
    })
    const getNetworkNode = () => {
      if (currentNetwork.value?.chainId && networkCache.value) {
        return (
          <>
            <img src={networkCache.value?.logo} class="rounded-xl h-5 w-5" />
            {globalConfigStore.isLargeScreen ? (
              <span class="ml-2">{networkCache.value?.name}</span>
            ) : (
              ''
            )}
          </>
        )
      } else {
        return (
          <>
            <img src={notsupport} class="rounded-xl h-5 mr-2 w-5" />
            {globalConfigStore.isLargeScreen ? <span class="ml-2">Not support</span> : ''}
          </>
        )
      }
    }
    return () => (
      <>
        <HeaderDropdown
          value={currentNetwork.value?.chainId}
          options={supportedNetworks.map(network => ({
            key: network.chainId,
            // disabled: network.disabled,
            icon: () => <img src={network.logo} class="rounded-full h-5 w-5" />,
            label: network.name ?? (network as ChainNetworkType).shortName
          }))}
          onSelect={onSelectNetwork}
        >
          <UButton size="small" class="h-8 u-h6">
            <div class="flex flex-nowrap items-center u-h6" ref={btnRef}>
              {getNetworkNode()}

              {globalConfigStore.isLargeScreen ? <ArrowDownOutlined class="h-4 ml-2 w-4" /> : null}
            </div>
          </UButton>
        </HeaderDropdown>
        <MobileSwitchNetTip />
      </>
    )
  }
})

export default NetworkSwitcher

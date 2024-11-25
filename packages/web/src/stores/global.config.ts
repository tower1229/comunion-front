import { UStyleProviderProps } from '@comunion/components'
import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

export type GlobalConfigState = {
  // current theme, default: light
  theme: 'light' | 'dark'
  mobileConnectModal: boolean
  mobileSwitchNetTip: boolean
}

export const useGlobalConfigStore = defineStore('globalConfig', {
  state: (): GlobalConfigState => ({
    theme: 'light',
    mobileConnectModal: false,
    mobileSwitchNetTip: false
  }),
  getters: {
    isLargeScreen: () => isLargeScreen.value,
    themeColors: state => UStyleProviderProps
  },
  actions: {
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  }
})

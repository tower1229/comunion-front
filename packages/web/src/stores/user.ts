import { message } from '@comunion/components'
import { storage } from '@comunion/utils'
import { signMessage } from '@wagmi/core'
import { defineStore } from 'pinia'
import { STORE_KEY_TOKEN } from '@/constants'
import router from '@/router'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import type { UserProfileState, UserResponse, ComerProfileState } from '@/types'

export type UserState = {
  // user token
  token: string | undefined
  // user profile
  profile: UserProfileState | null
  // user signin response
  userResponse: UserResponse | null
  // comer profile
  comerProfile: ComerProfileState | null
  // comer invite
  invitation_code: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: storage('local').get<string>(STORE_KEY_TOKEN),
    profile: null,
    userResponse: null,
    comerProfile: null,
    invitation_code: null
  }),
  getters: {
    logged: state => !!state.token,
    is_seted: state => state.profile?.is_seted,
    is_connected_wallet: state => !!state.profile?.address
  },
  actions: {
    async init(reload = false) {
      if (!reload && this.profile) return this.profile
      if (this.logged) {
        const { error, data } = await services['Comer@get-comer']()
        if (!error) {
          this.profile = data as unknown as UserProfileState
          return this.profile
        } else {
          // anything to do?
          return console.warn(`request error`)
        }
      } else {
        return console.warn(`user is unlogin`)
      }
    },
    async getComerProfile(reload = false) {
      if (!reload && this.comerProfile) return this.comerProfile
      if (this.logged) {
        const { error, data } = await services['Comer@get-comer-info-detail']()
        if (!error) {
          this.comerProfile = data as ComerProfileState
          return this.comerProfile
        } else {
          // anything to do?
          return null
        }
      } else {
        this.logout()
        return null
      }
    },
    refreshToken(token?: string) {
      this.token = token || storage('local').get<string>(STORE_KEY_TOKEN)
      storage('local').set(STORE_KEY_TOKEN, this.token as string)
    },
    mergeProfile(profile: Partial<UserProfileState>) {
      if (this.profile) {
        Object.assign(this.profile, profile)
      } else {
        this.profile = profile as UserProfileState
      }
    },
    async loginWithWalletAddress(address: string) {
      const invitation_code = this.invitation_code
      const { error, data } = await services['Authorization@get-nonce-by-address']({
        wallet_address: address
      })
      if (!error) {
        let signedMsg
        try {
          const signData = await signMessage({
            message: data.nonce!
          })
          if (signData) {
            signedMsg = signData
          } else {
            return new Error()
          }
        } catch (err) {
          alert('Wallet sign error:' + JSON.stringify(err))
          return false
        }
        const { error: tokenError, data: tokenData } = await services[
          'Authorization@login-by-wallet-address'
        ]({
          address,
          nonce: data.nonce!,
          signature: signedMsg,
          invitation_code: invitation_code ? invitation_code : undefined
        })
        if (tokenError) {
          console.error('get token fail')
          return false
        }
        console.log(2222222, tokenData)
        this.setLocalToken(tokenData?.token || '')
        const { error: error2, data: data2 } = await services['Comer@get-comer']()
        if (!error2) {
          this.onLogin(tokenData?.token, data2 as UserProfileState)
          return true
        } else {
          console.error('Login failed when parse signature')
          return false
        }
      } else {
        console.error('Login failed when get nonce')
        return false
      }
    },
    setLocalToken(token: string) {
      storage('local').set(STORE_KEY_TOKEN, token)
      this.token = token
    },
    onLogin(token: string, profile: UserProfileState) {
      this.setLocalToken(token)
      this.profile = profile
      this.userResponse = profile as UserResponse
      storage('session').set('oauth:info', this.userResponse)
    },
    onLogout() {
      const walletStore = useWalletStore()
      this.token = ''
      this.profile = null
      this.userResponse = null
      this.comerProfile = null
      storage('session').clear()
      storage('local').remove(STORE_KEY_TOKEN)
      console.log('onLogout disconnectWallet')
      walletStore.disconnectWallet()
    },
    logout(msg?: false | string, query?: any) {
      this.onLogout()
      if (msg) {
        message.info(typeof msg === 'string' ? msg : 'You have been logged out')
      }
      if (query !== false) {
        router.replace({ path: '/auth/login', query })
      }
    },
    setInvitationCode(code: string) {
      this.invitation_code = code
    }
  }
})

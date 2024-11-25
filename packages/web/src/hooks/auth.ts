import { storage } from '@comunion/utils'
import { toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import type { UserResponse } from '@/types'
export const landingRoute = '/project/list'

export type useCheckUserProfileParamsType = {
  route?: any
  router?: any
  handleUnlogin?: () => void
  handleUnseted?: () => void
  handleloged?: () => void
  flag?: string
  withoutJump?: boolean
}

export async function useCheckUserProfile(params?: useCheckUserProfileParamsType) {
  const userStore = useUserStore()
  const route = params?.route || useRoute()
  const router = params?.router || useRouter()
  await userStore.init()
  if (!userStore.logged) {
    if (!params?.withoutJump && route) {
      userStore.logout(
        false,
        route
          ? {
              from: route.path
            }
          : undefined
      )
    }

    typeof params?.handleUnlogin === 'function' && params?.handleUnlogin()
    return false
  } else {
    if (userStore.profile && !userStore.is_seted) {
      if (typeof params?.handleUnseted === 'function') {
        params?.handleUnseted()
      } else {
        if (route && route.path !== '/auth/register/simple') {
          router.replace('/auth/register/simple')
        } else {
          console.warn('route is undefined', params)
        }
      }

      return false
    } else {
      typeof params?.handleloged === 'function' && params?.handleloged()
      return true
    }
  }
}

export async function useOnLoggedIn(user?: UserResponse) {
  const userStore = useUserStore()
  const router = useRouter()
  console.log('useOnLoggedIn', user)
  if (user) {
    const { token, ..._user } = user
    userStore.onLogin(token, _user)
  }
  // oauth:info
  const result = storage('session').get('link:btn')
  if (result && (result === 'google' || result === 'github')) {
    storage('session').remove('link:btn')
    userStore.init(true)
    router.replace('/builder')
  } else {
    const userProfile = toRaw(userStore.profile)
    console.log(userProfile && Object.keys(userProfile))
    if (!userProfile || !Object.keys(userProfile).length) {
      console.log('oauth login')
      await userStore.init(true)
    }
    useCheckUserProfile({
      flag: 'useOnLoggedIn()'
    })
  }
}

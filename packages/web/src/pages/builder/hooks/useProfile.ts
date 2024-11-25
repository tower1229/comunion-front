import { computed, ref } from 'vue'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import type { ComerProfileState } from '@/types'

const userStore = useUserStore()

export function useProfile(comer_id?: any) {
  const currentComerProfile = ref<ComerProfileState | null>(null)

  userStore.getComerProfile().then(res => {
    currentComerProfile.value = res
  })

  const viewMode = computed(
    () => !!comer_id && String(currentComerProfile.value?.id) !== String(comer_id)
  )
  const loading = ref<boolean>(false)

  const profile = ref<ComerProfileState | null>(null)

  async function getProfileData(reload = false) {
    if (!reload && profile.value) {
      return profile.value
    }

    if (viewMode.value) {
      const { error, data } = await services['Comer@get-comer-info-detail-by-comer-id']({
        comer_id
      })
      if (!error) {
        profile.value = data as ComerProfileState
      } else {
        profile.value = null
      }
    } else {
      profile.value = await userStore.getComerProfile(reload)
    }
    return profile.value
  }

  // init
  // viewMode need reload
  getProfileData(viewMode.value)

  return {
    getProfileData,
    profile,
    viewMode,
    loading
  }
}

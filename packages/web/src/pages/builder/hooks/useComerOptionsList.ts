import { ref, computed } from 'vue'
import { getContactList } from '@/pages/project/util'
import { services } from '@/services'

type listType = {
  code?: string
  id: number
  name: string
  logo?: string
  type: number
}[]
const loading = ref(false)
const socialList = ref<listType | null>(null)
const languageList = ref<listType | null>(null)

export function useComerOptionsList() {
  const getSocialList = async (relaod = false) => {
    if (relaod) {
      socialList.value = null
    }
    if (socialList.value === null) {
      const { error, data } = await services['Social@get-socials']()
      if (!error) {
        socialList.value = data?.list || null
      }
    }
  }

  const getLanguageList = async (relaod = false) => {
    if (relaod) {
      languageList.value = null
    }
    if (languageList.value === null) {
      const { error, data } = await services['Language@get-languages']()
      if (!error) {
        languageList.value = data?.list || null
      }
    }
  }

  const initialize = async (reload = false) => {
    if (loading.value) {
      // console.warn('useComerOptionsList is loading')
      return null
    }
    loading.value = true
    return Promise.all([getSocialList(reload), getLanguageList(reload)]).finally(() => {
      loading.value = false
    })
  }

  initialize()

  return {
    socialList: computed(() =>
      getContactList(
        Array.isArray(socialList.value)
          ? socialList.value.map((item: any) => {
              return {
                id: 0,
                social_tool: {
                  id: 0,
                  logo: '',
                  name: item.name
                },
                social_tool_id: 0,
                target_id: 0,
                type: item.name,
                value: item.id
              }
            })
          : []
      )
    ),
    languageList,
    getSocialList,
    getLanguageList,
    initialize
  }
}

import { reactive, computed } from 'vue'
import { services } from '@/services'

type typeText =
  | 'comer'
  | 'startup'
  | 'bounty'
  | 'comer_skill'
  | 'startup_skill'
  | 'bounty_skill'
  | 'social'

type tagListType = {
  code?: string
  id: number
  name: string
  logo?: string
  type: number
}[]

export type SocialPropType = {
  id: number
  logo: string
  name: string
}

type tagListTypeKeys =
  | 'comer_tagList'
  | 'startup_tagList'
  | 'startup_ad_tagList'
  | 'bounty_tagList'
  | 'comer_skill_tagList'
  | 'startup_skill_tagList'
  | 'bounty_skill_tagList'
  | 'social_tagList'

type tagListGroupType = {
  comer_tagList: tagListType | null
  startup_tagList: tagListType | null
  startup_ad_tagList: tagListType | null
  bounty_tagList: tagListType | null
  comer_skill_tagList: tagListType | null
  startup_skill_tagList: tagListType | null
  bounty_skill_tagList: tagListType | null
  social_tagList: SocialPropType[] | null
}
const TagList = reactive<tagListGroupType>({
  comer_tagList: null,
  startup_tagList: null,
  startup_ad_tagList: null,
  bounty_tagList: null,
  comer_skill_tagList: null,
  startup_skill_tagList: null,
  bounty_skill_tagList: null,
  social_tagList: null
})

export function useTags(type: typeText, refresh = false, params?: Record<string, any>) {
  const dataKey = `${type}${params?.ad ? '_ad' : ''}_tagList` as tagListTypeKeys
  const getTypeList = async (reload = refresh) => {
    if (reload || TagList[dataKey] === null) {
      if (type === 'social') {
        const { error, data } = await services['Social@get-socials']({ type })
        if (!error) {
          TagList[dataKey] = data?.list || null
        } else {
          TagList[dataKey] = null
        }
      } else {
        const { error, data } = await services['Tag@get-tags-by-tag-type']({
          type,
          ...(params || {})
        })
        if (!error) {
          TagList[dataKey] = data?.list || null
        } else {
          TagList[dataKey] = null
        }
      }
    }
  }

  getTypeList()

  return {
    TagList: computed(() => TagList[dataKey]),
    reload: () => getTypeList(true)
  }
}

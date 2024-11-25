import { ref, computed } from 'vue'
import { services } from '@/services'
import { BountyInfo } from '@/types'
const loading = ref(false)

export default function useBounty(bounty_id: number) {
  const detail = ref<BountyInfo>()

  const get = async (reload = false) => {
    if (bounty_id) {
      if ((!detail.value && !loading.value) || reload) {
        loading.value = true
        const { error, data } = await services['Bounty@get-bounty-info']({
          bounty_id
        })
        loading.value = false
        if (!error) {
          detail.value = data
        }
      }

      return detail
    } else {
      return console.warn('useBounty() missing param [bounty_id]')
    }
  }

  get()

  return {
    reload: () => get(true),
    detail,
    applicants: computed(() => detail.value?.applicants),
    post_updates: computed(() => detail.value?.post_updates),
    startup: computed(() => detail.value?.startup),
    founder: computed(() => detail.value?.founder),
    approved: computed(() => detail.value?.approved),
    deposit_records: computed(() => detail.value?.deposit_records)
  }
}

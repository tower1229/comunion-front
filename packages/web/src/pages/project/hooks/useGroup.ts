import { ref } from 'vue'
import { services } from '@/services'
import { StartupTeamGroup } from '@/types'

export function useGroup() {
  const group = ref<StartupTeamGroup[]>([])

  const get = async (startup_id: number) => {
    if (startup_id) {
      const { data } = await services['Startup@get-startup-team-groups']({
        startup_id
      })
      if (Array.isArray(data?.list)) {
        group.value = data!.list
      }
    }
  }

  return {
    get,
    group
  }
}

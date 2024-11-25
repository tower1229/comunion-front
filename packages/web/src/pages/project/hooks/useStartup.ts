import { ref } from 'vue'
import { services } from '@/services'
import { StartupDetail } from '@/types'

export function useStartup(startup_id: number) {
  const startup = ref<StartupDetail>()
  const loading = ref(false)
  const get = async (reload = false) => {
    if (startup_id) {
      if (!startup.value || reload) {
        loading.value = true
        const { error, data } = await services['Startup@get-startup-info']({
          startup_id
        })
        loading.value = false
        if (!error) {
          startup.value = data
        }
      }

      return startup
    } else {
      return console.warn('useStartup() missing param [startup_id]')
    }
  }

  get()

  return {
    reload: () => get(true),
    detail: startup,
    loading
  }
}

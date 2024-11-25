import { ref } from 'vue'
import { ServiceReturn, services } from '@/services'

export type FollowedStartupType = NonNullable<
  ServiceReturn<'Comer@get-startup-connect-by-comer-id'>
>['list']

export function useFollowedStartups(comer_id: number) {
  const list = ref<NonNullable<FollowedStartupType>>([])
  const total = ref<number>(0)
  const page = ref<number>(1)
  const size = 5
  const fetchData = async () => {
    const { error, data } = await services['Comer@get-startup-connect-by-comer-id']({
      size,
      page: page.value,
      comer_id: String(comer_id)
    })
    if (!error) {
      if (data.list) {
        if (list.value) {
          list.value.push(...data.list)
        } else {
          list.value = data.list || []
        }
      } else {
        list.value = []
      }
      total.value = data.total
    }
  }

  const connect = async (startup_id: number, cb: () => void) => {
    const { error } = await services['Startup@connected-startup']({ startup_id })
    if (!error) {
      cb()
    }
  }

  const unconnect = async (startup_id: number, cb: () => void) => {
    const { error } = await services['Startup@unconnect-startup']({ startup_id })
    if (!error) {
      cb()
    }
  }

  const reset = () => {
    list.value = []
    total.value = 0
  }

  return {
    list,
    total,
    page,
    fetchData,
    connect,
    unconnect,
    reset
  }
}

import { ref } from 'vue'
import { useComer } from '../../hooks/comer'
import { ServiceReturn, services } from '@/services'

export type FollowedComerType = NonNullable<
  ServiceReturn<'Comer@get-comer-connect-comers-by-comer-id'>
>['list']

export function useFollowComer(comer_id: number) {
  const list = ref<NonNullable<FollowedComerType>>([])
  const total = ref<number>(0)
  const page = ref<number>(1)
  const size = 5

  const fetchData = async () => {
    if (comer_id) {
      services['Comer@get-comer-connect-comers-by-comer-id']({
        page: page.value,
        size,
        comer_id: String(comer_id)
      }).then(response => {
        const { error, data } = response
        if (!error) {
          if (data.list) {
            if (list.value) {
              list.value.push(...data.list)
            } else {
              list.value = (data.list || []) as NonNullable<FollowedComerType>
            }
          } else {
            list.value = []
          }
        }
        total.value = data?.total || 0
      })
    } else {
      console.warn('useFollowComer: Missing parameter comet_ id')
    }
  }

  const connect = async (id: number, cb: () => void) => {
    const comerService = useComer(id)
    const { error } = await comerService.follow()
    if (!error) {
      cb()
    }
  }

  const unconnect = async (id: number, cb: () => void) => {
    const comerService = useComer(id)
    const { error } = await comerService.unfollow()
    if (!error) {
      cb()
    }
  }

  const reset = () => {
    total.value = 0
    list.value = []
  }

  return {
    list,
    total,
    reset,
    fetchData,
    connect,
    unconnect,
    page
  }
}

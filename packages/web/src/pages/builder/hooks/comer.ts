import { services } from '@/services'

export function useComer(comer_id: number) {
  const follow = () => {
    return services['Comer@connect-comer']({
      comer_id
    })
  }

  const unfollow = () => {
    return services['Comer@unconnect-comer']({
      comer_id
    })
  }

  const followByMe = () =>
    services['Comer@connected-comer']({
      comer_id
    })

  return {
    follow,
    unfollow,
    followByMe
  }
}

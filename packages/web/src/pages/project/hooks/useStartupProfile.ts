import { services } from '@/services'

export function useStartupProfile() {
  const getUserIsFollow = async (startup_id: number) => {
    return new Promise((resolve, reject) => {
      services['Startup@connected-startup']({
        startup_id
      }).then(res => {
        const { error, data } = res
        if (!error) {
          resolve(data.is_connected)
          return
          // userIsFollow.value = data!.isFollowed
        }
        reject()
      })
    })
  }

  const toggleFollowStartup = (type: string, startup_id: number) => {
    return new Promise<any>((resolve, reject) => {
      services[type === 'follow' ? 'Startup@connect-startup' : 'Startup@unconnect-startup']({
        startup_id
      }).then(res => {
        const { error } = res
        if (!error) {
          resolve(getUserIsFollow(startup_id))
          return
        }
        reject()
      })
    })
  }
  return {
    toggleFollowStartup,
    getUserIsFollow
  }
}

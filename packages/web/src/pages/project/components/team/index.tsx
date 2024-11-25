import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed, ref, PropType } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import { useComer } from '@/pages/builder/hooks/comer'
import defaultAvatar from '@/pages/project/setting/components/team/assets/avatar.png?url'
type MemberType = {
  comer?:
    | {
        address: string
        avatar: string
        id: number
        name: string
        is_connected?: boolean
        location?: string
      }
    | undefined
  comer_id: number
  id: number
  position: string
  start_team_group?: { comer_id: number; id: number; name: string; startup_id: number } | undefined
  startup_id: number
  startup_team_group_id: number
}

export default defineComponent({
  props: {
    startupId: {
      type: Number,
      required: true
    },
    teamDetail: {
      type: Array as PropType<MemberType[]>,
      required: true,
      default: null
    }
  },
  setup(props) {
    const maxShowNumber = ref(5)
    const list = computed<MemberType[]>(() =>
      Array.isArray(props.teamDetail) ? props.teamDetail : []
    )

    const title = computed(() => {
      return `Team(${list.value?.length || 0})`
    })

    return {
      title,
      list,
      maxShowNumber
    }
  },
  render() {
    const handleConnect = async (item: any) => {
      const comerService = useComer(item.comerId)
      const { error } = await comerService.follow()
      if (!error) {
        typeof item.cb === 'function' && item.cb()
      }
    }

    const handleUnConnect = async (item: any) => {
      const comerService = useComer(item.comerId)
      const { error } = await comerService.unfollow()
      if (!error) {
        typeof item.cb === 'function' && item.cb()
      }
    }

    const handleMore = () => {
      this.maxShowNumber = 0
    }

    const listData = this.maxShowNumber ? this.list?.slice(0, this.maxShowNumber) : this.list

    return (
      <UCard title={this.title} class="mb-6">
        {listData?.map(item => (
          <BasicItem
            class="-mx-4"
            item={{
              comerId: item.comer?.id,
              comerName: item.comer?.name,
              followedByMe: item.comer?.is_connected
            }}
            onConnect={handleConnect}
            onUnconnect={handleUnConnect}
            keyMap={{
              name: 'comerName',
              follow: 'followedByMe'
            }}
            v-slots={{
              avatar: () => (
                <div
                  class="cursor-pointer flex h-9 w-9 items-center overflow-hidden"
                  onClick={() =>
                    this.$router.push({ path: '/builder', query: { id: item.comer_id } })
                  }
                >
                  <ULazyImage src={item.comer?.avatar || defaultAvatar} />
                </div>
              ),
              content: () => (
                <div class="flex-1 overflow-hidden">
                  <p class="text-color1 truncate u-h5">{item.comer?.name}</p>
                  <p class="truncate u-h7 !px-0 !text-color3">{item.comer?.location}</p>
                </div>
              )
            }}
          />
        ))}
        {this.maxShowNumber > 0 && this.list?.length > this.maxShowNumber && (
          <div class="flex mt-5 justify-center">
            <LoadingBtn onMore={handleMore} end={false} />
          </div>
        )}
      </UCard>
    )
  }
})

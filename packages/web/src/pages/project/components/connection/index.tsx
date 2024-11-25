import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed, ref } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import { useComer } from '@/pages/builder/hooks/comer'
import defaultAvatar from '@/pages/project/setting/components/team/assets/avatar.png?url'
import { services } from '@/services'

type MemberType =
  | {
      address: string
      avatar: string
      id: number
      name: string
      comer_id?: number
      contract_audit?: string
      kyc?: string
      logo?: string
      mission?: string
      type?: number
    }[]
  | null

export default defineComponent({
  props: {
    startupId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const maxShowNumber = ref(5)
    const list = ref<MemberType | null>(null)

    services['Startup@get-comer-connect-startup-comers-by-startup-id']({
      startup_id: String(props.startupId)
    }).then(res => {
      if (!res.error) {
        list.value = res.data?.list || null
      }
    })

    const title = computed(() => {
      return `Connection (${list.value?.length || 0})`
    })

    return {
      title,
      list,
      maxShowNumber
    }
  },
  render() {
    const handleConnect = async (item: any) => {
      const comerService = useComer(item.id)
      const { error } = await comerService.follow()
      if (!error) {
        typeof item.cb === 'function' && item.cb()
      }
    }

    const handleUnConnect = async (item: any) => {
      const comerService = useComer(item.id)
      const { error } = await comerService.unfollow()
      if (!error) {
        typeof item.cb === 'function' && item.cb()
      }
    }

    const handleMore = () => {
      this.maxShowNumber = 0
    }

    const fullList = this.list || []
    const listData = this.maxShowNumber ? fullList.slice(0, this.maxShowNumber) : fullList

    return (
      <UCard title={this.title} class="mb-6">
        {listData.map(item => (
          <BasicItem
            class="-mx-4"
            item={item}
            onConnect={handleConnect}
            onUnconnect={handleUnConnect}
            keyMap={{
              name: 'name',
              follow: 'is_connected'
            }}
            v-slots={{
              avatar: () => (
                <div
                  class="cursor-pointer flex h-9 w-9 items-center overflow-hidden"
                  onClick={() => this.$router.push({ path: '/builder', query: { id: item.id } })}
                >
                  <ULazyImage src={item.avatar || defaultAvatar} />
                </div>
              )
            }}
          />
        ))}
        {this.maxShowNumber > 0 && fullList.length > this.maxShowNumber && (
          <div class="flex mt-5 justify-center">
            <LoadingBtn onMore={handleMore} end={false} />
          </div>
        )}
      </UCard>
    )
  }
})

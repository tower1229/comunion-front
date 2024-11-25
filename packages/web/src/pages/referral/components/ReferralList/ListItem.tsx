import dayjs from 'dayjs'
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
export const ListItem = defineComponent({
  name: 'ListItem',
  props: {
    detail: {
      type: Object,
      default: {}
    }
  },
  setup(props, ctx) {
    const detail = computed(() => props.detail)
    const router = useRouter()
    const addressSimple = (text = '') => {
      const str = text
      let reStr = '--'
      if (str) {
        reStr = `${str.substring(0, 6)}...${str.substring(str.length - 4, str.length)}`
      }
      return reStr
    }
    const goComerPath = (id: string) => {
      router.push(`/builder?id=${id}`)
    }
    return () => (
      <div class="w-full border-b-1 border-[#F5F6FA] hover:bg-[#F0F0F0]">
        <div class="flex items-center py-4 px-12 u-h6 text-color1">
          <p class="w-72">
            {dayjs.utc(Number(detail.value.created_at)).format('YYYY/MM/DD HH:mm UTC')}
          </p>
          <p
            class="w-59 cursor-pointer hover:text-primary"
            onClick={() => goComerPath(detail.value.invitee.id)}
          >
            {addressSimple(detail.value.invitee.address)}
          </p>
          <p class="w-50 flex items-center">
            <p
              class={`mr-2 w-1.5 h-1.5 ${
                detail.value.invitee.activation ? 'bg-[#00BFA5]' : 'bg-black bg-opacity-10'
              }`}
            ></p>
            <p>{detail.value.invitee.activation ? 'Active' : 'Inactived'}</p>
          </p>
          <p>Coming soon</p>
        </div>
      </div>
    )
  }
})

export default ListItem

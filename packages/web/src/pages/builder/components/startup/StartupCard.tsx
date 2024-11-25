import { UTag } from '@comunion/components'
import { SettingOutlined } from '@comunion/icons'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { useUserStore } from '@/stores'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const userStore = useUserStore()
    const router = useRouter()

    const basicSetting = (e: Event) => {
      e.stopPropagation()
      router.push({ path: `/project/setting/${props.startup.id}` })
    }

    const toStartDetail = () => {
      router.push({ path: `/project/${props.startup.id}` })
    }

    const isFounder = computed(() => {
      return userStore.profile?.id === props.startup?.comer_id
    })

    return () => (
      <div
        class="rounded-sm cursor-pointer flex py-4 px-4 items-center hover:bg-color-hover"
        onClick={toStartDetail}
      >
        <StartupLogo src={props.startup.logo} class="rounded-sm h-15 mr-4 w-15" />
        <div class="flex-1">
          <div class="mb-2 text-color1 u-h4">{props.startup.name}</div>
          {Array.isArray(props.startup.tags) && (
            <div class="flex gap-2 items-center">
              {props.startup.tags.map((item, i) => {
                return i + 1 < 4 ? <UTag key={item.id}>{item.tag?.name}</UTag> : null
              })}
              {props.startup.tags.length - 4 > 0 ? (
                <UTag class="text-color1">+ {props.startup.tags.length - 4}</UTag>
              ) : null}
            </div>
          )}
        </div>
        {isFounder.value && (
          <span class="text-color3 u-h6 <lg:hidden hover:text-primary" onClick={basicSetting}>
            <SettingOutlined class="cursor-pointer rounded-2 h-4 mr-1 w-4 align-middle" /> Settings
          </span>
        )}
      </div>
    )
  }
})

export default StartupCard

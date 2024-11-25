import { UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar'
import { BountyComer } from '@/types'

export default defineComponent({
  name: 'PersonalCard',
  props: {
    profile: {
      type: Object as PropType<BountyComer>,
      require: true
    }
  },
  setup(props) {
    const router = useRouter()

    const normalize = computed(() => {
      return {
        skills: props.profile?.skills,
        comerId: props.profile?.id,
        name: props.profile?.name,
        avatar: props.profile?.avatar || '',
        location: props.profile?.location,
        timeZone: props.profile?.time_zone
      }
    })

    return { router, normalize }
  },

  render() {
    const toComerDetail = () => {
      this.router.push({ path: '/builder', query: { id: this.normalize?.comerId } })
    }
    return (
      <div class="flex">
        <Avatar avatar={this.normalize.avatar} onClickAvatar={toComerDetail} class="!h-9 !w-9" />
        <div class="flex-1 ml-4 overflow-hidden">
          <div class=" mb-2 truncate u-h3">{this.normalize.name}</div>
          <div class="flex flex-wrap mb-2 gap-2 items-center">
            {Array.isArray(this.normalize.skills) && (
              <>
                {this.normalize.skills.map((item, i) => {
                  return i + 1 < 4 ? (
                    <UTag class="text-[#211B42]" key={item.id}>
                      {item.tag?.name}
                    </UTag>
                  ) : null
                })}
                {this.normalize.skills.length - 4 > 0 ? (
                  <UTag class="text-[#211B42]">+ {this.normalize.skills.length - 4}</UTag>
                ) : null}
              </>
            )}
          </div>
          <div class="mb-2 text-color3 text-[14px] leading-4 u-h6">
            {this.normalize.location ? `${this.normalize.location} · ` : ''}
            {this.normalize.timeZone}
          </div>
        </div>
      </div>
    )
  }
})

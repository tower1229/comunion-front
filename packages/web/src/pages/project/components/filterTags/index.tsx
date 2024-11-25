import { UTag } from '@comunion/components'
import { defineComponent, computed, PropType, ref } from 'vue'
import { useTags } from '@/hooks'

export default defineComponent({
  name: 'ProjectFilterTags',
  props: {
    value: {
      type: Array as PropType<string[]>
    },
    showLength: {
      type: Number,
      default: 10
    }
  },
  emits: ['change'],
  setup(props, ctx) {
    const startupTags = useTags('startup', false, {
      ad: true
    })

    const list = computed(() => startupTags.TagList.value || [])
    const handleClick = (item: any) => {
      if (props.value?.includes(item.name)) {
        ctx.emit(
          'change',
          props.value.filter((tag: string) => tag !== item.name)
        )
      } else {
        ctx.emit('change', [...(props.value || []), item.name])
      }
    }

    const showAll = ref(false)

    return {
      list,
      showAll,
      handleClick
    }
  },
  render() {
    return (
      <div class="flex flex-wrap gap-2">
        {this.list.map((item: any, index: number) => {
          return (
            (this.showAll || index < this.showLength) && (
              <UTag
                class={
                  'text-color1 cursor-pointer hover:text-primary' +
                  (this.value?.includes(item.name) ? ' text-primary !border-primary' : '')
                }
                onClick={() => this.handleClick(item)}
              >
                {item.name}
              </UTag>
            )
          )
        })}

        {this.list.length - this.showLength > 0 ? (
          <UTag
            class="cursor-pointer !border-0 hover:text-primary"
            onClick={() => (this.showAll = !this.showAll)}
          >
            {this.showAll ? 'Less Tag' : 'More Tag'}
          </UTag>
        ) : null}
      </div>
    )
  }
})

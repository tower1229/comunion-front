import { UCard } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'

export type CardContentConfig = {
  width: number
}

export default defineComponent({
  name: 'DialogContent',
  props: {
    content: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      require: true
    },
    config: {
      type: Object as PropType<CardContentConfig>,
      require: true
    }
  },
  setup(props, ctx) {
    const widthStyle = computed<object>(() => {
      return { width: `${props.config?.width}px` }
    })

    return () => (
      <UCard
        style={{ ...widthStyle.value, '--n-title-text-color': '#000' }}
        title={props.title}
        bordered={false}
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>
          {typeof ctx.slots.content === 'function' ? ctx.slots.content() : <p> {props.content}</p>}
          {ctx.slots.footer?.()}
        </div>
      </UCard>
    )
  }
})

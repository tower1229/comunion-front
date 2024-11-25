import { UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    },
    text: {
      type: String,
      default: 'No activity yet'
    }
  },
  setup(props, ctx: any) {
    const text = computed(() => props.text)
    const tip = ctx.slots.tip?.() ?? null
    return { text, tip }
  },
  render() {
    return (
      <UNoContent textTip={`${this.text}`} class="my-10" v-slots={{ tip: () => this.tip }}>
        <EmptyFilled class="-mb-14 max-w-60" />
      </UNoContent>
    )
  }
})

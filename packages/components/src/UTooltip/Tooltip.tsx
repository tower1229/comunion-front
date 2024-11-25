import type { TooltipProps } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import { defineComponent } from 'vue'

export type UTooltipPropsType = TooltipProps

const UTooltip = defineComponent({
  name: 'UTooltip',
  extends: NTooltip,
  setup(props, ctx) {
    return () => <NTooltip {...props} v-slots={ctx.slots} />
  }
})

export default UTooltip

import { NPopover, PopoverProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type UPopoverProps = PopoverProps

export const UPopover = defineComponent({
  name: 'UPopover',
  extends: NPopover,
  setup(props, ctx) {
    return () => <NPopover {...props} v-slots={ctx.slots} />
  }
})

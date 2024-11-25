import { NBackTop } from 'naive-ui'
import type { BackTopProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type UBackTopPropsType = BackTopProps

const UBackTop = defineComponent({
  name: 'UBackTop',
  extends: NBackTop,
  setup(props, ctx) {
    return () => <NBackTop {...props}>{ctx.slots.default?.()}</NBackTop>
  }
})

export default UBackTop

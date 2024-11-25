import type { GridItemProps } from 'naive-ui'
import { NGridItem } from 'naive-ui'
import { defineComponent } from 'vue'

const UGridItem = defineComponent<GridItemProps>({
  name: 'UGridItem',
  setup(props, ctx) {
    return () => <NGridItem {...ctx.attrs}>{ctx.slots.default}</NGridItem>
  }
})

export default UGridItem

import type { GridProps } from 'naive-ui'
import { NGrid } from 'naive-ui'
import { defineComponent } from 'vue'

const UGrid = defineComponent<GridProps>({
  name: 'UGrid',
  setup(props, ctx) {
    return () => <NGrid {...ctx.attrs}>{ctx.slots}</NGrid>
  }
})

export default UGrid

import { NTable } from 'naive-ui'
import { defineComponent } from 'vue'

export const UTable = defineComponent({
  name: 'UTable',
  extends: NTable,
  setup(props, ctx) {
    return () => <NTable {...props} v-slots={ctx.slots} />
  }
})

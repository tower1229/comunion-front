import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'

export type UInputPropsType = InputProps

export default defineComponent({
  name: 'UInput',
  extends: NInput,
  setup(props, ctx) {
    return () => {
      return <NInput {...props} v-slots={ctx.slots} />
    }
  }
})

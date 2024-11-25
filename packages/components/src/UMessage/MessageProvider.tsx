import { NMessageProvider } from 'naive-ui'
import { defineComponent } from 'vue'

const UMessageProvider = defineComponent({
  name: 'UMessageProvider',
  setup(props, ctx) {
    return () => (
      <NMessageProvider containerStyle={{ zIndex: 3001 }}>{ctx.slots.default?.()}</NMessageProvider>
    )
  }
})

export default UMessageProvider

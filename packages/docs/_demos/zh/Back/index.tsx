import { UBack, UStyleProvider } from '@comunion/components'
import { defineComponent } from 'vue'

const BackDemoPage = defineComponent({
  name: 'BackDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UBack></UBack>
        </UStyleProvider>
      </>
    )
  }
})

export default BackDemoPage

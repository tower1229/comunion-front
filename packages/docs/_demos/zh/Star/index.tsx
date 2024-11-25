import { UStar, UStyleProvider } from '@comunion/components'
import { defineComponent } from 'vue'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UStar>Premium</UStar>
        </UStyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage

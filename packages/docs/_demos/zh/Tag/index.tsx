import { UTag, UStyleProvider } from '@comunion/components'
import { defineComponent } from 'vue'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UTag>Premium</UTag>
        </UStyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage

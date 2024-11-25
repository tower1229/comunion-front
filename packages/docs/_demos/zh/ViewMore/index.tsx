import { UViewMore, UStyleProvider } from '@comunion/components'
import { defineComponent } from 'vue'

const ViewMoreDemoPage = defineComponent({
  name: 'ViewMoreDemoPage',
  setup() {
    return () => (
      <>
        <UStyleProvider>
          <UViewMore>View all 250 comers</UViewMore>
        </UStyleProvider>
      </>
    )
  }
})

export default ViewMoreDemoPage

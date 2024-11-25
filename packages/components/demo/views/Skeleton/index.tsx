import { defineComponent } from 'vue'
import { USkeleton } from '@/comps/index'

const SkeletonDemoPage = defineComponent({
  name: 'SkeletonDemoPage',
  setup() {
    return () => (
      <>
        <USkeleton text repeat={2} />
        <USkeleton text class="!w-1/2" />
      </>
    )
  }
})

export default SkeletonDemoPage

import { USkeleton } from '@comunion/components'
import { defineComponent } from 'vue'

const CrowdfundingSkeleton = defineComponent({
  name: 'CrowdfundingSkeleton',
  setup(props) {
    return () => (
      <div class="bg-white rounded-sm h-108 relative">
        <div class="p-4">
          <USkeleton class=" rounded mb-8" height="10rem" />
          <div class="flex mb-4">
            <div class="flex-1">
              <USkeleton height="1.25rem" />
            </div>
            <USkeleton class=" ml-4" width="1.5rem" height="1.25rem" />
          </div>
          <div class="flex mb-4">
            <div class="flex-1">
              <USkeleton width="6.75rem" height="3.375rem" />
            </div>
            <USkeleton class="ml-2" height="1.25rem" width="3.375rem" />
            <USkeleton class="ml-2" height="1.25rem" width="3.375rem" />
          </div>
          <USkeleton class=" mb-1rem" height="1.25rem" />
          <USkeleton class=" mb-1rem" height="1.25rem" />
          <USkeleton class=" mb-1rem" height="1.25rem" />
        </div>
      </div>
    )
  }
})

export default CrowdfundingSkeleton

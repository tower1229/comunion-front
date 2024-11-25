import { USkeleton } from '@comunion/components'
import { defineComponent } from 'vue'

const StartupSkeleton = defineComponent({
  name: 'StartupSkeleton',
  setup(props) {
    return () => (
      <div class="bg-white rounded cursor-pointer h-90 relative">
        <div class="p-6">
          <div class="mb-2rem overflow-hidden">
            <USkeleton class="rounded-md float-left" width="4rem" height="4rem" />
            <USkeleton class="rounded--sm float-right" width="3rem" height="1.6rem" />
            <USkeleton
              class="rounded-sm mt-0.8rem float-right clear-right"
              width="5rem"
              height="1.6rem"
            />
          </div>
          <USkeleton class="mb-1 h5" />
          <USkeleton class="mb-1 h5" />
          <USkeleton class="mb-1 h5" />
          <USkeleton
            class="rounded--sm mt-2rem float-left clear-right"
            width="5rem"
            height="1.6rem"
          />
        </div>
      </div>
    )
  }
})

export default StartupSkeleton

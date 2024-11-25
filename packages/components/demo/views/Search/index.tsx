import { defineComponent } from 'vue'
import { USearch } from '@/comps/index'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full">
          <div class="p-20px rounded-xl">
            <div class="text-16px mb-16px">基础</div>
            <div class="flex flex-row w-180px">
              <USearch />
            </div>
          </div>
        </div>
      )
    }
  }
})

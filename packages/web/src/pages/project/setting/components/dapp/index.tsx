import { UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    startup_id: {
      type: Number,
      required: true
    }
  },
  render() {
    return (
      <div class="bg-white border rounded-sm flex mb-6 min-h-200 relative  overflow-hidden items-center justify-center">
        <div class="my-9.5 mx-10">
          <UNoContent>
            <EmptyFilled class="-mb-14" />
          </UNoContent>
        </div>
      </div>
    )
  }
})

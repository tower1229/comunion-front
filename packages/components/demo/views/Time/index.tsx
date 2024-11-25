import { defineComponent } from 'vue'
import { UTime } from '@/comps/index'

const TimeDemoPage = defineComponent({
  name: 'TimeDemoPage',
  setup() {
    return () => <UTime />
  }
})

export default TimeDemoPage

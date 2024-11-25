import { defineComponent } from 'vue'
import { USlider } from '@/comps/index'

const SliderDemoPage = defineComponent({
  name: 'SliderDemoPage',
  setup() {
    return () => <USlider />
  }
})

export default SliderDemoPage

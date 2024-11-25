import { defineComponent } from 'vue'
import { USwitch } from '@/comps/index'

const SwitchDemoPage = defineComponent({
  name: 'SwitchDemoPage',
  setup() {
    return () => <USwitch />
  }
})

export default SwitchDemoPage

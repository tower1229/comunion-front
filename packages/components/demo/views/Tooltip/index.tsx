import { defineComponent } from 'vue'
import { UTooltip, UButton } from '@/comps/index'

const TooltipDemoPage = defineComponent({
  name: 'TooltipDemoPage',
  setup() {
    return () => (
      <UTooltip>
        {{
          trigger: () => <UButton>Trigger</UButton>,
          default: () => 'Content'
        }}
      </UTooltip>
    )
  }
})

export default TooltipDemoPage

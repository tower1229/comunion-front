import { defineComponent } from 'vue'
import CoverLink from './components/CoverLink'
import Text from './components/Text'

export default defineComponent({
  name: 'Combinator',
  setup() {
    return () => (
      <div class="pt-9 pb-20 <lg:px-4 <lg:pt-5 <lg:pb-5">
        <Text />
        <CoverLink class="mt-10" />
      </div>
    )
  }
})

import { defineComponent } from 'vue'
import HomeContent from '@/components/homeContent'

export default defineComponent({
  name: 'HomePage',
  setup() {
    return () => (
      <>
        <HomeContent />
      </>
    )
  }
})

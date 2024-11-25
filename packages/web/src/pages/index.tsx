import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { landingRoute } from '@/hooks'

const LandingPage = defineComponent({
  name: 'LandingPage',
  setup() {
    const router = useRouter()
    router.replace(landingRoute)
    return () => null
  }
})

export default LandingPage

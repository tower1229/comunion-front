import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Footer from '@/components/defaultFooter'
import Header from '@/components/defaultHeader'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
    return () => (
      <div class=" u-page-container">
        <Header />
        <RouterView />
        <Footer />
      </div>
    )
  }
})

export default DefaultLayout

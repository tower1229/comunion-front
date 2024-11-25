import { defineComponent } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const EmptyLayout = defineComponent({
  name: 'EmptyLayout',
  setup() {
    const route = useRoute()
    console.log('route.fullPath', route.fullPath)

    return () => <RouterView key={route.fullPath} />
  }
})

export default EmptyLayout

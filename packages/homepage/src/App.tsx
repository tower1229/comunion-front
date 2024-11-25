import { UMessage, UMessageProvider, UModalProvider } from '@comunion/components'
import { UStyleProvider } from '@comunion/components/src/UStyleProvider'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <UStyleProvider>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <UModalProvider>
          <RouterView />
        </UModalProvider>
      </UStyleProvider>
    )
  }
})

import { defineComponent } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const ProfileLayout = defineComponent({
  name: 'ProfileLayout',
  setup() {
    const route = useRoute()

    return () => <RouterView key={route.fullPath} class="text-[14px] profilePage" />
  }
})

export default ProfileLayout

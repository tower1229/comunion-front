import { defineComponent } from 'vue'
import { useUserStore } from '@/stores'

const SwitchAccount = defineComponent({
  name: 'SwitchAccountPage',
  setup() {
    const userStore = useUserStore()
    return () => (
      <div class="flex mt-8 pb-4">
        <div
          class="cursor-pointer ml-auto text-primary hover:underline"
          onClick={() => userStore.logout()}
        >
          Switch account &gt;
        </div>
      </div>
    )
  }
})

export default SwitchAccount

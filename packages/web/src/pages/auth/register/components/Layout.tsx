import { defineComponent } from 'vue'

const RegisterLayout = defineComponent({
  name: 'RegisterLayout',
  setup(_, ctx) {
    return () => (
      <div class="bg-purple h-full min-h-screen text-[14px] relative">
        <div class="u-page-container">
          {ctx.slots.default?.()}
          {/* <SwitchAccount /> */}
        </div>
      </div>
    )
  }
})

export default RegisterLayout

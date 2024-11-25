import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PayedMask',
  render() {
    return (
      <div class="flex bg-[rgba(83,49,244,.4)] inset-0 z-9 absolute justify-center items-center">
        <div class="bg-white rounded cursor-default h-8 text-warning text-center  transform leading-8 w-18 -rotate-15 u-title2">
          PAID
        </div>
      </div>
    )
  }
})

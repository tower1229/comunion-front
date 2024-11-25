import { defineComponent } from 'vue'
import cover from '../image/coverlist.png'
import animate from './animate.module.css'
import activeBg from '@/assets/active.png'

export const CoverLink = defineComponent({
  name: 'CoverLink',
  setup() {
    return () => (
      <div class="mx-auto relative">
        <div
          class={`absolute top-6 right-5 h-5 leading-5 font-primary text-xs text-[#ffffff] text-center font-bold w-17 z-10 ${
            animate['active'] || ''
          }`}
        >
          <img class="top-0 left-0 absolute" src={activeBg} alt="" />
          <div class="z-10 relative">Active</div>
        </div>
        <div class={`relative w-full mx-auto z-1 cursor-pointer overflow-hidden`}>
          <img
            class={`relative w-fullmx-auto z-1 cursor-pointer ${animate['undefined-grow']}`}
            src={cover}
            onClick={() => {
              window.open('https://discord.gg/zxAyzDQNwE')
            }}
          />
        </div>
      </div>
    )
  }
})
export default CoverLink

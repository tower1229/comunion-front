import { defineComponent } from 'vue'
import oauthClass from './OAuthSignBtn.module.css'

export default defineComponent({
  name: 'OAuthSignBtn',
  emits: ['triggerBtn'],
  render() {
    const handleClick = () => {
      this.$emit('triggerBtn')
    }
    return (
      <div
        class={`${oauthClass.oauthBtn} w-full h-40px flex items-center border border-[#666] rounded-2px cursor-pointer`}
        onClick={handleClick}
      >
        {this.$slots.default?.()}
      </div>
    )
  }
})

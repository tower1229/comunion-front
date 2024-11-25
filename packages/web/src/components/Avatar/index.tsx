import { ULazyImage } from '@comunion/components'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    avatar: {
      type: String,
      required: true
    }
  },
  emits: ['clickAvatar'],
  render() {
    const clickAvatar = () => {
      this.$emit('clickAvatar')
    }
    return (
      <div
        class={`u-lazy-image-img rounded-1/2 h-15 w-15 cursor-pointer overflow-hidden`}
        onClick={clickAvatar}
      >
        <ULazyImage src={this.avatar || ''} class="h-full w-full" />
      </div>
    )
  }
})

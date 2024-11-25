import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    end: {
      type: Boolean,
      required: true
    }
  },
  emits: ['more'],
  render() {
    const handleMore = () => {
      this.$emit('more')
    }
    return (
      <>
        {this.end ? null : (
          <div
            class="cursor-pointer flex px-4 text-color2 group justify-center items-center u-h5 hover:text-primary"
            onClick={handleMore}
          >
            <span class="mr-2">
              {typeof this.$slots.text === 'function' ? this.$slots.text() : 'More'}
            </span>
            <ArrowDownOutlined class={`text-color2 w-4 h-4 group-hover:text-primary `} />
          </div>
        )}
      </>
    )
  }
})

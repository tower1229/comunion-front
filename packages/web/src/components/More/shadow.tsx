import { ArrowDownOutlined, ArrowUpOutlined } from '@comunion/icons'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    fold: {
      type: Boolean,
      required: true
    }
  },
  emits: ['more'],
  setup(props) {
    const btnText = computed(() => {
      return props.fold ? 'More' : 'Less'
    })
    return {
      btnText
    }
  },
  render() {
    const handleMore = () => {
      this.$emit('more')
    }
    return (
      <div
        class="w-100px flex justify-center items-center text-color2 text-[14px]  font-semibold cursor-pointer"
        onClick={handleMore}
      >
        <span class="mr-2 text-[14px]  font-semibold">{this.btnText}</span>
        {this.fold ? (
          <ArrowDownOutlined class="text-color2 w-4 h-4" />
        ) : (
          <ArrowUpOutlined class="text-color2 w-4 h-4" />
        )}
      </div>
    )
  }
})

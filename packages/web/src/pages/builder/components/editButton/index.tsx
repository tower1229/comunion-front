import { defineComponent } from 'vue'

export default defineComponent({
  name: 'editButton',
  emits: ['handleClick'],
  render() {
    const handleClick = () => {
      this.$emit('handleClick')
    }
    return (
      <span onClick={handleClick} class="cursor-pointer text-color3 hover:text-primary">
        {typeof this.$slots.default === 'function' ? this.$slots.default() : 'Edit'}
      </span>
    )
  }
})

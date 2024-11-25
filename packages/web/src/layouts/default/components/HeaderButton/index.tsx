import { defineComponent } from 'vue'

const HeaderButton = defineComponent({
  name: 'HeaderButton',
  emits: ['click'],
  setup(props, ctx) {
    return () => (
      <div {...ctx.attrs} onClick={() => ctx.emit('click')}>
        {ctx.slots.default?.()}
      </div>
    )
  }
})

export default HeaderButton

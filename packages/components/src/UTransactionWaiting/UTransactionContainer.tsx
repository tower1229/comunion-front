import { defineComponent, onMounted, ref, TransitionGroup } from 'vue'
import './UTransactionContainer.css'

const UTransactionContainer = defineComponent({
  name: 'UTransactionContainer',
  setup(props, ctx) {
    const el = ref<{ $el: HTMLDivElement }>()
    onMounted(() => {
      el.value?.$el?.classList.add('u-transaction-container')
    })
    return () => (
      <TransitionGroup name="transactions" tag="div" ref={el}>
        {ctx.slots.default?.()}
      </TransitionGroup>
    )
  }
})

export default UTransactionContainer

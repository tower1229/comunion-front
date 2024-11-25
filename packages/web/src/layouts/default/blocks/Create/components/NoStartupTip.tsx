import { UButton, UCard, UModal } from '@comunion/components'
import { defineComponent, ref } from 'vue'

const NoStartupTip = defineComponent({
  name: 'NoStartupTip',
  emits: ['toCreate'],
  setup(props, ctx) {
    const modalVisibleState = ref(false)
    const modalDescription = ref('Please do create a project before creating a bounty.')

    const show = (msg?: string) => {
      msg && (modalDescription.value = msg)
      modalVisibleState.value = true
    }
    const close = () => {
      modalVisibleState.value = false
    }
    const toCreateStartup = () => {
      modalVisibleState.value = false
      ctx.emit('toCreate')
    }
    ctx.expose({
      show,
      close
    })

    return () => (
      <UModal v-model:show={modalVisibleState.value} maskClosable={false} autoFocus={false}>
        <UCard
          style={{ width: '540px', '--n-title-text-color': '#000' }}
          size="huge"
          closable={true}
          onClose={close}
          title="You do need create a project at first"
        >
          <div class="min-h-20 text-color2 u-h6">{modalDescription.value}</div>
          <div class="flex mt-4 justify-end">
            <UButton type="primary" ghost class="mr-4 w-41" onClick={close}>
              Cancel
            </UButton>
            <UButton type="primary" class="w-41" onClick={toCreateStartup}>
              Go to create
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

export default NoStartupTip

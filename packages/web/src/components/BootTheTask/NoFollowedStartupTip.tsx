import { UButton, UCard, UModal } from '@comunion/components'
import { defineComponent, ref } from 'vue'

const NoFollowedStartupTip = defineComponent({
  name: 'NoFollowedStartupTip',
  emits: ['toCreate'],
  setup(props, ctx) {
    const modalVisibleState = ref(false)
    const show = () => {
      modalVisibleState.value = true
    }
    const close = () => {
      modalVisibleState.value = false
    }
    const toCreateStartup = () => {
      ctx.emit('toCreate')
      // modalVisibleState.value = false
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
          title="Please connect the project at first!"
        >
          {/* <div class="flex mt-3 ml-12 text-color1 items-center u-h3">
            <WarningFilled class="mr-2 w-10" />{' '}
            <span>Note: Please connect the project at first!</span>
          </div> */}
          <div class="flex mt-20 justify-end">
            <UButton type="primary" ghost class="h-9 mr-4 w-41" onClick={close}>
              Cancel
            </UButton>
            <UButton type="primary" class="h-9 w-41" onClick={toCreateStartup}>
              Connect
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

export default NoFollowedStartupTip

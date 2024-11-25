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
          title="You have not joined or connected any project"
        >
          <div class="mt-3 ml-12 text-grey3 u-h5">
            Please join or connect a project before create proposal
          </div>
          <div class="flex mt-20 justify-end">
            <UButton type="primary" ghost class="h-9 mr-4 w-41" onClick={close}>
              Cancel
            </UButton>
            <UButton type="primary" class="h-9 w-41" onClick={toCreateStartup}>
              Ok
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

export default NoFollowedStartupTip

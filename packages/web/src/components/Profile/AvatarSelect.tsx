import { UButton, UModal, UCard } from '@comunion/components'
import ULazyImage from '@comunion/components/src/ULazyImage/LazyImage'
import { HookFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import avatars from '@/components/Profile/avatars'

const AvatarSelect = defineComponent({
  name: 'AvatarSelect',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const selectedAvatar = ref(props.avatar)

    const cancel = () => {
      ctx.emit('update:show', false)
    }

    const submit = () => {
      ctx.emit('update:avatar', selectedAvatar.value)
      cancel()
    }

    const select = (avatarSrc: string) => {
      selectedAvatar.value = avatarSrc
    }

    return () => (
      <>
        <section>
          <UModal v-model:show={props.show} mask-closable={false}>
            <UCard
              style={{ width: '515px', '--n-title-text-color': '#000' }}
              size="huge"
              closable={true}
              title="Choose your avatar"
              onClose={cancel}
            >
              <div class="flex flex-wrap py-4 gap-4">
                {avatars.map(avatar => (
                  <div
                    key={avatar.src}
                    class="h-20 w-20 relative"
                    onClick={() => select(avatar.src)}
                  >
                    <>
                      <div
                        class={`h-full w-full rounded-1/2 bg-color-hover opacity-50 absolute cursor-pointer flex items-center justify-center ${
                          selectedAvatar.value === avatar.src ? 'z-1' : '-z-1'
                        }`}
                      >
                        <HookFilled class="" />
                      </div>
                      <ULazyImage
                        src={avatar.src}
                        class="rounded cursor-pointer h-full w-full justify-between"
                      />
                    </>
                  </div>
                ))}
              </div>
              <div class="mt-8 text-right">
                <UButton type="primary" ghost class="mr-4 w-41" onClick={cancel}>
                  Cancel
                </UButton>
                <UButton class="mr-4 w-41" onClick={submit} type="primary">
                  Submit
                </UButton>
              </div>
            </UCard>
          </UModal>
        </section>
      </>
    )
  }
})

export default AvatarSelect

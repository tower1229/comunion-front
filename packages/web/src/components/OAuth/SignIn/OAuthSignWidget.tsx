import { UModal } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { defineComponent, computed, ref, watchEffect, onUnmounted } from 'vue'
import useOAuth from '../Hooks/useOAuth'
import OAuthSignBtn from './OAuthSignBtn'
import { useUserStore } from '@/stores'

export default defineComponent({
  name: 'OAuthSignWidget',
  props: {
    inviteCode: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const userStore = useUserStore()
    const { googleLogin, githubLogin } = useOAuth()
    const associateWalletVisible = ref<boolean>(false)
    const dialogVisible = computed<boolean>(() => {
      return userStore.userResponse?.comerId === 0
    })
    const inviteCode = computed(() => props.inviteCode)
    const stop = watchEffect(() => {
      associateWalletVisible.value = dialogVisible.value
    })
    const googleLoginCollection = () => {
      googleLogin(inviteCode.value)
    }
    const githubLoginCollection = () => {
      githubLogin(inviteCode.value)
    }
    onUnmounted(() => {
      stop()
    })

    return () => (
      <>
        <UModal show={associateWalletVisible.value}></UModal>
        <div class="flex flex-col <md:mx-auto">
          <OAuthSignBtn onTriggerBtn={googleLoginCollection}>
            <GoogleFilled class="h-20px w-20px ml-16px mr-41px" />
            <span class="text-[#231944] font-bold text-14px">Sign in with Google</span>
          </OAuthSignBtn>
          <OAuthSignBtn onTriggerBtn={githubLoginCollection} class="mt-20px">
            <GithubFilled class="h-20px w-20px ml-16px mr-41px" />
            <span class="text-[#231944] font-bold text-14px">Sign in with Github</span>
          </OAuthSignBtn>
        </div>
      </>
    )
  }
})

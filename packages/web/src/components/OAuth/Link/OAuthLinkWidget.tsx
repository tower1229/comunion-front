import { UButton, UModal } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { storage } from '@comunion/utils'
import { defineComponent, ref, PropType, computed } from 'vue'
import CardContent from '../CardContent'
import useOAuth from '../Hooks/useOAuth'
import OAuthLinkBtn from './OAuthLinkBtn'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { UserResponse } from '@/types'

export type ComerAccount = {
  is_linked: boolean
  type: number
  id: number
}

// type AccountMap = {
//   [key: number]: string
// }

// const accountMap: AccountMap = {
//   1: 'Github',
//   2: 'Google'
// }

export default defineComponent({
  name: 'OAuthLinkWidget',
  props: {
    comerAccounts: {
      type: Array as PropType<ComerAccount[]>,
      required: true
    }
  },
  emits: ['update'],
  setup(props, ctx) {
    const loading = ref<boolean>(false)
    const { googleLogin, githubLogin } = useOAuth()
    const cantUnbind = ref<boolean>(false)
    const userStore = useUserStore()

    const onlyOneBound = computed(() => {
      let count = 0
      const profile = userStore.profile as UserResponse
      props.comerAccounts.forEach(item => {
        if (item.is_linked) {
          count += 1
        }
      })
      return count === 1 && profile.address === ''
    })

    const unBindVisible = ref<boolean>(false)
    const currentUnbindAccountId = ref<number>(-1)

    const getLinkedByAccountType = (type: number) => {
      const targetIndex = props.comerAccounts.findIndex(account => account.type === type)
      if (targetIndex !== -1) {
        return props.comerAccounts[targetIndex].is_linked
      }
      return false
    }

    const handleGoogleLink = (id: number) => () => {
      if (getLinkedByAccountType(2)) {
        if (onlyOneBound.value) {
          cantUnbind.value = true
          return
        }
        unBindVisible.value = true
        currentUnbindAccountId.value = id
        return
      }
      storage('session').set('link:btn', 'google')
      googleLogin()
    }

    const handleGithubLink = (id: number) => () => {
      if (getLinkedByAccountType(1)) {
        if (onlyOneBound.value) {
          cantUnbind.value = true
          return
        }
        unBindVisible.value = true
        currentUnbindAccountId.value = id
        return
      }
      storage('session').set('link:btn', 'github')
      githubLogin()
    }

    const triggerUnbindDialog = () => {
      unBindVisible.value = !unBindVisible.value
    }

    const triggerCantUnbindDialog = () => {
      cantUnbind.value = !cantUnbind.value
    }

    const unBindAccount = () => {
      loading.value = true
      services['Comer@unlink-oauth-by-comer-account-id']({
        comer_account_id: currentUnbindAccountId.value
      })
        .then(() => {
          userStore.init(true).then(() => {
            unBindVisible.value = false
            ctx.emit('update')
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      unBindVisible,
      triggerUnbindDialog,
      loading,
      unBindAccount,
      cantUnbind,
      triggerCantUnbindDialog,
      handleGoogleLink,
      handleGithubLink
    }
  },
  render() {
    return (
      <>
        <UModal show={this.unBindVisible}>
          <CardContent
            title="Unbind Account"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  After unbinding, you will not be able to sign in to the WELaunch account with this
                  social account.
                </p>
              ),
              footer: () => (
                <div class="flex mt-10 justify-end">
                  <UButton
                    onClick={this.triggerUnbindDialog}
                    disabled={this.loading}
                    class="w-160px"
                  >
                    Cancel
                  </UButton>
                  <UButton
                    type="primary"
                    class="ml-10px w-160px"
                    onClick={this.unBindAccount}
                    disabled={this.loading}
                  >
                    Sure
                  </UButton>
                </div>
              )
            }}
          />
        </UModal>
        <UModal show={this.cantUnbind}>
          <CardContent
            title="Tips"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  Please connect your wallet account before canceling the social account Association
                  ！
                </p>
              ),
              footer: () => (
                <div class="flex mt-10 justify-end">
                  <UButton
                    type="primary"
                    class="ml-10px w-160px"
                    onClick={this.triggerCantUnbindDialog}
                    disabled={false}
                  >
                    Sure
                  </UButton>
                </div>
              )
            }}
          />
        </UModal>
        {Array.isArray(this.comerAccounts) &&
          this.comerAccounts.map(account => {
            if (account.type === 1) {
              // github
              return (
                <OAuthLinkBtn
                  class="mr-4 mb-4"
                  onTriggerClick={this.handleGithubLink(account.id)}
                  disabled={false}
                >
                  <GithubFilled class="h-5 mr-4 w-5" />
                  <span class=" u-h5">
                    {account.is_linked ? (
                      <span class="text-color2">Linked</span>
                    ) : (
                      <span class="text-color1">Link</span>
                    )}
                  </span>
                </OAuthLinkBtn>
              )
            } else if (account.type === 2) {
              // google
              return (
                <OAuthLinkBtn
                  class="mr-4 mb-4"
                  onTriggerClick={this.handleGoogleLink(account.id)}
                  disabled={false}
                >
                  <GoogleFilled class="h-5 mr-4 text-primary w-5" />
                  <span class="u-h5">
                    {account.is_linked ? (
                      <span class="text-color2">Linked</span>
                    ) : (
                      <span class="text-color1">Link</span>
                    )}
                  </span>
                </OAuthLinkBtn>
              )
            }
            return null
          })}
      </>
    )
  }
})

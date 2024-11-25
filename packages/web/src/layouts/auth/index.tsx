import { defineComponent, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useCheckUserProfile, landingRoute } from '@/hooks'

const AuthLayout = defineComponent({
  name: 'AuthLayout',
  setup() {
    const route = useRoute()
    const router = useRouter()

    watchEffect(async () => {
      const userIsSet = await useCheckUserProfile({
        route,
        router,
        flag: 'AuthLayout',
        withoutJump: true
      })
      console.log('userIsSet', userIsSet)
      if (userIsSet) {
        // const loginRedirect = storage('session').get('login:redirect')
        location.href = (route ? (route.query.from as string) : '') || landingRoute
        // setTimeout(() => storage('session').remove('login:redirect'), 0)
      }
    })

    return () => <RouterView />
  }
})

export default AuthLayout

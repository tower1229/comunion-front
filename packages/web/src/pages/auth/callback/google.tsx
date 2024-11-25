import { defineComponent } from 'vue'
import useCommonCallback from './_common'

const GoogleAuthCallbackPage = defineComponent({
  name: 'GoogleAuthCallbackPage',
  setup() {
    const errMsg = useCommonCallback('google', 'Authorization@google-oauth')
    return () => <div>{errMsg.value}</div>
  }
})

export default GoogleAuthCallbackPage

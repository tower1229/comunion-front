import { defineComponent } from 'vue'
import useCommonCallback from './_common'

const GithubAuthCallbackPage = defineComponent({
  name: 'GithubAuthCallbackPage',
  setup() {
    const errMsg = useCommonCallback('github', 'Authorization@github-oauth')

    return () => <div>{errMsg.value}</div>
  }
})

export default GithubAuthCallbackPage

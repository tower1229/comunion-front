import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getClient } from '@/utils/ipfs'

export default defineComponent({
  name: 'IPFSContent',
  setup() {
    const content = ref()
    const route = useRoute()
    const ipfsClient = getClient()

    const getIPFSContent = async () => {
      const ipfsContent = await ipfsClient.get(route.params.hash as string)
      for await (const uint8Content of ipfsContent) {
        content.value = new TextDecoder().decode(uint8Content)
      }
    }

    onMounted(() => {
      getIPFSContent()
    })

    return {
      content
    }
  },
  render() {
    return <div class="text-sm">{this.content}</div>
  }
})

import { defineComponent, ref } from 'vue'
import { UButton, USingleImageUpload, UUpload, USingleImageFileUpload } from '@/comps/index'

const UploadDemoPage = defineComponent({
  name: 'UploadDemoPage',
  setup() {
    const value = ref('')
    const fileList = ref([
      {
        id: 'razars',
        name: '刀',
        status: 'finished',
        percentage: 100
      }
    ] as const)
    return () => (
      <div class="bg-white">
        <UUpload
          abstract
          defaultFileList={fileList.value}
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
        >
          <UButton>点我</UButton>
        </UUpload>
        <USingleImageUpload v-model:value={value.value} text="Upload  startup Logo" />
        <div class="w-full">
          <USingleImageFileUpload placeholder="Upload 3:2" v-model:value={value.value} />
        </div>
      </div>
    )
  }
})

export default UploadDemoPage

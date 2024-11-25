import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '@/components/OAuth/CardContent'
import { useCheckUserProfile, landingRoute } from '@/hooks'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { UserProfileState } from '@/types'

export default defineComponent({
  setup() {
    const form = ref<FormInst>()
    const formData = reactive({
      name: ''
    })
    return {
      form,
      formData
    }
  },
  render() {
    const fields: FormFactoryField[] = [
      {
        title: 'Choose your nickname',
        name: 'name',
        placeholder: 'EX： John Smith',
        rules: [
          {
            required: true,
            message: 'Nickname cannot be blank',
            trigger: 'blur'
          }
        ]
      }
    ]
    const router = useRouter()
    const userStore = useUserStore()
    const rules = getFieldsRules(fields)

    const onSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          const { error } = await services['Comer@update-comer-info']({
            name: this.formData.name,
            avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
            location: '',
            time_zone: '',
            banner: ''
          })
          if (!error) {
            userStore.mergeProfile({
              name: this.formData.name,
              avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
              is_seted: true,
              address: '',
              id: 0,
              bio: ''
            } as UserProfileState)

            // reload userStore
            await userStore.init(true)

            useCheckUserProfile({
              handleloged: () => router.replace(landingRoute),
              flag: 'simple'
            })
          }
        }
      })
    }
    return (
      <div class="bg-purple h-full min-h-screen text-[14px] relative">
        <div class="flex h-100vh u-page-container justify-center items-center">
          <CardContent
            title=""
            config={{ width: 678 }}
            v-slots={{
              content: () => (
                <UForm
                  class="mt-24px mb-40px"
                  rules={rules}
                  model={this.formData}
                  ref={(ref: any) => (this.form = ref)}
                >
                  <UFormItemsFactory fields={fields} values={this.formData} />
                </UForm>
              ),
              footer: () => (
                <div class="flex justify-end">
                  <UButton onClick={onSubmit} class="w-30" size="small" type="primary">
                    Submit
                  </UButton>
                </div>
              )
            }}
          />
        </div>
      </div>
    )
  }
})

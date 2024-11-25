import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  USingleImageFileUpload
} from '@comunion/components'
import { defineComponent, PropType, computed, Ref, ref, watch, h } from 'vue'
import { CrowdfundingInfo } from '../typing'
import RichEditor from '@/components/Editor'

export interface AdditionalInformationRef {
  additionalInfoForm: FormInst | null
}

export const AdditionalInformation = defineComponent({
  name: 'AdditionalInformation',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  setup(props, ctx) {
    const descriptionField = ref()
    watch(
      () => props.crowdfundingInfo.poster,
      () => {
        console.log('props.crowdfundingInfo.poster', props.crowdfundingInfo.poster?.url)
      }
    )
    watch(
      () => props.crowdfundingInfo.description,
      () => {
        descriptionField.value?.validate()
      }
    )
    const additionalInfoForm = ref<FormInst | null>(null)
    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        title: 'Poster',
        name: 'poster',
        rules: [
          {
            validator: (_rule, value) => {
              return !!value
            },
            message: 'Poster cannot be blank',
            trigger: 'change'
          },
          {
            validator: (_rule, value) => {
              return value?.status === 'finished'
            },
            message: '',
            trigger: 'change'
          }
        ],
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                Poster
                <span class="n-form-item-label__asterisk">&nbsp;*</span>{' '}
              </div>
            )
          ]
        },
        formItemProps: {
          first: true
        },
        render() {
          return (
            <USingleImageFileUpload
              placeholder="Recommended image ratio: 3:2, Max size: 1MB"
              v-model:value={props.crowdfundingInfo.poster}
            />
          )
        }
      },
      {
        title: 'Youtube',
        name: 'youtube',
        maxlength: 200,
        placeholder: 'EX：https://www.youtube.com/watch?v=xxxxx',
        rules: [
          {
            validator: (rule, value) =>
              !value || (value && value.startsWith('https://www.youtube.com/watch?v=')),
            message: 'Invalid youtube video',
            trigger: 'blur'
          }
        ]
      },
      {
        title: 'Launchpad Detail',
        name: 'detail',
        maxlength: 200,
        placeholder: 'EX：https://...',
        rules: [
          {
            validator: (rule, value) => !value || (value && value.startsWith('https://')),
            message: 'Invalid URL',
            trigger: 'blur'
          }
        ]
      },

      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        formItemProps: {
          ref: (value: any) => (descriptionField.value = value),
          first: true
        },
        rules: [
          {
            required: true,
            message: 'Description must be 64 characters or more',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => {
              return value && value.replace(/<.>|<\/.>/g, '').length > 64
            },
            message: 'Description must be 64 characters or more',
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <RichEditor
              limit={512}
              placeholder="Much more details to description this Launchpad"
              class="w-full"
              v-model:value={props.crowdfundingInfo.description}
            />
          )
        }
      }
    ])
    const additionalInfoRules = getFieldsRules(formFields.value)
    console.log('additionalInfoRules===>', additionalInfoRules)
    ctx.expose({
      additionalInfoForm
    })
    return {
      formFields,
      additionalInfoForm,
      additionalInfoRules
    }
  },
  render() {
    return (
      <UForm
        ref={(ref: any) => (this.additionalInfoForm = ref)}
        rules={this.additionalInfoRules}
        model={this.crowdfundingInfo}
      >
        <UFormItemsFactory fields={this.formFields} values={this.crowdfundingInfo} />
      </UForm>
    )
  }
})

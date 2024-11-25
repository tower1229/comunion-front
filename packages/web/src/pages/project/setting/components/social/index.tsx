import {
  USpin,
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  UInput,
  UInputGroup,
  USelect,
  message
} from '@comunion/components'
import { AddCircleOutlined, MinusCircleOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, PropType, computed, watch } from 'vue'
import { useTags } from '@/hooks'
import { contactList } from '@/pages/project/util'
import { services } from '@/services'
import { validateEmail, validateDiscord, validateLink } from '@/utils/valid'

type SocialPropType = {
  social_tool_id?: number
  type?: number
  value?: string
  label?: string
  delete?: boolean
  blur?: boolean
}

export default defineComponent({
  name: 'socialSetting',
  props: {
    data: {
      type: Array as PropType<SocialPropType[]>,
      required: true
    },
    startup_id: {
      type: Number,
      require: true
    }
  },
  emits: ['saved', 'edit'],
  setup(props, ctx) {
    const loading = ref(false)

    const info = reactive({ socials: props.data })

    // 1-SocialEmail  	2-SocialWebsite 	3-SocialTwitter 	4-SocialDiscord 	5-SocialTelegram 	6-SocialMedium 	7-SocialFacebook 	8-SocialLinktre
    const contactOptions = computed(
      () =>
        useTags('social').TagList.value?.map(tag => {
          const targetIndex = contactList.findIndex(
            localTag => localTag.label.toLocaleLowerCase() === tag.name.toLocaleLowerCase()
          )
          return {
            label: tag.name,
            value: tag.id,
            type: targetIndex === -1 ? 0 : contactList[targetIndex].value
          }
        }) || []
    )

    watch(
      () => contactOptions.value,
      () => {
        if (contactOptions.value.length && !info.socials.length) {
          console.log(contactOptions.value, info.socials)
          info.socials.push({
            type: contactOptions.value[0].value || 0,
            value: ''
          })
        }
      },
      {
        immediate: true
      }
    )

    const setItemValue = (item: object, social_tool_id: number) => {
      console.log(contactOptions.value, social_tool_id)
      const targetIndex = contactOptions.value.findIndex(option => option.value === social_tool_id)
      if (targetIndex === -1) {
        return item
      } else {
        return Object.assign(item, {
          type: contactOptions.value[targetIndex].type,
          label: contactOptions.value[targetIndex].label
        })
      }
    }

    const fields: FormFactoryField[] = [
      {
        t: 'custom',
        title: 'Social',
        name: 'socials',
        rules: [
          {
            validator: (rule, value: SocialPropType[]) => {
              return !!value.find(item => !!item.value && !item.delete)
            },
            message: 'Please enter at least one social information',
            trigger: 'blur'
          },
          {
            validator: (rule, value: SocialPropType[]) => {
              const items = value.filter(item => !item.delete && !!item.value)
              console.log(value, items)
              if (items.length) {
                return (
                  items.filter(item => {
                    if (
                      (item.type === 1 && !validateEmail(item.value)) ||
                      ([2, 5, 9, 10, 11].includes(Number(item.type || 0)) &&
                        !validateLink(item.value)) ||
                      (item.type === 4 && !validateDiscord(item.value))
                    ) {
                      return false
                    } else {
                      return !!item.value?.trim()
                    }
                  }).length === items.length
                )
              }

              return true
            },
            message: '',
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <div class="w-full">
              {info.socials
                .filter(e => !e.delete)
                .map((item: SocialPropType, itemIndex: number) => (
                  <div class="mb-4">
                    <div class="flex items-center">
                      <UInputGroup>
                        <USelect
                          options={contactOptions.value}
                          v-model:value={item.social_tool_id}
                          class="w-50"
                          onUpdate:value={social_tool_id => setItemValue(item, social_tool_id)}
                        ></USelect>
                        <UInput
                          class="rounded-r-lg flex-1"
                          v-model:value={item.value}
                          inputProps={{ type: item.type === 1 ? 'email' : 'text' }}
                          status={
                            (item.type === 1 && item.value && !validateEmail(item.value)) ||
                            ([2, 5, 9, 10, 11].includes(item.type || 0) &&
                              item.value &&
                              !validateLink(item.value)) ||
                            (item.type === 4 && item.value && !validateDiscord(item.value))
                              ? // (item.type === 5 && item.value && !validateTelegram(item.value))
                                'error'
                              : undefined
                          }
                          placeholder={`${item.type === 2 ? 'http(s)://' : 'Please Input'}`}
                          onBlur={() => {
                            item.blur = true
                          }}
                          onFocus={() => {
                            item.blur = false
                          }}
                        ></UInput>
                      </UInputGroup>
                      {info.socials.filter(e => !e.delete).length > 1 && (
                        <div
                          class="cursor-pointer flex items-center"
                          onClick={() => {
                            info.socials[itemIndex]['delete'] = true
                          }}
                        >
                          <MinusCircleOutlined class="h-5 text-error ml-4.5 w-5" />
                        </div>
                      )}
                      <div
                        class="cursor-pointer flex items-center"
                        onClick={() => {
                          info.socials.push({
                            social_tool_id: contactOptions.value[0]?.value || 0,
                            type: contactOptions.value[0]?.type || 0,
                            value: '',
                            label: contactOptions.value[0]?.label || '--'
                          })
                        }}
                      >
                        <AddCircleOutlined class="h-5 ml-4.5 w-5" />
                      </div>
                    </div>
                    {item.type === 1 && item.blur && item.value && !validateEmail(item.value) && (
                      <div class="text-error ml-50">Please enter the correct email address</div>
                    )}
                    {[2, 5, 9, 10, 11].includes(item.type || 0) &&
                      item.blur &&
                      item.value &&
                      !validateLink(item.value) && (
                        <div class="text-error ml-50">Please enter the correct url</div>
                      )}
                  </div>
                ))}
            </div>
          )
        }
      }
    ]
    const form = ref<FormInst>()

    watch(
      () => info,
      () => {
        console.log(11111111111, 'social change')
        ctx.emit('edit')
      },
      {
        deep: true
      }
    )

    return {
      loading,
      form,
      fields,
      info
    }
  },
  render() {
    const handleSubmit = () => {
      if (this.startup_id) {
        this.form?.validate(async err => {
          if (!err) {
            this.loading = true
            await services['Startup@bind-startup-socials']({
              startup_id: this.startup_id as number,
              socials: this.info.socials
                .filter(e => !e.delete && e.type && e.value)
                .map(e => {
                  return {
                    social_tool_id: Number(e.social_tool_id),
                    value: String(e.value)
                  }
                })
            })
            this.loading = false
            message.success('Successfully saved')
            this.$emit('saved')
          }
        })
      } else {
        console.warn('Missing parameter: startup_id')
      }
    }

    const rules = getFieldsRules(this.fields)
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
          <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
            <UFormItemsFactory fields={this.fields} values={this.info} />
          </UForm>
          <div class="flex mt-10 items-center justify-end">
            <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
              Save
            </UButton>
          </div>
        </div>
      </USpin>
    )
  }
})

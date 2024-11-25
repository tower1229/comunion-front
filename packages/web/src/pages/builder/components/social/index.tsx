import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  UPopover,
  USpin
} from '@comunion/components'
import { PenOutlined, DeleteFilled } from '@comunion/icons'
import { defineComponent, ref, reactive, computed, PropType, watch } from 'vue'
import { useComerOptionsList } from '../../hooks/useComerOptionsList'
import { btnGroup } from '../btnGroup'
import Edit from '../editButton'
import SocialIcon from '@/components/SocialIcon'
import { contactList } from '@/pages/project/util'
import { services } from '@/services'
import type { ComerProfileState } from '@/types'
import { validateEmail, validateDiscord, validateLink } from '@/utils/valid'

type FnParam = (type: string | number, value?: string | number, blockId?: number) => void
type socialListType = {
  id: number
  social_tool?:
    | {
        id: number
        logo: string
        name: string
      }
    | undefined
  social_tool_id: number
  target_id: number
  type: number
  value: string
}[]

function socialIconComponent(
  socialObj: { [key: string]: string | undefined },
  viewMode: boolean,
  edit: FnParam,
  del: FnParam,
  socialTypeList: socialListType
) {
  return socialTypeList.map(item => {
    const social_tool_name = item?.social_tool?.name || ''
    const social_tool_id = item?.social_tool?.id || 0
    const social = socialObj[social_tool_name.toLowerCase()]
    if (social) {
      if (viewMode) {
        return <SocialIcon icon={social_tool_name} disable={!social} address={social} />
      } else {
        return (
          <UPopover
            trigger="click"
            placement="top"
            v-slots={{
              trigger: () => <SocialIcon icon={social_tool_name} />,
              default: () => (
                <div class="cursor-pointer flex m-3">
                  <PenOutlined
                    class="h-3.5 text-primary mr-4.5 w-3.5"
                    onClick={() => edit(social_tool_id, social, item.id)}
                  />
                  <DeleteFilled class="h-3.5 text-primary w-3.5" onClick={() => del(item.id)} />
                </div>
              )
            }}
          />
        )
      }
    }
    return null
  })
}

export default defineComponent({
  props: {
    viewMode: {
      type: Boolean,
      default: () => false
    },
    profile: {
      type: Object as PropType<ComerProfileState>,
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)
    const editMode = ref<boolean>(false)
    const info = reactive<{
      type: string | number | null
      value: string | number | undefined
      blockId?: number
      label?: string
    }>({
      type: null,
      value: undefined
    })

    const ComerOptionsListInstance = useComerOptionsList()
    const socialTypeList = ComerOptionsListInstance.socialList

    watch(
      () => info,
      () => {
        if (info.type) {
          const targetIndex = socialTypeList.value.findIndex(option => option.value === info.type)
          if (targetIndex !== -1) {
            info.label = socialTypeList.value[targetIndex].label
          }
        }
      },
      {
        deep: true
      }
    )

    const form = ref<FormInst>()
    const fields = computed<FormFactoryField[]>(() => {
      const fields: FormFactoryField[] = [
        {
          t: 'select',
          title: 'Social media',
          name: 'type',
          required: true,
          placeholder: 'Select a social media',
          options: socialTypeList.value || [],
          rules: [{ type: 'number' }]
        }
      ]

      if (info.label === 'Email') {
        // Email
        fields.push({
          t: 'string',
          title: 'Address',
          name: 'value',
          maxlength: 1000,
          value: null,
          rules: [
            {
              validator: (rule, value: any) => {
                return !!value
              },
              message: 'Please enter at least one contact information',
              trigger: 'blur'
            },
            {
              validator: (rule, value: any) => {
                return !value || !!validateEmail(value)
              },
              message: 'Please enter the correct Email',
              trigger: 'blur'
            }
          ],
          placeholder: 'Input the Email'
        })
      } else if (info.label === 'Discord') {
        // Discord
        fields.push({
          t: 'string',
          title: 'Address',
          name: 'value',
          value: null,
          maxlength: 1000,
          rules: [
            {
              validator: (rule, value) => {
                return !!value
              },
              message: 'Please enter at least one contact information',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                return !value || !!validateDiscord(value)
              },
              message: 'Please enter the correct address or username',
              trigger: 'blur'
            }
          ],
          placeholder: 'Input the Discord link or username'
        })
      } else if (['Website', 'Telegram', 'Youtube', 'Reddit', 'Docs'].includes(info.label || '')) {
        // link
        fields.push({
          t: 'string',
          title: 'Address',
          name: 'value',
          value: null,
          maxlength: 1000,
          rules: [
            {
              validator: (rule, value) => {
                return !!value
              },
              message: 'Please enter at least one contact information',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                return !value || !!validateLink(value)
              },
              message: 'Please enter the correct URL',
              trigger: 'blur'
            }
          ],
          placeholder: 'Input the URL'
        })
      } else {
        fields.push({
          t: 'string',
          title: 'Address',
          name: 'value',
          required: true,
          placeholder: 'Input the Address',
          value: null
        })
      }
      return fields
    })

    const socials = computed(() => {
      const result: string[] = []
      if (props.profile) {
        if (props.profile?.socials && props.profile?.socials?.length > 0) {
          props.profile.socials.forEach(item => {
            result.push(item.value)
          })
        }
      }
      return result
    })

    function getSocialValue(type: string) {
      const socialItem = (props.profile.socials || []).find((item: any) => {
        return item.social_tool.name === type
      })
      return socialItem?.value || ''
    }

    const socialsObj = computed(() => {
      const result: any = {}
      contactList.forEach(item => {
        result[item.name] = getSocialValue(item.label)
      })
      return result
    })

    return {
      loading,
      editMode,
      fields,
      form,
      info,
      socials,
      socialsObj,
      socialTypeList
    }
  },
  emits: ['Done'],
  render() {
    const handleEditMode =
      (create = false) =>
      () => {
        if (create) {
          this.info.type = null
          this.info.value = undefined
        }
        this.editMode = !this.editMode
      }

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined' && this.info.type) {
          this.loading = true
          if (this.info.blockId) {
            await services['Comer@update-comer-socials']({
              soical_book_id: this.info.blockId,
              social_tool_id: Number(this.info.type),
              value: String(this.info?.value) || ''
            })
            this.info.blockId = 0
          } else {
            await services['Comer@bind-comer-socials']({
              social_tool_id: Number(this.info.type),
              value: String(this.info?.value) || ''
            })
          }

          this.$emit('Done')
          handleEditMode()()
          this.loading = false
        }
      })
    }

    const editIcon = (type: string | number, value?: number | string, blockId?: number) => {
      this.info.type = Number(type)
      this.info.value = value || undefined
      this.info.blockId = blockId
      handleEditMode()()
    }

    const delIcon = async (type: string | number) => {
      this.loading = true
      await services['Comer@unbind-comer-socials']({
        soical_book_id: Number(type)
      })
      this.$emit('Done')
      this.loading = false
    }

    const rules = getFieldsRules(this.fields)

    return (
      <USpin show={this.loading}>
        {this.viewMode && this.socials.length === 0 ? null : (
          <UCard
            title="Social"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.viewMode) {
                  return
                }
                return <Edit onHandleClick={handleEditMode(true)}>Add</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col flex-wrap">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div class="cursor-pointer flex flex-wrap gap-4">
                {this.socials.length === 0 ? (
                  <p class="text-color3 u-h5">Add your social</p>
                ) : (
                  <>
                    {socialIconComponent(
                      this.socialsObj,
                      this.viewMode,
                      editIcon,
                      delIcon,
                      this.profile?.socials ? this.profile.socials : []
                    )}
                  </>
                )}
              </div>
            )}
          </UCard>
        )}
      </USpin>
    )
  }
})

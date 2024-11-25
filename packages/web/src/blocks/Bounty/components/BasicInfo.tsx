import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  UInput,
  UInputGroup,
  USelect,
  UInputNumberGroup
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { MinusCircleOutlined, AddCircleOutlined, ArrowLineRightOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, ref, computed, Ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bountyInfoType } from '../CreateForm'
import { ContactType, chainInfoType } from '../typing'
import RichEditor from '@/components/Editor'
import { useTags } from '@/hooks'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { validateEmail, validateTelegram, validateDiscord } from '@/utils/valid'

export const MAX_AMOUNT = 9999

export const renderUnit = (name: string) => (
  <div
    class={[
      'flex justify-center items-center border rounded-r-sm bg-white w-30',
      { 'text-color1': name, 'text-color3': !name }
    ]}
  >
    {name || 'Token'}
  </div>
)

export interface BountyBasicInfoRef {
  bountyDetailForm: FormInst | null
}
export interface startupOptionsInterface extends SelectOption {
  on_chain?: boolean
}
const BountyBasicInfo = defineComponent({
  name: 'BountyBasicInfo',
  props: {
    bountyInfo: {
      type: Object as PropType<bountyInfoType>,
      required: true
    },
    chainInfo: {
      type: Object as PropType<chainInfoType>,
      required: true,
      defualt: {
        onChain: false
      }
    }
  },
  emits: ['delContact', 'addContact', 'closeDrawer'],
  setup(props, ctx) {
    const router = useRouter()
    const contactOptions = ref([
      { label: 'Email', value: 1 },
      { label: 'Discord', value: 4 },
      { label: 'Telegram', value: 5 }
    ])
    const startupOptions = ref<startupOptionsInterface[]>([])
    const userStore = useUserStore()
    const bountyDetailForm = ref<FormInst | null>(null)
    const optionsList = useTags('comer_skill')

    const comerSkillTagList = computed(() => {
      return (optionsList.TagList.value || []).map(item => {
        return {
          label: item.name,
          value: item.name
        }
      })
    })

    const getStartupByComerId = async () => {
      const comer_id = userStore.profile?.id
      try {
        const { error, data } = await services['Startup@get-startups']({
          admin_comer_id: comer_id
        })
        if (!error) {
          startupOptions.value = (data.list || [])
            .map((startup: { name: string; id: number; on_chain: boolean }) => ({
              label: startup.name!,
              value: startup.id!,
              on_chain: startup.on_chain!
            }))
            .sort(function compareFunction(param1: { label: string }, param2: { label: any }) {
              return param1.label.localeCompare(param2.label, 'zh-Hans-CN', {
                sensitivity: 'accent'
              })
            })
        }
      } catch (error) {
        console.error('error', error)
      }
    }
    const goSetting = async () => {
      router.push({ path: `/project/setting/${props.bountyInfo.startup_id}` })
      ctx.emit('closeDrawer')
    }
    onMounted(() => {
      getStartupByComerId()
    })
    ctx.expose({
      bountyDetailForm
    })
    return {
      bountyDetailForm,
      contactOptions,
      comerSkillTagList,
      startupOptions,
      goSetting
    }
  },
  render() {
    const { contactOptions, $emit } = this

    const bountyInfo = this.$props.bountyInfo

    const bountyBasicInfoFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Project',
        name: 'startup_id',
        placeholder: 'Select a project',
        rules: [
          {
            required: true,
            message: 'Project cannot be blank',
            type: 'number',
            trigger: ['blur']
          },
          {
            validator: (rule, value) => {
              if (value) {
                return this.startupOptions.find(item => item.value === value)?.on_chain || false
              }
              return true
            },
            renderMessage: () => {
              return (
                <div class="flex items-center">
                  <span>The project cannot create a bounty without being on the blockchain,</span>
                  <span
                    onClick={this.goSetting}
                    class="cursor-pointer flex ml-2 items-center !text-primary"
                  >
                    <span>Go to setting</span>
                    <ArrowLineRightOutlined class="h-[16px] ml-2 w-[16px]" />
                  </span>
                </div>
              )
            },
            trigger: ['blur']
          }
        ],
        options: this.startupOptions || []
      },
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        placeholder: 'Input bounty title',
        maxlength: 200,
        rules: [
          { required: true, message: 'Title cannot be blank', type: 'string', trigger: 'blur' },
          {
            validator: (rule, value) => !value.length || value.length > 11,
            message: 'Bounty title must be 12 characters or more',
            trigger: 'blur'
          }
        ]
      },
      {
        t: 'date',
        class: 'w-full',
        type: 'datetime',
        title: 'Apply Cutoff Date',
        name: 'expiresIn',
        placeholder: 'Select date',
        actions: ['clear', 'confirm'],
        rules: [
          {
            required: true,
            message: 'Apply Cutoff Date cannot be blank',
            type: 'date',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => {
              if (!value) return true
              return dayjs(value) > dayjs()
            },
            message: 'Please set the reasonable cutoff date',
            trigger: 'blur'
          }
        ],
        isDateDisabled: (current: number) => {
          return dayjs(current) < dayjs()
        }
      },
      {
        t: 'custom',
        title: 'Contact',
        name: 'contact',
        rules: [
          {
            required: true,
            validator: (rule, value: ContactType[]) => {
              const hasValue = value.find(item => !!item.value)

              return !!hasValue
            },
            message: 'Please enter at least one contact information',
            trigger: 'blur'
          },
          {
            validator: (rule, value: ContactType[]) => {
              const items = value.filter(item => !!item.value)

              if (items.length) {
                return (
                  items.filter(item => {
                    if (
                      (item.type === 1 && !validateEmail(item.value)) ||
                      (item.type === 4 && !validateDiscord(item.value)) ||
                      (item.type === 5 && !validateTelegram(item.value))
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
        render(value) {
          const setItemValue = (item: object, type: number) => {
            console.log(contactOptions, type)
            const targetIndex = contactOptions.findIndex(option => option.value === type)
            if (targetIndex === -1) {
              return item
            } else {
              return Object.assign(item, {
                type: contactOptions[targetIndex].value,
                label: contactOptions[targetIndex].label
              })
            }
          }

          return (
            <div class="w-full">
              {bountyInfo.contact.map((item: ContactType, itemIndex: number) => (
                <>
                  <div
                    class={`flex items-center justify-between ${
                      itemIndex < bountyInfo.contact.length - 1 ? 'mb-4' : ''
                    }`}
                  >
                    <UInputGroup>
                      <USelect
                        options={contactOptions}
                        v-model:value={item.type}
                        class="w-50"
                        onUpdate:value={type => setItemValue(item, type)}
                      ></USelect>
                      <UInput
                        class="rounded-r-lg flex-1"
                        v-model:value={item.value}
                        status={
                          (item.type === 1 && item.value && !validateEmail(item.value)) ||
                          (item.type === 4 && item.value && !validateDiscord(item.value)) ||
                          (item.type === 5 && item.value && !validateTelegram(item.value))
                            ? 'error'
                            : undefined
                        }
                        placeholder={`${
                          item.type === 1
                            ? '@email.com'
                            : item.type === 4
                            ? 'Username#1234'
                            : '@Username/Phone number'
                        }`}
                        onBlur={() => {
                          item.blur = true
                        }}
                        onFocus={() => {
                          item.blur = false
                        }}
                      ></UInput>
                    </UInputGroup>
                    {/* buttons */}
                    <div class="flex ml-4 w-15 items-center">
                      {bountyInfo.contact.length > 1 && (
                        <div
                          class="cursor-pointer flex items-center"
                          onClick={() => $emit('delContact', itemIndex)}
                        >
                          <MinusCircleOutlined class="h-5 mr-4 text-error w-5" />
                        </div>
                      )}

                      {itemIndex + 1 === bountyInfo.contact.length && itemIndex < 5 && (
                        <div
                          class="cursor-pointer flex items-center"
                          onClick={() => $emit('addContact')}
                        >
                          <AddCircleOutlined class="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* tips */}
                  {item.type === 1 && item.blur && item.value && !validateEmail(item.value) && (
                    <div class="text-error p-2">Please enter the correct email address</div>
                  )}
                  {item.type === 4 && item.blur && item.value && !validateDiscord(item.value) && (
                    <div class="text-error p-2">Invalid Discord contract</div>
                  )}
                  {item.type === 5 && item.blur && item.value && !validateTelegram(item.value) && (
                    <div class="text-error p-2">Invalid Telegram contract</div>
                  )}
                </>
              ))}
            </div>
          )
        }
      },
      {
        t: 'website',
        title: 'Discussion link',
        name: 'discussionLink',
        maxlength: 200,
        placeholder: 'EX:https://...'
      },
      {
        t: 'skillTags',
        title: 'Applicant skills',
        name: 'applicantsSkills',
        placeholder: 'Add applicant skills',
        charLimit: 20,
        required: true,
        options: this.comerSkillTagList
      },
      {
        t: 'custom',
        name: 'applicantsDeposit',
        title: 'Applicants deposit',
        formItemProps: {
          feedback: `The maximal deposit amount is 9999 ${bountyInfo.applicantsDepositSymbol}`,
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
        slots: {
          label: () => [
            h(
              <div>
                Applicants deposit
                <span class="font-normal text-xs ml-4 text-color3">
                  Applicant must deposit {bountyInfo.applicantsDepositSymbol} for applying the
                  bounty
                </span>
              </div>
            )
          ]
        },
        render(value) {
          //
          return (
            <UInputNumberGroup
              v-model:value={bountyInfo.applicantsDeposit}
              type="withSelect"
              class="w-full"
              inputProps={{
                precision: 8,
                min: 0,
                max: MAX_AMOUNT,
                class: 'flex-1'
              }}
              renderSelect={() => (
                <USelect
                  class="text-center w-30"
                  options={[
                    { value: bountyInfo.token0_symbol, label: bountyInfo.token0_symbol },
                    { value: bountyInfo.token1_symbol, label: bountyInfo.token1_symbol }
                  ]}
                  v-model:value={bountyInfo.applicantsDepositSymbol}
                />
              )}
            />
          )
        }
      },
      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        rules: [
          { required: true, message: 'Description cannot be blank', trigger: 'blur' },
          {
            validator: (rule, value) => {
              return !value || (value && value.replace(/<.>|<\/.>/g, '').length > 30)
            },
            message: 'Description must be 30 characters or more',
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <RichEditor
              placeholder="Much more details to description this bounty"
              class="w-full"
              v-model:value={bountyInfo.description}
            />
          )
        }
      }
    ])
    const bountyBasicInfoRules = getFieldsRules(bountyBasicInfoFields.value)

    return (
      <UForm
        ref={(ref: any) => (this.bountyDetailForm = ref)}
        rules={bountyBasicInfoRules}
        model={bountyInfo}
      >
        <UFormItemsFactory fields={bountyBasicInfoFields.value} values={bountyInfo} />
      </UForm>
    )
  }
})

export default BountyBasicInfo

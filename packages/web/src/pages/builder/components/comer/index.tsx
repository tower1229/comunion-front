import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItem,
  UInput,
  UFormItemsFactory,
  ULazyImage,
  useUpload,
  UUpload,
  USpin,
  UTooltip
} from '@comunion/components'
import {
  CheckFilled,
  PenOutlined,
  PlusOutlined,
  UploadFilled,
  QuestionCircleOutlined
} from '@comunion/icons'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, computed, ref, reactive, watchEffect, PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useComer } from '../../hooks/comer'
import { btnGroup } from '../btnGroup'
import Edit from '../editButton'
import defaultCover from './assets/default.png'
import { ComerAccount } from '@/components/OAuth/Link/OAuthLinkWidget'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { UTC_OPTIONS } from '@/constants'
import { services } from '@/services'

import './rect.css'
import { useUserStore } from '@/stores'

export default defineComponent({
  props: {
    comerId: {
      type: Number,
      required: true
    },
    avatar: {
      type: String,
      default: () => '',
      required: true
    },
    name: {
      type: String,
      default: () => '',
      required: true
    },
    location: {
      type: String,
      default: () => '',
      required: true
    },
    timeZone: {
      type: String,
      default: () => null,
      required: true
    },
    cover: {
      type: String,
      requried: true
    },
    custom_domain: {
      type: String,
      requried: true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    },
    comerAccounts: {
      type: Object as PropType<ComerAccount[]>
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  emits: ['Done'],
  setup(props) {
    const userStore = useUserStore()
    const loading = ref(false)
    const subTitle = computed(() => {
      const result = []
      props.location && result.push(props.location)
      props.timeZone && result.push(props.timeZone)
      return `${result.join(', ')}`
    })
    const editMode = ref<boolean>(false)
    const showAvatarModal = ref<boolean>(false)

    const form = ref<FormInst>()
    const formDomain = ref<FormInst>()

    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        placeholder: 'Input your name',
        maxlength: 24,
        rules: [
          {
            required: true,
            message: 'Name can not be blank',
            trigger: 'blur'
          }
        ],
        value: null
      },
      {
        t: 'string',
        title: 'Location',
        name: 'location',
        maxlength: 100,
        placeholder: 'Add your location',
        value: null
      },
      {
        t: 'select',
        title: 'Time Zone',
        name: 'timeZone',
        placeholder: `Select your time zone`,
        options: UTC_OPTIONS.map(item => ({ label: item.label, value: item.label }))
      }
    ]
    const info = reactive({
      avatar: props.avatar,
      name: props.name,
      location: props.location,
      timeZone: props.timeZone ? props.timeZone : null,
      cover: props.cover,
      custom_domain: props.custom_domain
    })

    watchEffect(() => {
      info.avatar = props.avatar
      info.name = props.name
      info.location = props.location
      info.timeZone = props.timeZone ? props.timeZone : null
      info.cover = props.cover
    })

    const { onUpload } = useUpload()

    const customRequest: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        onUpload(file.file, percent => {
          onProgress({ percent })
        })
          .then(url => {
            console.log(url)
            info.cover = url as string
            onFinish()
          })
          .catch(err => {
            onError()
          })
      }
    }
    const follow = ref<boolean>(false)

    const route = useRoute()

    const comerService = useComer(props.comerId)

    const toggleFollow = async (onlyGet = false) => {
      if (!onlyGet) {
        if (follow.value) {
          await comerService.unfollow()
        } else {
          await comerService.follow()
        }
      }

      if (props.viewMode && userStore.token) {
        const { error, data } = await comerService.followByMe()
        if (!error) {
          follow.value = data.is_connected
        }
      }
    }
    toggleFollow(true)

    const self = computed(() => {
      return !route.query.id || String(route.query.id) === String(userStore.profile?.id)
    })
    const isOwner = computed(() => {
      return props.isOwner
    })
    return {
      loading,
      subTitle,
      editMode,
      showAvatarModal,
      fields,
      info,
      form,
      formDomain,
      customRequest,
      toggleFollow,
      follow,
      self,
      userStore,
      isOwner
    }
  },
  render() {
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const showAvatarSelect = () => {
      this.showAvatarModal = true
    }
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          this.formDomain?.validate(async err2 => {
            if (!err2) {
              this.loading = true
              await services['Comer@update-comer-info']({
                name: this.info.name,
                banner: this.info.cover,
                avatar: this.info.avatar,
                time_zone: this.info.timeZone ? this.info.timeZone : '',
                location: this.info.location
              })
              await services['Comer@set-user-custom-domain']({
                custom_domain: this.info.custom_domain as string
              })
              this.$emit('Done')
              handleEditMode()
              this.loading = false
              this.userStore.mergeProfile({ avatar: this.info.avatar })
            }
          })
        }
      })
    }

    const rules = getFieldsRules(this.fields)

    const rulesDomain = {
      custom_domain: [
        {
          required: true,
          message: `Domain name cannot be blank.`,
          trigger: 'change'
        },
        {
          validator(rule: any, value: string) {
            return !!value && !!value.trim() && !!value.trim().match(/^[a-zA-Z_0-9]+$/)
          },
          message: `Your username can only contain alphanumeric characters and underscores.`,
          trigger: 'change'
        },
        {
          validator(rule: any, value: string) {
            return !!value && !!value.trim() && value.trim().length > 2
          },
          message: `Your username must be at least 3 characters.`,
          trigger: 'change'
        },
        {
          validator(rule: any, value: string) {
            return new Promise<void>((resolve, reject) => {
              if (!value || !value.trim()) {
                return reject(`Domain name cannot be blank.`)
              }
              return services['Comer@get-user-custom-domain-is-existence']({
                custom_domain: value
              })
                .then((res: any) => {
                  if (res && !res.is_exist) {
                    resolve(void true)
                  } else {
                    reject(`This username is already taken`)
                  }
                })
                .catch(() => {
                  resolve(void false)
                })
            })
          },
          trigger: 'change'
        }
      ]
    }

    return (
      <USpin show={this.loading}>
        <div class="bg-white border border-color-border rounded-sm mb-6 relative overflow-hidden">
          {this.editMode ? (
            <>
              <AvatarSelect v-model:show={this.showAvatarModal} v-model:avatar={this.info.avatar} />
              <UUpload
                class="rect-upload"
                customRequest={this.customRequest}
                accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
              >
                <div class="flex h-45 w-full relative">
                  <div class="bg-[rgba(0,0,0,0.5)] top-0 right-0 bottom-0 left-0 absolute"></div>
                  <img src={this.info.cover || defaultCover} alt="bg" class="object-fill w-full" />
                  <PenOutlined class="h-4 -mt-2 mr-3 text-white -ml-2 top-1/2 left-1/2 w-4 absolute" />
                </div>
              </UUpload>
              <div
                class="rounded-1/2 h-20 -ml-10 top-155px left-1/2 w-20 absolute overflow-hidden"
                onClick={showAvatarSelect}
              >
                <UploadFilled class="h-6 -mt-3 text-white -ml-3 top-1/2 left-1/2 w-6 z-1 absolute" />
                <div class="bg-[rgba(0,0,0,0.5)] top-0 right-0 bottom-0 left-0 absolute"></div>
                <ULazyImage class="rounded-1/2 h-20 w-20" src={this.info.avatar} />
              </div>
              <div class="mt-79px p-6">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                <UForm
                  rules={rulesDomain}
                  model={this.info}
                  ref={(ref: any) => (this.formDomain = ref)}
                >
                  <UFormItem
                    path="custom_domain"
                    first
                    class="u-form-factory_item"
                    v-slots={{
                      label: () => {
                        return (
                          <div class="flex n-form-item-label !items-center">
                            <div>Domain name</div>
                            <UTooltip
                              trigger="hover"
                              placement="top"
                              v-slots={{
                                trigger: () => (
                                  <QuestionCircleOutlined class="cursor-pointer h-4 ml-2 text-color3 w-4" />
                                ),
                                default: () => (
                                  <div class="w-80">
                                    This is the link you'll share with everyone. Usually,it's the
                                    same as your project's twitter username, or something similar.
                                  </div>
                                )
                              }}
                            ></UTooltip>
                          </div>
                        )
                      }
                    }}
                  >
                    <UInput
                      v-slots={{
                        prefix: () => (
                          <div class="border-color-border border-r-1 mr-1 px-3 !bg-[#F5F6FA] !-ml-3 !text-color3">{`${
                            import.meta.env.VITE_HOST
                          }/profile/`}</div>
                        )
                      }}
                      v-model:value={this.info.custom_domain}
                      maxlength={20}
                    />
                  </UFormItem>
                </UForm>
                {btnGroup(handleEditMode, handleSubmit)}
              </div>
            </>
          ) : (
            <>
              <div class="h-45">
                <img
                  src={this.info.cover || defaultCover}
                  alt="bg"
                  class="h-full object-cover w-full"
                />
              </div>
              <ULazyImage
                class="rounded-1/2 h-20 top-155px left-6 w-20 absolute"
                src={this.avatar}
              />
              <div class="flex mt-5 w-full pr-6 justify-end">
                {this.viewMode ? (
                  <>
                    {!this.self || !this.isOwner ? (
                      <>
                        {this.follow ? (
                          <UButton
                            secondary
                            type="tertiary"
                            size="small"
                            onClick={() => this.toggleFollow()}
                          >
                            <CheckFilled class="mr-2" />
                            Unconnect
                          </UButton>
                        ) : (
                          <UButton type="primary" size="small" onClick={() => this.toggleFollow()}>
                            <PlusOutlined class="h-4 mr-2 w-4" />
                            Connect
                          </UButton>
                        )}
                      </>
                    ) : (
                      <UButton class="mr-6 w-40 invisible" size="small">
                        Connect
                      </UButton>
                    )}
                  </>
                ) : (
                  <Edit onHandleClick={handleEditMode} />
                )}
              </div>
              <div class="flex flex-col mt-8 mb-6 px-6">
                <p class="text-color1 u-h3">{this.name}</p>
                <p class="mt-2 text-color3 u-h6">{this.subTitle}</p>
              </div>
            </>
          )}
        </div>
      </USpin>
    )
  }
})

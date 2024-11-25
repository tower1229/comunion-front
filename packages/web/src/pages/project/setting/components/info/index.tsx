import {
  USpin,
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  useUpload,
  message
} from '@comunion/components'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, ref, reactive, PropType, watch, h } from 'vue'
import { RectDraggerUpload } from '@/components/Upload'
import {
  getStartupTypeFromNumber,
  STARTUP_TYPES,
  ChainNetworkType,
  StartupTypesType,
  getStartupNumberFromType,
  supportedNetworks
} from '@/constants'
import { useStartupContract } from '@/contracts'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
type InfoPropType = {
  logo: string
  banner: string
  name: string
  type: number
  mission: string
  overview: string
  blockChainAddress: string
  chain_id: number | undefined
  tags: Array<string>
  on_chain: boolean | undefined
}

type InfoType = Omit<InfoPropType, 'type' | 'blockChainAddress' | 'on_chain'> & {
  type: string
}

type chainSelectOption = {
  label: string
  logo: string
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<InfoPropType>,
      required: true
    },
    startup_id: {
      type: Number,
      required: true
    }
  },
  emits: ['saved', 'edit'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const contractStore = useContractStore()
    const loading = ref(false)
    const info = reactive<InfoType & { switchChain: boolean }>({
      logo: props.data.logo || '',
      banner: props.data.banner || '',
      name: props.data.name || '',
      type: getStartupTypeFromNumber(props.data.type) || '',
      mission: props.data.mission || '',
      overview: props.data.overview || '',
      chain_id: props.data.chain_id,
      tags: props.data.tags || [],
      switchChain: props.data.on_chain || false
    })

    const netWorkChange = async (chainId: number) => {
      if (walletStore.chainId !== chainId && info.switchChain) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.switchNetwork({ chainId })
        if (!result) {
          info.switchChain = false
        }
      }
    }
    const switchChange = async (value: boolean) => {
      if (value) {
        netWorkChange(info.chain_id!)
      }
    }
    const getNetWorkList = (supportedNetworks: Array<ChainNetworkType> = []) => {
      return supportedNetworks.map((item: ChainNetworkType) => ({
        value: item.chainId,
        label: item.name,
        logo: item.logo
      }))
    }
    const setFieldsStatus = (status = false) => {
      const stringArr = ['switchChain', 'chain_id', 'name']
      fields.map(item => {
        if (stringArr.includes(item.name)) {
          item.disabled = status
        }
      })
    }

    const fields: FormFactoryField[] = reactive([
      {
        t: 'select',
        title: 'Blockchain Network',
        name: 'chain_id',
        placeholder: 'Select project Blockchain Network',
        defaultValue: info.chain_id,
        options: getNetWorkList(supportedNetworks),
        onUpdateValue: (value: number) => netWorkChange(value),
        renderTag: ({ option }) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            },
            [
              h('img', {
                src: option.logo,
                round: true,
                style: {
                  marginRight: '12px',
                  width: '20px'
                }
              }),
              option.label as string
            ]
          )
        },
        renderLabel: (option: chainSelectOption) => {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center'
              }
            },
            [
              h('img', {
                src: option.logo,
                round: true,
                size: 20
              }),
              h(
                'div',
                {
                  style: {
                    marginLeft: '12px',
                    padding: '4px 0'
                  }
                },
                [
                  h('div', null, [option.label as string])
                  // h(
                  //   NText,
                  //   { depth: 3, tag: 'div' },
                  //   {
                  //     default: () => 'description'
                  //   }
                  // )
                ]
              )
            ]
          )
        },
        rules: [
          {
            required: true,
            validator: (rule, value) => !!value,
            message: 'Blockchain Network cannot be blank',
            trigger: 'blur'
          }
        ],
        disabled: info.switchChain
      },
      {
        t: 'string',
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'Please enter your project name',
        maxlength: 24,
        disabled: info.switchChain,
        value: null
      },
      {
        t: 'switch',
        title: '',
        name: 'switchChain',
        onUpdateValue: (value: boolean) => switchChange(value),
        disabled: info.switchChain
      },
      {
        t: 'select',
        title: 'Type',
        name: 'type',
        required: true,
        placeholder: 'Select project type',
        options: STARTUP_TYPES.map(item => ({ label: item, value: item }))
      },
      {
        t: 'startupTags',
        required: true,
        title: 'Tag',
        name: 'tags',
        placeholder: 'Select project tag'
      },
      {
        t: 'string',
        title: 'Mission',
        name: 'mission',
        placeholder: 'Please enter your project mission',
        maxlength: 100,
        required: true,
        value: null
      },
      {
        t: 'string',
        title: 'Overview',
        name: 'overview',
        placeholder: 'Describe your project',
        minlength: 100,
        required: true,
        type: 'textarea',
        rules: [
          {
            required: true,
            message: 'Please enter a description of at least 100 letters'
          }
        ],
        value: null
      }
    ])
    const form = ref<FormInst>()
    const { onUpload } = useUpload()
    const logoUploadLoading = ref(false)
    const coverUploadLoading = ref(false)
    const handleUploadLogo: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        logoUploadLoading.value = true
        onUpload(file.file, percent => {
          onProgress({ percent })
        })
          .then(url => {
            info.logo = url as string
            logoUploadLoading.value = false
            onFinish()
          })
          .catch(err => {
            logoUploadLoading.value = false
            onError()
          })
      }
    }

    const handleUploadCover: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        coverUploadLoading.value = true
        onUpload(file.file, percent => {
          onProgress({ percent })
        })
          .then(url => {
            info.banner = url as string
            coverUploadLoading.value = false
            onFinish()
          })
          .catch(err => {
            coverUploadLoading.value = false
            onError()
          })
      }
    }

    setFieldsStatus(info.switchChain)

    watch(
      () => info,
      () => {
        if (info.name && info.chain_id) {
          console.log(2222222, 'info change', info.overview)
          ctx.emit('edit')
        }
      },
      {
        deep: true
      }
    )

    return {
      loading,
      form,
      fields,
      info,
      handleUploadLogo,
      handleUploadCover,
      contractStore,
      setFieldsStatus,
      coverUploadLoading,
      logoUploadLoading
    }
  },
  render() {
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          this.loading = true
          const startupContract = useStartupContract()
          if (this.info.switchChain && !this.data.on_chain) {
            const res = await startupContract.createStartup(
              [this.info.name, this.info.chain_id || 0, true],
              'The fields of network and name will be registered to blockchain.',
              `Project "${this.info.name}" is creating`
            )
            if (res) {
              // message.success('Successfully saved')
              this.$emit('saved')
            } else {
              this.info.switchChain = false
            }

            this.setFieldsStatus(true)
          } else {
            const res = await this.contractStore.setStartupSuccessAfter({
              startup_id: String(this.startup_id),
              logo: this.info.logo,
              banner: this.info.banner,
              chain_id: this.info.chain_id === undefined ? 0 : this.info.chain_id,
              name: this.info.name,
              type:
                this.info.type === undefined
                  ? 0
                  : getStartupNumberFromType(this.info.type as StartupTypesType),
              mission: this.info.mission,
              overview: this.info.overview,
              switch: false,
              tags: this.info.tags
            })

            console.log('res', res)
            if (res) {
              message.success('Successfully saved')
              this.$emit('saved')
            }
          }

          this.loading = false
        }
      })
    }

    const rules = getFieldsRules(this.fields)
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-sm mb-6 min-h-100 p-10 relative overflow-hidden">
          <div class="flex mb-14">
            <RectDraggerUpload
              text="Project Logo"
              tip={() => (
                <>
                  <p>Recommended：180px*180px</p>
                  <p>Max size：10MB</p>
                </>
              )}
              loading={this.logoUploadLoading}
              fileSize={10 * 1024 * 1024}
              accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
              imageUrl={this.info.logo}
              customRequest={this.handleUploadLogo}
            />
            <RectDraggerUpload
              class="flex-1 ml-10"
              text="Project Banner"
              tip={() => (
                <>
                  <p>Recommended：1380px*210px</p>
                  <p>Max size：10MB</p>
                </>
              )}
              loading={this.coverUploadLoading}
              fileSize={10 * 1024 * 1024}
              accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
              imageUrl={this.info.banner}
              customRequest={this.handleUploadCover}
              bgSize={true}
            />
          </div>

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

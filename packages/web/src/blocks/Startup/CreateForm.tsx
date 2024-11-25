import {
  FormInst,
  message,
  getFieldsRules,
  FormItemRule,
  UForm,
  UFormItemsFactory,
  UButton,
  FormFactoryField
} from '@comunion/components'
import { defineComponent, PropType, reactive, computed, ref, CSSProperties, h } from 'vue'
import { STARTUP_TYPES, supportedNetworks } from '@/constants'
import { useStartupContract } from '@/contracts'
import { useTags } from '@/hooks'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { reportError } from '@/utils/sentry'

type chainSelectOption = {
  label: string
  logo: string
}
type modelType = {
  chain_id: number | undefined
  switch: boolean
  name: string
  type: number | undefined
  mission: string
  overview: string
  tags: Array<string>
}
type createStartUpReturn = {
  hash?: string
}
const CreateStartupForm = defineComponent({
  name: 'CreateStartupForm',
  props: {
    onCancel: {
      type: Function as PropType<() => void>
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const contractStore = useContractStore()
    const startupTags = useTags('startup')

    const defaultModel = {
      chain_id: walletStore.chainId,
      // logo: '',
      switch: true,
      name: '',
      type: undefined,
      mission: '',
      overview: '',
      tags: []
      // tokenContract: '',
      // composes: [
      //   {
      //     name: '',
      //     address: ''
      //   }
      // ]
    }
    // const defaultTokenInfo = {
    //   name: '',
    //   symbol: '',
    //   supply: null as number | null,
    //   liquidity: null as number | null,
    //   txns: null as number | null,
    //   holders: null as number | null
    // }
    const formRef = ref<FormInst>()
    const loading = ref(false)
    const model = reactive<modelType>({
      ...{
        ...defaultModel
        // composes: [...defaultModel.composes]
      }
    })
    let startupContract = useStartupContract()

    function onCancel() {
      Object.assign(model, {
        ...{
          ...defaultModel
          // composes: [...defaultModel.composes]
        }
      })
      // Object.assign(tokenInfo, { ...defaultTokenInfo })
      props.onCancel?.()
    }

    function onSubmit() {
      formRef.value?.validate(async error => {
        if (!walletStore.chainId) {
          return console.warn('missing walletStore.chainId')
        }
        if (!error) {
          loading.value = true
          const { data } = await services['Startup@get-startup-is-existence']({
            chain_id: walletStore.chainId,
            name: model.name
          })
          if (!data || data.is_exist) {
            return message.error('Project name already exists')
          }
          try {
            if (model.switch) {
              const res1 = await startupContract.createStartup(
                [
                  model.name,
                  // model.type ? model.type : 0,
                  // model.tags,
                  // model.logo,
                  model.chain_id || 0,
                  // model.mission,
                  // model.tokenContract,
                  // model.composes.map(item => [item.name, item.address]),
                  // model.overview,
                  true
                ],
                'The fields of network and name will be registered to blockchain.',
                `Project "${model.name}" is creating`
              )
              if (!res1) {
                throw new Error('fail')
              }
              await contractStore.createStartupSuccessAfter({
                chain_id: model.chain_id || 0,
                switch: false,
                name: model.name,
                type: model.type ? model.type : 0,
                mission: model.mission,
                overview: model.overview,
                tags: model.tags,
                txHash: (res1 as createStartUpReturn).hash || ''
              })
            } else {
              const res2 = await contractStore.createStartupSuccessAfter({
                chain_id: model.chain_id === undefined ? 0 : model.chain_id,
                switch: false,
                name: model.name,
                type: model.type ? model.type : 0,
                mission: model.mission,
                overview: model.overview,
                tags: model.tags,
                txHash: ''
              })
              if (!res2?.data) {
                throw new Error('fail')
              }
            }
            ctx.emit('success', model)
            message.success(
              'Success send transaction to the chain, please wait for the confirmation'
            )
            onCancel()
            loading.value = false
          } catch (error) {
            reportError(error as Error)
            loading.value = false
          }
        }
      })
    }

    // reload contract and wallet store
    const initContract = () => {
      walletStore.init().then(() => {
        startupContract = useStartupContract()
      })
    }

    const netWorkChange = async (value: number) => {
      if (value && walletStore.chainId !== value) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.switchNetwork({ chainId: value })
        if (!result) {
          model.chain_id = walletStore.chainId
        } else {
          initContract()
        }
      }
    }
    const infoFields = computed<FormFactoryField[]>(() => {
      return [
        {
          t: 'select',
          title: 'Blockchain Network',
          name: 'chain_id',
          placeholder: 'Select startup Blockchain Network',
          options: supportedNetworks.map(item => ({
            value: item.chainId,
            label: item.name,
            logo: item.logo
          })),
          defaultValue: walletStore.chainId,
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
                  class: 'w-[20px] h-[20px] mr-[12px] object-cover'
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
                  class: 'w-[20px] h-[20px] mr-[12px] object-cover'
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
          ]
        },
        {
          t: 'string',
          title: 'Name',
          name: 'name',
          placeholder: 'Input project name',
          maxlength: 24,
          validationStatus: true,
          rules: [
            {
              required: true,
              validator: (rule, value) => !!value,
              message: 'Name cannot be blank',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => !value || value.length >= 3,
              message: 'Name must be 3 characters or more',
              trigger: 'blur'
            },
            {
              asyncValidator: (rule, value, callback) => {
                return new Promise((resolve, reject) => {
                  if (!walletStore.chainId) {
                    return callback(new Error('Operation not allowed'))
                  }
                  if (value) {
                    services['Startup@get-startup-is-existence']({
                      chain_id: walletStore.chainId,
                      name: value
                    })
                      .then(res => {
                        if (res?.data?.is_exist) {
                          callback(new Error('Operation not allowed'))
                        } else {
                          callback()
                        }
                      })
                      .catch(() => {
                        callback()
                      })
                  } else {
                    callback()
                  }
                })
              },
              message: 'That name has been taken. Please choose another.',
              trigger: 'blur'
            }
          ]
        },
        {
          t: 'switch',
          title: '',
          name: 'switch',
          disabled: false,
          defaultValue: false,
          railStyle: ({ focused, checked }: { focused: boolean; checked: boolean }) => {
            const style: CSSProperties = {}
            if (checked) {
              style.background = '#00BFA5'
            }
            return style
          }
        },
        {
          t: 'select',
          title: 'Type',
          name: 'type',
          placeholder: 'Select project type',
          options: STARTUP_TYPES.map((item, index) => ({ label: item, value: index + 1 })),
          rules: [
            {
              required: true,
              validator: (rule, value) => {
                return !!value
              },
              message: 'Type cannot be blank',
              trigger: 'blur'
            }
          ]
        },
        {
          t: 'startupTags',
          required: true,
          title: 'Tag',
          name: 'tags',
          placeholder: 'Select project tag',
          options: startupTags.TagList.value?.map(tag => {
            return {
              value: tag.name,
              label: tag.name
            }
          }),
          charLimit: 20
        },
        {
          t: 'string',
          title: 'Mission',
          name: 'mission',
          placeholder: 'Input project mission',
          maxlength: 100,
          rules: [
            {
              required: true,
              validator: (rule, value) => !!value,
              message: 'Mission cannot be blank',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => !value || value.length > 12,
              message: 'Mission must be 12 characters or more',
              trigger: 'blur'
            }
          ]
        },
        {
          t: 'string',
          title: 'Overview',
          name: 'overview',
          placeholder: 'Input overview for introducing your project',
          type: 'textarea',
          maxlength: 1000,
          rules: [
            {
              required: true,
              validator: (rule, value) => !!value,
              message: 'Overview cannot be blank',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => !value || value.length > 100,
              message: 'Overview must be 100 characters or more',
              trigger: 'blur'
            }
          ],
          autosize: {
            minRows: 5,
            maxRows: 5
          }
        }
      ]
    })
    const infoRules = getFieldsRules(infoFields.value)
    const allRules: Record<string, FormItemRule[]> = {
      ...infoRules
      // tokenContract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      // composes: [{ required: true, type: 'array', min: 1 }]
    }
    return {
      formRef,
      allRules,
      model,
      infoFields,
      onCancel,
      onSubmit,
      loading
    }
  },
  render() {
    return (
      <UForm ref={(ref: any) => (this.formRef = ref)} rules={this.allRules} model={this.model}>
        <UFormItemsFactory fields={this.infoFields} values={this.model} />

        <div class="flex mt-10 items-center justify-end">
          <UButton type="default" size="large" class="mr-4 w-41" onClick={this.onCancel}>
            Cancel
          </UButton>
          <UButton
            type="primary"
            size="large"
            class="w-41"
            loading={this.loading}
            onClick={this.onSubmit}
          >
            Submit
          </UButton>
        </div>
      </UForm>
    )
  }
})

export default CreateStartupForm

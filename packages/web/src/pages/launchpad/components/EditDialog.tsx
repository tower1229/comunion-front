import {
  UButton,
  UCard,
  UModal,
  FormFactoryField,
  USingleImageFileUpload,
  getFieldsRules,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { BigNumber } from 'ethers'
import { defineComponent, PropType, computed, Ref, ref, watch, h } from 'vue'
import RichEditor from '@/components/Editor'
import { useCrowdfundingContract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'

export default defineComponent({
  name: 'CrowdfundingEditDialog',
  props: {
    show: {
      type: Boolean
    },
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'Crowdfunding@get-crowdfunding-info'>>>,
      required: true
    }
  },
  emits: ['close', 'update'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const crowdfundingInfo = ref({
      ...props.info,
      startTime: Number(props.info.start_time),
      endTime: Number(props.info.end_time)
    })

    watch(
      () => props.show,
      () => {
        if (props.show) {
          crowdfundingInfo.value = {
            ...props.info,
            startTime: Number(props.info.start_time),
            endTime: Number(props.info.end_time)
          }
        }
      }
    )

    const isInCrowdChain = computed(() => {
      return walletStore.chainId === props.info.chain_id
    })

    const updateOnChain = async () => {
      const fundingContract = useCrowdfundingContract({
        chainId: walletStore.chainId!,
        addresses: { [walletStore.chainId!]: props.info.crowdfunding_contract! }
      })

      await fundingContract.parameters('Waiting to load.', 'Waiting to load.')
      const updateRes: any = await fundingContract.updateParas(
        BigNumber.from(crowdfundingInfo.value.endTime / 1000),
        'Waiting to update.',
        'Waiting to update.'
      )
      if (updateRes) {
        updateRes.wait().then((res: any) => {
          console.log(33333333, res)
        })
      }
    }

    const loading = ref(false)

    const descriptionField = ref()
    watch(
      () => props.info.description,
      () => {
        descriptionField.value?.validate()
      }
    )

    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        rules: [{ required: true, message: 'Title cannot be blank', trigger: 'blur' }],
        placeholder: 'Input Launchpad title',
        maxlength: 100
      },
      {
        t: 'date',
        title: 'Start Date (UTC)',
        name: 'startTime',
        type: 'datetime',
        class: 'w-full !grid-rows-[28px,40px,1fr] items-start',
        format: 'yyyy-MM-dd HH:mm',
        disabled: true,
        placeholder: 'Select a date'
      },
      {
        t: 'date',
        title: 'End Date (UTC)',
        name: 'endTime',
        type: 'datetime',
        class: 'w-full !grid-rows-[28px,40px,1fr] items-start',
        actions: ['confirm'],
        format: 'yyyy-MM-dd HH:mm',
        required: true,
        disabled: Number(props.info.end_time) < new Date().getTime() || !isInCrowdChain.value,
        isDateDisabled: (ts: number) => {
          return ts < Number(props.info.end_time)
        },
        placeholder: 'Select a date'
      },
      {
        t: 'custom',
        title: 'Poster',
        name: 'poster',
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
              value={{
                id: '0',
                name: 'poster',
                status: 'finished',
                url: crowdfundingInfo.value.poster
              }}
              onUpdate:value={(file: any) =>
                file?.url && (crowdfundingInfo.value.poster = file.url)
              }
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
              v-model:value={crowdfundingInfo.value.description}
            />
          )
        }
      }
    ])

    const additionalInfoRules = getFieldsRules(formFields.value)
    const formRef = ref()
    const handleSubmit = () =>
      formRef.value?.validate(async (error: any) => {
        if (!error) {
          if (String(crowdfundingInfo.value.endTime) !== props.info.end_time) {
            console.log('endTime change')
            await updateOnChain()
          }
          console.log('save api')
          loading.value = true
          const { error } = await services['Crowdfunding@update-crowdfunding']({
            description: crowdfundingInfo.value.description as string,
            detail: crowdfundingInfo.value.detail,
            id: crowdfundingInfo.value.id,
            poster: crowdfundingInfo.value.poster as string,
            title: crowdfundingInfo.value.title as string,
            youtube: crowdfundingInfo.value.youtube
          })
          if (!error) {
            ctx.emit('update')
          }
          loading.value = false
        }
      })

    return {
      handleSubmit,
      formFields,
      crowdfundingInfo,
      additionalInfoRules,
      formRef,
      loading
    }
  },
  render() {
    return (
      <UModal show={this.show} maskClosable={false}>
        <UCard
          style={{ width: '540px', '--n-title-text-color': '#000' }}
          size="huge"
          closable={true}
          onClose={() => this.$emit('close')}
          title="Edit"
        >
          <div class="min-h-20 max-h-[60vh] text-color2 overflow-auto u-h6">
            <UForm
              rules={this.additionalInfoRules}
              model={this.crowdfundingInfo}
              ref={ref => (this.formRef = ref)}
            >
              <UFormItemsFactory fields={this.formFields} values={this.crowdfundingInfo} />
            </UForm>
          </div>

          <div class="flex mt-4 justify-end">
            <UButton
              type="primary"
              ghost
              class="mr-4 w-41"
              onClick={() => this.$emit('close')}
              loading={this.loading}
            >
              Cancel
            </UButton>
            <UButton type="primary" class="w-41" onClick={this.handleSubmit} loading={this.loading}>
              Yes
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

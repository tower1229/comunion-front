import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal
} from '@comunion/components'
import {
  defineComponent,
  Ref,
  computed,
  ref,
  reactive,
  PropType,
  watch,
  inject,
  ComputedRef
} from 'vue'
import { useRoute } from 'vue-router'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { allNetworks } from '@/constants'
import { services } from '@/services'
import { BountyPaymentTerms } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'
import './pay.css'

type paidInfoType = {
  tokenSymbol: string
  tokenAmount: number
  txHash: string
}

export default defineComponent({
  name: 'PayDailog',
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    paymentInfo: {
      type: Object as PropType<BountyPaymentTerms>,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const route = useRoute()
    const paramBountyId = inject<ComputedRef<number>>('paramBountyId')
    const refreshData = inject<ComputedRef<() => void>>('refreshData')

    const formData = reactive({
      token1_symbol: '',
      token2_symbol: '',
      token1_amount: 0,
      token2_amount: 0,
      transactionHash1: '',
      transactionHash2: ''
    })

    watch(
      () => props.visible,
      value => {
        if (value) {
          formData.token1_symbol = props.paymentInfo?.token1_symbol || ''
          formData.token2_symbol = props.paymentInfo?.token2_symbol || ''
          formData.token1_amount = props.paymentInfo?.token1_amount || 0
          formData.token2_amount = props.paymentInfo?.token2_amount || 0
          formData.transactionHash1 = ''
          formData.transactionHash2 = ''
        }
      }
    )

    const fields: Ref<FormFactoryField[]> = computed(() => {
      const result: FormFactoryField[] = []
      if (formData.token1_symbol) {
        result.push({
          t: 'custom',
          name: 'token1_amount',
          title: 'Pay amount',
          // required: true,
          rules: [
            {
              validator: (rule, value) => {
                return value > 0 || (formData.token2_amount > 0 && value >= 0)
              },
              message: 'At least greater than 0 for pay amount',
              trigger: 'blur'
            }
          ],
          render() {
            return (
              <UInputNumberGroup
                v-model:value={formData.token1_amount}
                type="withUnit"
                class="w-full"
                inputProps={{
                  precision: 0,
                  min: 0,
                  max: MAX_AMOUNT,
                  class: 'flex-1',
                  parse: (value: string) => {
                    if (value === null) return 0
                    return Number(value)
                  }
                }}
                renderUnit={() => renderUnit(formData.token1_symbol)}
              />
            )
          }
        })
      }
      if (formData.token2_amount && formData.token2_amount > 0) {
        result.push({
          t: 'custom',
          name: 'token2_amount',
          title: '',
          class: 'pay_dialog_token2_amount_form_item',
          rules: [
            {
              validator: (rule, value) => {
                return value > 0 || (formData.token1_amount > 0 && value >= 0)
              },
              message: 'At least greater than 0 for pay amount',
              trigger: 'blur'
            }
          ],
          render() {
            return (
              <UInputNumberGroup
                v-model:value={formData.token2_amount}
                type="withUnit"
                class=" w-full"
                inputProps={{
                  precision: 0,
                  min: 0,
                  max: MAX_AMOUNT,
                  class: 'flex-1',
                  parse: (value: string) => {
                    if (value === null) return 0
                    return Number(value)
                  }
                }}
                renderUnit={() => renderUnit(formData.token2_symbol)}
              />
            )
          }
        })
      }
      if (formData.token1_symbol) {
        result.push({
          title: 'Transaction Hash',
          name: 'transactionHash1',
          required: true,
          placeholder: 'Transaction Hash',
          rules: [
            {
              validator: (rule, value: string) => {
                return !value || /^0x([A-Fa-f0-9]{64})$/.test(value)
              },
              message: 'Transaction Hash incorrect',
              trigger: 'blur'
            }
          ]
        })
      }
      if (formData.token2_amount && formData.token2_amount > 0) {
        result.push({
          title: `${formData.token2_symbol} Transaction Hash`,
          name: 'transactionHash2',
          required: true,
          placeholder: 'Transaction Hash',
          rules: [
            {
              validator: (rule, value: string) => {
                return !value || /^0x([A-Fa-f0-9]{64})$/.test(value)
              },
              message: 'Transaction Hash incorrect',
              trigger: 'blur'
            }
          ]
        })
      }

      return result
    })
    const payFields = computed(() => {
      const p = getFieldsRules(fields.value)
      console.log(p)
      // return p
      return p
    })
    const form = ref<FormInst>()

    const paidInfo = computed(() => {
      const result: paidInfoType[] = []
      if (formData.token1_symbol) {
        const tokenAmount = Number(formData.token1_amount) || 0
        result.push({
          tokenSymbol: formData.token1_symbol,
          tokenAmount: tokenAmount,
          txHash: formData.transactionHash1
        })
      }
      if (formData.token2_symbol) {
        const tokenAmount = Number(formData.token2_amount) || 0
        result.push({
          tokenSymbol: formData.token2_symbol,
          tokenAmount: tokenAmount,
          txHash: formData.transactionHash2
        })
      }
      return JSON.stringify(result)
    })

    return {
      payFields,
      fields,
      form,
      formData,
      paramBountyId,
      refreshData,
      paidInfo,
      route
    }
  },
  render() {
    if (!this.paramBountyId || !this.paymentInfo) {
      return null
    }

    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          const { error: err1 } = await services['Bounty@payment-bounty']({
            bounty_id: this.paramBountyId as number,
            bounty_payment_terms_id: this.paymentInfo!.id,
            paid_info: this.paidInfo
          })
          if (!err1) {
            const chainNet = allNetworks.find(net => net.chainId === this.detailChainId)
            const explorerUrl = chainNet?.explorerUrl
            const { error: err2 } = await services['Bounty@post-update-bounty']({
              bounty_id: this.paramBountyId as number,
              content: JSON.stringify({
                ...this.formData,
                url: `${explorerUrl}/tx/`
              }),
              type: 2
            })
            if (!err2) {
              triggerDialog()
              this.refreshData && this.refreshData()
            }
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style={{
            width: '600px',
            maxWidth: '90%',
            '--n-title-text-color': '#000'
          }}
          size="huge"
          title="Payment"
          bordered={false}
          closable
          onClose={triggerDialog}
        >
          <>
            <UForm
              rules={this.payFields}
              model={this.formData}
              ref={(ref: any) => (this.form = ref)}
            >
              <UFormItemsFactory fields={this.fields} values={this.formData} />
            </UForm>
            <div class="flex justify-end">
              <UButton class="mr-4 w-40" type="default" onClick={userBehavier('cancel')}>
                Cancel
              </UButton>
              <UButton class="w-40" type="primary" onClick={userBehavier('submit')}>
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})

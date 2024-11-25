import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal,
  message
} from '@comunion/components'
import { ethers } from 'ethers'
import {
  defineComponent,
  Ref,
  ComputedRef,
  computed,
  ref,
  reactive,
  watch,
  VNodeChild,
  inject
} from 'vue'
import {
  useBountyContractWrapper,
  BountyContractReturnType
} from '../../hooks/useBountyContractWrapper'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { useWalletStore, useUserStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const walletConnected = useWalletStore().connected
    const userStore = useUserStore()
    const formData = reactive({
      increaseDeposit: 0
    })

    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    watch(
      () => props.visible,
      value => {
        if (value) {
          formData.increaseDeposit = 0
        }
      }
    )

    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'increaseDeposit',
        title: 'Increase amount of deposit to enhance credit',
        formItemProps: {
          feedback: 'At least greater than 0 for new desposit',
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
        rules: [
          {
            required: true,
            validator: (rule, value: number) => {
              // console.log(formData.increaseDeposit)
              return value > 0
            },
            trigger: 'change'
          }
        ],
        render() {
          return (
            <UInputNumberGroup
              v-model:value={formData.increaseDeposit}
              type="withUnit"
              class="w-full"
              inputProps={{
                precision: 0,
                min: 0,
                max: MAX_AMOUNT,
                class: 'flex-1',
                parse: (value: string) => {
                  if (value === null || value === '') return 0
                  return Number(value)
                }
              }}
              renderUnit={() =>
                renderUnit(bountyDetail?.value.deposit_contract_token_symbol || '--')
              }
            />
          )
        }
      }
    ])
    const addDepositFields = getFieldsRules(fields.value)
    const form = ref<FormInst>()

    return {
      bountyDetail,
      addDepositFields,
      fields,
      form,
      formData,
      walletConnected,
      userStore
    }
  },
  render() {
    if (!this.bountyDetail) {
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

      const isSupport = this.bountyDetail?.chain_id
        ? await checkSupportNetwork(this.bountyDetail.chain_id)
        : false
      if (!isSupport) {
        return console.warn('chain id is not match!')
      }

      if (!this.walletConnected) {
        return this.userStore.logout()
      }

      const { bountyContract, approve } = await useBountyContractWrapper(
        this.bountyDetail as BountyInfo
      )

      const { deposit } = bountyContract

      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          const approvePendingText = 'Apply for increasing the deposits to bounty contract.'
          const contractStore = useContractStore()
          contractStore.startContract(approvePendingText)
          const tokenSymbol = this.bountyDetail?.deposit_contract_token_symbol
          // console.log(this.bountyDetail?.contract_address, this.formData.increaseDeposit)
          const isMainCoin =
            this.bountyDetail?.deposit_contract_address ===
            '0x0000000000000000000000000000000000000000'
          const depositValue = ethers.utils.parseUnits(
            this.formData.increaseDeposit.toString(),
            this.bountyDetail?.deposit_contract_token_decimal
          )
          let response
          if (isMainCoin) {
            response = await deposit(
              depositValue,
              'The bounty credit will be enchanced by increasing the deposits.',
              `Increase deposits to ${this.formData.increaseDeposit} ${tokenSymbol}.`,
              {
                value: depositValue
              }
            )
          } else {
            const res1 = await approve(
              this.bountyDetail?.contract_address || '',
              ethers.utils.parseUnits(
                this.formData.increaseDeposit.toString(),
                this.bountyDetail?.deposit_contract_token_decimal
              )
            )
            if (!res1) {
              contractStore.endContract('failed', { success: false })
            } else {
              console.log('this.formData.increaseDeposit', this.formData.increaseDeposit)

              response = (await deposit(
                depositValue,
                'The bounty credit will be enchanced by increasing the deposits.',
                `Increase deposits to ${this.formData.increaseDeposit} ${tokenSymbol}.`
              ).catch((error: { message: string | (() => VNodeChild) }) => {
                message.error(error.message)
                return null
              })) as unknown as BountyContractReturnType
            }
          }

          if (!response) {
            contractStore.endContract('failed', { success: false })
          }
          console.log('should trigger socket reload...')
          triggerDialog()
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
          title="Increase deposit"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={triggerDialog}
        >
          <>
            <UForm
              class="mt-24px mb-40px"
              rules={this.addDepositFields}
              model={this.formData}
              ref={(ref: any) => (this.form = ref)}
            >
              <UFormItemsFactory fields={this.fields} values={this.formData} />
            </UForm>
            <div class="flex justify-end">
              <UButton class="mr-16px w-164px" type="default" onClick={userBehavier('cancel')}>
                Cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})

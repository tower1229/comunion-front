import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UCheckbox,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal,
  message
} from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, Ref, computed, h, ref, reactive, watch, inject, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { services } from '@/services'
import { useWalletStore, useUserStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { BountyInfo } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

type checkboxItem = {
  value: boolean
  validate: boolean
}

const ApplyDialog = defineComponent({
  name: 'applyBountyDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    deposit: {
      type: Number,
      required: true
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
    const route = useRoute()
    const formData = reactive({
      deposit: 0,
      description: ''
    })
    // Minimum deposit
    let deposit = 0
    const paramBountyId = inject<ComputedRef<number>>('paramBountyId')
    const bountyDetail = inject<ComputedRef<BountyInfo>>('bountyDetail')

    watch(
      () => props.visible,
      value => {
        if (value) {
          formData.deposit = props.deposit || 0
          formData.description = ''
          if (!deposit) deposit = props.deposit || 0
        }
      }
    )

    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'deposit',
        label: '1.Deposit',
        title: '1. Deposit',
        rules: [
          {
            required: true,
            validator: (rule, value: number) => {
              return Number(value) >= Number(deposit)
            },
            message: `Minimum deposit ${deposit} USDC for applying bounty`,
            trigger: 'blur'
          }
        ],
        slots: {
          label: () => [h(<div>1.Deposit</div>)],
          feedback: () => [
            h(
              <span class="text-color3 u-h7">
                Minimum deposit <span class="text-primary">{deposit}</span>{' '}
                {bountyDetail?.value.deposit_contract_token_symbol} for applying bounty
              </span>
            )
          ]
        },
        render() {
          return (
            <UInputNumberGroup
              v-model:value={formData.deposit}
              type="withUnit"
              class="w-full"
              inputProps={{
                precision: 8,
                min: 0,
                max: MAX_AMOUNT,
                class: 'flex-1'
              }}
              renderUnit={() => renderUnit(bountyDetail?.value.deposit_contract_token_symbol || '')}
            />
          )
        }
      },
      {
        t: 'string',
        title: '2.Submit your executing plan.',
        name: 'description',
        type: 'textarea',
        placeholder: 'Input your executing plan',
        minlength: 30,
        rules: [
          { required: true, message: `The executing plan can't be blank.` },
          { min: 30, message: 'At least more than 30 characters' },
          { max: 1000, message: 'No more than 1000 characters' }
        ],
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ])
    const applyFields = getFieldsRules(fields.value)

    const form = ref<FormInst>()

    const terms = reactive<checkboxItem>({ value: false, validate: false })

    const accept = reactive<checkboxItem>({ value: false, validate: false })

    const termsClass = computed(() => {
      return `text-14px ${terms.validate ? 'text-error' : 'text-color1'}`
    })

    const acceptClass = computed(() => {
      return `text-14px ${accept.validate ? 'text-error' : 'text-color1'}`
    })

    return {
      fields,
      applyFields,
      form,
      terms,
      accept,
      termsClass,
      acceptClass,
      formData,
      bountyDetail,
      paramBountyId,
      route,
      walletConnected,
      userStore
    }
  },
  render() {
    if (!this.bountyDetail) {
      return null
    }

    const triggerDialog = (done: boolean) => {
      this.$emit('triggerDialog', done)
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog(false)
        return
      }
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }

      if (!this.walletConnected) {
        return this.userStore.logout()
      }
      const { bountyContract, approve } = await useBountyContractWrapper(
        this.bountyDetail as BountyInfo
      )

      // submit
      this.form?.validate(async err => {
        if (typeof err === 'undefined' && this.accept.value) {
          const tokenSymbol = this.bountyDetail?.deposit_contract_token_symbol
          if (this.formData.deposit >= this.deposit) {
            const contractStore = useContractStore()
            contractStore.startContract('Apply for deposit deposits into bounty contract.')

            const depositAmount = ethers.utils.parseUnits(
              this.formData.deposit.toString(),
              this.bountyDetail?.deposit_contract_token_decimal
            )
            console.log('applyFor deposit', this.formData.deposit)
            let res2
            if (
              this.bountyDetail?.deposit_contract_address !==
              '0x0000000000000000000000000000000000000000'
            ) {
              const res1 = await approve(
                this.bountyDetail?.contract_address || '',
                ethers.utils.parseUnits(
                  this.formData.deposit.toString(),
                  this.bountyDetail?.deposit_contract_token_decimal
                )
              )
              if (!res1) {
                return contractStore.endContract('failed', { success: false })
              }
              res2 = await bountyContract.applyFor(
                depositAmount,
                'The deposits are transfering to deposit contract.',
                `Apply to ${this.formData.deposit} ${tokenSymbol}`
              )
              if (!res2) {
                return contractStore.endContract('failed', { success: false })
              }
            } else {
              res2 = await bountyContract.applyFor(
                depositAmount,
                'The deposits are transfering to deposit contract.',
                `Apply to ${this.formData.deposit} ${tokenSymbol}`,
                {
                  value: depositAmount
                }
              )
              if (!res2) {
                return contractStore.endContract('failed', { success: false })
              }
            }
            // send request
            if (this.paramBountyId) {
              await services['Bounty@apply-bounty']({
                bounty_id: this.paramBountyId,
                deposit: Number(this.formData.deposit),
                description: this.formData.description,
                tx_hash: res2 ? res2.hash : ''
              })

              // this.bountySection.reload()
              return triggerDialog(true)
            } else {
              return console.warn('missing paramBountyId')
            }
          } else {
            return message.error('Input deposit must be greater than applicant deposit!')
          }
        }

        if (!this.accept.value) {
          this.accept.validate = true
        }
        return console.log(err)
      })
    }

    const handleCheckbox = (type: 'terms' | 'accept') => (checked: boolean) => {
      this[type].value = checked
      if (checked) {
        this[type].validate = false
      }
    }

    return (
      <UModal v-model:show={this.visible}>
        <UCard
          style={{
            width: '540px',
            '--n-title-text-color': '#000'
          }}
          size="huge"
          title={this.title}
          closable
          onClose={userBehavier('cancel')}
        >
          <>
            <UForm
              rules={this.applyFields}
              model={this.formData}
              ref={(ref: any) => (this.form = ref)}
            >
              <UFormItemsFactory fields={this.fields} values={this.formData} />
            </UForm>
            {/* <UCheckbox checked={this.terms.value} onUpdateChecked={handleCheckbox('terms')}>
              <span class={this.termsClass}>
                I have read, understand, and agree to,{' '}
                <a class="text-primary" href="###">
                  the Terms of Service.
                </a>
              </span>
            </UCheckbox>
            <br /> */}
            <UCheckbox
              checked={this.accept.value}
              onUpdateChecked={handleCheckbox('accept')}
              class="mt-2"
            >
              <span class={this.acceptClass}>
                I accept that I will not be able to withdraw the deposit if I do evil.
              </span>
            </UCheckbox>
            <div class="flex mt-10 justify-end">
              <UButton class="mr-4 w-40" type="default" onClick={userBehavier('cancel')}>
                Cancel
              </UButton>
              <UButton
                class="w-40"
                type="primary"
                onClick={userBehavier('submit')}
                disabled={!this.bountyDetail?.contract_address}
                loading={!this.bountyDetail?.contract_address}
              >
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})

export default ApplyDialog

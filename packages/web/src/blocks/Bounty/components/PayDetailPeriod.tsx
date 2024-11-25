import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  USelect,
  UInputNumberGroup
} from '@comunion/components'
import { defineComponent, PropType, ref, computed } from 'vue'
import { BountyInfo, chainInfoType } from '../typing'
import { MAX_AMOUNT, renderUnit } from './BasicInfo'
import RichEditor from '@/components/Editor'
import { PERIOD_OPTIONS, allNetworks, BASE_CURRENCY } from '@/constants'

export interface PayDetailPeriodRef {
  payPeriodForm: FormInst | null
  payPeriodTotal: {
    usdcTotal: number
    tokenTotal: number
  }
}

const PayDetailPeriod = defineComponent({
  name: 'PayDetailPeriod',
  props: {
    bountyInfo: {
      type: Object as PropType<BountyInfo>,
      required: true
    },
    chainInfo: {
      type: Object as PropType<chainInfoType>
    }
  },
  emits: ['showLeaveTipModal'],
  setup(props, ctx) {
    const payPeriodForm = ref<FormInst | null>(null)

    const renderSelect = computed(() => (
      <USelect
        class="text-center w-30"
        options={PERIOD_OPTIONS}
        v-model:value={props.bountyInfo.period.periodType}
      />
    ))
    const payPeriodTotal = computed(() => {
      return {
        usdcTotal: props.bountyInfo.period.periodAmount * props.bountyInfo.period.token1_amount,
        tokenTotal: props.bountyInfo.period.periodAmount * props.bountyInfo.period.token2_amount
      }
    })

    const currentStartupCurrency = computed<string>(() => {
      const currentChainId = props.chainInfo?.chain_id
      if (currentChainId) {
        const targetIndex = allNetworks.findIndex(net => net.chainId === currentChainId)
        if (targetIndex !== -1) {
          return allNetworks[targetIndex].currencySymbol
        }
      }
      return ''
    })

    const token1SymbolOptions = (
      currentStartupCurrency.value
        ? [
            ...new Set(BASE_CURRENCY)
              .add(props.bountyInfo.token1_symbol)
              .add(currentStartupCurrency.value)
          ]
        : [...new Set(BASE_CURRENCY).add(props.bountyInfo.token1_symbol)]
    ).map(label => {
      return {
        label,
        value: label
      }
    })

    const renderRewardsSelect = computed(() => (
      <USelect
        class="text-center w-30"
        options={token1SymbolOptions}
        v-model:value={props.bountyInfo.payTokenSymbol}
      />
    ))

    const payDetailPeriodFields: FormFactoryField[] = [
      {
        t: 'custom',
        title: 'Work time planning',
        name: 'period',
        render(value) {
          return (
            <div class="w-full">
              <div class="flex items-center">
                <UInputNumberGroup
                  inputProps={{
                    class: 'flex-1',
                    precision: 0,
                    min: 2
                  }}
                  v-model:value={props.bountyInfo.period.periodAmount}
                  class="flex-1"
                  type="withSelect"
                  renderSelect={() => renderSelect.value}
                ></UInputNumberGroup>
                <div class="px-5 text-grey2 text-3xl invisible">+</div>
                <UInputNumberGroup
                  inputProps={{
                    class: 'flex-1',
                    precision: 0,
                    min: 1,
                    max: 24
                  }}
                  v-model:value={props.bountyInfo.period.hoursPerDay}
                  class="flex-1"
                  type="withUnit"
                  renderUnit={() => renderUnit('hours/Day')}
                ></UInputNumberGroup>
              </div>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Rewards (once)',
        name: 'rewards',
        render(value) {
          return (
            <div class="flex w-full items-start">
              <UInputNumberGroup
                class="flex-1"
                type="withSelect"
                v-model:value={props.bountyInfo.period.token1_amount}
                inputProps={{
                  precision: 0,
                  min: 0,
                  max: MAX_AMOUNT,
                  class: 'flex-1',
                  parse: (value: string) => {
                    if (value === null) return 0
                    return Number(value)
                  },
                  status: payPeriodTotal.value.usdcTotal > MAX_AMOUNT ? 'error' : undefined
                }}
                renderSelect={() => renderRewardsSelect.value}
              ></UInputNumberGroup>
              <div class="px-5 text-grey2 text-3xl">+</div>
              <div class="flex-1">
                <UInputNumberGroup
                  class="flex-1"
                  type="withUnit"
                  v-model:value={props.bountyInfo.period.token2_amount}
                  inputProps={{
                    precision: 0,
                    min: 0,
                    max: MAX_AMOUNT,
                    class: 'flex-1',
                    parse: (value: string) => {
                      if (value === null) return 0
                      return Number(value)
                    },
                    status: payPeriodTotal.value.tokenTotal > MAX_AMOUNT ? 'error' : undefined
                  }}
                  renderUnit={() => renderUnit(props.bountyInfo.token2_symbol)}
                ></UInputNumberGroup>
                <div>
                  {!props.bountyInfo.token2_symbol && (
                    <div class="mt-2 text-xs text-color3 col-start-3">
                      Not setup token yet, go to{' '}
                      <span
                        class="cursor-pointer text-primary"
                        onClick={() => ctx.emit('showLeaveTipModal', 'toFinanceSetting')}
                      >
                        Finance Setting
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: '',
        // slots: {
        //   label: () => [<div class="h-4"></div>]
        // },
        class: '!grid-rows-none',
        name: 'summary',
        render() {
          return (
            <div class="bg-purple mt-4 w-full py-5.5 px-6">
              The current total rewards as{' '}
              <span class="text-primary">
                <span class={[{ 'text-error': payPeriodTotal.value.usdcTotal > MAX_AMOUNT }]}>
                  {payPeriodTotal.value.usdcTotal} {props.bountyInfo.payTokenSymbol}{' '}
                </span>
                {props.bountyInfo.token2_symbol && (
                  <span>
                    {' '}
                    +{' '}
                    <span class={[{ 'text-error': payPeriodTotal.value.tokenTotal > MAX_AMOUNT }]}>
                      {payPeriodTotal.value.tokenTotal} {props.bountyInfo.token2_symbol}
                    </span>
                  </span>
                )}
              </span>
              {(payPeriodTotal.value.usdcTotal > MAX_AMOUNT ||
                payPeriodTotal.value.tokenTotal > MAX_AMOUNT) && (
                <span> , Please reduce your reward to under 10000</span>
              )}
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Target',
        name: 'period.target',
        // required: true,
        rules: [
          { required: true, message: 'Please input description and target of bounty for applicant' }
        ],
        render() {
          return (
            <RichEditor
              placeholder="Set up description and target of bounty for applicant"
              class="w-full"
              v-model:value={props.bountyInfo.period.target}
            />
          )
        }
      }
    ]
    const payPeriodRules = getFieldsRules(payDetailPeriodFields)
    ctx.expose({
      payPeriodForm,
      payPeriodTotal
    })
    return {
      payDetailPeriodFields,
      payPeriodRules,
      payPeriodForm
    }
  },
  render() {
    return (
      <UForm
        class="mt-9"
        model={this.bountyInfo}
        rules={this.payPeriodRules}
        ref={(ref: any) => (this.payPeriodForm = ref)}
      >
        <UFormItemsFactory fields={this.payDetailPeriodFields} values={this.bountyInfo} />
      </UForm>
    )
  }
})

export default PayDetailPeriod

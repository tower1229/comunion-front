import {
  FormInst,
  UForm,
  UFormItem,
  UInput,
  UInputNumberGroup,
  USelect
} from '@comunion/components'
import { MinusCircleOutlined, AddCircleOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, computed } from 'vue'
import { BountyInfo, chainInfoType } from '../typing'
import { MAX_AMOUNT, renderUnit } from './BasicInfo'
import { allNetworks, BASE_CURRENCY } from '@/constants'

export interface PayDetailStageRef {
  payStageForm: FormInst | null
  payStagesTotal: {
    usdcTotal: number
    tokenTotal: number
  }
}

const PayDetailStage = defineComponent({
  name: 'PayDetailStage',
  props: {
    bountyInfo: {
      type: Object as PropType<BountyInfo>,
      required: true
    },
    chainInfo: {
      type: Object as PropType<chainInfoType>
    }
  },
  emits: ['delStage', 'addStage', 'showLeaveTipModal'],
  setup(props, ctx) {
    const payStageForm = ref<FormInst | null>(null)
    const payStagesTotal = computed(() => {
      const usdcTotal = props.bountyInfo.stages.reduce(
        (total, stage) => total + Number(stage.token1_amount),
        0
      )
      const tokenTotal = props.bountyInfo.stages.reduce(
        (total, stage) => total + Number(stage.token2_amount),
        0
      )
      return {
        usdcTotal,
        tokenTotal
      }
    })
    const delStage = (stageIndex: number) => {
      ctx.emit('delStage', stageIndex)
    }
    const addStage = () => {
      ctx.emit('addStage')
    }
    const showLeaveTipModal = () => {
      ctx.emit('showLeaveTipModal', 'toFinanceSetting')
    }
    ctx.expose({
      payStageForm,
      payStagesTotal
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
    const renderSelect = computed(() => (
      <USelect
        class="text-center w-30"
        options={token1SymbolOptions}
        v-model:value={props.bountyInfo.payTokenSymbol}
      />
    ))

    return {
      payStageForm,
      payStagesTotal,
      delStage,
      addStage,
      showLeaveTipModal,
      renderSelect
    }
  },
  render() {
    return (
      <UForm
        model={this.bountyInfo.stages}
        ref={(ref: any) => (this.payStageForm = ref)}
        class="mt-7"
      >
        {/* <UFormItemsFactory fields={this.payDetailStageFields} values={this.bountyInfo} /> */}
        {this.bountyInfo.stages.map((stage: any, stageIndex: number) => (
          <div class="flex mb-6 items-center">
            <div class="bg-purple rounded-sm px-4 pt-4">
              <div class="text-color1">Rewards</div>
              {/* <div class="flex items-center"> */}
              <div class="grid grid-cols-[1fr,56px,1fr]">
                <UInputNumberGroup
                  class="flex-1"
                  type="withSelect"
                  inputProps={{
                    class: 'flex-1',
                    precision: 0,
                    min: 0,
                    max: MAX_AMOUNT,
                    parse: (value: string) => {
                      if (value === null) return 0
                      return Number(value)
                    },
                    status: this.payStagesTotal.usdcTotal > MAX_AMOUNT ? 'error' : undefined
                  }}
                  v-model:value={stage.token1_amount}
                  renderSelect={() => this.renderSelect}
                ></UInputNumberGroup>
                <div class="px-5 text-grey2 text-3xl">+</div>
                <UInputNumberGroup
                  class="flex-1"
                  type="withUnit"
                  inputProps={{
                    class: 'flex-1',
                    precision: 0,
                    min: 0,
                    max: MAX_AMOUNT,
                    parse: (value: string) => {
                      if (value === null) return 0
                      return Number(value)
                    },
                    status: this.payStagesTotal.tokenTotal > MAX_AMOUNT ? 'error' : undefined,
                    disabled: !this.bountyInfo.token2_symbol
                  }}
                  v-model:value={stage.token2_amount}
                  renderUnit={() => renderUnit(this.bountyInfo.token2_symbol)}
                ></UInputNumberGroup>
              </div>
              <div class="grid grid-cols-[1fr,56px,1fr]">
                {!this.bountyInfo.token2_symbol && (
                  <div class="mt-2 text-xs text-color3 col-start-3">
                    Not setup token yet, go to{' '}
                    <span
                      class="cursor-pointer text-primary"
                      onClick={() => this.showLeaveTipModal()}
                    >
                      Finance Setting
                    </span>
                  </div>
                )}
              </div>
              <UFormItem
                path={`${stageIndex}.terms`}
                rule={[
                  {
                    required: true,
                    message: 'Stage decription cannot be blank',
                    trigger: 'blur'
                  },
                  {
                    validator: (rule, value) => !value || value.length > 12,
                    message: 'Stage decription must be 12 characters or more',
                    trigger: 'blur'
                  }
                ]}
              >
                <UInput
                  placeholder="The applicant will get the rewards when do complete this stage"
                  type="textarea"
                  rows={1}
                  class="-mt-1"
                  v-model:value={stage.terms}
                  maxlength={200}
                />
              </UFormItem>
            </div>

            <div
              class={[
                'flex items-center ',
                {
                  invisible: this.bountyInfo.stages.length <= 1,
                  'cursor-pointer': this.bountyInfo.stages.length > 1
                }
              ]}
              onClick={() => (this.bountyInfo.stages.length > 1 ? this.delStage(stageIndex) : null)}
            >
              <MinusCircleOutlined class="h-5 ml-5 w-5" />
            </div>

            <div
              class={[
                'flex items-center cursor-pointer',
                {
                  invisible:
                    this.bountyInfo.stages.length > 4 ||
                    stageIndex + 1 < this.bountyInfo.stages.length
                }
              ]}
              onClick={stageIndex + 1 === this.bountyInfo.stages.length ? this.addStage : undefined}
            >
              <AddCircleOutlined class="h-5 ml-5 w-5" />
            </div>
          </div>
        ))}
        <div class="bg-purple rounded-sm mr-20 py-5.5 px-6">
          The current total rewards as{' '}
          <span class="text-primary">
            <span class={[{ 'text-error': this.payStagesTotal.usdcTotal > MAX_AMOUNT }]}>
              {this.payStagesTotal.usdcTotal} {this.bountyInfo.payTokenSymbol}
            </span>
            {this.bountyInfo.token2_symbol && (
              <span>
                {' '}
                +{' '}
                <span class={[{ 'text-error': this.payStagesTotal.tokenTotal > MAX_AMOUNT }]}>
                  {this.payStagesTotal.tokenTotal} {this.bountyInfo.token2_symbol}
                </span>
              </span>
            )}
          </span>
          {(this.payStagesTotal.usdcTotal > MAX_AMOUNT ||
            this.payStagesTotal.tokenTotal > MAX_AMOUNT) && (
            <span> , Please reduce your reward to under 10000</span>
          )}
        </div>
      </UForm>
    )
  }
})

export default PayDetailStage

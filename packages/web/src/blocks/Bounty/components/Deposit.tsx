import {
  FormFactoryField,
  FormInst,
  UCheckbox,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  USelect
} from '@comunion/components'
import { defineComponent, h, PropType, ref } from 'vue'
import { bountyInfoType } from '../CreateForm'
import { MAX_AMOUNT } from './BasicInfo'

export interface DepositRef {
  depositForm: FormInst | null
}

const Deposit = defineComponent({
  name: 'Deposit',
  props: {
    bountyInfo: {
      type: Object as PropType<bountyInfoType>,
      required: true
    }
  },
  setup(props, ctx) {
    const depositForm = ref<FormInst | null>(null)
    const depositFields: FormFactoryField[] = [
      {
        t: 'custom',
        name: 'deposit',
        title: 'Deposit',
        slots: {
          label: () => [
            h(
              <div>
                Deposit
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <span class="text-xs ml-4 text-color3 u-body1">
                  Depoist {props.bountyInfo.applicantsDepositSymbol} into bounty contract which can
                  enhance credit in order to attract much more applicants
                </span>
              </div>
            )
          ]
        },
        render(value) {
          return (
            <UInputNumberGroup
              v-model:value={props.bountyInfo.deposit}
              class="flex-1"
              inputProps={{
                precision: 8,
                min: 0,
                max: MAX_AMOUNT,
                class: 'flex-1'
              }}
              type="withSelect"
              renderSelect={() => (
                <USelect
                  class="text-center w-30"
                  options={[
                    {
                      value: props.bountyInfo.token0_symbol,
                      label: props.bountyInfo.token0_symbol
                    },
                    { value: props.bountyInfo.token1_symbol, label: props.bountyInfo.token1_symbol }
                  ]}
                  v-model:value={props.bountyInfo.applicantsDepositSymbol}
                />
              )}
            ></UInputNumberGroup>
          )
        }
      },
      {
        t: 'custom',
        name: 'agreement',
        title: '',
        render(value) {
          return (
            <div class="flex mt-4.5 items-center">
              <UCheckbox
                label="I accept that I will not be able to withdraw the deposit if I do evil."
                v-model:checked={props.bountyInfo.agreement}
              />
            </div>
          )
        }
      }
    ]
    ctx.expose({
      depositForm
    })
    return {
      depositForm,
      depositFields
    }
  },
  render() {
    return (
      <UForm
        model={this.bountyInfo}
        ref={(ref: any) => (this.depositForm = ref)}
        class="deposit-form"
      >
        <UFormItemsFactory fields={this.depositFields} values={this.bountyInfo} />
      </UForm>
    )
  }
})

export default Deposit

import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  UInputBigNumber,
  UInputNumberGroup,
  USelect,
  UTooltip
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { QuestionFilled } from '@comunion/icons'
import Big from 'big.js'
import dayjs from 'dayjs'
import { computed, defineComponent, Ref, PropType, ref, h, onMounted, watch } from 'vue'
import { CrowdfundingInfo } from '../typing'
import { getBuyCoinAddress } from '../utils'
import { allNetworks } from '@/constants'
import { useErc20Contract } from '@/contracts'
import { useWalletStore } from '@/stores'

export const MAIN_COIN_ADDR = '0x0000000000000000000000000000000000000000'

export interface InformationRef {
  crowdfundingInfoForm: FormInst | null
}

export const Information = defineComponent({
  name: 'Information',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  setup(props, ctx) {
    const erc20TokenContract = useErc20Contract()
    const walletStore = useWalletStore()
    const crowdfundingInfoForm = ref<FormInst | null>(null)
    const BuyCoinAddress = getBuyCoinAddress(MAIN_COIN_ADDR)[walletStore.chainId as number]
    console.log(BuyCoinAddress, 8989)
    // === props.crowdfundingInfo.sellTokenContract
    const raiseGoalOptions = computed(() => {
      return BuyCoinAddress.filter(item => item.value === MAIN_COIN_ADDR)
    })

    const getBuyTokenDecimals = async (value: string) => {
      const tokenContract = await erc20TokenContract(value) // construct erc20 contract
      try {
        const [decimals] = await Promise.all([tokenContract.decimals()])
        props.crowdfundingInfo.buyTokenDecimals = decimals
      } catch (error) {
        console.warn('getBuyTokenDecimals error:', error)
        props.crowdfundingInfo.buyTokenDecimals = '18'
      }
    }
    // const getMainCoin = async () => {}
    onMounted(() => {
      props.crowdfundingInfo.buyTokenContract = raiseGoalOptions.value[0].value as string
      props.crowdfundingInfo.buyTokenName = raiseGoalOptions.value[0].label as string
      props.crowdfundingInfo.buyTokenSymbol = raiseGoalOptions.value[0].label as string
      getBuyTokenDecimals(props.crowdfundingInfo.buyTokenContract)
    })

    const totalSellToken = computed(() => {
      if (props.crowdfundingInfo.listing === 'Manual Listing') {
        if (props.crowdfundingInfo.raiseGoal && props.crowdfundingInfo.buyPrice) {
          const sellTokenDeposit = new Big(props.crowdfundingInfo.raiseGoal)
            .times(new Big(props.crowdfundingInfo.buyPrice))
            .toString()
          props.crowdfundingInfo.sellTokenDeposit = Number(sellTokenDeposit)
          return sellTokenDeposit
        } else {
          props.crowdfundingInfo.sellTokenDeposit = 0
          return 0
        }
      } else {
        const { raiseGoal, buyPrice, swapPercent, listingRate } = props.crowdfundingInfo
        if (!raiseGoal || !buyPrice || !swapPercent || !listingRate) return '?'
        return raiseGoal * buyPrice + (raiseGoal * swapPercent * listingRate) / 100
      }
    })

    watch(
      () => totalSellToken.value,
      () => {
        props.crowdfundingInfo.totalSellToken = Number(totalSellToken.value)
      }
    )

    const renderSelect = computed(() => (
      <USelect
        class="text-center w-30"
        options={raiseGoalOptions.value}
        v-model:value={props.crowdfundingInfo.buyTokenContract}
        onUpdateValue={(value, option: SelectOption) => {
          props.crowdfundingInfo.buyTokenName = option.label
          props.crowdfundingInfo.buyTokenSymbol = option.label
          getBuyTokenDecimals(value)
        }}
      />
    ))

    const formFields: Ref<FormFactoryField[]> = computed(() => {
      const fields: FormFactoryField[] = [
        {
          t: 'custom',
          title: 'Raise Goal',
          name: 'raiseGoal',
          formItemProps: {
            first: true
          },
          class: '!grid-rows-[28px,40px,1fr] items-start col-start-1 col-end-3',
          slots: {
            label: () => [
              h(
                <div>
                  Raise Goal<span class="n-form-item-label__asterisk">&nbsp;*</span>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: () => {
                return !!props.crowdfundingInfo.raiseGoal
              },
              message: 'Raise Goal cannot be blank',
              trigger: ['blur']
            },
            {
              validator: () =>
                !!props.crowdfundingInfo.raiseGoal && props.crowdfundingInfo.raiseGoal > 0,
              message: 'Raise goal must be positive  number',
              trigger: ['blur']
            }
          ],
          render(value) {
            return (
              <div class="flex flex-1 items-center">
                <UInputNumberGroup
                  inputProps={{
                    placeholder: 'EX：10',
                    maxlength: 20,
                    precision: 18
                  }}
                  v-model:value={props.crowdfundingInfo.raiseGoal}
                  class="flex-1"
                  type="withSelect"
                  renderSelect={() => renderSelect.value}
                ></UInputNumberGroup>
              </div>
            )
          }
        },

        {
          t: 'custom',
          title: 'IBO Rate',
          name: 'buyPrice',
          class: '!grid-rows-[28px,60px,1fr] items-start',
          formItemProps: {
            first: true
          },
          slots: {
            label: () => [
              h(
                <div class="flex items-end">
                  Rate
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                  <span class="ml-1 u-h5">
                    1 {props.crowdfundingInfo.buyTokenSymbol} ={' '}
                    {props.crowdfundingInfo.buyPrice || '?'}{' '}
                    {props.crowdfundingInfo.sellTokenSymbol}
                  </span>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Rate cannot be blank',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: ' Rate must be positive number',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <div class="w-full">
                <UInputBigNumber
                  placeholder="EX:10"
                  maxlength="20"
                  precision={Number(props.crowdfundingInfo.sellTokenDecimals)}
                  v-model:value={props.crowdfundingInfo.buyPrice}
                  class="flex-1"
                ></UInputBigNumber>
                <div class="my-1 text-xs text-color3">
                  The price is at when investors buy token during Launchpad
                </div>
              </div>
            )
          }
        },
        {
          t: 'custom',
          title: 'Swap',
          name: 'swapPercent',
          class: '!grid-rows-[28px,60px,1fr] items-start',
          formItemProps: {
            first: true
          },
          slots: {
            label: () => [
              h(
                <div class="flex items-end">
                  Swap (%)
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                  <UTooltip placement="right">
                    {{
                      trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                      default: () => (
                        <div class="w-60">
                          Part of the funds raised will go into the swap pool as a fixed-price
                          exchangeable currency. and part will go directly to the team wallet.
                        </div>
                      )
                    }}
                  </UTooltip>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Swap cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Swap must be positive number.',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <div class="flex-1">
                <UInputBigNumber
                  placeholder="EX：70"
                  max="100"
                  precision={2}
                  v-model:value={props.crowdfundingInfo.swapPercent}
                  class="flex-1"
                ></UInputBigNumber>
                <div class="my-1 text-sx text-color3">
                  {props.crowdfundingInfo.swapPercent || '?'} % of the raised funds will go into the
                  swap pool.
                </div>
              </div>
            )
          }
        },

        {
          t: 'custom',
          title: 'Minimum Buy',
          name: 'minBuyAmount',
          class: '!grid-rows-[28px,40px,1fr] items-start',
          formItemProps: {
            first: true
          },
          slots: {
            label: () => [
              h(
                <div>
                  Minimum Buy ({props.crowdfundingInfo.buyTokenSymbol})
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Minimum Buy cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Minimum Buy must be positive number.',
              trigger: ['blur']
            }
          ],
          render(value) {
            return (
              <UInputBigNumber
                placeholder="EX: 10"
                precision={18}
                maxlength="20"
                v-model:value={props.crowdfundingInfo.minBuyAmount}
                class="flex flex-1 items-center"
              ></UInputBigNumber>
            )
          }
        },

        {
          t: 'custom',
          title: 'Maximum Buy',
          name: 'maxBuyAmount',
          class: '!grid-rows-[28px,40px,1fr] items-start',
          formItemProps: {
            first: true
          },
          slots: {
            label: () => [
              h(
                <div>
                  Maximum Buy ({props.crowdfundingInfo.buyTokenSymbol})
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Maximum Buy cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Maximum Buy must be positive number.',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                return value > props.crowdfundingInfo.minBuyAmount!
              },
              message: 'Max buy must be greater than min buy.',
              trigger: ['blur']
            }
          ],
          render(value) {
            return (
              <UInputBigNumber
                placeholder="EX: 10"
                precision={18}
                maxlength="20"
                v-model:value={props.crowdfundingInfo.maxBuyAmount}
                class="flex-1"
              ></UInputBigNumber>
            )
          }
        },
        {
          t: 'custom',
          title: 'Maximum Sell (%)',
          name: 'maxSell',
          class: '!grid-rows-[28px,60px,1fr] items-start',
          slots: {
            label: () => [
              h(
                <div class="flex items-end">
                  Maximum Sell (%)
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>{' '}
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (_rule, value) => !!value,
              message: 'Maximum Sell cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Maximum Sell must be positive number.',
              trigger: 'blur'
            }
          ],
          formItemProps: {
            first: true
          },
          render(value) {
            return (
              <div class="w-full">
                <UInputBigNumber
                  max="100"
                  precision={2}
                  v-model:value={props.crowdfundingInfo.maxSell}
                  class="flex-1"
                ></UInputBigNumber>
                <div class="my-1 text-xs text-color3">
                  Maximum sellable is the percentage of token each investor can sell.
                </div>
              </div>
            )
          }
        },
        {
          t: 'custom',
          title: 'Sell Tax',
          class: '!grid-rows-[28px,60px,1fr] items-start',
          slots: {
            label: () => [
              h(
                <div class="flex items-end">
                  Sell Tax (%)
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>{' '}
                </div>
              )
            ]
          },
          name: 'sellTax',
          formItemProps: {
            first: true
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Sell Tax cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Sell Tax must be positive number.',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <div class="w-full">
                <UInputBigNumber
                  max="100"
                  precision={2}
                  placeholder="EX:10"
                  v-model:value={props.crowdfundingInfo.sellTax}
                  class="flex-1"
                ></UInputBigNumber>
                <div class="my-1 text-xs text-color3">
                  Fees to be deducted when investors sell tokens in the swap pool.
                </div>
              </div>
            )
          }
        },
        {
          t: 'date',
          title: 'Start Date (UTC)',
          name: 'startTime',
          type: 'datetime',
          class: 'w-full !grid-rows-[28px,40px,1fr] items-start',
          format: 'yyyy-MM-dd HH:mm',
          rules: [
            { required: true, message: 'Start Date cannot be blank.' },
            {
              validator: (rule, value) => {
                if (!value || !props.crowdfundingInfo.endTime) return true
                return dayjs(value).isBefore(dayjs(props.crowdfundingInfo.endTime))
              },
              message: 'Start time needs to be before End time.',
              trigger: ['blur']
            }
          ],
          isDateDisabled: (current: number) => {
            return dayjs(current) < dayjs().startOf('day')
          },
          placeholder: 'Select a date'
        },
        {
          t: 'date',
          title: 'End Date (UTC)',
          name: 'endTime',
          type: 'datetime',
          class: 'w-full !grid-rows-[28px,40px,1fr] items-start',
          actions: ['clear', 'confirm'],
          format: 'yyyy-MM-dd HH:mm',
          rules: [
            { required: true, message: 'End Date cannot be blank.' },
            {
              validator: (rule, value) => {
                if (!value || !props.crowdfundingInfo.startTime) return true
                return dayjs(value).isAfter(dayjs(props.crowdfundingInfo.startTime))
              },
              message: 'End time needs to be after Start time.',
              trigger: ['blur']
            }
          ],
          isDateDisabled: (current: number) => {
            return dayjs(current) < dayjs().startOf('day')
          },
          placeholder: 'Select a date.'
        }
      ]

      const router: FormFactoryField = {
        t: 'select',
        title: 'Router',
        name: 'Router',
        placeholder: 'Select Router',
        class: '!grid-rows-[26px,40px,1fr] items-start',
        rules: [
          {
            required: true,
            message: ' Please select a Router',
            type: 'string',
            trigger: ['blur']
          }
        ],
        options: allNetworks
          .find(item => item.chainId === props.crowdfundingInfo.chainId)!
          .routers!.map(item => ({ label: item.dex, value: item.address }))
      }

      const listingRate: FormFactoryField = {
        t: 'custom',
        title: 'Listing Rate',
        name: 'listingRate',
        class: '!grid-rows-[28px,60px,1fr] items-start',
        formItemProps: {
          first: true
        },
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                Listing Rate
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <span class="ml-1 u-h5">
                  1 {props.crowdfundingInfo.buyTokenSymbol} ={' '}
                  {props.crowdfundingInfo.listingRate || '?'}{' '}
                  {props.crowdfundingInfo.sellTokenSymbol}
                </span>
              </div>
            )
          ]
        },
        rules: [
          {
            validator: (rule, value) => {
              console.log(value)
              return !!value
            },
            message: 'Listing Rate cannot be blank.',
            trigger: ['blur']
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Listing Rate must be positive number.',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="w-full">
              <UInputBigNumber
                placeholder="EX:10"
                maxlength="20"
                precision={Number(props.crowdfundingInfo.sellTokenDecimals)}
                v-model:value={props.crowdfundingInfo.listingRate}
                class="flex-1"
              ></UInputBigNumber>
              <div class="my-1 text-xs text-color3">
                The price is at when investors buy token during Launchpad.
              </div>
            </div>
          )
        }
      }

      if (props.crowdfundingInfo.listing !== 'Manual Listing') fields.push(router, listingRate)

      return fields
    })

    const crowdfundingInfoRules = getFieldsRules(formFields.value)
    ctx.expose({
      crowdfundingInfoForm
    })

    return {
      formFields,
      crowdfundingInfoForm,
      crowdfundingInfoRules,
      totalSellToken
    }
  },
  render() {
    return (
      <div>
        <UForm
          ref={(ref: any) => (this.crowdfundingInfoForm = ref)}
          rules={this.crowdfundingInfoRules}
          model={this.crowdfundingInfo}
          class="grid gap-x-10 grid-cols-2"
        >
          <UFormItemsFactory fields={this.formFields} values={this.crowdfundingInfo} />
        </UForm>
        <div class="bg-purple rounded-sm mt-4 py-5.5 px-6">
          Need <span class="text-primary">{this.totalSellToken}</span>
          {this.crowdfundingInfo.sellTokenSymbol} to create Launchpad.
        </div>
      </div>
    )
  }
})

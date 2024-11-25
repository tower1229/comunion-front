import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCheckbox,
  UForm,
  UFormItemsFactory,
  UInputBigNumber,
  URadio
} from '@comunion/components'
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

    onMounted(() => {
      props.crowdfundingInfo.buyTokenContract = raiseGoalOptions.value[0].value as string
      props.crowdfundingInfo.buyTokenName = raiseGoalOptions.value[0].label as string
      props.crowdfundingInfo.buyTokenSymbol = raiseGoalOptions.value[0].label as string
      getBuyTokenDecimals(props.crowdfundingInfo.buyTokenContract)
    })

    const totalSellToken = computed(() => {
      const { softCap, hardCap, buyPrice, liquidityPercent, listingRate, listing } =
        props.crowdfundingInfo
      if (listing === 'Manual Listing') {
        if (!hardCap || !buyPrice) return '?'
        return hardCap * buyPrice
      } else {
        if (!softCap || !hardCap || !buyPrice || !liquidityPercent || !listingRate) return '?'
        return hardCap * buyPrice + (hardCap * liquidityPercent * listingRate) / 100
      }
    })

    watch(
      () => totalSellToken.value,
      () => {
        props.crowdfundingInfo.totalSellToken = Number(totalSellToken.value)
      }
    )

    const formFields: Ref<FormFactoryField[]> = computed(() => {
      const fields: FormFactoryField[] = [
        {
          t: 'custom',
          title: 'IBO Rate',
          name: 'buyPrice',
          class: `!grid-rows-[28px,60px,1fr] items-start ${
            props.crowdfundingInfo.listing === 'Manual Listing' ? 'col-start-1 col-end-3' : ''
          }`,
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
          title: 'Liquidity (%)',
          name: 'liquidityPercent',
          class: '!grid-rows-[28px,60px,1fr] items-start',
          formItemProps: {
            first: true
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Liquidity cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Liquidity must be positive number.',
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
                  v-model:value={props.crowdfundingInfo.liquidityPercent}
                  class="flex-1"
                ></UInputBigNumber>
                <div class="my-1 text-xs text-color3">
                  {props.crowdfundingInfo.liquidityPercent || '?'} % of raised funds that should be
                  allocated to Liquidity.
                </div>
              </div>
            )
          }
        },
        {
          t: 'custom',
          title: 'Currency',
          name: 'currency',
          class: '!grid-rows-[20px,36px,1fr] items-start col-start-1 col-end-3',
          formItemProps: { first: true },
          render(value) {
            return (
              <>
                {raiseGoalOptions.value.map(item => (
                  <URadio
                    checked={props.crowdfundingInfo.buyTokenName === item.label}
                    value={item.value}
                    v-modal:value={props.crowdfundingInfo.buyTokenContract}
                    name="basic-demo"
                    onUpdateChecked={value => {
                      if (value) props.crowdfundingInfo.buyTokenName = item.label
                      if (value) props.crowdfundingInfo.buyTokenSymbol = item.label
                    }}
                  >
                    {item.label}
                  </URadio>
                ))}
              </>
            )
          }
        },
        {
          t: 'custom',
          title: 'Soft Cap',
          name: 'softCap',
          class: '!grid-rows-[28px,60px,1fr] items-start',
          formItemProps: {
            first: true
          },
          slots: {
            label: () => [
              h(
                <div>
                  Soft Cap ({props.crowdfundingInfo.buyTokenSymbol})
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Softcap Buy cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Softcap Buy must be positive number.',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <div class="w-full">
                <UInputBigNumber
                  placeholder="EX: 10"
                  precision={18}
                  maxlength="20"
                  v-model:value={props.crowdfundingInfo.softCap}
                  class="flex-1"
                ></UInputBigNumber>
              </div>
            )
          }
        },
        {
          t: 'custom',
          title: 'Hard Cap',
          name: 'hardCap',
          class: '!grid-rows-[28px,40px,1fr] items-start',
          formItemProps: {
            first: true
          },
          slots: {
            label: () => [
              h(
                <div>
                  Hard Cap ({props.crowdfundingInfo.buyTokenSymbol})
                  <span class="n-form-item-label__asterisk">&nbsp;*</span>
                </div>
              )
            ]
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Hard Cap cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Hard Cap must be positive number.',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                console.log(value, props.crowdfundingInfo.softCap)
                return +value > (Number(props.crowdfundingInfo.softCap) || 0)
              },
              message: 'Hard Cap must be greater than Soft Cap!',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <UInputBigNumber
                placeholder="EX: 10"
                precision={18}
                maxlength="20"
                v-model:value={props.crowdfundingInfo.hardCap}
                class="flex flex-1 items-center"
              ></UInputBigNumber>
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
              trigger: 'blur'
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
                return +value > +props.crowdfundingInfo.minBuyAmount!
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
          t: 'select',
          title: 'Router',
          name: 'Router',
          class: '!grid-rows-[28px,40px,1fr] items-start',
          placeholder: 'Select Router',
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
        },
        {
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
        },
        {
          t: 'custom',
          name: 'usingVestingContributor',
          title: '',
          class: `!grid-rows-[0px,${
            props.crowdfundingInfo.isRebaseToken ? 72 : 0
          }px,1fr] items-start col-start-1 col-end-3`,
          formItemProps: { first: true },
          render(value) {
            return (
              <div class="w-full">
                <UCheckbox
                  checked={props.crowdfundingInfo.usingVestingContributor}
                  disabled={props.crowdfundingInfo.isRebaseToken}
                  size="large"
                  onUpdateChecked={value => {
                    console.log(value, 8989)
                    props.crowdfundingInfo.usingVestingContributor = value
                  }}
                >
                  &nbsp;&nbsp;Using Vesting Contributor?
                </UCheckbox>
                {props.crowdfundingInfo.isRebaseToken && (
                  <div
                    style={{ borderColor: '#F46359', background: '#F4695922', color: '#F12323' }}
                    class="border-1 pl-3 border-solid rounded-0 h-8 text-xs flex row items-center p mt-3"
                  >
                    The presale tokens are rebase tokens, and therefore cannot be used with Vesting
                    Contributor.
                  </div>
                )}
              </div>
            )
          }
        },
        {
          t: 'custom',
          title: 'First release for presale (%)*',
          name: 'firstRelease',
          class: '!grid-rows-[28px,40px,1fr] items-start col-start-1 col-end-3',
          formItemProps: {
            first: true
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'First release cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'First release must be positive number.',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <UInputBigNumber
                placeholder="EX：50"
                max="100"
                disabled={props.crowdfundingInfo.isRebaseToken}
                precision={2}
                v-model:value={props.crowdfundingInfo.firstRelease}
                class="flex-1"
              ></UInputBigNumber>
            )
          }
        },
        {
          t: 'custom',
          title: 'Vesting period each cycle (days)*',
          name: 'vestingPeriod',
          class: '!grid-rows-[28px,40px,1fr] items-start',
          formItemProps: {
            first: true
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Vesting period cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => value > 0,
              message: 'Vesting period must be positive number.',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => +value % 1 === 0,
              message: 'Period must be a positive integer.',
              trigger: 'blur'
            }
          ],
          render(value) {
            return (
              <UInputBigNumber
                placeholder="EX：7"
                max="100"
                precision={2}
                step={0.5}
                disabled={props.crowdfundingInfo.isRebaseToken}
                v-model:value={props.crowdfundingInfo.vestingPeriod}
                class="flex-1"
              ></UInputBigNumber>
            )
          }
        },
        {
          t: 'custom',
          title: 'Presale token release each cycle (%) *',
          name: 'tokenCycle',
          class: '!grid-rows-[28px,40px,1fr] items-start',
          formItemProps: {
            first: true
          },
          rules: [
            {
              validator: (rule, value) => !!value,
              message: 'Presale token cannot be blank.',
              trigger: ['blur']
            },
            {
              validator: (rule, value) => +value > 0,
              message: 'Vesting period must be positive number.',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                console.log(value, props.crowdfundingInfo.firstRelease)
                return +(props.crowdfundingInfo.firstRelease || 0) + +value <= 100
              },
              message:
                'First release for presale and Percent token release each cycle must be less than 100 percent.',
              trigger: ['blur', 'input']
            }
          ],
          render(value) {
            return (
              <UInputBigNumber
                placeholder="EX：20"
                max={100 - props.crowdfundingInfo.firstRelease}
                disabled={props.crowdfundingInfo.isRebaseToken}
                precision={2}
                v-model:value={props.crowdfundingInfo.tokenCycle}
                class="flex-1"
              ></UInputBigNumber>
            )
          }
        }
      ]

      if (props.crowdfundingInfo.listing === 'Manual Listing') {
        const routerIndex = fields.findIndex(item => item.name === 'Router')
        fields.splice(routerIndex, 1)
        const listRatingIndex = fields.findIndex(item => item.name === 'listingRate')
        fields.splice(listRatingIndex, 1)
        const liquidityIndex = fields.findIndex(item => item.name === 'liquidityPercent')
        fields.splice(liquidityIndex, 1)
      }

      if (!props.crowdfundingInfo.usingVestingContributor) {
        const index1 = fields.findIndex(item => item.name === 'firstRelease')
        fields.splice(index1, 1)
        const index2 = fields.findIndex(item => item.name === 'vestingPeriod')
        fields.splice(index2, 1)
        const index3 = fields.findIndex(item => item.name === 'tokenCycle')
        fields.splice(index3, 1)
      }

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

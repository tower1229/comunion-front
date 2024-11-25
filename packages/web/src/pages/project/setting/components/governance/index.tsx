import {
  message,
  UButton,
  UForm,
  UFormItem,
  UInput,
  UInputNumberGroup,
  UModal,
  USearch,
  USelect,
  USwitch,
  UTooltip
} from '@comunion/components'
import {
  AddCircleOutlined,
  CloseOutlined,
  DeleteFilled,
  MinusCircleOutlined,
  WarningFilled,
  ErrorTipFilled,
  QuestionFilled
} from '@comunion/icons'
import { defineComponent, reactive, ref, PropType, onMounted, computed, watch } from 'vue'
import { StrategyType } from './typing'
import { allNetworks, infuraKey } from '@/constants'

import './style.css'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupDetail } from '@/types'

export const renderUnit = (name: string) => (
  <div
    class={`flex justify-center items-center border rounded-r-lg bg-white w-30 ${
      name ? 'text-color1' : 'text-color3'
    }`}
  >
    {name || 'Token'}
  </div>
)

export default defineComponent({
  name: 'StartupGovernance',
  props: {
    startup_id: {
      type: Number,
      required: true
    },
    startup: {
      type: Object as PropType<StartupDetail>,
      required: true
    }
  },
  emits: ['saved', 'edit'],
  setup(props, ctx) {
    const formRef = ref()
    const addStrategyBtnLoading = ref(false)
    const walletStore = useWalletStore()
    const tokenContract = useErc20Contract()
    const strategies = ref<ServiceReturn<'DataDict@GetdataDictbydicttype'>>()

    const govSetting = reactive<{
      strategies: StrategyType[]
      voteDecimals: number
      voteSymbol: string
      allowMember: boolean
      proposalThreshold: number
      proposalValidity: number
      admins: string[]
    }>({
      strategies: [],
      voteDecimals: 0,
      voteSymbol: '',
      allowMember: true,
      proposalThreshold: 0,
      proposalValidity: 0,
      admins: []
    })
    //  ticket strategy
    const ticketStrategy = reactive({
      chainId: 1
    })
    const erc20BalanceStrategy = reactive({
      chainId: 1,
      tokenContractAddress: '',
      symbol: ''
    })
    const strategyModal = ref()
    const erc20BalanceForm = ref()
    const contractAddressExist = ref(true)

    const getStrategies = async () => {
      try {
        const { error, data } = await services['DataDict@GetdataDictbydicttype']({
          type: 7
        })
        if (!error) {
          console.log('data===>', data)
          strategies.value = data
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const getGovernanceSetting = async () => {
      try {
        const { error, data } = await services['Governance@get-governance-setting']({
          startup_id: props.startup_id
        })
        console.log('data---》', data)

        if (!error) {
          govSetting.strategies = (data.strategies || []).map(item => ({
            chainId: item.chain_id,
            dictValue: item.dict_value,
            dictLabel: item.strategy_name,
            voteDecimals: item.vote_decimals,
            tokenContractAddress: item.token_contract_address,
            voteSymbol: item.vote_symbol
          }))
          console.log('govSetting===>', govSetting)

          govSetting.voteSymbol = data.vote_symbol
          govSetting.allowMember = data.allow_member
          govSetting.proposalThreshold = Number(data.proposal_threshold)
          govSetting.proposalValidity = Number(data.proposal_validity)
          govSetting.admins = (data.admins || []).length
            ? data.admins!.map(item => item.address).concat([''])
            : ['', '']

          if (!infoWatcher) {
            infoWatcher = watch(
              () => govSetting,
              () => {
                console.log(11111111111, 'gov change')
                ctx.emit('edit')
              },
              {
                deep: true
              }
            )
          }
        }
      } catch (error) {
        console.error('error==>', error)
      }
    }

    const addStrategy = () => {
      strategyModal.value = 'selectModal'
    }

    const delStrategy = (dictValue: string) => {
      const newStrategies = govSetting.strategies?.filter(stra => stra.dictValue !== dictValue)
      govSetting.strategies = newStrategies || []
    }

    const addErc20Strategy = async (strategy: StrategyType) => {
      erc20BalanceForm.value?.validate(async (error: any) => {
        console.log('error===>', error)
        console.log('strategy==>', strategy)
        if (!error) {
          addStrategyBtnLoading.value = true
          try {
            const { chainId, tokenContractAddress, symbol } = erc20BalanceStrategy
            const provider = await walletStore.getRpcProvider(chainId, infuraKey)

            const code = await provider?.getCode(tokenContractAddress)
            if (!code || code.length < 3) {
              throw new Error()
            }
            const erc20Token = await tokenContract(tokenContractAddress, provider)
            const decimal = await erc20Token.decimals()
            // govSetting.strategies?.push({ ...strategy, voteDecimals: decimal, symbol })
            govSetting.strategies = [{ ...strategy, voteDecimals: decimal, voteSymbol: symbol }]
            strategyModal.value = undefined
            addStrategyBtnLoading.value = false
          } catch (error) {
            contractAddressExist.value = false
          } finally {
            addStrategyBtnLoading.value = false
          }
        }
      })
    }

    const addTicketStrategy = async (strategy: StrategyType) => {
      // govSetting.strategies?.push(strategy)
      govSetting.strategies = [strategy]
      strategyModal.value = undefined
    }

    const saveGovSetting = async () => {
      try {
        formRef.value?.validate(async (error: Error) => {
          console.log('error===>', error)
          if (!govSetting.strategies?.length) return
          if (!error) {
            const strategies = govSetting.strategies!.map(strategy => ({
              chain_id: strategy.chainId,
              dict_value: strategy.dictValue,
              strategy_name: strategy.dictLabel,
              vote_symbol: strategy.voteSymbol || '',
              token_min_balance: 0,
              token_contract_address: strategy.tokenContractAddress || '',
              vote_decimals: strategy.voteDecimals || 0
            }))
            const { error } = await services['Governance@create-governance-setting']({
              startup_id: Number(props.startup_id),
              vote_symbol: govSetting.voteSymbol,
              allow_member: govSetting.allowMember,
              proposal_threshold: Number(govSetting.proposalThreshold),
              proposal_validity: Number(govSetting.proposalValidity),
              strategies,
              admins: govSetting.admins.filter(Boolean).map(admin => ({ wallet_address: admin }))
            })
            if (!error) {
              message.success('Successfully saved')
              ctx.emit('saved')
            }
          }
        })
      } catch (error) {
        console.error((error as Error).message)
      }
    }

    const addAdmin = () => {
      govSetting.admins.push('')
    }

    const delAdmin = (index: number) => {
      const newAdmins = govSetting.admins.filter((_, adminIndex) => adminIndex !== index)
      govSetting.admins = newAdmins
    }

    const networks = computed(() => {
      // const showChainId = [1, 43114 ]
      return allNetworks
    })

    const editStrategy = async (strategy: StrategyType) => {
      console.log('editStrate', strategy)

      switch (strategy.dictValue) {
        case 'ticket': {
          ticketStrategy.chainId = strategy.chainId as number
          strategyModal.value = 'ticket'
          break
        }
        case 'erc20Balance': {
          erc20BalanceStrategy.chainId = strategy.chainId as number
          erc20BalanceStrategy.tokenContractAddress = strategy.tokenContractAddress as string
          erc20BalanceStrategy.symbol = strategy.voteSymbol as string
          strategyModal.value = 'erc20-balance-of'
          break
        }
      }
    }

    let infoWatcher: any
    onMounted(() => {
      getStrategies()
      getGovernanceSetting()
    })

    return {
      govSetting,
      strategies,
      strategyModal,
      ticketStrategy,
      erc20BalanceStrategy,
      erc20BalanceForm,
      contractAddressExist,
      formRef,
      networks,
      addStrategyBtnLoading,
      addStrategy,
      editStrategy,
      delStrategy,
      addTicketStrategy,
      addErc20Strategy,
      saveGovSetting,
      addAdmin,
      delAdmin
    }
  },
  render() {
    return (
      <div>
        <UForm
          ref={(ref: any) => (this.formRef = ref)}
          model={this.govSetting}
          class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden governance-setting"
        >
          <div class="border border-color-border rounded-sm mb-6 w-full">
            <div class="border-b border-b-color-border flex py-3 px-6 items-center u-h4">
              <span class="mr-2">Strategie(s)</span>
              <UTooltip placement="right">
                {{
                  trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                  default: () => (
                    <div class="w-60">
                      Strategris are used determine voting power or whether a user is eligible to
                      create a proposal(Voting power is cumulative)
                    </div>
                  )
                }}
              </UTooltip>
            </div>
            <div class="p-6">
              {this.govSetting.strategies.length ? (
                this.govSetting.strategies.map(strategy => (
                  <div
                    class="border border-color-border rounded-sm flex mb-6 py-3 px-4 justify-between items-center"
                    onClick={() => this.editStrategy(strategy)}
                  >
                    <span class="u-body4">
                      {strategy.dictLabel}{' '}
                      {strategy.voteSymbol && strategy.dictValue !== 'ticket' && (
                        <span class="bg-[#8247E50F] rounded-2xl text-primary text-xs ml-3 py-1 px-4">
                          {strategy.voteSymbol}
                        </span>
                      )}
                    </span>
                    <div
                      class="cursor-pointer transform scale-75"
                      onClick={() => this.delStrategy(strategy.dictValue!)}
                    >
                      <DeleteFilled class="text-color3" />
                    </div>
                  </div>
                ))
              ) : (
                <div class="border border-warning rounded-sm flex mb-6 py-4 px-6 items-center">
                  <WarningFilled class="mr-2" />
                  <span>You must add at least one strategy</span>
                </div>
              )}
              {}
              <div
                class="border border-dashed rounded-sm cursor-pointer flex py-2 text-color3 items-center justify-center u-h5"
                onClick={this.addStrategy}
              >
                <span style={{ fontSize: '18px', marginRight: '10px' }}>+</span>
                <span>Add strategy</span>
              </div>
            </div>
          </div>
          <div class="border border-color-border rounded-sm mb-6 w-full">
            <div class="border-b border-b-color-border py-3 px-6 u-h4">Vote symbol</div>
            <div class="p-6">
              <UFormItem
                showLabel={false}
                path="voteSymbol"
                rule={[
                  {
                    required: true,
                    message: 'Vote symbol cannot be blank',
                    trigger: 'blur'
                  }
                ]}
              >
                <UInput v-model:value={this.govSetting.voteSymbol} maxlength={8} />
              </UFormItem>
              <div class="mt-2 text-color3 u-h7">
                The default symbol used for this startup,usually token symbol
              </div>
            </div>
          </div>
          <div class="border border-color-border rounded-sm mb-6 w-full">
            <div class="border-b border-b-color-border py-3 px-6 u-h4">Proposal precondition</div>
            <div class="p-6">
              <div class="mb-6">
                <USwitch
                  v-model:value={this.govSetting.allowMember}
                  railStyle={({ checked }) => {
                    if (checked) return { background: '#00BFA5', boxShadow: 'unset' }
                    return {}
                  }}
                />
                <span class="ml-4 u-h5">Allow all team members to submit a proposal</span>
              </div>
              <div class="mb-2 u-body4">Proposal threshold </div>
              <UInputNumberGroup
                v-model:value={this.govSetting.proposalThreshold}
                type="withUnit"
                renderUnit={() => renderUnit(this.govSetting.voteSymbol)}
                v-slots={{
                  suffix: () => null
                }}
                inputProps={{
                  maxlength: 20,
                  precision: 18,
                  min: 0,
                  parse: (value: string) => {
                    const newVal = value.replace('-', '')
                    if (newVal === null || newVal === '') return 0
                    return newVal
                  }
                }}
              />
              <div class="mt-2 text-color3 u-h7">
                The minimum amount of voting power required to create a proposal
              </div>
            </div>
          </div>
          <div class="border border-color-border rounded-sm mb-6 w-full">
            <div class="border-b border-b-color-border py-3 px-6 u-h4">Proposal validity</div>
            <div class="p-6">
              <UInputNumberGroup
                class="w-full"
                v-model:value={this.govSetting.proposalValidity}
                type="withUnit"
                renderUnit={() => renderUnit(this.govSetting.voteSymbol)}
                v-slots={{
                  suffix: () => null
                }}
                inputProps={{
                  maxlength: 20,
                  precision: 18,
                  min: 0,
                  parse: (value: string) => {
                    const newVal = value.replace('-', '')
                    if (newVal === null || newVal === '') return 0
                    return newVal
                  }
                }}
              />
              <div class="mt-2 text-color3 u-h7">
                The minimum amount of voting power required for the proposal to pass
              </div>
            </div>
          </div>
          <div class="border border-color-border rounded-sm mb-2 w-full">
            <div class="border-b border-b-color-border py-3 px-6 u-h4">Admin</div>
            <div class="p-6">
              <div class="flex mb-4">
                <UInput disabled value={this.govSetting.admins[0]} class="flex-1" />
                <div class="basis-20"></div>
              </div>
              {this.govSetting.admins.slice(1).map((item, itemIndex) => (
                <UFormItem
                  showLabel={false}
                  class="mb-4"
                  path={`admins[${itemIndex + 1}]`}
                  rule={[
                    {
                      validator: (rule, value) => {
                        if (!item || (/^0x[a-zA-Z\d]{40}/.test(item) && item.length === 42)) {
                          return true
                        }
                        return false
                      },
                      message: 'Invalid wallet address',
                      trigger: 'blur'
                    }
                  ]}
                >
                  <UInput v-model:value={this.govSetting.admins[itemIndex + 1]} class="flex-1" />
                  <div class="flex items-center basis-20">
                    <MinusCircleOutlined
                      onClick={() => this.delAdmin(itemIndex + 1)}
                      class={`
                        ml-3 cursor-pointer text-error
                        ${this.govSetting.admins?.length <= 2 ? 'hidden' : ''}
                      `}
                    />

                    <AddCircleOutlined class="cursor-pointer ml-3" onClick={this.addAdmin} />
                  </div>
                </UFormItem>
              ))}
            </div>
          </div>
          <div class="text-color3 u-h7">
            The admins will be able to moderate proposals. You must add one address per line.
          </div>
          <div class="flex mt-10 justify-end">
            <UButton class="w-30" type="primary" size="small" onClick={this.saveGovSetting}>
              Save
            </UButton>
          </div>
        </UForm>
        <UModal
          show={this.strategyModal === 'selectModal'}
          class="bg-white rounded-sm max-w-[90%] py-8 px-10 w-150"
        >
          <div>
            <header class="flex mb-6 justify-between items-center">
              <span class="tracking-normal text-primary1 u-card-title2">Add strategy</span>
              <CloseOutlined
                class="cursor-pointer text-xs transform text-primary1 scale-75"
                onClick={() => {
                  this.strategyModal = ''
                }}
              />
            </header>
            <USearch class="my-6" placeholder="Search" />
            <div>
              {this.strategies?.map((strate: any) => (
                <div
                  class="border rounded-sm cursor-pointer mb-6 p-6 u-h4"
                  onClick={() => (this.strategyModal = strate.value)}
                >
                  {strate.label}
                </div>
              ))}
            </div>
          </div>
        </UModal>
        <UModal
          show={this.strategyModal === 'erc20-balance-of'}
          class="bg-white rounded-sm max-w-[90%] py-8 px-10 w-150"
        >
          <div>
            <UForm
              model={this.erc20BalanceStrategy}
              ref={(ref: any) => (this.erc20BalanceForm = ref)}
            >
              <header class="flex mb-6 justify-between items-center">
                <span class="text-primary1 u-card-title2">erc20-balance-of</span>
                <CloseOutlined
                  class="cursor-pointer text-xs transform text-primary1 scale-75"
                  onClick={() => (this.strategyModal = '')}
                />
              </header>
              {/* <div class="my-2 u-body4">Network</div> */}
              <UFormItem label="Network" path="network">
                <USelect
                  v-model:value={this.erc20BalanceStrategy.chainId}
                  options={this.networks}
                  labelField="name"
                  valueField="chainId"
                />
              </UFormItem>
              {/* <div class="my-2 u-body4"></div> */}
              <UFormItem
                label="Contract address"
                path="tokenContractAddress"
                first={true}
                rule={[
                  {
                    validator: (rule, value) => !!value,
                    message: 'Contract address cannot be blank',
                    trigger: 'blur'
                  },
                  {
                    validator: (rule, value) => {
                      return /^0x[a-zA-Z\d]{40}/.test(value) && value.length === 42
                    },
                    message: 'Invalid contract address',
                    trigger: 'blur'
                  }
                ]}
              >
                <UInput v-model:value={this.erc20BalanceStrategy.tokenContractAddress} />
              </UFormItem>
              {/* <div class="my-2 u-body4">Symbol</div> */}
              <UFormItem label="Symbol" path="symbol" showFeedback={false}>
                <UInput
                  value={this.erc20BalanceStrategy.symbol}
                  maxlength={10}
                  onUpdateValue={value => {
                    this.erc20BalanceStrategy.symbol = (value as string).replace(
                      /[^0-9a-zA-Z]/gi,
                      ''
                    )
                  }}
                />
              </UFormItem>
              <div class="mt-2 mb-6 text-color3 u-h7">
                This strategy returns the balances of the voters for a specific ERC20 token.You can
                edit the strategy by clicking on it if you want to add your own token.
              </div>
              {!this.contractAddressExist && (
                <div class="border rounded-sm flex border-[#F53F3F] mb-10  py-1 px-4 items-center">
                  <ErrorTipFilled class="transform text-[#F53F3F] scale-75" />
                  <span class="ml-4 text-[#F53F3F] u-body1">
                    The token address was not found, please make sure the network is correct
                  </span>
                </div>
              )}
              <div class="flex mt-4 justify-end">
                <UButton
                  type="primary"
                  loading={this.addStrategyBtnLoading}
                  class="rounded-sm cursor-pointer bg-primary1 text-white text-center py-2 w-40 !hover:bg-primary1"
                  onClick={() =>
                    this.addErc20Strategy({
                      ...this.erc20BalanceStrategy,
                      dictLabel: 'erc20-balance-of',
                      dictValue: 'erc20Balance'
                    })
                  }
                >
                  Add
                </UButton>
              </div>
            </UForm>
          </div>
        </UModal>
        <UModal
          show={this.strategyModal === 'ticket'}
          class="bg-white rounded-sm max-w-[90%] py-8 px-10 w-150"
        >
          <div>
            <UForm model={this.ticketStrategy}>
              <header class="flex mb-6 justify-between items-center">
                <span class="text-primary1 u-card-title2">Ticket</span>
                <CloseOutlined
                  class="cursor-pointer text-xs transform text-primary1 scale-75"
                  onClick={() => (this.strategyModal = '')}
                />
              </header>
              {/* <div class="my-2 u-body4">Network</div> */}
              <UFormItem label="Network" path="network" showFeedback={false}>
                <USelect
                  v-model:value={this.ticketStrategy.chainId}
                  options={this.networks}
                  labelField="name"
                  valueField="chainId"
                />
              </UFormItem>

              <div class="mt-2 mb-6 text-color3 u-h7">
                This strategy means that voting can be done as long as the wallet is linked, and
                each wallet address has only one vote
              </div>
              <div class="flex mt-4 justify-end">
                <div
                  class="rounded-sm cursor-pointer bg-primary1 text-white text-center py-2 w-40"
                  onClick={() =>
                    this.addTicketStrategy({
                      ...this.ticketStrategy,
                      dictLabel: 'Ticket',
                      dictValue: 'ticket'
                    })
                  }
                >
                  Add
                </div>
              </div>
            </UForm>
          </div>
        </UModal>
      </div>
    )
  }
})

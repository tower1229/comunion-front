import {
  message,
  UButton,
  UCard,
  ULazyImage,
  UModal,
  UPopover,
  UTooltip,
  USpin,
  UTable,
  UTag
} from '@comunion/components'
import {
  CloseOutlined,
  MoreFilled,
  ShareOutlined,
  SignOutlined,
  UrlOutlined
} from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import { signTypedData } from '@wagmi/core'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { NSpin } from 'naive-ui'
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CurrentResult } from './components/CurrentResult'
import { StrategyInformation } from './components/StrategyInfo'
import { GOVERNANCE_STATUS_STYLE, signerVoteTypes } from './utils'
import CreateProposalBlock, { CreateProposalRef } from '@/blocks/Proposal/Create'
import CustomCard from '@/components/CustomCard'
import More from '@/components/More/shadow'
import { ShareButtonGroup } from '@/components/Share'
import StartupCard from '@/components/StartupCard'
import { allNetworks, infuraKey } from '@/constants'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'
import { getClient } from '@/utils/ipfs'

type SelectChoiceType = NonNullable<
  NonNullable<ServiceReturn<'Proposal@get-proposal-info'>>['choices']
>[number]

type StrategyType = NonNullable<
  NonNullable<ServiceReturn<'Proposal@get-proposal-info'>>['strategies']
>[number]

const ProposalDetail = defineComponent({
  name: 'ProposalDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const ipfsClient = getClient()
    const walletStore = useWalletStore()
    const tokenContract = useErc20Contract()
    const createProposalRef = ref<CreateProposalRef>()
    const startupInfo = ref<any>()
    const proposalInfo = ref()
    const voteRecords =
      ref<NonNullable<ServiceReturn<'Proposal@get-proposal-invest-records'>>['list']>()
    const govSetting = ref()
    const pageLoading = ref(false)
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 10,
      total: 0,
      page: 1,
      loading: false
    })
    const selectedChoice = ref<SelectChoiceType>()
    const votePower = ref<number | string>(0)
    const votePowerShow = ref<boolean>(false)
    const strategyInfo = ref()
    const voteInfoVisible = ref(false)
    const strategyVisible = ref(false)
    const delProposalVisible = ref(false)
    const ipfsDetail = ref({
      visible: false,
      hash: '',
      address: '',
      choice: ''
    })

    // const getStartupInfo = async (startup_id: number) => {
    //   try {
    //     pageLoading.value = true
    //     const { error, data } = await services['Startup@get-startup-info']({
    //       startup_id
    //     })
    //     if (!error) {
    //       startupInfo.value = data
    //     }
    //     pageLoading.value = false
    //   } catch (error) {
    //     pageLoading.value = false
    //     console.error('error===>', error)
    //   }
    // }

    const getVotePower = async (strategy: StrategyType) => {
      switch (strategy?.dict_value) {
        case 'ticket': {
          votePower.value = 1
          break
        }
        case 'erc20Balance': {
          votePowerShow.value = true
          if (strategy.token_contract_address) {
            const userAddress = walletStore.address

            const rpcProvider = walletStore.getRpcProvider(strategy.chain_id, infuraKey)
            const tokenRes = await tokenContract(strategy.token_contract_address, rpcProvider)
            const userBalance = await tokenRes.balanceOf(userAddress, {
              blockTag: proposalInfo.value?.block_number
            })
            votePower.value = ethers.utils.formatUnits(userBalance, strategy.vote_decimals)
            console.log(votePower.value)
          }
          votePowerShow.value = false
          break
        }
        default:
          votePower.value = 0
      }
    }

    // const getGovernanceSetting = async (startup_id: number) => {
    //   try {
    //     const { error, data } = await services['Governance@get-governance-setting']({
    //       startup_id
    //     })
    //     if (!error) {
    //       govSetting.value = data
    //     }
    //   } catch (error) {
    //     console.error('error==>', error)
    //   }
    // }

    const getProposalDetail = async () => {
      try {
        pageLoading.value = true
        const { error, data } = await services['Proposal@get-proposal-info']({
          proposal_id: Number(route.params.id)
        })
        if (!error && data) {
          proposalInfo.value = data
          startupInfo.value = data?.startup
          govSetting.value = data?.startup?.governance_setting
          strategyInfo.value = data?.startup?.governance_setting?.strategies
          if (strategyInfo.value) {
            getVotePower(strategyInfo.value)
          }
          setTimeout(() => {
            console.log('pRef.value.scrollHeight', pRef.value.scrollHeight)
            showMoreBtn.value = pRef.value.scrollHeight > 200
            fold.value = showMoreBtn.value
          }, 100)
        }
        // pageLoading.value = false
      } catch (error) {
        console.log(error)
      }
      pageLoading.value = false
    }

    const getVoteRecords = async (page: number, override = false) => {
      try {
        const { error, data } = await services['Proposal@get-proposal-invest-records']({
          size: pagination.pageSize,
          page,
          proposal_id: Number(route.params.id)
        })
        if (!error) {
          pagination.total = data.total
          if (override) {
            voteRecords.value = data.list || []
          } else {
            voteRecords.value = [...(voteRecords.value || []), ...(data.list || [])]
          }
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const choiceVote = async (voteInfo: SelectChoiceType) => {
      selectedChoice.value = voteInfo
    }

    const showVoteInfo = async () => {
      voteInfoVisible.value = true
    }

    const voteLoading = ref(false)
    const confirmVote = async () => {
      console.log(selectedChoice.value)
      if (selectedChoice.value) {
        try {
          console.log('selectedChoice.value===>', selectedChoice.value)

          const { item_name, id } = selectedChoice.value

          const saveContent = {
            From: walletStore.address,
            Startup: proposalInfo.value?.startup.name,
            timestamp: dayjs().valueOf(),
            proposal: proposalInfo.value?.title,
            choice: item_name
          }

          const domain = {
            name: 'Comunion'
          }

          console.log('saveContent==>', saveContent)

          // const signature = await walletStore.wallet?.sign(JSON.stringify(saveContent, null, 4))

          const signature = await signTypedData({
            domain,
            types: signerVoteTypes,
            message: saveContent,
            primaryType: 'voteInfo'
          })
          if (signature) {
            voteLoading.value = true
            const voteRes = await ipfsClient
              .add(
                JSON.stringify({
                  address: walletStore.address,
                  sig: signature,
                  data: {
                    domain,
                    types: signerVoteTypes,
                    message: saveContent
                  }
                })
              )
              .catch(err => {
                console.warn('voteRes=', err)
                message.warning(err.message)
                voteLoading.value = false
              })

            voteLoading.value = false
            if (!voteRes) {
              return null
            }
            const { error } = await services['Proposal@voiteproposal']({
              proposal_id: Number(route.params.id),
              voter_wallet_address: walletStore.address!,
              choice_item_id: id,
              votes: Number(votePower.value),
              ipfs_hash: voteRes.cid.toString(),
              choice_item_name: item_name
            })
            if (!error) {
              getProposalDetail()
              getVoteRecords(1, true)
              voteInfoVisible.value = false
              return true
            }
          }
        } catch (error) {
          console.error('error', error)
        }
      }
      return null
    }

    const showVerifyModal = (hash: string, address: string, choice: string) => {
      ipfsDetail.value = {
        visible: true,
        hash,
        address,
        choice
      }
    }

    const toVerify = async ({ ipfs }: { ipfs: string }) => {
      window.open(`https://signator.io/view?ipfs=${ipfs}`)
    }

    const duplicateProposal = () => {
      if (proposalInfo.value) {
        createProposalRef.value?.show({
          current: 1,
          title: proposalInfo.value.title,
          discussion: proposalInfo.value.discussion_link,
          description: proposalInfo.value.description,
          // startup_id: proposalInfo.value.startup.id,
          vote: proposalInfo.value.vote_system!,
          vote_choices: proposalInfo.value.choices?.map((choice: any) => ({
            value: choice.item_name!
          })),
          start_time: dayjs(Number(proposalInfo.value.start_time)).valueOf(),
          end_time: dayjs(Number(proposalInfo.value.end_time)).valueOf()
        })
      }
    }

    const deleteProposal = async () => {
      const proposal_id = Number(route.params.id)
      const { error } = await services['Proposal@deleteproposal']({
        proposal_id
      })
      if (!error) {
        message.success('delete successfully')
        router.replace({
          path: '/governance/list'
        })
      }
    }

    const statusStyle = computed(() => {
      return GOVERNANCE_STATUS_STYLE[
        proposalInfo.value?.status as keyof typeof GOVERNANCE_STATUS_STYLE
      ]
    })

    const toIPFSRaw = (hash: string) => {
      window.open(`/ipfs/raw/${hash}`)
    }

    const closeIPFSDetail = () => {
      ipfsDetail.value = {
        visible: false,
        hash: '',
        address: '',
        choice: ''
      }
    }

    const toComerDetail = (comerId?: number) => {
      if (comerId) {
        router.push({ path: '/builder', query: { id: comerId } })
      }
    }

    const loadMoreVoteRecords = () => {
      pagination.page += 1
      getVoteRecords(pagination.page)
    }

    const isShowStrategyInfo = (property: string) => {
      let showInfo: string[] = []

      switch (strategyInfo.value.dict_value) {
        case 'ticket':
          showInfo = ['network']
          break
        case 'erc20Balance':
          showInfo = ['network', 'symbol', 'address', 'decimals']
          break
        default:
          showInfo = []
      }
      return showInfo.includes(property)
    }

    const networkInfo = computed(() => {
      if (proposalInfo.value.chain_id) {
        const findRes = allNetworks.find(network => network.chainId === proposalInfo.value.chain_id)
        return findRes
      }
      return
    })

    const isAdmin = computed(() => {
      if (!proposalInfo.value || !proposalInfo.value.admins) return false
      return (
        proposalInfo.value.admins.findIndex((admin: any) => admin.address === walletStore.address) >
        -1
      )
    })

    const timeLabel = computed(() => {
      if (dayjs().isAfter(+proposalInfo.value?.end_time)) {
        return 'Ended'
      }
      if (dayjs.utc().isBefore(dayjs(+proposalInfo.value?.start_time).utc())) {
        return 'Upcoming'
      }
      return 'Active'
    })

    const isActive = computed(() => {
      return (
        dayjs().isBefore(+proposalInfo.value?.end_time) &&
        dayjs().isAfter(+proposalInfo.value?.start_time) &&
        walletStore.connected
      )
    })
    const isUpcoming = computed(() => {
      return dayjs.utc().isBefore(dayjs(+proposalInfo.value?.start_time).utc())
    })

    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>(false)
    const fold = ref<boolean>(false)

    onMounted(() => {
      getProposalDetail()
      getVoteRecords(1, true)
    })

    return {
      startupInfo,
      pageLoading,
      proposalInfo,
      pagination,
      statusStyle,
      voteRecords,
      selectedChoice,
      votePower,
      votePowerShow,
      voteInfoVisible,
      strategyVisible,
      createProposalRef,
      strategyInfo,
      govSetting,
      ipfsDetail,
      networkInfo,
      isAdmin,
      delProposalVisible,
      voteLoading,
      showVoteInfo,
      choiceVote,
      confirmVote,
      toVerify,
      duplicateProposal,
      deleteProposal,
      showVerifyModal,
      toIPFSRaw,
      closeIPFSDetail,
      toComerDetail,
      loadMoreVoteRecords,
      isShowStrategyInfo,
      timeLabel,
      isActive,
      isUpcoming,
      fold,
      pRef,
      showMoreBtn,
      walletStore
    }
  },
  render() {
    const handleMore = () => {
      this.fold = !this.fold
    }

    return (
      <USpin show={this.pageLoading}>
        <div class="flex gap-6 <lg:pt-10 <lg:block">
          {/* share button */}
          {this.startupInfo && this.startupInfo.name && this.proposalInfo?.title && (
            <ShareButtonGroup
              class=" top-0 left-[100%] absolute <lg:left-auto <lg:right-0"
              generate={{
                banner: this.startupInfo.banner,
                logo: this.startupInfo.logo,
                name: this.startupInfo.name + '-Proposal',
                content: this.proposalInfo?.title
              }}
              route={window.location.href}
              title={this.startupInfo?.name + '--Proposal | WELaunch'}
              description={`Check out the proposal on WELaunch, a next generation all-in-one decentralized economy BUIDLing and Launch Network`}
              text={`${this.startupInfo.name} just posted a #proposal, check it out on #WELaunch Network: `}
              tipPlacement="right"
            />
          )}
          {/* left part */}
          <div class="w-86 overflow-hidden <lg:w-auto">
            {this.startupInfo && <StartupCard startup={this.startupInfo} class="mb-6" />}
            {this.proposalInfo && (
              <StrategyInformation
                class="mb-6"
                proposalInfo={this.proposalInfo}
                onShowStrategyDetail={() => (this.strategyVisible = true)}
                blockExploreUrl={this.networkInfo?.explorerUrl}
              />
            )}
            {!!this.proposalInfo && !!this.strategyInfo && (
              <CurrentResult
                proposalInfo={this.proposalInfo}
                voteSymbol={this.strategyInfo.voteSymbol}
              />
            )}
          </div>
          {/* right part */}
          <div class="flex-1 relative overflow-hidden">
            <UCard>
              <div class="flex mb-5 justify-between">
                <span class="max-w-9/10 text-color1 u-h2">{this.proposalInfo?.title}</span>
                <div class="leading-8">
                  <UTag class="text-color2">
                    {/* {GOVERNANCE_KEY[this.proposalInfo?.status as keyof typeof GOVERNANCE_KEY]} */}
                    {this.timeLabel}
                  </UTag>
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="cursor-pointer flex items-center"
                  onClick={() => this.toComerDetail(this.proposalInfo?.comer_id)}
                >
                  <ULazyImage
                    class="rounded-full h-9 w-9"
                    src={this.proposalInfo?.comer.avatar || ''}
                  />
                  <div class="ml-2 text-color2 u-h6 hover:text-primary">
                    {this.proposalInfo?.comer.name}
                  </div>
                </div>
                <UPopover
                  trigger="click"
                  placement="bottom"
                  arrowStyle={{ background: '#fff' }}
                  contentStyle={{
                    background: '#fff',
                    borderRadius: '0.25rem',
                    fontSize: '0.8rem',
                    padding: '0.5rem'
                  }}
                  raw={true}
                  v-slots={{
                    trigger: () => <MoreFilled class="cursor-pointer h-7 ml-4 w-9" />,
                    default: () => (
                      <div class="flex flex-col">
                        <UButton size="small" onClick={this.duplicateProposal}>
                          Duplicate proposal
                        </UButton>
                        {this.isAdmin && (
                          <UButton
                            size="small"
                            type="error"
                            class="mt-1"
                            onClick={() => (this.delProposalVisible = true)}
                          >
                            Delete proposal
                          </UButton>
                        )}
                      </div>
                    )
                  }}
                ></UPopover>
              </div>

              <div
                class="transition-all ease-linear duration-1000 overflow-hidden relative"
                style={{ height: `${!this.fold ? 'auto' : '200px'}` }}
              >
                <div ref={(ref: any) => (this.pRef = ref)}>
                  {this.proposalInfo?.description && (
                    <div class="mt-4 text-color2 u-h6" v-html={this.proposalInfo?.description} />
                  )}
                  {this.proposalInfo?.discussion_link && (
                    <div class="mt-8">
                      <div class="mb-1 text-color1 u-h4">Discussion：</div>
                      <a
                        href={this.proposalInfo.discussion_link}
                        target="__blank"
                        class="text-color3 u-h5 hover:text-primary"
                      >
                        {this.proposalInfo.discussion_link}
                      </a>
                    </div>
                  )}
                </div>
                {this.showMoreBtn && this.fold && (
                  <div
                    class="h-16 right-0 bottom-0 left-0 absolute"
                    style={{
                      background:
                        'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
                      transform: 'rotate(-180deg)'
                    }}
                  ></div>
                )}
              </div>
              {this.showMoreBtn && (
                <div class="flex mt-5 justify-center">
                  <More onMore={handleMore} fold={this.fold} />
                </div>
              )}
            </UCard>

            <CustomCard class="mt-6 mb-6" title="Cast your vote">
              <div class="p-6">
                {this.proposalInfo?.choices?.map((voteInfo: any) => (
                  <div
                    class={`u-h4 border text-center py-3 mb-4 rounded-sm cursor-pointer hover:border-[#5331F4] hover:text-primary ${
                      this.selectedChoice?.id === voteInfo.id
                        ? 'border-primary  text-primary'
                        : 'border-primary-10  text-color2'
                    }`}
                    onClick={() => this.choiceVote(voteInfo)}
                  >
                    {voteInfo.item_name}
                  </div>
                ))}
                {this.isActive ? (
                  <div
                    class={[
                      'text-white u-h4 text-center py-3 rounded-sm',
                      this.selectedChoice
                        ? 'bg-primary cursor-pointer'
                        : 'bg-grey5 cursor-not-allowed'
                    ]}
                    onClick={() => (this.selectedChoice ? this.showVoteInfo() : null)}
                  >
                    Vote
                  </div>
                ) : (
                  <UTooltip
                    placement="top"
                    v-slots={{
                      trigger: () => (
                        <div
                          class={
                            'text-white u-h4 text-center py-3 rounded-sm bg-grey5 cursor-not-allowed'
                          }
                        >
                          Vote
                        </div>
                      ),
                      default: () =>
                        this.walletStore.connected ? (
                          this.isUpcoming ? (
                            <div>This Proposal is not opened yet.</div>
                          ) : (
                            <div>This proposal has ended.</div>
                          )
                        ) : (
                          <div>You have not connected wallet yet.</div>
                        )
                    }}
                  />
                )}
              </div>
            </CustomCard>
            {!!this.voteRecords?.length && (
              <CustomCard title={`Votes (${this.pagination.total})`}>
                <div class="">
                  <UTable bordered={false}>
                    <tbody>
                      {this.voteRecords?.map((record: any) => (
                        <tr key={record.comer.id}>
                          <td>
                            <div
                              class="cursor-pointer flex ml-2 items-center"
                              onClick={() => this.toComerDetail(record.comer.id)}
                            >
                              <ULazyImage src={record.comer.avatar} class="h-9 mr-3 w-9" />
                              <span class="text-color2 u-h6">{record.comer.name}</span>
                            </div>
                          </td>
                          <td>
                            <div class="flex text-color1 items-center u-h6">
                              {record.choice_item_name}
                            </div>
                          </td>
                          <td>
                            <div class="flex text-color3 justify-end items-center u-h6">
                              <span>{record.votes}</span>
                              <span class="mx-2">{this.strategyInfo?.vote_symbol}</span>
                              <SignOutlined
                                class="cursor-pointer mr-5 text-color2"
                                onClick={() =>
                                  this.showVerifyModal(
                                    record.ipfs_hash,
                                    record.voter_wallet_address,
                                    record.choice_item_name
                                  )
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {this.pagination.page * this.pagination.pageSize < this.pagination.total && (
                        <tr>
                          <td colspan={3}>
                            <div
                              class="text-center text-primary"
                              onClick={this.loadMoreVoteRecords}
                            >
                              See more
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </UTable>
                </div>
              </CustomCard>
            )}
          </div>

          <UModal show={this.voteInfoVisible} class="bg-white rounded-sm max-w-[90%] p-10 w-150">
            <USpin show={this.voteLoading}>
              <div class="mb-6 u-h3">Vote overview</div>
              <div class="border border-color-border rounded-sm grid py-4 px-6 gap-y-4 grid-cols-2">
                <div class="text-color1 u-h5">Option(s)</div>
                <div class="text-right text-color3 u-h6">{this.selectedChoice?.item_name}</div>
                <div class="text-color1 u-h5">Block height</div>
                <div class="flex text-color3 justify-end items-center u-h6">
                  {this.proposalInfo?.block_number?.toLocaleString()}
                  {this.networkInfo?.explorerUrl && (
                    <a
                      href={`${this.networkInfo?.explorerUrl}/block/${this.proposalInfo?.block_number}`}
                      target="__blank"
                      class="outline-none ml-2 leading-4"
                    >
                      <UrlOutlined class="text-primary" />
                    </a>
                  )}
                </div>
                <div class="text-color1 u-h5">Your voting power</div>
                <div class="text-right text-color3 u-h6">
                  <NSpin size="small" show={this.votePowerShow}>
                    {!this.votePowerShow && <span>{this.votePower}</span>}
                    <span> {this.proposalInfo?.voteSymbol}</span>
                  </NSpin>
                </div>
              </div>
              <div class="flex mt-6 justify-end">
                <UButton
                  size="small"
                  class="mr-4 w-40"
                  onClick={() => (this.voteInfoVisible = false)}
                >
                  Cancel
                </UButton>
                <UButton
                  type="primary"
                  size="small"
                  class="w-40"
                  onClick={this.confirmVote}
                  disabled={
                    !Number(this.votePower) ||
                    (!this.proposalInfo?.allowMember &&
                      Number(this.votePower) < Number(this.govSetting?.proposalThreshold))
                  }
                >
                  Vote
                </UButton>
              </div>
            </USpin>
          </UModal>
          <UModal
            show={this.strategyVisible}
            class="bg-white rounded-sm max-w-[90%] px-7 pt-7 pb-10 w-150"
          >
            <div>
              <div class="flex mb-6 justify-between">
                <span class="text-primary2 u-h3">Strategies</span>
                <CloseOutlined
                  class="cursor-pointer h-6 text-primary w-6"
                  onClick={() => (this.strategyVisible = false)}
                />
              </div>
              <div class="border border-color-border rounded-sm grid py-4 px-6 gap-y-4 grid-cols-2">
                <div class="text-colo1 u-h4">{this.strategyInfo?.strategy_name}</div>
                <div class="text-right text-color3 u-h5"></div>
                <div class="text-colo1 u-h5">Network</div>
                <div class="text-right text-color3 u-h5">{this.networkInfo?.name || '--'}</div>
                {this.isShowStrategyInfo('symbol') && <div class="text-colo1 u-h5">Symbol</div>}
                {this.isShowStrategyInfo('symbol') && (
                  <div class="text-right text-color3 u-h5">
                    {this.strategyInfo.vote_symbol || '--'}
                  </div>
                )}

                {this.isShowStrategyInfo('address') && <div class="text-color1 u-h5">Address</div>}
                {this.isShowStrategyInfo('address') && (
                  <div class="flex text-color2 items-center justify-end u-h5">
                    {shortenAddress(this.strategyInfo?.token_contract_address) || '--'}{' '}
                    <a
                      href={`${this.networkInfo?.explorerUrl}/address/${this.strategyInfo?.token_contract_address}`}
                      target="__blank"
                      class="outline-none ml-2 leading-4 "
                    >
                      <UrlOutlined class="text-primary" />
                    </a>
                  </div>
                )}
                {this.isShowStrategyInfo('decimals') && (
                  <div class="text-color1 u-h5">Decimals</div>
                )}
                {this.isShowStrategyInfo('decimals') && (
                  <div class="text-right text-color3 u-h5">{this.strategyInfo?.vote_decimals}</div>
                )}
              </div>
            </div>
          </UModal>
          {/* this.ipfsDetail.visible */}
          <UModal
            show={this.ipfsDetail.visible}
            class="bg-white rounded-sm max-w-[90%] py-7 px-8 w-150"
          >
            <div>
              <div class="flex text-primary mb-6 justify-between u-h5">
                <span class="text-color1 u-h5">Receipt</span>
                <CloseOutlined
                  class="cursor-pointer h-6 text-primary w-6"
                  onClick={this.closeIPFSDetail}
                />
              </div>
              <div class="border border-color-border rounded-sm flex text-center p-5 justify-between">
                <span class="u-h5">Author</span>
                <span class="flex text-primary items-center">
                  <span class="text-primary mr-4 u-body4">
                    #{this.ipfsDetail.hash.substring(0, 8)}
                  </span>
                  <ShareOutlined
                    class="cursor-pointer"
                    onClick={() => this.toIPFSRaw(this.ipfsDetail.hash)}
                  />
                </span>
              </div>
              <div
                class="border border-color-border rounded-full cursor-pointer flex mt-5 text-primary py-4 px-6 group justify-center items-center hover:border-[#5331F4]"
                onClick={() =>
                  this.toVerify({
                    ipfs: this.ipfsDetail.hash
                  })
                }
              >
                <span class="mr-2 text-color2 u-h5 group-hover:text-primary">
                  Verify on Signator.io
                </span>
                <ShareOutlined />
              </div>
            </div>
          </UModal>
          <UModal v-model:show={this.delProposalVisible} maskClosable={false} autoFocus={false}>
            <UCard
              style={{ width: '540px', '--n-title-text-color': '#000' }}
              size="huge"
              closable={true}
              onClose={() => (this.delProposalVisible = false)}
              title="Delete the proposal?"
            >
              <div class="min-h-20 text-color2 u-h6">
                The action cannot be undone and the proposal will be permanently deleted!
              </div>

              <div class="flex mt-4 justify-end">
                <UButton
                  type="primary"
                  ghost
                  class="h-9 mr-4 w-41"
                  onClick={() => (this.delProposalVisible = false)}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="h-9 w-41" onClick={this.deleteProposal}>
                  Yes
                </UButton>
              </div>
            </UCard>
          </UModal>
          <CreateProposalBlock ref={(ref: any) => (this.createProposalRef = ref)} />
        </div>
      </USpin>
    )
  }
})

export default ProposalDetail

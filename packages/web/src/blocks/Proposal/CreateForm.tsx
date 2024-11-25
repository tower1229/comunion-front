import { message, UButton, UCard, UModal, USpin } from '@comunion/components'
import { signTypedData, fetchBlockNumber } from '@wagmi/core'
import dayjs from 'dayjs'
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue'
import { BasicInfo } from './components/BasicInfo'
import { Vote } from './components/Vote'
import { ProposalInfo, VoteOption } from './typing'
import { StepProps } from '@/components/Step'
import { signerProposalTypes } from '@/pages/governance/utils'
import { services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { getClient } from '@/utils/ipfs'
import { reportError } from '@/utils/sentry'

const CreateProposalFrom = defineComponent({
  name: 'CreateProposalFrom',
  emits: ['cancel'],
  props: {
    stepOptions: {
      type: Array as PropType<StepProps[]>,
      required: true
    },
    defaultProposalInfo: {
      type: Object as PropType<ProposalInfo>,
      default: {
        current: 1,
        startup_id: undefined,
        vote: 'Single choice voting',
        vote_choices: [{ value: '' }, { value: '' }],
        start_time: undefined,
        end_time: undefined
      }
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userInfo = useUserStore()
    const startupOptions = ref()
    const basicInfoRef = ref()
    const voteRef = ref()
    const voteOptions = ref<VoteOption[] | undefined>()
    const modalVisibleState = ref(false)
    const ipfsClient = getClient()
    const proposalInfo: ProposalInfo = reactive<ProposalInfo>({ ...props.defaultProposalInfo })
    const showLeaveTipModal = () => {
      modalVisibleState.value = true
    }
    const toPreviousStep = () => {
      proposalInfo.current -= 1
    }
    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }
    const toNext = () => {
      // proposalInfo.current += 1
      if (proposalInfo.current === 1) {
        basicInfoRef.value?.proposalBasicInfoForm?.validate((error: any) => {
          if (!error) {
            proposalInfo.current = 2
          }
        })
      }
    }

    const getStartupsOptions = async () => {
      try {
        const { error, data } = await services['Comer@get-comer-joined-and-followed-startups']()
        if (!error) {
          startupOptions.value = ((data as any)?.list || []).map((item: any) => ({
            value: item.id,
            label: item.name
          }))
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const getGovernanceSetting = async (startup_id: number) => {
      try {
        const { error, data } = await services['Governance@get-governance-setting']({
          startup_id: startup_id
        })
        if (!error) {
          const { strategies } = data
          return { chainId: strategies?.[0].chain_id }
        }
        return null
      } catch (error) {
        console.error('error==>', error)
        return null
      }
    }
    onMounted(() => {
      getVoteTypeOptions()
      getStartupsOptions()
    })
    const getVoteTypeOptions = async () => {
      try {
        const { error, data } = await services['DataDict@GetdataDictbydicttype']({
          type: 6
        })
        if (!error) {
          voteOptions.value = data.map((item: any) => ({
            label: item.label as string,
            value: item.label as string,
            key: item.key,
            remark: item.remark
          }))
        }
      } catch (error) {
        //
      }
    }

    const submitLoading = ref(false)

    const onSubmit = async () => {
      // validate
      voteRef.value?.proposalVoteFormRef?.validate(async (error: any) => {
        if (!error) {
          //
          submitLoading.value = true
          const startupInfo = startupOptions.value.find(
            (startup: { value: number | undefined }) => startup.value === proposalInfo.startup_id
          )
          try {
            const govSetting = await getGovernanceSetting(proposalInfo.startup_id!)
            // const blockNumber = await walletStore.wallet?.getProvider().getBlockNumber()
            let blockNumber: number | undefined = undefined
            if (govSetting) {
              blockNumber = Number(await fetchBlockNumber())
            }

            const domain = { name: 'Comunion' }

            const saveContent = {
              From: walletStore.address,
              Startup: startupInfo?.label,
              Timestamp: dayjs().valueOf(),
              Type: proposalInfo.vote,
              Title: proposalInfo.title,
              Choice: proposalInfo.vote_choices?.map(choice => choice.value).filter(Boolean),
              Start: dayjs(proposalInfo.start_time).utc().valueOf(),
              End: dayjs(proposalInfo.end_time).utc().valueOf(),
              Description: proposalInfo.description || '',
              Discussion: proposalInfo.discussion || '',
              BlockHeight: blockNumber
            }
            console.log('saveContent===>', saveContent)

            const signature = await signTypedData({
              domain,
              types: signerProposalTypes,
              message: saveContent,
              primaryType: 'proposalInfo'
            })

            // sign(JSON.stringify(saveContent, null, 2))
            if (signature) {
              const ipfsClientRes: any = await ipfsClient
                .add(
                  JSON.stringify({
                    address: walletStore.address,
                    data: saveContent,
                    sig: signature
                  })
                )
                .catch(err => {
                  console.warn('ipfsClientRes=', err)
                  message.warning(err.message)
                  submitLoading.value = false
                })
              if (!ipfsClientRes) {
                return console.error('ipfsClientRes error')
              }
              const reqParams = {
                author_comer_id: userInfo.profile!.id!,
                author_wallet_address: walletStore.address!,
                chain_id: walletStore.chainId!,
                block_number: blockNumber!,
                release_timestamp: dayjs().utc().valueOf(),
                ipfs_hash: ipfsClientRes.cid.toString(),
                title: proposalInfo.title!,
                startup_id: proposalInfo.startup_id,
                description: proposalInfo.description,
                discussion_link: proposalInfo.discussion,
                vote_system: proposalInfo.vote,
                start_time: dayjs(proposalInfo.start_time!).utc().valueOf(),
                end_time: dayjs(proposalInfo.end_time!).utc().valueOf(),
                choices: (proposalInfo.vote_choices || [])
                  .filter((item: { value: string }) => item.value)
                  .map((choice, choiceIndex) => ({
                    item_name: choice.value,
                    seq_num: choiceIndex + 1
                  }))
              }

              const { error } = await services['Proposal@createproposal'](reqParams)
              if (error) {
                submitLoading.value = false
                return reportError(new Error('create proposal'), reqParams)
              }
              submitLoading.value = false
              message.success('Successfully create proposal.')
              closeDrawer()
            }
          } catch (error) {
            console.error('submit proposal error', error)

            submitLoading.value = false
            return reportError(error as Error)
          }
        }
      })
    }
    ctx.expose({
      proposalInfo,
      submitLoading,
      toPreviousStep,
      toNext,
      showLeaveTipModal,
      closeDrawer,
      onSubmit
    })
    return {
      proposalInfo,
      modalVisibleState,
      basicInfoRef,
      voteRef,
      startupOptions,
      voteOptions,
      submitLoading,
      closeDrawer
    }
  },
  render() {
    return (
      <USpin show={this.submitLoading}>
        {this.proposalInfo.current === 1 && (
          <BasicInfo
            startupOptions={this.startupOptions}
            proposalInfo={this.proposalInfo}
            ref={(ref: any) => (this.basicInfoRef = ref)}
          />
        )}
        {this.proposalInfo.current === 2 && (
          <Vote
            proposalInfo={this.proposalInfo}
            ref={(ref: any) => (this.voteRef = ref)}
            voteOptions={this.voteOptions}
          />
        )}
        <UModal v-model:show={this.modalVisibleState} maskClosable={false}>
          <UCard
            style={{
              width: '540px',
              '--n-title-text-color': '#000'
            }}
            size="huge"
            closable={true}
            onClose={() => (this.modalVisibleState = false)}
            title="Discard the changes?"
          >
            <div class="min-h-20 text-color2 u-h6">
              The action cannot be undone at once you click 'Yes'!
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={this.closeDrawer}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </USpin>
    )
  }
})

export default CreateProposalFrom

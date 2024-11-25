import './style.css'
import { UButton, UCard, UModal, UTabPane, UTabs } from '@comunion/components'
import { PeriodOutlined, StageOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { Contract, ethers } from 'ethers'
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BountyBasicInfo, { BountyBasicInfoRef, MAX_AMOUNT } from './components/BasicInfo'
import Deposit from './components/Deposit'
import PayDetailPeriod, { PayDetailPeriodRef } from './components/PayDetailPeriod'
import PayDetailStage, { PayDetailStageRef } from './components/PayDetailStage'
import { BountyInfo, chainInfoType } from './typing'
import { getBuyCoinAddress, getMainTokenDecimal } from '@/blocks/FairLaunchpad/utils'
import Steps from '@/components/Step'
import {
  useBountyFactoryContract,
  useErc20Contract,
  BountyFactoryAddresses as bountyFactoryAddresses
} from '@/contracts'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { reportError } from '@/utils/sentry'

export type bountyInfoType = BountyInfo & {
  token0_symbol: string
  applicantsDepositSymbol: string
  token0_address: string | number
  token1_address: string | number
}

const CreateBountyForm = defineComponent({
  name: 'CreateBountyForm',
  emits: ['cancel'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const usdcTokenContract = useErc20Contract()
    const contractStore = useContractStore()
    const stepOptions = ref([{ name: 'Bounty' }, { name: 'Payment' }, { name: 'Deposit' }])

    let bountyContract = useBountyFactoryContract()
    const modalVisibleState = ref(false)
    const modalClickYesToWhere = ref('')
    const router = useRouter()
    const bountyBasicInfoRef = ref<BountyBasicInfoRef>()
    const payPeriodRef = ref<PayDetailPeriodRef>()
    const payStageRef = ref<PayDetailStageRef>()
    const chainInfo = ref<chainInfoType>({
      chain_id: undefined,
      on_chain: false
    })
    const tokens = getBuyCoinAddress('0x0000000000000000000000000000000000000000')
    const token0_symbol = tokens[walletStore.chainId!][0].label || 'ETH'
    console.log(tokens)
    const token1_symbol = tokens[walletStore.chainId!][1].label || 'USDC'

    const bountyInfoRef = ref<bountyInfoType>({
      current: 1,
      startup_id: undefined,
      title: '',
      expiresIn: undefined,
      contact: [{ type: 1, value: '' }],
      discussionLink: '',
      applicantsSkills: [],
      applicantsDeposit: 0,
      description: '',
      payDetailType: 'stage',
      token0_symbol: token0_symbol,
      token0_address:
        tokens[walletStore.chainId!][0].value || '0x0000000000000000000000000000000000000000',
      token1_symbol: token1_symbol,
      token1_address: tokens[walletStore.chainId!][1].value || '',
      token2_symbol: '',
      payTokenSymbol: '',
      applicantsDepositSymbol: token0_symbol,
      stages: [{ token1_amount: 0, token2_amount: 0, terms: '' }],
      period: {
        periodType: 2,
        periodAmount: 2,
        hoursPerDay: 1,
        target: '',
        token1_amount: 0,
        token2_amount: 0
      },
      deposit: 0,
      agreement: false,
      on_chain: false
    })
    const bountyInfo = bountyInfoRef.value
    const addContact = () => {
      bountyInfo.contact.push({ type: 1, value: '' })
    }

    const delContact = (index: number) => {
      bountyInfo.contact.splice(index, 1)
    }

    const renderUnit = (name: string) => (
      <div class="bg-white border rounded-r-lg flex px-10 w-30 justify-center items-center">
        {name}
      </div>
    )

    const addStage = () => {
      bountyInfo.stages.push({ token1_amount: 0, token2_amount: 0, terms: '' })
    }

    const delStage = (stageIndex: number) => {
      bountyInfo.stages.splice(stageIndex, 1)
    }

    const toFinanceSetting = () => {
      closeDrawer()
      const url = `/project/setting/${bountyInfo.startup_id}`
      router.push(url)
    }

    const showLeaveTipModal = (toNext = '') => {
      modalClickYesToWhere.value = toNext
      modalVisibleState.value = true
    }

    const contractSubmit = async () => {
      const approvePendingText = 'Create bounty deposit contract on blockchain.'
      const depositInput = bountyInfo.deposit
      const applicantsDeposit = bountyInfo.applicantsDeposit

      try {
        /* first approve amount to bountyFactory */
        const usdcTokenAddress = (
          bountyInfo.applicantsDepositSymbol === bountyInfo.token0_symbol
            ? bountyInfo.token0_address
            : bountyInfo.token1_address
        ) as string
        let decimal, depositAmount, applicantsDepositAmount
        if (bountyInfo.applicantsDepositSymbol === bountyInfo.token0_symbol) {
          decimal = getMainTokenDecimal()
          depositAmount = ethers.utils.parseUnits(depositInput.toString(), decimal)
          applicantsDepositAmount = ethers.utils.parseUnits(applicantsDeposit.toString(), decimal)
          // second send tx to bountyFactory create bounty
          console.log(
            1111111111,
            'main token',
            decimal,
            usdcTokenAddress,
            depositAmount,
            applicantsDepositAmount,
            dayjs(bountyInfo.expiresIn).utc().valueOf() / 1000
          )
          const contractRes: any = await bountyContract.createBounty(
            usdcTokenAddress,
            depositAmount,
            applicantsDepositAmount,
            dayjs(bountyInfo.expiresIn).utc().valueOf() / 1000,
            'Create bounty deposit contract on blockchain.',
            `<div class="flex items-center">Bounty "<span class="max-w-20 truncate">${bountyInfo.title}</span>" is creating</div>`,
            {
              value: depositAmount
            }
          )
          console.log(222222222, contractRes)
          return contractRes
        } else {
          const usdcRes = await usdcTokenContract(usdcTokenAddress) // construct erc20 contract
          decimal = await usdcRes.decimals()
          depositAmount = ethers.utils.parseUnits(depositInput.toString(), decimal) // convert usdc unit to wei
          applicantsDepositAmount = ethers.utils.parseUnits(applicantsDeposit.toString(), decimal) // convert usdc unit to wei
          if (depositInput !== 0) {
            contractStore.startContract(approvePendingText)
            const bountyFactoryAddress = bountyFactoryAddresses[walletStore.chainId!]
            console.log(bountyFactoryAddress)
            // approve amount to bounty factory contract
            const approveRes: Contract = await usdcRes.approve(bountyFactoryAddress, depositAmount)
            await approveRes.wait()
          }

          // second send tx to bountyFactory create bounty
          console.log(
            1111111111,
            'erc20 token',
            decimal,
            usdcTokenAddress,
            depositAmount,
            applicantsDepositAmount,
            dayjs(bountyInfo.expiresIn).utc().valueOf() / 1000
          )
          const contractRes: any = await bountyContract.createBounty(
            usdcTokenAddress,
            depositAmount,
            applicantsDepositAmount,
            dayjs(bountyInfo.expiresIn).utc().valueOf() / 1000,
            'Create bounty deposit contract on blockchain.',
            `<div class="flex items-center">Bounty "<span class="max-w-20 truncate">${bountyInfo.title}</span>" is creating</div>`
          )
          console.log(222222222, contractRes)
          return contractRes
        }
      } catch (e: any) {
        reportError(e as Error)
        console.error(e)
        contractStore.endContract('failed', { success: false })
      }
      return null
    }

    const postSubmit = async () => {
      try {
        const contractRes = await contractSubmit()
        // Call the interface whether the contract is successful or not
        if (!contractRes) return
        const payDetail = (() => {
          if (bountyInfo.payDetailType === 'stage') {
            return {
              stages: bountyInfo.stages.map((stage, stageIndex) => {
                const token1_amount = Number(stage.token1_amount)
                const token2_amount = Number(bountyInfo.token2_symbol ? stage.token2_amount : 0)
                return {
                  sort_index: stageIndex + 1,
                  token1_amount: token1_amount || 0, // usdc amount
                  token1_symbol: bountyInfo.payTokenSymbol, // usdc symbol
                  token2_amount: token2_amount || 0, // finance setting token amount
                  token2_symbol: bountyInfo.token2_symbol, // finance setting token symbol
                  terms: stage.terms
                }
              })
            }
          } else {
            const periodAmount = Number(bountyInfo.period.periodAmount)
            const token1_amount = Number(bountyInfo.period.token1_amount)
            const token2_amount = Number(bountyInfo.period.token2_amount)
            const hoursPerDay = Number(bountyInfo.period.hoursPerDay)
            return {
              period: {
                period: periodAmount || 0,
                period_type: bountyInfo.period.periodType,
                hours_per_day: hoursPerDay || 0,
                token1_amount: token1_amount || 0, // usdc amount
                token1_symbol: bountyInfo.payTokenSymbol, // usdc symbol
                token2_amount: token2_amount || 0, // finance setting token amount
                token2_symbol: bountyInfo.token2_symbol, // finance setting token symbol
                terms: bountyInfo.period.target
              }
            }
          }
        })()

        const payment_mode =
          bountyInfo.payDetailType === 'stage' ? 1 : bountyInfo.payDetailType === 'period' ? 2 : 0
        await services['Bounty@create-bounty']({
          startup_id: bountyInfo?.startup_id as number,
          contacts: bountyInfo.contact
            .filter(item => item.value)
            .map(item => ({ type: item.type, value: item.value })),
          deposit_contract_token_symbol: bountyInfo.applicantsDepositSymbol,
          description: bountyInfo.description,
          discussion_link: bountyInfo.discussionLink,
          payment_mode,
          skills: bountyInfo.applicantsSkills,
          title: bountyInfo.title,
          tx_hash: contractRes.hash,
          stages: bountyInfo.payDetailType === 'stage' ? payDetail.stages : undefined,
          period: bountyInfo.payDetailType === 'period' ? payDetail.period : undefined
        })
        ctx.emit('cancel')
      } catch (error) {
        reportError(error as Error)
        console.error('error===>', error)
      }
    }

    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }

    const onSubmit = async () => {
      // const value = new Big(bountyInfo.deposit).times(Math.pow(10, 18)).toNumber
      postSubmit()
    }

    // reload contract and wallet store
    const initContract = () => {
      walletStore.init().then(() => {
        bountyContract = useBountyFactoryContract()
      })
    }

    watch(
      () => bountyInfo.startup_id,
      () => {
        if (bountyInfo.startup_id) {
          getFinanceSymbol(bountyInfo.startup_id)
        }
      }
    )
    // change to startup chain
    const getFinanceSymbol = async (startup_id?: number) => {
      if (!startup_id) {
        bountyInfo.token2_symbol = ''
        return
      }
      const { error, data } = await services['Startup@get-startup-info']({
        startup_id
      })
      if (!error) {
        if (data.chain_id) {
          bountyInfo.token2_symbol = data.finance?.symbol || ''
          netWorkChange(data.chain_id)
          chainInfo.value = { chain_id: data.chain_id, on_chain: data.on_chain }
        } else {
          console.warn('somthing is wrong', data)
        }
      }
    }
    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value) {
        const result = await walletStore.switchNetwork({ chainId: value })
        if (!result) {
          closeDrawer()
        } else {
          initContract()
        }
      }
    }

    const toNext = () => {
      if (bountyInfo.current === 1) {
        bountyBasicInfoRef.value?.bountyDetailForm?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      } else if (bountyInfo.current === 2 && bountyInfo.payDetailType === 'stage') {
        // if anyone total rewards bigger than MAX_AMOUNT, go to next is not allowed
        if (
          (payStageRef.value?.payStagesTotal.usdcTotal as number) > MAX_AMOUNT ||
          (payStageRef.value?.payStagesTotal?.tokenTotal as number) > MAX_AMOUNT
        ) {
          return
        }
        payStageRef.value?.payStageForm?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      } else if (bountyInfo.current === 2 && bountyInfo.payDetailType === 'period') {
        if (
          (payPeriodRef.value?.payPeriodTotal.usdcTotal as number) > MAX_AMOUNT ||
          (payPeriodRef.value?.payPeriodTotal?.tokenTotal as number) > MAX_AMOUNT
        ) {
          return
        }
        payPeriodRef.value?.payPeriodForm?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      }
    }

    const toPreviousStep = () => {
      bountyInfo.current -= 1
    }

    ctx.expose({
      bountyInfo,
      toNext,
      toPreviousStep,
      onSubmit,
      showLeaveTipModal
    })

    bountyInfo.payTokenSymbol = bountyInfo.payTokenSymbol || bountyInfo.token1_symbol
    return {
      stepOptions,
      bountyInfo,
      modalVisibleState,
      bountyBasicInfoRef,
      payPeriodRef,
      payStageRef,
      addContact,
      delContact,
      toFinanceSetting,
      renderUnit,
      delStage,
      addStage,
      showLeaveTipModal,
      closeDrawer,
      modalClickYesToWhere,
      chainInfo
    }
  },

  render() {
    return (
      <>
        <div class="mx-35 mb-15">
          <Steps
            steps={this.stepOptions}
            current={this.bountyInfo.current}
            classes={{ stepTitle: 'whitespace-nowrap' }}
            class="mt-4"
          />
        </div>
        {this.bountyInfo.current === 1 && (
          <BountyBasicInfo
            bountyInfo={this.bountyInfo}
            chainInfo={this.chainInfo}
            onDelContact={this.delContact}
            onAddContact={this.addContact}
            onCloseDrawer={this.closeDrawer}
            ref={(ref: any) => (this.bountyBasicInfoRef = ref)}
          />
        )}
        {this.bountyInfo.current === 2 && (
          <UTabs v-model:value={this.bountyInfo.payDetailType} class="mt-10">
            <UTabPane
              name="stage"
              v-slots={{
                tab: () => (
                  <div class="flex items-center">
                    <StageOutlined class="mr-4" /> Stage
                  </div>
                )
              }}
            >
              <PayDetailStage
                ref={(ref: any) => (this.payStageRef = ref)}
                bountyInfo={this.bountyInfo}
                chainInfo={this.chainInfo}
                onDelStage={this.delStage}
                onAddStage={this.addStage}
                onShowLeaveTipModal={this.showLeaveTipModal}
              />
            </UTabPane>
            <UTabPane
              name="period"
              v-slots={{
                tab: () => (
                  <div class="flex items-center">
                    <PeriodOutlined class="mr-4" />
                    Period
                  </div>
                )
              }}
            >
              <PayDetailPeriod
                bountyInfo={this.bountyInfo}
                chainInfo={this.chainInfo}
                ref={(ref: any) => (this.payPeriodRef = ref)}
                onShowLeaveTipModal={this.showLeaveTipModal}
              />
            </UTabPane>
          </UTabs>
        )}
        {this.bountyInfo.current === 3 && <Deposit bountyInfo={this.bountyInfo} />}
        {/* {this.visible && <CreateStartupForm onCancel={this.close} />} */}
        {/* {this.footer()} */}
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
                size="large"
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton
                size="large"
                type="primary"
                class="w-41"
                onClick={
                  this.modalClickYesToWhere === 'toFinanceSetting'
                    ? this.toFinanceSetting
                    : this.closeDrawer
                }
              >
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </>
    )
  }
})

export default CreateBountyForm

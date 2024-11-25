import { UButton, message } from '@comunion/components'
import {
  CreateStartupNewFilled,
  CreateBountyNewFilled,
  CreateCrowdfundingNewFilled,
  CreateProposalNewFilled
} from '@comunion/icons'
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeaderDropdown from '../../components/HeaderDropdown'
import NoFollowedStartupTip from './components/NoFollowedStartupTip'
import NoStartupTip from './components/NoStartupTip'
import CreateBountyBlock, { CreateBountyRef } from '@/blocks/Bounty/Create'
import CreateFairLaunchpadBlock, { type CreateFairLaunchRef } from '@/blocks/FairLaunchpad/Create'
import CreateProposalBlock, { CreateProposalRef } from '@/blocks/Proposal/Create'
import CreateSaleLaunchpadBlock, { type CreateSaleLaunchRef } from '@/blocks/SaleLaunchpad/Create'

import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'
import { services } from '@/services'
import { useUserStore, useGlobalConfigStore, useWalletStore } from '@/stores'

const CreateBlock = defineComponent({
  name: 'CreateBlock',
  setup(props, ctx) {
    const router = useRouter()
    const walletStore = useWalletStore()
    const globalConfigStore = useGlobalConfigStore()
    const userStore = useUserStore()
    const createStartupRef = ref<CreateStartupRef>()
    const createBountyRef = ref<CreateBountyRef>()
    const createFairRef = ref<CreateFairLaunchRef>()
    const createSaleRef = ref<CreateSaleLaunchRef>()
    const createProposalRef = ref<CreateProposalRef>()
    const hasStartup = ref(false)
    const NoStartupTipRef = ref()
    const NoFollowedStartupTipRef = ref()

    const getStartupByComerId = async (comer_id: number | undefined) => {
      try {
        // search founder & Admin startup
        const { error, data } = await services['Startup@get-startups']({
          admin_comer_id: comer_id
        })
        if (!error) {
          hasStartup.value = !!(data.list || []).length
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    const onCreateStartup = () => {
      if (globalConfigStore.isLargeScreen) {
        createStartupRef.value?.show()
      } else {
        message.info(`Note: please switch desktop to create Project`)
      }
    }

    const onCreateBounty = () => {
      if (walletStore.chainId === 57000) {
        message.info(
          'The current chain does not support the bounty function, please wait for the launch'
        )
        return
      }
      if (globalConfigStore.isLargeScreen) {
        if (hasStartup.value) {
          createBountyRef.value?.show()
        } else {
          NoStartupTipRef.value?.show('Please do create a Project before creating a Bounty.')
        }
      } else {
        message.info(`Note: please switch desktop to create Bounty`)
      }
    }

    const onCreateFair = () => {
      if (globalConfigStore.isLargeScreen) {
        if (hasStartup.value) {
          createFairRef.value?.show()
        } else {
          NoStartupTipRef.value?.show('Please do create a Project before creating a Launchpad.')
        }
      } else {
        message.info(`Note: please switch desktop to create Launchpad`)
      }
    }

    const onCreateSale = () => {
      if (globalConfigStore.isLargeScreen) {
        if (hasStartup.value) {
          createSaleRef.value?.show()
        } else {
          NoStartupTipRef.value?.show('Please do create a Project before creating a Launchpad.')
        }
      } else {
        message.info(`Note: please switch desktop to create Launchpad`)
      }
    }

    const toStartupList = () => {
      router.push('/project/list')
    }

    const onCreateProposal = () => {
      if (globalConfigStore.isLargeScreen) {
        if (hasStartup.value) {
          createProposalRef.value?.show()
        } else {
          NoFollowedStartupTipRef.value?.show()
        }
      } else {
        message.info(`Note: please switch desktop to create Proposal`)
      }
    }

    watch(
      () => userStore.profile?.id,
      () => {
        if (userStore.profile?.id) {
          getStartupByComerId(userStore.profile?.id)
        }
      },
      {
        immediate: true
      }
    )

    return () => (
      <>
        <CreateStartupBlock ref={createStartupRef} />
        <CreateBountyBlock ref={createBountyRef} />
        <CreateFairLaunchpadBlock ref={createFairRef} />
        <CreateSaleLaunchpadBlock ref={createSaleRef} />
        <CreateProposalBlock ref={createProposalRef} />
        <NoStartupTip ref={NoStartupTipRef} onToCreate={onCreateStartup} />
        <NoFollowedStartupTip ref={NoFollowedStartupTipRef} onToCreate={toStartupList} />
        <HeaderDropdown
          options={[
            {
              key: 'startup',
              label: () => (
                <div class="flex items-center" onClick={onCreateStartup}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateStartupNewFilled />
                  </div>
                  <div class="text-[#000000] u-h4">Project</div>
                </div>
              )
            },
            {
              key: 'bounty',
              label: () => (
                <div class="flex items-center" onClick={onCreateBounty}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateBountyNewFilled class="text-primary" />
                  </div>
                  <div class="text-[#000000] u-h4">Bounty</div>
                </div>
              )
            },
            {
              key: 'Crowdfunding',
              label: () => (
                <div class="flex items-center">
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateCrowdfundingNewFilled class="text-primary" />
                  </div>
                  <div class="text-[#000000] u-h4">Launchpad</div>
                </div>
              ),
              children: [
                {
                  key: 'pair',
                  label: () => (
                    <div class="flex-col my-[10px] mx-[30px] items-center" onClick={onCreateFair}>
                      <div class="font-normal text-[#333] u-h4">Fair Launch</div>
                      <div class="mt-2 text-gray-500 leading-4 w-[300px] whitespace-normal">
                        During the fair liquidity, a presale pool is established with a fixed swap
                        price. This presale pool allows investors to invest in and withdraw tokens
                        in real-time.
                      </div>
                    </div>
                  )
                },
                {
                  key: 'sale',
                  label: () => (
                    <div class="flex-col my-[10px] mx-[30px] items-center" onClick={onCreateSale}>
                      <div class="font-normal text-[#333] u-h4">Sale Launch</div>
                      <div class="mt-2 text-gray-500 leading-4 w-[300px] whitespace-normal">
                        After a set vesting date, investors will be able to receive the tokens they
                        invested in during the presale
                      </div>
                    </div>
                  )
                }
              ]
            },
            {
              key: 'Proposal',
              label: () => (
                <div class="flex items-center" onClick={onCreateProposal}>
                  <div class="rounded flex h-full mr-4 w-8 items-center justify-center">
                    <CreateProposalNewFilled class="text-primary" />
                  </div>
                  <div class="text-[#000000] u-h4">Proposal</div>
                </div>
              )
            }
          ]}
        >
          <UButton type="primary" size="small" class="h-8 w-19.25 !font-normal">
            Create
          </UButton>
          {/* <button class={[styles.btn, ctx.attrs.class]}></button> */}
        </HeaderDropdown>
      </>
    )
  }
})

export default CreateBlock

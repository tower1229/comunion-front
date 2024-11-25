import { UCard, UButton, message } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NoFollowedStartupTip from './NoFollowedStartupTip'
import createLogo from './image/create.png'
import createProfile from './image/create_profile.png'
import createSettingLogo from './image/create_setting.png'
import CreateBountyBlock, { CreateBountyRef } from '@/blocks/Bounty/Create'
import CreateProposalBlock, { CreateProposalRef } from '@/blocks/Proposal/Create'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'
import { services } from '@/services'
import { useUserStore } from '@/stores'
export const BootTheTask = defineComponent({
  name: 'BootTheTask',
  props: {
    taskList: {
      type: Array,
      default: []
    },
    projectData: {
      type: Object,
      default: {}
    },
    profile: {
      type: Object,
      default: {}
    },
    noData: {
      type: Boolean,
      default: false
    },
    viewMode: {
      type: Boolean,
      default: false
    },
    founder: {
      type: Boolean,
      default: true
    }
  },
  emits: ['editAll'],
  setup(props, ctx) {
    const router = useRouter()
    const userStore = useUserStore()
    const NoFollowedStartupTipRef = ref()
    const createStartupRef = ref<CreateStartupRef>()
    const createBountyRef = ref<CreateBountyRef>()
    const createProposalRef = ref<CreateProposalRef>()
    const storeProfile = computed(() => userStore.profile)
    const profile = computed(() => props.profile)
    const viewMode: any = computed(() => props.viewMode)
    const profileAllHasData = computed(() => {
      return (
        !!profile.value?.name &&
        !!profile.value?.location &&
        !!profile.value?.info?.bio &&
        profile.value?.skills?.length > 0 &&
        profile.value?.languages?.length > 0 &&
        profile.value?.socials?.length > 0
      )
    })
    const hasSettingTask = computed(() => {
      return !(!!props.projectData.logo && !!props.projectData.banner)
    })
    const noData = computed(() => props.noData)
    const isFounder = computed(() => props.founder)
    const taskListAll = ref([
      {
        value: 1,
        title: 'Add project settings',
        subTitle: [
          'Settings include security, social, finance, governance.',
          'Upload logo and banner.'
        ],
        buttonName: 'Go to add',
        logo: createSettingLogo,
        fn: () => {
          router.push(`/project/setting/${props.projectData.id}`)
        }
      },
      {
        value: 2,
        title: 'Create a proposal',
        subTitle: ['Create your first proposal to govern your project.'],
        buttonName: 'Go to create',
        logo: createLogo,
        fn: () => {
          onCreateProposal()
        }
      },
      {
        value: 3,
        title: 'Create a bounty',
        subTitle: ['Create the first bounty in your project to attract builder.'],
        buttonName: 'Go to create',
        logo: createLogo,
        fn: () => {
          onCreateBounty()
        }
      },
      {
        value: 4,
        title: 'Add to profile',
        subTitle: ['Perfect your Web3 profile to promote it to the world.'],
        buttonName: 'Go to add',
        logo: createProfile,
        fn: () => {
          ctx.emit('editAll')
        }
      },
      {
        value: 5,
        title: 'Create a project',
        subTitle: ['Drive your idea through creating a project.'],
        buttonName: 'Go to create',
        logo: createLogo,
        fn: () => {
          onCreateStartup()
        }
      }
    ])
    const taskList = computed(() => {
      const data: any = []
      const propData = props.taskList
      propData.map(item => {
        switch (item) {
          case 1:
            if (noData.value && hasSettingTask.value) {
              data.push(item)
            }
            break
          case 2:
            if (noData.value) {
              data.push(item)
            }
            break
          case 3:
            if (noData.value) {
              data.push(item)
            }
            break
          case 4:
            if (!profileAllHasData.value && noData.value) {
              data.push(item)
            }
            break
          case 5:
            if (noData.value) {
              data.push(item)
            }
            break
          default:
            break
        }
      })
      return data
    })
    const taskNode = computed(() =>
      taskList.value.map((item: number) => {
        return taskListAll.value.find(tkl => tkl.value === item)
      })
    )
    const getFollowedStartupByComerId = async () => {
      const data = props.projectData
      const comerId = storeProfile.value?.id
      if (
        data.is_connected ||
        data.team.some((item: { comer_id: number | undefined }) => item?.comer_id === comerId)
      ) {
        createProposalRef.value?.show()
        setTimeout(() => {
          const proposalInfo = createProposalRef.value?.createCreateProposalInfo.proposalInfo
          proposalInfo.startup_id = props.projectData.id
        }, 1000)
      } else {
        NoFollowedStartupTipRef.value?.show()
      }
    }
    const onCreateStartup = () => {
      createStartupRef.value?.show()
    }

    const onCreateBounty = () => {
      createBountyRef.value?.show()
      console.log(createBountyRef.value)
      setTimeout(() => {
        const bountyInfo = createBountyRef.value?.createBountyFormRef.bountyInfo
        bountyInfo.startup_id = props.projectData.id
      }, 1000)
    }
    const onpenProposal = () => {
      createProposalRef.value?.show()
      setTimeout(() => {
        const proposalInfo = createProposalRef.value?.createCreateProposalInfo.proposalInfo
        proposalInfo.startup_id = props.projectData.id
      }, 1000)
    }
    const onCreateProposal = () => {
      if (isFounder.value) {
        onpenProposal()
      } else {
        getFollowedStartupByComerId()
      }
    }
    const connectAndCreateProposal = async () => {
      try {
        const res = await services['Startup@connect-startup']({
          startup_id: props.projectData.id
        })
        if (!res.error) {
          NoFollowedStartupTipRef.value?.close()
          onpenProposal()
        }
      } catch (error) {
        message.error('connect fail')
      }
    }
    return () =>
      taskList.value.length > 0 &&
      !viewMode.value && (
        <>
          <CreateStartupBlock ref={createStartupRef} />
          <CreateBountyBlock ref={createBountyRef} />
          <CreateProposalBlock ref={createProposalRef} />
          <NoFollowedStartupTip
            ref={NoFollowedStartupTipRef}
            onToCreate={connectAndCreateProposal}
          />
          <UCard title="" class="mb-6">
            {taskNode.value.map((item: any, index: number) => {
              return (
                <div class={`bg-[#FAFAFA] p-4 ${index === 0 ? '' : 'mt-5'}`}>
                  <p class="border-color-border flex border-b-1 pb-4 items-center ">
                    <img src={item.logo} alt="" />
                    <span class="ml-5 u-h4">{item.title}</span>
                  </p>
                  <div class="flex mt-4 items-center justify-between">
                    <div class="text-color2 u-h6">
                      {item.subTitle.map((st: string) => (
                        <div>
                          <strong class="mr-2">·</strong>
                          {st}
                        </div>
                      ))}
                    </div>
                    <UButton
                      type="primary"
                      size="large"
                      ghost
                      class="bg-[#ffffff] h-8 min-w-25.75 u-num1"
                      onClick={(event: { cancelBubble: boolean }) => {
                        item.fn()
                        event.cancelBubble = true
                      }}
                    >
                      {item.buttonName}
                    </UButton>
                  </div>
                </div>
              )
            })}
          </UCard>
        </>
      )
  }
})
export default BootTheTask

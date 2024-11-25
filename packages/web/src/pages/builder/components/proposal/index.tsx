import { UCard, UScrollList, USpin } from '@comunion/components'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ListSwitcher from '../ListSwitcher'
import Empty from '@/components/Empty'
import { ProposalCard } from '@/pages/governance/components/ProposalCard'
import { ServiceReturn, services } from '@/services'

export default defineComponent({
  props: {
    moduleCount: {
      type: Object
    },
    comerId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const createdByMe = ref(true)

    const router = useRouter()
    const pagination = reactive({
      size: 4,
      page: 1,
      comer_id: props.comerId
    })
    const totalCount = ref(0)
    const loading = ref(false)
    const proposalList = ref<NonNullable<ServiceReturn<'Proposal@get-proposal'>>['list']>([])

    const getProposalList = async () => {
      // let serviceError = false
      // let serviceData: ServiceReturn<'Proposal@getproposalspostedbycomer'>
      const reqData: any = {
        page: pagination.page,
        size: pagination.size
      }
      if (createdByMe.value) {
        reqData.founder_comer_id = props.comerId
      } else {
        reqData.participate_comer_id = props.comerId
      }
      const { error, data } = await services['Proposal@get-proposal'](reqData)

      loading.value = false

      if (!error && data?.list) {
        proposalList.value.push(...(data!.list ?? []))
        totalCount.value = data.total
      }
    }

    const toProposalDetail = async (proposalId: number) => {
      router.push({ path: `/governance/${proposalId}` })
    }

    const toggleList = (bool: boolean) => {
      createdByMe.value = bool
      proposalList.value = []
      pagination.page = 1
      loading.value = true
      getProposalList()
    }

    return {
      pagination,
      totalCount,
      loading,
      proposalList,
      getProposalList,
      toProposalDetail,
      toggleList
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.loading = true
      this.pagination.page = p
      await this.getProposalList()
    }

    return (
      <USpin show={this.loading}>
        <UCard
          title="Proposal"
          class="mb-6"
          v-slots={{
            'header-extra': () => {
              return (
                <ListSwitcher
                  moduleName="Proposal"
                  moduleCount={this.moduleCount}
                  onCreatedByMe={this.toggleList}
                />
              )
            }
          }}
        >
          {/* {this.proposalList.map((proposal: any) => (
          <div
            class="cursor-pointer -mx-4"
            onClick={() => this.toProposalDetail(proposal.proposal_id)}
          >
            <ProposalCard noBorder={true} noDescription={true} proposalData={proposal} />
          </div>
        ))} */}
          <UScrollList
            class="max-h-90 <lg:-mx-5"
            triggered={this.loading}
            page={this.pagination.page}
            pageSize={this.pagination.size}
            total={this.totalCount}
            onLoadMore={onLoadMore}
          >
            {Array.isArray(this.proposalList) && this.proposalList.length > 0 ? (
              this.proposalList.map(item => (
                <ProposalCard
                  noBorder={true}
                  noDescription={true}
                  proposalData={item}
                  key={item.id}
                />
              ))
            ) : (
              <Empty />
            )}
          </UScrollList>
        </UCard>
      </USpin>
    )
  }
})

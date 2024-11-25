import { UCard, UScrollList } from '@comunion/components'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Empty from '@/components/Empty'
import { ProposalCard } from '@/pages/governance/components/ProposalCard'
import { ServiceReturn, services } from '@/services'

export default defineComponent({
  name: 'governance',
  props: {
    startupId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const pagination = reactive({
      size: 4,
      page: 1,
      startup_id: props.startupId
    })
    const totalCount = ref(0)
    const loading = ref(false)

    const list = ref<NonNullable<ServiceReturn<'Proposal@get-proposal'>>['list']>([])

    const getProposalList = async () => {
      const { error, data } = await services['Proposal@get-proposal'](pagination)

      if (!error && data?.list) {
        list.value.push(...(data.list || []))
        totalCount.value = data.total
      }
    }

    const toProposalDetail = async (proposalId: number) => {
      router.push({ path: `/governance/${proposalId}` })
    }

    getProposalList()

    return {
      pagination,
      totalCount,
      loading,
      list,
      getProposalList,
      toProposalDetail
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.loading = true
      this.pagination.page = p
      await this.getProposalList()
      this.loading = false
    }

    return (
      <UCard title="Governance" class="mb-6">
        {/* {this.list.map((proposal: { proposalId: number }) => (
          <div onClick={() => this.toProposalDetail(proposal.proposalId)}>
            <ProposalCard
              class="-mx-4"
              proposalData={proposal}
              noDescription={true}
              noBorder={true}
            />
          </div>
        ))} */}
        <UScrollList
          style="max-height:363px"
          class="<lg:-mx-5"
          triggered={this.loading}
          page={this.pagination.page}
          pageSize={this.pagination.size}
          total={this.totalCount}
          onLoadMore={onLoadMore}
        >
          {Array.isArray(this.list) && this.list.length > 0 ? (
            this.list.map(item => (
              <ProposalCard proposalData={item} noDescription={true} noBorder={true} />
            ))
          ) : (
            <Empty />
          )}
        </UScrollList>
      </UCard>
    )
  }
})

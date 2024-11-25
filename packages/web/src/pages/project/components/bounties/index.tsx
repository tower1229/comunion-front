import { UCard, UScrollList } from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import Empty from '@/components/Empty'
import BountyCard from '@/pages/bounty/components/BountyCard'
import { services } from '@/services'
import { BountyListItem } from '@/types'

type BountyListType = BountyListItem[]

export default defineComponent({
  props: {
    startupId: {
      type: Number
    }
  },
  setup(props) {
    const pagination = reactive({
      size: 4,
      page: 1,
      startup_id: props.startupId
    })
    const totalCount = ref(0)
    const loading = ref(false)
    const bounties = ref<BountyListType>([])
    const getBounties = async () => {
      const { error, data } = await services['Bounty@get-bounties'](pagination)
      if (!error) {
        bounties.value.push(...(data.list || []))
        totalCount.value = data.total
      }
    }

    getBounties()

    return {
      pagination,
      totalCount,
      loading,
      bounties,
      getBounties
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.loading = true
      this.pagination.page = p
      await this.getBounties()
      this.loading = false
    }

    return (
      <UCard title="Bounty" class="mb-6">
        <UScrollList
          style="max-height:430px"
          class="<lg:-mx-5"
          triggered={this.loading}
          page={this.pagination.page}
          pageSize={this.pagination.size}
          total={this.totalCount}
          onLoadMore={onLoadMore}
        >
          {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
            this.bounties.map(item => <BountyCard info={item} key={item.id} miniCard />)
          ) : (
            <Empty />
          )}
        </UScrollList>
      </UCard>
    )
  }
})

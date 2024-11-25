import { UCard, UScrollList } from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import Empty from '@/components/Empty'
import SaleLaunchpadMiniCard from '@/pages/launchpad/components/SaleLaunchpadMiniCard'
import { services } from '@/services'

import { SaleCrowdfundingItem } from '@/types'

export default defineComponent({
  props: {
    startupId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const pagination = reactive({
      size: 200,
      page: 1,
      startup_id: props.startupId
    })
    const totalCount = ref(0)
    const loading = ref(false)
    const list = ref<SaleCrowdfundingItem[]>([])
    const getBounties = async () => {
      const { error, data } = await services['SaleLaunchpad@get-sale-launchpad']({
        startup_id: props.startupId,
        size: pagination.size,
        page: pagination.page
      })
      if (!error) {
        list.value = data?.list || []
      }
    }

    getBounties()

    return {
      pagination,
      totalCount,
      loading,
      list,
      getBounties
    }
  },
  render() {
    const onLoadMore = () => null

    return (
      <UCard title="Sale Launchpad" class="mb-6 ">
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
            this.list.map(item => <SaleLaunchpadMiniCard info={item} key={item.id} />)
          ) : (
            <Empty />
          )}
        </UScrollList>
      </UCard>
    )
  }
})

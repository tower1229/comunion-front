import { UCard, UScrollList, USpin } from '@comunion/components'
import { defineComponent, reactive, ref } from 'vue'
import ListSwitcher from '../ListSwitcher'
import Empty from '@/components/Empty'
import { default as ItemCard } from '@/pages/launchpad/components/SaleLaunchpadMiniCard'
import { services } from '@/services'
import { CrowdfundingItem, SaleCrowdfundingItem } from '@/types'

export default defineComponent({
  props: {
    moduleCount: {
      type: Object
    },
    viewMode: {
      type: Boolean,
      default: () => false
    },
    comerId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const createdByMe = ref(true)

    const pagination = reactive({
      size: 4,
      page: 1
    })
    // createdByMe.value
    const totalCount = ref(0)
    const loading = ref(false)
    const list = ref<SaleCrowdfundingItem[]>([])
    const fetchData = async () => {
      const reqData: any = {
        page: pagination.page,
        size: pagination.size
      }
      if (createdByMe.value) {
        reqData.founder_comer_id = props.comerId
      } else {
        reqData.participate_comer_id = props.comerId
      }
      const { error, data } = await services['SaleLaunchpad@get-sale-launchpad'](reqData)

      loading.value = false

      if (!error) {
        const dataList: CrowdfundingItem[] = Array.isArray(data.list)
          ? data.list.map(item => {
              return {
                ...item,
                kyc: item.kyc || '',
                contract_audit: item.contract_audit || '',
                buy_token_amount: item.invest_token_amount || 0
              }
            })
          : []
        list.value.push(...dataList)
        totalCount.value = data.total
      }
    }

    const toggleList = (bool: boolean) => {
      createdByMe.value = bool
      list.value = []
      pagination.page = 1
      loading.value = true
      fetchData()
    }

    return {
      pagination,
      totalCount,
      loading,
      list,
      fetchData,
      toggleList
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.loading = true
      this.pagination.page = p
      await this.fetchData()
    }

    return (
      <USpin show={this.loading}>
        <UCard
          title="Sale Launchpad"
          class="mb-6"
          v-slots={{
            'header-extra': () => {
              return (
                <ListSwitcher
                  moduleName="Launchpad"
                  moduleCount={this.moduleCount}
                  onCreatedByMe={this.toggleList}
                />
              )
            }
          }}
        >
          {/* {Array.isArray(this.list) &&
          this.list.map(item => <ItemCard class="-mx-4" info={item} key={item.crowdfundingId} />)} */}
          <UScrollList
            class="max-h-90 <lg:-mx-5"
            triggered={this.loading}
            page={this.pagination.page}
            pageSize={this.pagination.size}
            total={this.totalCount}
            onLoadMore={onLoadMore}
          >
            {Array.isArray(this.list) && this.list.length > 0 ? (
              this.list.map(item => <ItemCard info={item} key={item.crowdfundingId} />)
            ) : (
              <Empty />
            )}
          </UScrollList>
        </UCard>
      </USpin>
    )
  }
})

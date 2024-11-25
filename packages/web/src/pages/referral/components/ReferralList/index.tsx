// import { NDataTable } from 'naive-ui'
import { UScrollList } from '@comunion/components'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ListItem } from './ListItem'
import Empty from '@/components/Empty'
import { services } from '@/services'
export const ReferralList = defineComponent({
  name: 'ReferralList',
  setup() {
    const loading = ref(false)
    const totalCount = ref(80)
    const pagination = reactive({
      size: 20,
      page: 1
    })
    const list = ref<any[]>([])
    const onLoadMore = async (p: number) => {
      loading.value = true
      pagination.page = p
      await fetchData()
    }
    const fetchData = async () => {
      loading.value = false
      try {
        const { error, data } = await services['Comer@get-comer-invitation-records']()
        if (!error) {
          const dataList = Array.isArray(data.list)
            ? data.list.map(item => {
                return item
              })
            : []
          list.value.push(...dataList)
          totalCount.value = data.total
        }
      } catch (error) {
        console.error('list', error)
      }
    }
    onMounted(() => {
      onLoadMore(1)
    })
    return () => (
      <div class="w-full mb-20">
        <p class="u-h4 mb-6 text-color1">Track Your Referrals</p>
        {Array.isArray(list.value) && list.value.length > 0 ? (
          <>
            <div class="flex items-center py-4 px-12 bg-[#F5F6FA] u-h5 text-color1 font-medium">
              <p class="w-72">Date</p>
              <p class="w-59">Wallet</p>
              <p class="w-50">Status</p>
              <p>Rewards</p>
            </div>
            <UScrollList
              style="max-height:200px"
              triggered={loading.value}
              page={pagination.page}
              pageSize={pagination.size}
              total={totalCount.value}
              onLoadMore={onLoadMore}
            >
              {list.value.map(item => (
                <ListItem detail={item} />
              ))}
            </UScrollList>
          </>
        ) : (
          <Empty text="referral" />
        )}
      </div>
    )
  }
})

export default ReferralList

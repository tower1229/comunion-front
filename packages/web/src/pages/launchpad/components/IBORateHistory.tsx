import { UCard, UScrollList } from '@comunion/components'
// import dayjs from 'dayjs'
import { defineComponent, reactive, ref, inject, ComputedRef } from 'vue'
// import { services } from '@/services'

interface IPagination {
  pageSize: number
  total: number
  page: number
  loading: boolean
}

export const IBORateHistory = defineComponent({
  name: 'IBORateHistory',
  setup(props) {
    const records = ref()

    const paramCrowdfundingId = inject<ComputedRef<number>>('paramCrowdfundingId')

    if (!paramCrowdfundingId?.value) {
      return null
    }

    const pagination = reactive<IPagination>({
      pageSize: 20,
      total: 300,
      page: 1,
      loading: false
    })
    const getHistories = async (page = 1) => {
      // try {
      //   const { error, data } = await services['Crowdfunding@get-modification-histories']({
      //     crowdfunding_id: paramCrowdfundingId.value
      //     // page
      //   })
      //   if (!error) {
      //     records.value = data || []
      //   }
      // } catch (error) {
      //   console.error('error', error)
      // }
    }

    return () => (
      <UCard title="Rate History">
        {!!records.value?.length && (
          <UScrollList
            triggered={pagination.loading}
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onLoadMore={() => getHistories(pagination.page)}
          >
            {/* {(records.value || [])?.map(record => {
              return (
                <div class="mb-6">
                  <div class="mb-2 text-color3 u-h6">{dayjs().format('YYYY-MM-DD HH:mm')}</div>
                  <div class="bg-purple rounded-sm flex border-1 border-grey5 py-2.5 px-4 justify-between">
                    <span class="u-h4">
                      1 {record.buy_token_symbol} = {record.buy_price} {record.sell_token_symbol}
                    </span>
                    <span class="u-h4">Swap = {record.swap_percent} %</span>
                  </div>
                </div>
              )
            })} */}
          </UScrollList>
        )}
      </UCard>
    )
  }
})

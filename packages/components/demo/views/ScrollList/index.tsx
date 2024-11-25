import { range } from 'lodash'
import { NInputNumber } from 'naive-ui'
import { computed, defineComponent, reactive } from 'vue'

import { UScrollList } from '@/comps/index'

interface IPagination {
  pageSize: number
  total: number
  page: number
  loading: boolean
}

export default defineComponent({
  setup() {
    const pagination = reactive<IPagination>({
      pageSize: 20,
      total: 300,
      page: 1,
      loading: false
    })

    const recordSize = computed(() => pagination.page * pagination.pageSize)

    return () => {
      return (
        <div class="h-full flex flex-col">
          <div class="h-60px px-24px flex flex-row items-center">
            <div>Current page: {pagination.page}</div>
            <div class="flex flex-row items-center ml-24px">
              pageSize:{' '}
              <NInputNumber
                value={pagination.pageSize}
                min={10}
                onUpdateValue={v => {
                  pagination.pageSize = v || 20
                  pagination.page = 1
                }}
              />
            </div>
            <div class="flex flex-row items-center ml-24px">
              Total:{' '}
              <NInputNumber
                min={1}
                value={pagination.total}
                onUpdateValue={v => {
                  pagination.total = v || 1
                  pagination.page = 1
                }}
              />
            </div>
          </div>
          <div class="flex-1 min-h-0">
            <UScrollList
              triggered={pagination.loading}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onLoadMore={p => {
                pagination.loading = true
                setTimeout(() => {
                  pagination.page = p
                  pagination.loading = false
                }, 2000)
              }}
            >
              {range(recordSize.value).map(item => {
                return (
                  <div
                    key={item}
                    class="h-80px border border-[#666] text-[24px] mb-16px text-[#000] flex flex-row items-center justify-center"
                  >
                    {item + 1}
                  </div>
                )
              })}
            </UScrollList>
          </div>
        </div>
      )
    }
  }
})

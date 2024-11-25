import { UCard, ULazyImage, UScrollList, UTag } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, reactive, ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ServiceReturn, services } from '@/services'
interface IPagination {
  pageSize: number
  total: number
  page: number
  loading: boolean
}

export interface InvestmentsRecordsExpose {
  getInvestRecord: () => void
}

export const InvestmentRecords = defineComponent({
  name: 'InvestmentRecords',
  props: {
    buyTokenName: {
      type: String
    },
    sellTokenName: {
      type: String
    }
  },
  setup(props, ctx) {
    const router = useRouter()

    const paramCrowdfundingId = inject<number>('paramCrowdfundingId')

    if (!paramCrowdfundingId) {
      return null
    }

    const pagination = reactive<IPagination>({
      pageSize: 20,
      total: 300,
      page: 1,
      loading: false
    })
    const investRecords =
      ref<NonNullable<ServiceReturn<'SaleLaunchpad@get-sale-launchpad-history-records'>>['list']>()

    const getAmount = (
      record: NonNullable<
        ServiceReturn<'SaleLaunchpad@get-sale-launchpad-history-records'>
      >['list'][number]
    ) => {
      let operator = '+'

      const tokenName = record.token_symbol
      const amount = record.amount
      if (record.amount.startsWith('-')) {
        operator = ''
      }
      return (
        <span title={amount}>
          {`${operator} ${
            amount.split('.')[1] && amount.split('.')[1].length > 4
              ? amount.split('.')[0] + '.' + amount.split('.')[1].substring(0, 4) + '...'
              : amount
          } ${tokenName}`}
        </span>
      )
    }

    const getInvestRecord = async (page = 1) => {
      try {
        const { error, data } = await services['SaleLaunchpad@get-sale-launchpad-history-records']({
          sale_launchpad_id: paramCrowdfundingId,
          page,
          size: pagination.pageSize
        })
        if (!error) {
          investRecords.value = data.list || []
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    const toComerDetail = (comerId?: number) => {
      if (comerId) {
        router.push({ path: '/builder', query: { id: comerId } })
      }
    }

    onMounted(() => {
      getInvestRecord(pagination.page)
    })

    ctx.expose({
      getInvestRecord
    })

    return {
      pagination,
      investRecords,
      getInvestRecord,
      getAmount,
      toComerDetail
    }
  },
  render() {
    return (
      <UCard title="Investment Record">
        {!!this.investRecords?.length && (
          <UScrollList
            triggered={this.pagination.loading}
            page={this.pagination.page}
            pageSize={this.pagination.pageSize}
            total={this.pagination.total}
            onLoadMore={() => this.getInvestRecord(this.pagination.page)}
          >
            {(this.investRecords ?? []).map((record: any) => {
              return (
                <div class="flex mb-4">
                  <div
                    onClick={() => this.toComerDetail(record.comer_id)}
                    class="rounded-full cursor-pointer h-9 w-9"
                  >
                    <ULazyImage src={record.comer?.avatar ?? ''} class="h-full w-full" />
                  </div>
                  <div class="flex-1 mx-2 overflow-hidden">
                    <div class="flex mb-1 items-center">
                      <div class="flex-1 text-color1 truncate u-h5">{record?.comer?.name}</div>
                      <UTag class="ml-2 text-color3 whitespace-nowrap">
                        {
                          {
                            // 需求只展示1，3, 后端已经过滤了1，3之外的type
                            1: 'Buy',
                            2: 'founder 撤资',
                            3: 'Withdraw',
                            4: '投资者认领预售token',
                            5: 'founder 认领投资token',
                            6: '取消',
                            7: '取消返还投资人投资token（这个没有，预留）',
                            8: '取消返还founder质押预售token',
                            9: '转移流动性'
                          }[record.type as string]
                        }
                      </UTag>
                    </div>
                    <div class="mb-2 text-color3 u-h7">
                      {dayjs(+record.timestamp * 1000).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <div class="text-primary whitespace-nowrap">{this.getAmount(record)}</div>
                </div>
              )
            })}
          </UScrollList>
        )}
      </UCard>
    )
  }
})

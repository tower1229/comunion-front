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
      ref<NonNullable<ServiceReturn<'Crowdfunding@get-crowdfunding-invest-records'>>['list']>()

    const getAmount = (
      record: NonNullable<
        ServiceReturn<'Crowdfunding@get-crowdfunding-invest-records'>
      >['list'][number]
    ) => {
      let operator = '+'
      let tokenName = '--'
      let amount = ''
      if (record.access === 2) {
        operator = '-'
        tokenName = record.buy_token_symbol
        amount = record.buy_token_amount
      } else {
        operator = '+'
        tokenName = record.buy_token_symbol
        amount = record.buy_token_amount
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
        const { error, data } = await services['Crowdfunding@get-crowdfunding-invest-records']({
          crowdfunding_id: paramCrowdfundingId,
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
                        {record.access === 1 ? 'Invest' : 'Sell'}
                      </UTag>
                    </div>
                    <div class="mb-2 text-color3 u-h7">
                      {dayjs(+record.timestamp).format('YYYY-MM-DD HH:mm')}
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

import { UDropdownFilter, USpin } from '@comunion/components'
import { debounce } from '@comunion/utils'
import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'
import { ProposalCard } from './components/ProposalCard'
import SearchInput from '@/components/SearchInput'
import { GOVERNANCE_TYPES } from '@/constants/governance'
import { ServiceReturn, services } from '@/services'
type ItemType = NonNullable<ServiceReturn<'Proposal@get-proposal'>>['list'][number]

const GovernanceListPage = defineComponent({
  name: 'GovernanceListPage',
  setup() {
    const proposalStatus = ref<number | undefined>(undefined)
    const searchInput = ref<string>('')

    const DataList = ref<ItemType[]>([])
    const pagination = reactive<{
      pageSize: number
      total: number | undefined
      page: number
      loading: boolean
    }>({
      pageSize: 10,
      total: 0,
      page: 1,
      loading: false
    })

    const fetchData = async (reload?: boolean) => {
      try {
        const { error, data } = await services['Proposal@get-proposal']({
          page: pagination.page,
          size: pagination.pageSize,
          keyword: searchInput.value,
          status:
            proposalStatus.value !== undefined && proposalStatus.value !== null
              ? proposalStatus.value + 1
              : undefined
        })
        if (!error) {
          if (reload) {
            DataList.value = (data!.list as unknown as ItemType[]) || []
          } else {
            DataList.value.push(...((data!.list as unknown as ItemType[]) || []))
          }

          pagination.total = data?.total
        }
      } catch (error) {
        console.error(error)
      }
    }
    const onLoadMore = async (p: number, reload?: boolean) => {
      pagination.loading = true
      pagination.page = p
      await fetchData(reload)
      pagination.loading = false
    }

    // filter
    const debounceLoad = debounce(onLoadMore)

    watch(
      () => [proposalStatus.value, searchInput.value],
      () => debounceLoad(1, true)
    )

    const isLastPage = computed(() => {
      return (pagination.page || 0) * (pagination.pageSize || 0) >= (pagination.total || 0)
    })

    let winHeight = 0
    let body = document.body
    const scrollHandler = () => {
      if (!pagination.loading) {
        const bodyRect = body?.getBoundingClientRect()

        if (bodyRect.height + bodyRect.top - winHeight < 240) {
          if (isLastPage.value) {
            document.removeEventListener('scroll', scrollHandler)
          } else {
            pagination.page++
            onLoadMore(pagination.page)
          }
        }
      }
    }

    onMounted(() => {
      nextTick(() => {
        winHeight = window.innerHeight
        body = document.body
        document.addEventListener('scroll', scrollHandler)
        onLoadMore(pagination.page)
      })
    })

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', scrollHandler)
    })

    return {
      DataList,
      proposalStatus,
      pagination,
      searchInput
    }
  },
  render() {
    return (
      <USpin show={this.pagination.loading}>
        <div class="flex mb-3">
          <div class="flex-1"></div>
          <UDropdownFilter
            options={GOVERNANCE_TYPES.map((item, index) => ({ label: item, value: index }))}
            placeholder="Filter"
            class="rounded w-28"
            clearable
            v-model:value={this.proposalStatus}
          />
          <SearchInput
            v-model:value={this.searchInput}
            placeholder="Search"
            loading={this.pagination.loading}
          />
        </div>
        {Array.isArray(this.DataList) &&
          this.DataList.map(item => <ProposalCard key={item.id} proposalData={item} />)}
      </USpin>
    )
  }
})

export default GovernanceListPage

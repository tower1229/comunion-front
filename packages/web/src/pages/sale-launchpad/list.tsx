import { UDropdownFilter, USpin } from '@comunion/components'
import { debounce } from '@comunion/utils'
import {
  defineComponent,
  ref,
  computed,
  reactive,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import { CrowdfundingCard } from './components/CrowdfundingCard'
import CrowdfundingSkeleton from './components/CrowdfundingSkeleton'
import SearchInput from '@/components/SearchInput'
import { CrowdfundingType, CROWDFUNDING_TYPES } from '@/constants'
import { services } from '@/services'
import { SaleCrowdfundingItem } from '@/types'

const CrowdfundingList = defineComponent({
  name: 'CrowdfundingList',
  setup() {
    const searchType = ref<string | undefined>(undefined)
    const searchInput = ref<string>('')
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 24,
      total: 0,
      page: 1,
      loading: false
    })

    const dataList = ref<SaleCrowdfundingItem[]>([])
    const fetchData = async (reload?: boolean) => {
      const statusIndex = CROWDFUNDING_TYPES.indexOf(searchType.value as CrowdfundingType)
      const { error, data } = await services['SaleLaunchpad@get-sale-launchpad']({
        page: pagination.page,
        size: pagination.pageSize,
        status: statusIndex > -1 ? statusIndex : undefined,
        keyword: searchInput.value
      })
      if (!error) {
        if (reload) {
          dataList.value = data?.list || []
        } else {
          dataList.value.push(...(data?.list || []))
        }

        pagination.total = data!.total || 0
      }
    }

    const router = useRouter()

    const toDetail = (crowdfundingId: number) => {
      router.push('/sale-launchpad/' + crowdfundingId)
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
      () => searchType.value,
      () => debounceLoad(1, true)
    )

    watch(
      () => searchInput.value,
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
          if (!isLastPage.value) {
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

    return () => (
      <USpin show={pagination.loading}>
        <div class="flex mb-3 items-center">
          <div class="flex-1">
            {/* <h3 class="text-color1 u-h3">{total.value.toLocaleString()} Available</h3> */}
          </div>
          <UDropdownFilter
            options={CROWDFUNDING_TYPES.filter(item => !['Pending', 'Failure'].includes(item)).map(
              item => ({ label: item, value: item })
            )}
            placeholder="Filter"
            class="rounded mr-4 w-28"
            clearable
            v-model:value={searchType.value}
          />
          <SearchInput
            v-model:value={searchInput.value}
            placeholder="Search"
            loading={pagination.loading}
          />
        </div>
        <div class="grid pb-6 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {dataList.value.map(crowdfunding => (
            <CrowdfundingCard
              key={crowdfunding.id}
              info={crowdfunding}
              onClick={() => toDetail(crowdfunding.id)}
            />
          ))}
          {pagination.loading &&
            new Array(pagination.pageSize).fill('').map(item => <CrowdfundingSkeleton />)}
        </div>
      </USpin>
    )
  }
})

export default CrowdfundingList

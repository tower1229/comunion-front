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
import BountyCard from './components/BountyCard'
import BountySkeleton from './components/BountySkeleton'
import FilterStatus from './components/FilterStatus'
import SearchInput from '@/components/SearchInput'
import { useTags } from '@/hooks'
import { services } from '@/services'
import { useSocketStore } from '@/stores'
import { BountyListItem } from '@/types'

const BountyPage = defineComponent({
  name: 'BountyPage',
  setup() {
    const SocketStore = useSocketStore()
    const searchType = ref([])
    const searchInput = ref<string>('')
    const DataList = ref<BountyListItem[]>([])
    const pagination = reactive<{
      size: number
      total: number | undefined
      page: number
      loading: boolean
    }>({
      size: 10,
      total: 0,
      page: 1,
      loading: false
    })

    const optionsList = useTags('comer_skill')
    const ListFilters = ref<string[]>([])
    const getListFilterMap = (keys: string[]) => {
      const map: Record<string, number[]> = {
        Ongoing: [1, 2],
        Others: [3, 4]
      }
      return keys.map(key => map[key] || []).flat()
    }
    const fetchData = async (reload?: boolean) => {
      const { error, data } = await services['Bounty@get-bounties']({
        page: pagination.page,
        size: pagination.size,
        tags: searchType.value,
        keyword: searchInput.value,
        status: getListFilterMap(ListFilters.value)
      })
      if (!error) {
        if (reload) {
          DataList.value = data.list || []
        } else {
          DataList.value.push(...(data.list || []))
        }

        pagination.total = data?.total
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
      () => searchType.value,
      () => debounceLoad(1, true)
    )

    watch(
      () => searchInput.value,
      () => debounceLoad(1, true)
    )

    watch(
      () => ListFilters.value,
      () => onLoadMore(1, true)
    )

    const isLastPage = computed(() => {
      return (pagination.page || 0) * (pagination.size || 0) >= (pagination.total || 0)
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
      SocketStore.unsubscribe('startup', 1)
    })

    // socket subscribe
    SocketStore.init().then(socket => {
      console.log(socket)
      SocketStore.subscribe('bounty', 1, msg => {
        console.log('subscribe bounty list', msg)
      })
    })

    const handleTagChange = (tags: string[]) => {
      ListFilters.value = tags
    }

    return () => (
      <USpin show={pagination.loading}>
        <div class="flex mb-3 items-end">
          <div class="flex-1">
            <FilterStatus value={ListFilters.value} onChange={handleTagChange} />
          </div>
          <UDropdownFilter
            options={(optionsList.TagList.value || []).map((item: any) => ({
              label: item.name,
              value: item.name
            }))}
            multiple
            placeholder="Filter"
            class="rounded mr-4 min-w-37 w-auto"
            clearable
            v-model:value={searchType.value}
          />

          <SearchInput
            v-model:value={searchInput.value}
            placeholder="Search"
            loading={pagination.loading}
          />
        </div>
        {DataList.value.map(item => (
          <BountyCard key={item.id} info={item} />
        ))}
        {pagination.loading && new Array(pagination.size).fill('').map(item => <BountySkeleton />)}
      </USpin>
    )
  }
})

export default BountyPage

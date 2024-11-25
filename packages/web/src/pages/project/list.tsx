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
import StartupCard from './components/StartupCard'
import StartupSkeleton from './components/StartupSkeleton'
import FilterTags from './components/filterTags'
import SearchInput from '@/components/SearchInput'
import { StartupTypesType, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { useSocketStore, useGlobalConfigStore } from '@/stores'
import { StartupItem } from '@/types'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const SocketStore = useSocketStore()
    const globalConfig = useGlobalConfigStore()

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
    const TagFilters = ref<string[]>([])
    const DataList = ref<StartupItem[]>([])
    const fetchData = async (reload?: boolean) => {
      const { error, data } = await services['Startup@get-startups']({
        page: pagination.page,
        size: pagination.pageSize,
        type:
          searchType.value !== undefined
            ? STARTUP_TYPES.indexOf(searchType.value as StartupTypesType) + 1
            : undefined,
        keyword: searchInput.value,
        tags: TagFilters.value
      })
      if (!error) {
        const list = Array.isArray(data.list) ? data.list : []
        if (reload) {
          DataList.value = list as unknown as StartupItem[]
        } else {
          DataList.value.push(...(list as unknown as StartupItem[]))
        }

        pagination.total = data!.total
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
      () => onLoadMore(1, true)
    )

    watch(
      () => searchInput.value,
      () => debounceLoad(1, true)
    )

    watch(
      () => TagFilters.value,
      () => onLoadMore(1, true)
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
      SocketStore.unsubscribe('startup', 1)
    })

    // socket subscribe
    SocketStore.init().then(socket => {
      console.log(socket)
      SocketStore.subscribe('startup', 1, msg => {
        console.log('subscribe', msg)
      })
    })

    const handleTagChange = (tags: string[]) => {
      TagFilters.value = tags
    }

    return () => (
      <>
        {pagination.loading ? (
          <USpin class="top-0 right-0 bottom-0 left-0 z-50 fixed" show={true} />
        ) : null}
        <div class="flex mb-3 items-center ">
          <div class="flex-1">
            <FilterTags
              value={TagFilters.value}
              showLength={globalConfig.isLargeScreen ? 10 : 3}
              onChange={handleTagChange}
            />
          </div>
          <UDropdownFilter
            options={STARTUP_TYPES.map(item => ({ label: item, value: item }))}
            placeholder="Filter"
            class="mr-4 w-28 "
            clearable
            v-model:value={searchType.value}
            consistent-menu-width={false}
          />
          <SearchInput
            v-model:value={searchInput.value}
            placeholder="Search"
            loading={pagination.loading}
          />
        </div>

        <div class="grid pb-6 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {DataList.value.map(startup => {
            return <StartupCard startup={startup} key={startup.id} />
          })}
          {pagination.loading &&
            new Array(pagination.pageSize).fill('').map(item => <StartupSkeleton />)}
        </div>
      </>
    )
  }
})

export default StartupsPage

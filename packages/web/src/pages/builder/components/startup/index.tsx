import { UCard, UScrollList, USpin } from '@comunion/components'
import { defineComponent, reactive, ref } from 'vue'
import ListSwitcher from '../ListSwitcher'
import StartupCard from './StartupCard'
import Empty from '@/components/Empty'
import { services } from '@/services'
import { StartupItem } from '@/types'

export default defineComponent({
  props: {
    moduleCount: {
      type: Object
    },
    comerId: {
      type: Number,
      required: true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const createdByMe = ref(true)

    const pagination = reactive({
      size: 4,
      page: 1,
      keyword: undefined,
      type: undefined
    })
    const totalCount = ref(0)
    const loading = ref(false)
    const startups = ref<StartupItem[]>([])

    const getStartups = async () => {
      const { error, data } = await services['Startup@get-startups']({
        ...pagination,
        comer_id: createdByMe.value ? props.comerId : undefined,
        startup_team_comer_id: createdByMe.value ? undefined : props.comerId
      })

      loading.value = false

      if (!error) {
        startups.value.push(...(data.list || []))

        totalCount.value = data.total
      }
    }

    const toggleList = (bool: boolean) => {
      createdByMe.value = bool
      startups.value = []
      pagination.page = 1
      loading.value = true
      getStartups()
    }

    return {
      pagination,
      totalCount,
      loading,
      startups,
      getStartups,
      toggleList
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.loading = true
      this.pagination.page = p
      await this.getStartups()
    }

    return (
      <USpin show={this.loading}>
        <UCard
          title="Projects"
          class="mb-6 "
          v-slots={{
            'header-extra': () => {
              return (
                <ListSwitcher
                  moduleName="Project"
                  moduleCount={this.moduleCount}
                  onCreatedByMe={this.toggleList}
                />
              )
            }
          }}
        >
          {/* {this.startups.map(startup => (
          <StartupCard class="-mx-4" startup={startup} key={startup.id} viewMode={this.viewMode} />
        ))} */}
          <UScrollList
            class="max-h-90 <lg:-mx-5"
            triggered={this.loading}
            page={this.pagination.page}
            pageSize={this.pagination.size}
            total={this.totalCount}
            onLoadMore={onLoadMore}
          >
            {Array.isArray(this.startups) && this.startups.length > 0 ? (
              this.startups.map(item => (
                <StartupCard startup={item} key={item.id} viewMode={this.viewMode} />
              ))
            ) : (
              <Empty />
            )}
          </UScrollList>
        </UCard>
      </USpin>
    )
  }
})

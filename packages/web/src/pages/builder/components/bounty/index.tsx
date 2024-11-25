import { UCard, UScrollList, USpin } from '@comunion/components'
import { defineComponent, reactive, ref } from 'vue'
import ListSwitcher from '../ListSwitcher'
import Empty from '@/components/Empty'
import BountyCard from '@/pages/bounty/components/BountyCard'
import { services } from '@/services'

import { BountyListItem } from '@/types'

export default defineComponent({
  props: {
    moduleCount: {
      type: Object
    },
    comerId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const createdByMe = ref(true)

    const pagination = reactive({
      size: 4,
      page: 1
    })
    const totalCount = ref(0)
    const loading = ref(false)
    const bounties = ref<BountyListItem[]>([])
    const getBounties = async () => {
      const { error, data } = await services['Bounty@get-bounties']({
        ...pagination,
        founder_comer_id: createdByMe.value ? props.comerId : undefined,
        applicant_comer_id: createdByMe.value ? undefined : props.comerId
      })

      loading.value = false

      if (!error) {
        bounties.value.push(...(data!.list ?? []))

        totalCount.value = data.total
      }
    }

    const toggleList = (bool: boolean) => {
      createdByMe.value = bool
      bounties.value = []
      pagination.page = 1
      loading.value = true
      getBounties()
    }

    return {
      pagination,
      totalCount,
      loading,
      bounties,
      getBounties,
      toggleList
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.loading = true
      this.pagination.page = p
      await this.getBounties()
    }

    return (
      <USpin show={this.loading}>
        <UCard
          title="Bounty"
          class="mb-6"
          v-slots={{
            'header-extra': () => {
              return (
                <ListSwitcher
                  moduleName="Bounty"
                  moduleCount={this.moduleCount}
                  onCreatedByMe={this.toggleList}
                />
              )
            }
          }}
        >
          <UScrollList
            class="max-h-105 <lg:-mx-5"
            triggered={this.loading}
            page={this.pagination.page}
            pageSize={this.pagination.size}
            total={this.totalCount}
            onLoadMore={onLoadMore}
          >
            {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
              this.bounties.map(item => <BountyCard info={item} key={item.id} miniCard />)
            ) : (
              <Empty />
            )}
          </UScrollList>
        </UCard>
      </USpin>
    )
  }
})

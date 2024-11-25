import { UCard, UDropdownFilter } from '@comunion/components'
import { defineComponent, ref, watch, PropType } from 'vue'

import { useConnector, ConnectComerType } from './useConnector'
import { useFollowComer, FollowedComerType } from './useFollowComer'
import { useFollowedStartups, FollowedStartupType } from './useFollowedStartups'
import { useTabs } from './useTabs'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import StartupLogo from '@/components/StartupLogo'
import { ComerProfileState } from '@/types'

export default defineComponent({
  name: 'ComerConnection',
  props: {
    viewMode: {
      type: Boolean,
      default: () => false
    },
    profile: {
      type: Object as PropType<ComerProfileState>,
      require: true
    }
  },
  setup(props) {
    const tabsInstance = useTabs(props.profile)
    const followedStartups = useFollowedStartups(props.profile!.id)
    const connector = useConnector(props.profile!.id)
    const followComer = useFollowComer(props.profile!.id)
    const currentTabId = ref<string>('0')

    const loadData = (id: string, reset = false) => {
      if (id === '0') {
        if (reset) followedStartups.reset()
        followedStartups.fetchData()
      } else if (id === '1') {
        if (reset) followComer.reset()
        followComer.fetchData()
      } else if (id === '2') {
        if (reset) connector.reset()
        connector.getConnector()
      }
    }

    watch(
      () => currentTabId.value,
      id => id && loadData(id, true),
      {
        immediate: true
      }
    )

    watch(
      () => tabsInstance.value,
      tabs => {
        if (tabs[0].totalRows === 0) {
          const targetIndex = tabs.findIndex(tab => Number(tab.totalRows) > 0)
          if (targetIndex !== -1) {
            currentTabId.value = String(targetIndex)
          }
        }
      },
      {
        immediate: true
      }
    )

    return {
      followedStartups,
      followComer,
      connector,
      tabsInstance,
      currentTabId
    }
  },
  render() {
    const handleMore = () => {
      if (this.currentTabId === '0') {
        this.followedStartups.page.value += 1
        this.followedStartups.fetchData()
      } else if (this.currentTabId === '1') {
        this.followComer.page.value += 1
        this.followComer.fetchData()
      } else if (this.currentTabId === '2') {
        this.connector.page.value += 1
        this.connector.getConnector()
      }
    }

    const handleConnect = (item: any) => {
      if (this.currentTabId === '0') {
        this.followedStartups.connect(item.id, item.cb)
      } else if (this.currentTabId === '1') {
        this.followComer.connect(item.id, item.cb)
      } else if (this.currentTabId === '2') {
        this.connector.connect(item.id, item.cb)
      }
    }

    const handleUnConnect = (item: any) => {
      if (this.currentTabId === '0') {
        this.followedStartups.unconnect(item.id, item.cb)
      } else if (this.currentTabId === '1') {
        this.followComer.unconnect(item.id, item.cb)
      } else if (this.currentTabId === '2') {
        this.connector.unconnect(item.id, item.cb)
      }
    }

    const tabContents: { count: number; content?: JSX.Element }[] = [
      // project
      {
        count: this.followedStartups.list.value.length,
        content: (
          <>
            {this.followedStartups.list.value.length > 0 && (
              <>
                {this.followedStartups.list.value.map((item: FollowedStartupType) => {
                  return (
                    <BasicItem
                      class="-mx-4"
                      item={item}
                      key={item.id}
                      onConnect={handleConnect}
                      onUnconnect={handleUnConnect}
                      keyMap={{
                        follow: 'is_connected'
                      }}
                      v-slots={{
                        avatar: () => (
                          <div
                            class="cursor-pointer flex h-12 w-12 items-center overflow-hidden"
                            onClick={() => this.$router.push(`/project/${item.id}`)}
                          >
                            <StartupLogo src={item?.avatar || item?.logo || ''} />
                          </div>
                        )
                      }}
                    />
                  )
                })}
              </>
            )}
            {this.followedStartups.total.value > 5 && (
              <div class="flex mt-5 justify-center">
                <LoadingBtn
                  onMore={handleMore}
                  end={this.followedStartups.list.value.length >= this.followedStartups.total.value}
                  v-slots={{
                    text: () => {
                      return `More(${this.tabsInstance[0].totalRows})`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      },
      // comer
      {
        count: this.followComer.list.value.length,
        content: (
          <>
            {this.followComer.list.value.length > 0 && (
              <>
                {this.followComer.list.value.map((item: FollowedComerType) => {
                  return (
                    <BasicItem
                      class="-mx-4"
                      key={item.id}
                      item={item}
                      onConnect={handleConnect}
                      onUnconnect={handleUnConnect}
                      keyMap={{
                        follow: 'is_connected'
                      }}
                      v-slots={{
                        avatar: () => (
                          <div
                            class="cursor-pointer flex h-9 w-9 "
                            onClick={() =>
                              this.$router.push({ path: '/builder', query: { id: item.id } })
                            }
                          >
                            <StartupLogo src={item?.avatar || item?.logo || ''} />
                          </div>
                        )
                      }}
                    />
                  )
                })}
              </>
            )}
            {this.followComer.total.value > 5 && (
              <div class="flex mt-5 justify-center">
                <LoadingBtn
                  onMore={handleMore}
                  end={this.followComer.list.value.length >= this.followComer.total.value}
                  v-slots={{
                    text: () => {
                      return `More(${this.tabsInstance[1].totalRows})`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      },
      // connector
      {
        count: this.connector.list.value.length,
        content: (
          <>
            {this.connector.list.value.length > 0 && (
              <>
                {this.connector.list.value.map((item: ConnectComerType) => {
                  return (
                    <BasicItem
                      class="-mx-4"
                      key={item.id}
                      item={item}
                      onConnect={handleConnect}
                      onUnconnect={handleUnConnect}
                      keyMap={{
                        follow: 'is_connected'
                      }}
                      v-slots={{
                        avatar: () => (
                          <div
                            class="cursor-pointer flex h-9 w-9 items-center overflow-hidden"
                            onClick={() =>
                              this.$router.push({ path: '/builder', query: { id: item.id } })
                            }
                          >
                            <StartupLogo src={item?.avatar || item?.logo || ''} />
                          </div>
                        )
                      }}
                    />
                  )
                })}
              </>
            )}
            {this.connector.total.value > 5 && (
              <div class="flex mt-5 justify-center">
                <LoadingBtn
                  onMore={handleMore}
                  end={this.connector.list.value.length >= this.connector.total.value}
                  v-slots={{
                    text: () => {
                      return `More(${this.tabsInstance[2].totalRows})`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      }
    ]

    return !this.viewMode ||
      this.tabsInstance.filter((item: any) => item.totalRows > 0).length > 0 ? (
      <UCard
        title="Connected"
        class="mb-6"
        v-slots={{
          'header-extra': () => {
            return (
              <UDropdownFilter
                options={this.tabsInstance.map(item => ({
                  label: `${item.title}`,
                  value: item.id
                }))}
                placeholder="Filter"
                class="w-28"
                v-model:value={this.currentTabId}
                consistent-menu-width={false}
              />
            )
          }
        }}
      >
        {tabContents[Number(this.currentTabId)] && tabContents[Number(this.currentTabId)].content}
      </UCard>
    ) : null
  }
})

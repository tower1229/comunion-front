import {
  ULazyImage,
  UPaginatedList,
  UPaginatedListPropsType,
  message,
  UModal,
  UCard,
  UButton
} from '@comunion/components'
import { DeleteFilled, PenOutlined, SettingOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, ref, computed, toRaw, provide } from 'vue'
import AddGroupDialog from './addGroupDialog'
import AddTeamMember from './addTeamMember'
import AddTeamMemberDialog, { editComerData } from './addTeamMemberDialog'
import defaultAvatar from './assets/avatar.png?url'
import './style.css'
import { ModuleTags } from '@/components/Tags'
import { useGroup } from '@/pages/project/hooks/useGroup'
import { ServiceReturn, services } from '@/services'
import { useUserStore } from '@/stores'
import { ComerBasicResponse } from '@/types'

type ListType = NonNullable<ServiceReturn<'Startup@get-startup-team'>>['list']

export default defineComponent({
  name: 'TeamSetting',
  props: {
    startup_id: {
      type: Number,
      required: true
    },
    founderId: {
      type: Number
    }
  },
  setup(props) {
    const userStore = useUserStore()
    const teamGroup = useGroup()
    const updateGroupList = () => {
      teamGroup.get(props.startup_id)
    }
    updateGroupList()

    // current group
    const currentGroup = ref()

    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        const { error, data } = await services['Startup@get-startup-team']({
          startup_id: props.startup_id,
          startup_team_group_id: currentGroup.value || undefined,
          size: pageSize,
          page
        })
        return { items: error ? [] : data!.list || [], total: error ? 0 : data.total }
      }
    )

    const addGroupVisible = ref<boolean>(false)

    const groupList = computed(() => {
      return [
        {
          id: 0,
          name: 'All',
          comer_id: undefined,
          startup_id: undefined
        },
        ...toRaw(teamGroup.group.value)
      ]
    })

    provide('group', groupList)

    // member edit
    const editMemberProfile = ref<editComerData>()
    const editMemberVisible = ref(false)
    const refreshMark = ref(true)
    const updateMemberList = () => {
      refreshMark.value = false
      setTimeout(() => {
        refreshMark.value = true
      })
    }

    const handleCreateComer = (newProfile: ComerBasicResponse) => {
      console.warn(newProfile)
      editMemberProfile.value = {
        avatar: newProfile.avatar,
        name: newProfile.name,
        comer_id: newProfile.id,
        startup_team_group_id: 0,
        position: ''
      }
      editMemberVisible.value = true
    }

    // showDeleteDialog
    const showDeleteDialog = ref<boolean>(false)
    const deleteItem = ref<any>(null)
    const showDeleteLoading = ref<boolean>(false)

    const handleMemberAction = (type: string, item: editComerData) => {
      // member act
      if (type === 'del') {
        showDeleteLoading.value = true
        services['Startup@delete-comer-of-startup-team']({
          startup_id: props.startup_id,
          startup_team_comer_id: item.comer_id
        }).then(res => {
          if (!res.error) {
            message.success('successfully deleted')
            updateMemberList()
            deleteItem.value = null
            showDeleteDialog.value = false
            showDeleteLoading.value = false
          }
        })
      } else if (type === 'edit') {
        editMemberProfile.value = item
        editMemberVisible.value = true
      }
    }

    const isFounder = computed(() => {
      return userStore.profile?.id === props.founderId
    })

    return {
      startup_id: props.startup_id,
      founderId: props.founderId,
      isFounder,
      group: groupList,
      dataService,
      addGroupVisible,
      updateGroupList,
      currentGroup,
      editMemberProfile,
      editMemberVisible,
      updateMemberList,
      handleCreateComer,
      handleMemberAction,
      refreshMark,
      showDeleteDialog,
      deleteItem,
      showDeleteLoading
    }
  },
  render() {
    const handleToggleGroup = (selectedList: string[]) => {
      const selectGroupName = selectedList[0]
      const selectGroupIndex = this.group.findIndex(group => group.name === selectGroupName)
      if (selectGroupIndex !== -1) {
        this.currentGroup = this.group[selectGroupIndex].id
        console.warn('currentGroup', this.currentGroup)
      }
    }

    return (
      <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
        <AddTeamMember
          startup_id={this.startup_id}
          group={this.group}
          onTriggerNewComer={this.handleCreateComer}
        />
        <AddTeamMemberDialog
          startup_id={this.startup_id}
          comer={this.editMemberProfile}
          visible={this.editMemberVisible}
          onTriggerDialog={() => (this.editMemberVisible = false)}
          onTriggerActionDone={this.updateMemberList}
        />
        <div class="flex mb-8 items-center">
          <ModuleTags
            radio
            tasks={this.group.map(e => e.name)}
            onSelectedChange={handleToggleGroup}
          />
          <div
            class="cursor-pointer flex h-4 ml-2 w-4"
            onClick={() => (this.addGroupVisible = !this.addGroupVisible)}
          >
            <SettingOutlined class="w-full text-color3 hover:text-[#5331F4]" />
          </div>
          <AddGroupDialog
            group={this.group}
            visible={this.addGroupVisible}
            startup_id={this.startup_id}
            onTriggerDialog={() => (this.addGroupVisible = !this.addGroupVisible)}
            onTriggerUpdate={this.updateGroupList}
          />
        </div>
        {this.refreshMark && (
          <UPaginatedList
            service={this.dataService}
            children={({ dataSource: list }: { dataSource: ListType }) => {
              return (
                <div class="flex flex-col">
                  {list.map((item: any) => (
                    <div
                      class={`rounded-sm flex justify-between items-center cursor-pointer startup-team-list p-4 hover:bg-color-hover`}
                    >
                      <div
                        class="flex w-1/2 items-center"
                        onClick={() => {
                          this.$router.push({ path: '/builder', query: { id: item.comer_id } })
                        }}
                      >
                        <ULazyImage
                          class="rounded-1/2 h-12 w-12"
                          src={item.comer.avatar || defaultAvatar}
                        />
                        <div class="flex flex-col ml-4">
                          <p class="text-color1 u-h4">{item.comer.name}</p>
                          <p class="text-color3 truncate u-h7 ">
                            <span>{item.position || ''}</span>
                          </p>
                        </div>
                      </div>

                      {item.created_at && (
                        <div class="text-color3 u-h6">
                          Join {dayjs(new Date(Number(item.created_at))).format('MMMM D, YYYY')}
                        </div>
                      )}
                      {this.isFounder ? (
                        <p class={` text-color3 w-15 change`}>
                          <PenOutlined
                            class=" h-4 mr-4 w-4 hover:text-primary"
                            onClick={() => this.handleMemberAction('edit', item)}
                          />
                          {this.founderId !== item.comer_id && (
                            <DeleteFilled
                              class=" h-4 w-4 hover:text-primary"
                              onClick={() => {
                                this.deleteItem = item
                                this.showDeleteDialog = true
                              }}
                            />
                          )}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )
            }}
          />
        )}
        {/* delete confirm */}
        <UModal v-model:show={this.showDeleteDialog} mask-closable={false}>
          <UCard
            style={{ width: '540px', '--n-title-text-color': '#000' }}
            size="huge"
            closable={true}
            onClose={() => (this.showDeleteDialog = false)}
            title="Remove team members"
          >
            <div class="min-h-20 text-color2 u-h6">
              Are you sure you want to remove "{this.deleteItem?.comerName}" from the team list?
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (this.showDeleteDialog = false)}
              >
                Cancel
              </UButton>
              <UButton
                type="primary"
                class="w-41"
                loading={this.showDeleteLoading}
                onClick={() => this.handleMemberAction('del', this.deleteItem)}
              >
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

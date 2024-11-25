import { UButton, UCard, UInput, UModal } from '@comunion/components'
import { DeleteFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, watch, PropType } from 'vue'
import { services } from '@/services'
import { StartupTeamGroup } from '@/types'

type StartupTeamGroupExt = StartupTeamGroup & {
  delete?: boolean
}

export default defineComponent({
  name: 'addGroupDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    group: {
      type: Object as PropType<StartupTeamGroupExt[]>
    },
    startup_id: {
      type: Number,
      required: true
    }
  },
  setup(props, ctx) {
    const list = ref<StartupTeamGroupExt[]>([])

    watch(
      () => props.group,
      () => {
        list.value = [...(props.group || [])]
      },
      {
        immediate: true
      }
    )

    const closeDialog = () => {
      ctx.emit('triggerDialog')
      list.value = [...(props.group || [])]
    }

    return {
      list,
      startup_id: props.startup_id,
      closeDialog
    }
  },
  emits: ['triggerDialog', 'triggerUpdate'],
  render() {
    const userBehavier = (type: string) => () => {
      if (type === 'cancel') {
        return this.closeDialog()
      }
      if (!this.startup_id) {
        return console.warn('this.startup_id is missing')
      }

      const saveList = this.list.filter(e => {
        return !e.delete && e.name.trim().length && e.name !== 'All'
      })
      console.log('saveList', saveList)
      services['Startup@save-startup-team-group']({
        startup_id: this.startup_id,
        groups: saveList.map(group => {
          return {
            start_team_group_id: group.id || undefined,
            name: group.name
          }
        })
      }).then(res => {
        console.log('saveList res =', res)
        if (!res.error) {
          this.closeDialog()
          this.$emit('triggerUpdate')
        }
      })
    }

    const addGroup = () => {
      this.list.push({ id: 0, name: '', comer_id: 0, startup_id: 0 })
    }

    const removeGroup = (index: number) => () => {
      // this.list.splice(index, 1)
      const currentList = this.list.filter(e => e.name !== 'All' && !e.delete)
      currentList[index]['delete'] = true
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style={{ width: '400px', '--n-title-text-color': '#000' }}
          title="Group management"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={userBehavier('cancel')}
        >
          <>
            <div class="h-9.5 w-full"></div>
            {this.list
              .filter(e => e.name !== 'All' && !e.delete)
              .map((group, index) => (
                <div class="flex mb-4 items-center">
                  <UInput
                    placeholder="Group Name"
                    v-model:value={group.name}
                    maxlength={200}
                    v-slots={{
                      suffix: () =>
                        this.list.length > 1 && group.name.trim().length ? (
                          <DeleteFilled
                            class="cursor-pointer h-3 ml-4.5 text-color3 w-3"
                            onClick={removeGroup(index)}
                          />
                        ) : null
                    }}
                  />
                </div>
              ))}
            <UButton dashed class="w-full u-h5" onClick={addGroup}>
              <span class="flex text-color3 items-center u-h5">
                <PlusOutlined class="h-4 mr-3 w-4" />
                Add
              </span>
            </UButton>
            <div class="flex mt-10 justify-end">
              <UButton class="w-40" type="primary" onClick={userBehavier('submit')} size="small">
                Save
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})

import { defineComponent, computed, onMounted, nextTick } from 'vue'
import { ModuleTags } from '@/components/Tags'
import { startupSortItemList } from '@/pages/project/setting/components/sequence/BasicSortable'

export default defineComponent({
  props: {
    tabSequence: {
      type: String,
      default: ''
    }
  },
  emits: ['selectedTagChange'],
  setup(props, ctx) {
    const tasksList = computed<string[]>(() => {
      const _tabSequence = props.tabSequence
        ? props.tabSequence.split(',').map(n => Number(n))
        : [2, 3, 4, 5]
      return _tabSequence.map(value => {
        const targetIndex = startupSortItemList.findIndex(item => item.id === value)
        if (targetIndex !== -1) {
          return startupSortItemList[targetIndex].name
        }
        return ''
      })
    })

    const tasks = computed(() => {
      return ['All', ...tasksList.value.filter(item => !!item)]
    })

    onMounted(() => {
      nextTick(() => {
        ctx.emit('selectedTagChange', ['All'])
      })
    })

    return {
      tasks
    }
  },
  render() {
    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }
    return (
      <div class="bg-white border rounded-sm mb-6 p-6 relative overflow-hidden">
        <ModuleTags tasks={this.tasks} onSelectedChange={handleSelectedChange} />
      </div>
    )
  }
})

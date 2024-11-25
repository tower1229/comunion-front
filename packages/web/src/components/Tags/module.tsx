import { defineComponent, ref, computed, PropType } from 'vue'

export default defineComponent({
  props: {
    tasks: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    },
    radio: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const selectedList = ref<string[]>(['All'])
    const taskList = computed(() => {
      return props.tasks.map(task => {
        const targetIndex = selectedList.value.findIndex(item => item === task)

        return {
          value: task,
          class: `box-content h-7 leading-7 rounded-sm  mr-2 min-w-4 px-4  cursor-pointer border border-color-border text-color2 u-h6 hover:text-color1 ${
            targetIndex !== -1 ? 'text-color1' : ''
          }`,
          active: targetIndex !== -1
        }
      })
    })

    return {
      selectedList,
      taskList,
      radio: props.radio
    }
  },
  emits: ['selectedChange'],
  render() {
    const handleTag = (key: string) => () => {
      if (key === 'All') {
        this.selectedList = ['All']
        this.$emit('selectedChange', this.selectedList)
        return
      }
      const index = this.selectedList.findIndex(value => {
        return value === key
      })
      if (index > -1) {
        this.selectedList.splice(index, 1)
        if (this.selectedList.length === 0) {
          this.selectedList = ['All']
        }
        this.$emit('selectedChange', this.selectedList)
        return
      }
      const allIndex = this.selectedList.findIndex(value => value === 'All')
      if (allIndex > -1) {
        this.selectedList.splice(allIndex, 1)
      }
      if (this.radio) {
        // single mode
        this.selectedList = [key]
      } else {
        // multi mode
        this.selectedList.push(key)
      }

      this.$emit('selectedChange', this.selectedList)
    }
    return (
      <div class="flex w-auto">
        {this.taskList.map(task => {
          return (
            // style={task.active ? { borderRadius: 'rgba(83, 49, 244, 0.1)' } : {}}
            <div
              class={`${task.class} ${task.active ? '!text-color1' : ''}`}
              onClick={handleTag(task.value)}
            >
              {task.value}
            </div>
          )
        })}
      </div>
    )
  }
})

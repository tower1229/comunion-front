import { defineComponent, ref, computed, PropType, watch } from 'vue'

export default defineComponent({
  name: 'ListSwitcher',
  props: {
    moduleCount: {
      type: Object as PropType<any>,
      required: true
    },
    moduleName: {
      type: String,
      required: true
    }
  },
  emits: ['createdByMe'],
  setup(props, ctx) {
    const noPostedCount = computed(() => {
      return (
        (props.moduleName === 'Project' && props.moduleCount.postedCount.startup_count === 0) ||
        (props.moduleName === 'Bounty' && props.moduleCount.postedCount.bounty_count === 0) ||
        (props.moduleName === 'Launchpad' &&
          props.moduleCount.postedCount.crowdfunding_count === 0) ||
        (props.moduleName === 'Proposal' && props.moduleCount.postedCount.governance_count === 0)
      )
    })

    const currentIndex = ref<number>(0)

    watch(
      () => noPostedCount.value,
      () => {
        currentIndex.value = noPostedCount.value ? 1 : 0
        ctx.emit('createdByMe', currentIndex.value === 0)
      },
      {
        immediate: true
      }
    )

    const list = ref(['Created', 'Participated'])
    const handleClick = (index: number) => {
      if (currentIndex.value !== index) {
        currentIndex.value = index
        ctx.emit('createdByMe', currentIndex.value === 0)
      }
    }

    return {
      currentIndex,
      list,
      handleClick
    }
  },
  render() {
    return (
      <div class="flex gap-4">
        {this.list.map((item, index) => (
          <span
            class={`cursor-pointer u-h6 hover:text-color1 ${
              this.currentIndex === index ? 'text-color1' : 'text-color3'
            }`}
            onClick={() => this.handleClick(index)}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
})

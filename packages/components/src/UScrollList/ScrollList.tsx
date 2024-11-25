import type { PropType } from 'vue'
import { defineComponent, toRefs, computed } from 'vue'

import './index.css'

export const UScrollListProps = {
  pageSize: {
    type: Number,
    required: true,
    default: 20
  },
  page: {
    type: Number,
    required: true,
    default: 1
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  // load more states
  triggered: {
    type: Boolean,
    required: true,
    default: false
  },
  onLoadMore: {
    type: Function as PropType<(page: number) => void>,
    required: true
  },
  // Trigger to load more threshold
  triggerThreshold: {
    type: Number,
    default: 60
  },
  loadingText: String,
  noMoreText: String
} as const

export type UScrollListPropsType = typeof UScrollListProps

const UScrollList = defineComponent({
  name: 'UScrollList',
  props: UScrollListProps,
  setup(props, { slots, attrs }) {
    const { total, page, pageSize, triggerThreshold, onLoadMore } = toRefs(props)

    const isLastPage = computed(() => {
      return (page.value || 0) * (pageSize.value || 0) >= (total.value || 0)
    })

    const onWarpperScroll = (e: UIEvent) => {
      const el = e.target as Element
      const invisibleSize = el.scrollHeight - el.clientHeight

      const threshold = triggerThreshold?.value
      if (invisibleSize - el.scrollTop < threshold) {
        if (!isLastPage.value) {
          onLoadMore.value!(page.value + 1)
        }
      }
    }

    return () => {
      return (
        <div class={`u-scroll-list ${attrs?.class || ''}`} onScroll={onWarpperScroll}>
          {slots.default?.()}
        </div>
      )
    }
  }
})

export default UScrollList

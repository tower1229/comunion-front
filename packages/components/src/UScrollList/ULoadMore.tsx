import { NSpin } from 'naive-ui'
import { defineComponent, toRefs } from 'vue'

import './index.css'

const scrollListProps = {
  loading: {
    type: Boolean,
    default: false
  },
  noMore: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 60
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  noMoreText: {
    type: String,
    default: 'No more data'
  }
} as const

export type UScrollListProps = typeof scrollListProps

const ULoadMore = defineComponent({
  props: scrollListProps,
  setup(props) {
    const { loadingText, noMoreText, noMore, loading, height } = toRefs(props)

    return () => {
      if (noMore?.value === true) {
        return (
          <div
            style={{
              height: `${height?.value}px`
            }}
            class="flex flex-row items-center justify-center"
          >
            <div class="flex flex-row items-center justify-center">
              <span class="ml-8px text-color2 ">{noMoreText?.value}</span>
            </div>
          </div>
        )
      }

      return (
        <div
          style={{
            height: loading?.value === true ? `${height?.value}px` : 0,
            overflow: 'hidden'
          }}
          class="flex flex-row items-center justify-center"
        >
          <div class="flex flex-row items-center justify-center">
            <NSpin size="small" />
            <span class="ml-16px text-color2 ">{loadingText?.value}</span>
          </div>
        </div>
      )
    }
  }
})

export default ULoadMore

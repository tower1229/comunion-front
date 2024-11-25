import { UScrollbar } from '@comunion/components'
import { defineComponent, computed, ref } from 'vue'
import Copy from '@/components/Copy'
import './paragraph.css'
export default defineComponent({
  name: 'paragraph',
  props: {
    label: {
      type: String,
      required: true
    },
    content: {
      type: String,
      requred: true
    },
    foldAble: {
      type: Boolean,
      required: false,
      default: () => false
    },
    fold: {
      type: Boolean,
      required: false,
      default: () => false
    },
    contentClass: {
      type: String,
      required: false,
      default: () => 'text-primary2'
    },
    maxHeight: {
      type: Number,
      default: () => 120
    },
    pasteboard: {
      type: Boolean,
      default: () => false
    },
    isLink: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, ctx) {
    const contentClass = computed(() => {
      return `u-h5 ${props.contentClass}`
    })

    const foldClass = computed(() => {
      const str = 'whitespace-pre-wrap break-all overflow-hidden'
      if (props.fold) {
        return `${str} overflow-ellipsis line-clamp-3 ${contentClass.value}`
      }
      return `${str} ${contentClass.value}`
    })

    const showTooltipRef = ref<boolean>(false)
    const ele = ref<any>()

    ctx.expose({
      ele
    })

    const handleClick = () => {
      if (props.isLink) {
        window.open(props.content)
      }
    }

    return {
      contentClass,
      foldClass,
      showTooltipRef,
      ele,
      handleClick
    }
  },
  render() {
    return (
      <div class="flex">
        <div class=" max-w-1/2 text-color1 w-42 ">{this.label}</div>
        <div class=" flex-1 overflow-hidden">
          {this.foldAble ? (
            // style={{
            //   maxHeight: `${this.maxHeight}px`
            // }}
            <UScrollbar>
              <p
                class={this.foldClass}
                ref={(ref: any) => (this.ele = ref)}
                v-html={this.content}
              />
            </UScrollbar>
          ) : (
            <p
              class={`${this.contentClass} ${this.isLink ? 'cursor-pointer' : ''}`}
              onClick={this.handleClick}
            >
              {this.content}
              {this.pasteboard ? <Copy content={this.content || ''} /> : null}
            </p>
          )}
        </div>
      </div>
    )
  }
})

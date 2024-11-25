import type { PropType, VNode, ExtractPropTypes } from 'vue'
import { defineComponent } from 'vue'
import { UEllipsis } from '../UEllipsis'
import './index.css'

export interface UDescriptionItem {
  label: string
  content: string | number | VNode
}

export const UDescriptionProps = {
  items: {
    type: Array as PropType<UDescriptionItem[]>,
    required: true
  },
  // how columns a row
  cols: {
    type: Number,
    default: 1
  },
  labelWidth: {
    type: String,
    default: `148px`
  },
  // shoule ad colon after label
  colon: {
    type: Boolean,
    default: true
  },
  // should upper case label text
  upperCase: {
    type: Boolean,
    default: true
  },
  // should content auto wrap to next line
  contentWrap: {
    type: Boolean,
    default: true
  }
} as const

export type UDescriptionPropsType = ExtractPropTypes<typeof UDescriptionProps>

const UDescription = defineComponent({
  name: 'UDescription',
  props: UDescriptionProps,
  setup(props, ctx) {
    return () => (
      <div class="u-description">
        {props.items.map((item, index) => {
          let labelNode: VNode | string | number
          switch (typeof item.content) {
            case 'string':
              labelNode = <UEllipsis>{item.content}</UEllipsis>
              break
            case 'number':
              labelNode = <span>{item.content.toLocaleString()}</span>
              break
            default:
              labelNode = item.content
          }

          return (
            <div
              class="u-description-item"
              key={index}
              style={{
                width: `${100 / props.cols}%`,
                textTransform: props.upperCase ? 'uppercase' : 'none',
                flexWrap: props.contentWrap ? 'wrap' : 'nowrap',
                paddingLeft: props.cols > 1 && index % props.cols > 0 ? '8px' : '0',
                paddingRight: props.cols > 1 && index % props.cols < props.cols - 1 ? '8px' : '0'
              }}
            >
              <div class="u-description-item__label" style={{ width: props.labelWidth }}>
                {item.label}
                {props.colon && ':'}
              </div>
              <div
                class="u-description-item__content"
                style={{
                  overflow: props.contentWrap ? 'visible' : 'hidden'
                }}
              >
                {labelNode}
              </div>
            </div>
          )
        })}
        {ctx.slots.default?.()}
      </div>
    )
  }
})

export default UDescription

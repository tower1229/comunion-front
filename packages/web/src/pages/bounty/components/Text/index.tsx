import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: () => '0'
    },
    enhance: {
      type: Number,
      default: () => 24
    },
    unit: {
      type: String,
      default: () => ''
    },
    plus: {
      type: Boolean,
      default: () => false
    },
    half: {
      type: Boolean,
      default: () => false
    },
    textColor: {
      type: String,
      default: 'text-primary'
    },
    digit: {
      type: Number,
      default: 0
    },
    unitClass: {
      type: String
    }
  },
  setup(props) {
    const prefix = computed(() => {
      return props.plus ? (
        <span
          class="font-sans font-normal right-full bottom-1 text-[24px] absolute"
          data-name="placeholder"
        >
          +
        </span>
      ) : null
    })

    const formatText = computed(() => {
      const isDecimals = props.value.includes('.')
      const valueLength = props.value.replace('.', '').length
      let remainingStr = ''
      if (props.digit > valueLength) {
        const remaining = props.digit - valueLength
        remainingStr = new Array(remaining).fill('0').join('')
      }

      return (
        // text-warning
        <strong
          class=" leading-none px-1 text-9 truncate relative"
          style={{ fontSize: `${props.enhance}px` }}
        >
          {prefix.value}
          {props.value}
          {isDecimals ? '' : '.'}
          {remainingStr}
        </strong>
      )
    })

    return {
      formatText
    }
  },
  render() {
    const colorClass = this.value === '0' ? 'text-grey5' : this.textColor
    return (
      <p class={`text-primary align-text-bottom ${this.plus ? 'pl-4' : ''} ${colorClass}`}>
        {this.formatText}
        {<span class={`text-[12px] truncate ${this.unitClass}`}>{this.unit}</span>}
      </p>
    )
  }
})

import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import './back.css'

export const UBackProps = {
  onClick: {
    type: Function,
    default: window.history.back
  }
}

const UBack = defineComponent({
  name: 'UBack',
  props: UBackProps,
  setup(props, { slots }) {
    return () => (
      <div class="u-back" onClick={props.onClick?.()}>
        <ArrowRightOutlined class="u-back__icon" />
        <div class="u-back__text">{slots.default?.() ?? 'BACK'}</div>
      </div>
    )
  }
})

export default UBack

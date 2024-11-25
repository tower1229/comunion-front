import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import './index.css'

export default defineComponent({
  name: 'UViewMore',
  setup(props, { slots }) {
    return () => (
      <div class="u-view-more">
        <div>{slots.default?.() ?? 'View more'}</div>
        <ArrowRightOutlined class="u-view-more__icon" />
      </div>
    )
  }
})

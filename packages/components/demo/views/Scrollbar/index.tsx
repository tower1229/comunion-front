import { defineComponent } from 'vue'
import { UScrollbar } from '@/comps/index'

const ScrollbarDemoPage = defineComponent({
  name: 'ScrollbarDemoPage',
  setup() {
    return () => (
      <UScrollbar style={{ maxHeight: '120px' }}>
        1<br />
        2<br />
        3<br />
        4<br />
        5<br />
        6<br />
        7<br />
        8<br />
        9<br />
        10
        <br />
        11
        <br />
        12
        <br />
        13
        <br />
        14
        <br />
        15
        <br />
      </UScrollbar>
    )
  }
})

export default ScrollbarDemoPage

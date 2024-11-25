import { NDropdown, DropdownProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UPopupPropsType = DropdownProps

const UPopupMenu = defineComponent({
  name: 'UPopupMenu',
  // props: {
  //   trigger: {
  //     type: String as PropType<PopoverTrigger>,
  //     default: 'click'
  //   },
  //   size: {
  //     type: String as PropType<'small' | 'medium' | 'large'>,
  //     default: 'medium'
  //   }
  // },
  extends: NDropdown,
  setup(props, ctx) {
    return () => <NDropdown {...props} class="u-popup-menu" v-slots={ctx.slots} />
  }
})

export default UPopupMenu

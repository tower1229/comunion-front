import { BreadcrumbProps, NBreadcrumb } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UBreadcrumbPropsType = BreadcrumbProps

const UBreadcrumb = defineComponent({
  name: 'UBreadcrumb',
  extends: NBreadcrumb,
  setup(props, ctx) {
    return () => <NBreadcrumb {...props} class="u-breadcrumb" v-slots={ctx.slots} />
  }
})

export default UBreadcrumb

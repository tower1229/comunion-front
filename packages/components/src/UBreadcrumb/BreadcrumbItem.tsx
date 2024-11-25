import { BreadcrumbItemProps, NBreadcrumbItem } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UBreadcrumbItemPropsType = BreadcrumbItemProps

const UBreadcrumbItem = defineComponent({
  name: 'UBreadcrumbItem',
  extends: NBreadcrumbItem,
  setup(props, ctx) {
    return () => <NBreadcrumbItem {...props} class="u-breadcrumb-item" v-slots={ctx.slots} />
  }
})

export default UBreadcrumbItem

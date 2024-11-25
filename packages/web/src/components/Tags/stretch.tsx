import { UTag } from '@comunion/components'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    count: {
      type: Number,
      default: () => 3
    },
    tags: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  render() {
    return (
      <>
        {this.tags.slice(0, this.count + 1).map((value, $index) => {
          return $index + 1 < this.count + 1 && <UTag key={value}>{value}</UTag>
        })}

        {this.tags.length - this.count > 1 ? <UTag>+ {this.tags.length - this.count}</UTag> : null}
      </>
    )
  }
})

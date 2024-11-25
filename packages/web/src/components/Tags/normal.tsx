import { UTag } from '@comunion/components'
import { defineComponent, computed, PropType } from 'vue'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'

export default defineComponent({
  props: {
    mode: {
      type: Number,
      requred: true,
      default: () => 0
    },
    type: {
      type: String as PropType<'filled' | 'outlined'>,
      default: () => 'filled'
    }
  },
  setup(props) {
    const modeName = computed(() => getStartupTypeFromNumber(props.mode) as StartupTypesType)

    return {
      modeName
    }
  },
  render() {
    return (
      <UTag type={this.type} bgColor={STARTUP_TYPES_COLOR_MAP[this.modeName]}>
        {this.modeName}
      </UTag>
    )
  }
})

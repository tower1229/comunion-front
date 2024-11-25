import { NSelect } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import { DEFAULT_STARTUP_TAGS, SelectOption } from '../constants'
import useLimitTags from './tag.select'

const StartupTags = defineComponent({
  name: 'StartupTags',
  inheritAttrs: true,
  extends: NSelect,
  props: {
    value: {
      type: Array as PropType<string[]>
    },
    placeholder: {
      type: String,
      default: 'Choose your project tag'
    },
    tagLimit: {
      type: Number,
      default: 8
    },
    charLimit: {
      type: Number,
      default: 16
    },
    options: {
      type: Array as PropType<SelectOption[]>
    }
  },
  setup(props) {
    const { options, inputProps, onSearch } = useLimitTags(props, DEFAULT_STARTUP_TAGS)
    return () => (
      <NSelect
        {...props}
        consistentMenuWidth={false}
        clearable
        maxTagCount="responsive"
        multiple
        options={options.value}
        tag
        filterable
        onSearch={onSearch}
        inputProps={inputProps.value}
      />
    )
  }
})

export default StartupTags

import { defineComponent, ExtractPropTypes, onMounted, ref, onUnmounted } from 'vue'
import Editor from './Editor'

export const UMarkdownProps = {
  value: {
    type: String
  },
  placeholder: {
    type: String
  }
} as const

export type UMarkdownPropsType = ExtractPropTypes<typeof UMarkdownProps>

const UMarkdown = defineComponent({
  name: 'UMarkdown',
  props: UMarkdownProps,
  emits: ['update:value'],
  setup(props, ctx) {
    const elRef = ref<HTMLDivElement>()
    const editorRef = ref<Editor>()

    onMounted(() => {
      editorRef.value = new Editor(elRef.value!, {
        placeholder: props.placeholder,
        onChange: v => {
          ctx.emit('update:value', v)
        }
      })
      if (props.value) {
        editorRef.value.setValue(props.value)
      }
    })

    onUnmounted(() => {
      editorRef.value?.dispose()
    })

    return () => <div ref={elRef} />
  }
})

export default UMarkdown

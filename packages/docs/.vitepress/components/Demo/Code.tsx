import { defineComponent, ref, onMounted } from 'vue'
import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index'

loadLanguages(['typescript', 'tsx'])
// import Prism from 'prismjs'
// import hljs from 'highlight.js/lib/core'
// import typescript from 'highlight.js/lib/languages/typescript'
// hljs.registerLanguage('typescript', typescript)
// import 'highlight.js/styles/atom-one-dark.css'

const Code = defineComponent({
  name: 'Code',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const codeRef = ref()

    onMounted(() => {
      // hljs.highlightElement(codeRef.value)
      // Prism.highlightElement(codeRef.value)
    })

    return () => (
      <pre class="__demo-code">
        <code
          class="language-tsx"
          ref={codeRef}
          innerHTML={prism.highlight(props.code, prism.languages.tsx, 'tsx')}
        ></code>
      </pre>
    )
  }
})

export default Code

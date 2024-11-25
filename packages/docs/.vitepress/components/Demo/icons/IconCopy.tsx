import { ref, defineComponent } from 'vue'

const IconCopy = defineComponent({
  name: 'IconCopy',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const copied = ref(false)

    const copyCode = () => {
      navigator.clipboard.writeText(props.code)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 3 * 1000)
    }

    return () =>
      copied.value ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19L21 7l-1.4-1.4L9 16.2z" fill="#1bca45" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 512 512"
          onClick={copyCode}
        >
          <title>Copy demo code</title>
          <path
            d="M296 48H176.5C154.4 48 136 65.4 136 87.5V96h-7.5C106.4 96 88 113.4 88 135.5v288c0 22.1 18.4 40.5 40.5 40.5h208c22.1 0 39.5-18.4 39.5-40.5V416h8.5c22.1 0 39.5-18.4 39.5-40.5V176L296 48zm0 44.6l83.4 83.4H296V92.6zm48 330.9c0 4.7-3.4 8.5-7.5 8.5h-208c-4.4 0-8.5-4.1-8.5-8.5v-288c0-4.1 3.8-7.5 8.5-7.5h7.5v255.5c0 22.1 10.4 32.5 32.5 32.5H344v7.5zm48-48c0 4.7-3.4 8.5-7.5 8.5h-208c-4.4 0-8.5-4.1-8.5-8.5v-288c0-4.1 3.8-7.5 8.5-7.5H264v128h128v167.5z"
            fill="currentColor"
          />
        </svg>
      )
  }
})

export default IconCopy

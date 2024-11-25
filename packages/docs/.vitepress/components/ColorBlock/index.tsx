import { defineComponent } from 'vue'

const ColorBlock = defineComponent({
  name: 'ColorBlock',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return () => (
      <div class="border rounded-lg border-grey-5 mr-5 p-4">
        <div
          class="rounded-lg h-20 w-40"
          style={{
            backgroundColor: props.color
          }}
        ></div>
        <p class="my-5 text-xl text-grey-1">{props.name}</p>
        <p class="my-0 text-base text-grey-3">{props.color}</p>
      </div>
    )
  }
})

export default ColorBlock

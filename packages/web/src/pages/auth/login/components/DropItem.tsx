import { defineComponent } from 'vue'

const DropItem = defineComponent({
  name: 'DropItem',
  props: {
    openUrl: {
      type: String,
      required: true,
      default: ''
    },
    text: {
      type: String,
      required: true,
      default: ''
    },
    icon: {
      type: Function,
      required: true
    }
  },

  setup(props, ctx) {
    const openUrl = () => {
      window.open(props!.openUrl, '_blank')
    }
    return () => (
      <>
        <div
          onClick={openUrl}
          class="flex flex-row w-89 h-12 pl-2 items-center cursor-pointer group hover:bg-primary hover:color-white hover:rounded-sm"
        >
          <div class="h-8 w-8 rounded-sm mr-5 flex items-center justify-center group-hover:bg-white bg-purple">
            <props.icon class="h-4 w-4" />
          </div>
          <div class="u-card-title2 group-hover:text-white">{props!.text}</div>
        </div>
      </>
    )
  }
})
export default DropItem

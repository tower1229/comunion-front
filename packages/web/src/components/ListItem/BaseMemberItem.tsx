import { defineComponent, PropType, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'BaseMemberItem',
  props: {
    item: {
      type: Object as PropType<any>,
      required: true
    },
    keyMap: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => ({
        name: 'name',
        follow: 'follow'
      })
    }
  },
  setup(props) {
    const connect = ref<boolean>(!props.item[props.keyMap.follow || 'follow'])
    const disabled = computed(() => {
      return typeof props.item[props.keyMap.follow || 'follow'] === 'undefined'
    })

    watch(
      () => props.item[props.keyMap.follow || 'follow'],
      value => {
        connect.value = value
      },
      {
        immediate: true
      }
    )
    return {
      connect,
      disabled
    }
  },
  emits: ['connect', 'unconnect'],
  render() {
    const handleConnect = () => {
      this.$emit('connect', {
        ...this.item,
        cb: () => {
          this.connect = true
        }
      })
    }
    const handleUnconnect = () => {
      if (this.disabled) {
        return null
      }
      return this.$emit('unconnect', {
        ...this.item,
        cb: () => {
          this.connect = false
        }
      })
    }
    return (
      <div class="rounded-sm cursor-default flex py-4 px-4 items-center hover:bg-color-hover">
        {typeof this.$slots.avatar === 'function' && this.$slots.avatar()}
        <div class="flex flex-1 px-4 items-center overflow-hidden">
          {typeof this.$slots.content === 'function' ? (
            this.$slots.content()
          ) : (
            <div
              title={this.item[this.keyMap.name || 'name']}
              class="flex-1 text-color1 truncate u-h5"
            >
              {this.item[this.keyMap.name || 'name']}
            </div>
          )}
        </div>
        <span
          class="cursor-pointer text-color2 u-h7 hover:text-primary"
          onClick={() => (this.connect ? handleUnconnect() : handleConnect())}
        >
          {/* <CheckFilled class="mr-2" /> */}
          {this.connect ? 'Unconnect' : 'Connect'}
        </span>
      </div>
    )
  }
})

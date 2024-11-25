import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    color: {
      type: String,
      default: () => '#666666'
    },
    text: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const subTitleColor = computed(() => {
      return {
        color: props.color
      }
    })
    return {
      subTitleColor
    }
  },
  render() {
    return (
      <p
        class="font-bold text-center text-16px leading-6 <md:font-normal <md:text-[1.2rem]"
        style={this.subTitleColor}
      >
        {this.text}
      </p>
    )
  }
})

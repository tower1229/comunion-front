import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomCard',
  props: {
    title: {
      type: String
    },
    lock: {
      type: Boolean,
      require: true,
      default: () => false
    }
  },
  render() {
    return (
      <div
        class={`n-card u-card border rounded-sm bg-purple overflow-hidden ${
          this.lock ? 'border-error' : 'border-color-border'
        }`}
      >
        {this.$slots.title ? (
          this.$slots.title()
        ) : (
          <p class="border-b border-color-border p-3 text-color1 u-h5">{this.title}</p>
        )}
        {typeof this.$slots.default === 'function' && (
          <div class="bg-white n-card__content">{this.$slots.default()}</div>
        )}
      </div>
    )
  }
})

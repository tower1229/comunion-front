import { defineComponent } from 'vue'
import H1 from './h1'
import Subtitle from './subtitle'

export default defineComponent({
  props: {
    title: {
      type: String,
      require: true
    },
    subTitle: {
      type: String
    },
    subTitleLine: {
      type: String,
      default: ''
    }
  },
  render() {
    return (
      <div class={this.$attrs.class || ''}>
        <H1 text={this.title || ''} />
        {this.subTitle && (
          <Subtitle
            class={`mt-5.5 text-center mx-auto ${this.subTitleLine ? 'leading-' : ''}${
              this.subTitleLine ? this.subTitleLine : ''
            }`}
            text={this.subTitle || ''}
          />
        )}
      </div>
    )
  }
})

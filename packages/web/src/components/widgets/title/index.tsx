import { defineComponent } from 'vue'
import H1 from './h1'
import Subtitle from './subtitle'

export default defineComponent({
  name: 'Title',
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
      <>
        <H1 class={`mt-60 <sm:mt-30 <md:w-[92%] mx-auto <md:mt-45`} text={this.title || ''} />
        {this.subTitle && (
          <Subtitle
            class={`mt-5.5 <md:w-[92%] w-886px text-center mx-auto ${
              this.subTitleLine ? 'leading-' : ''
            }${this.subTitleLine ? this.subTitleLine : ''}`}
            text={this.subTitle || ''}
          />
        )}
      </>
    )
  }
})

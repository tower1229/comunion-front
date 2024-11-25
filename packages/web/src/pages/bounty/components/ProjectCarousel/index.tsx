import { UCarousel } from '@comunion/components'
import { LeftArrowFilled, RightArrowFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: Number,
      require: true
    },
    total: {
      type: Number,
      require: true,
      default: () => 0
    }
  },
  setup() {
    const carousel = ref<any>()
    return {
      carousel
    }
  },
  render() {
    const prev = () => {
      this.carousel.prev()
    }

    const next = () => {
      this.carousel.next()
    }
    return (
      <div class="relative" style={{ maxWidth: `${this.width}px` }}>
        {this.total > 3 && (
          <>
            <div
              class="cursor-pointer flex bg-gray-100 h-48px -mt-24px top-1/2 -left-20px w-20px absolute items-center"
              onClick={prev}
            >
              <LeftArrowFilled />
            </div>
            <div
              class="cursor-pointer flex bg-gray-100 h-48px -mt-24px top-1/2 -right-20px w-20px absolute items-center"
              onClick={next}
            >
              <RightArrowFilled />
            </div>
          </>
        )}
        <div class={this.total > 3 ? `mx-4` : ''}>
          <UCarousel
            ref={(ref: any) => (this.carousel = ref)}
            slidesPerView={Math.min(3, this.total)}
            spaceBetween={24}
            loop={true}
            draggable={true}
            showDots={false}
          >
            {this.$slots.default?.()}
          </UCarousel>
        </div>
      </div>
    )
  }
})

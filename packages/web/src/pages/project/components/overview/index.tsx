import { UCard } from '@comunion/components'
import { defineComponent, ref, watch } from 'vue'
import More from '@/components/More/shadow'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup() {
    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>(false)
    const fold = ref<boolean>(false)

    watch(
      () => pRef.value,
      () => {
        console.log('pRef.value.scrollHeight', pRef.value.scrollHeight)
        showMoreBtn.value = pRef.value.scrollHeight > 162
        fold.value = showMoreBtn.value
      }
    )

    return {
      fold,
      pRef,
      showMoreBtn
    }
  },
  render() {
    const handleMore = () => {
      this.fold = !this.fold
    }
    return (
      <>
        {this.content.trim() === '' ? null : (
          <UCard title="Overview" class="mb-6">
            <div
              class="transition-all ease-linear duration-1000 overflow-hidden relative"
              style={{ height: `${!this.fold ? 'auto' : '162px'}` }}
            >
              <p
                class="text-color2 u-h6 "
                ref={(ref: any) => (this.pRef = ref)}
                v-html={this.content.replaceAll('\n', '<br>')}
              />
              {this.showMoreBtn && this.fold && (
                <div
                  class="h-16 right-0 bottom-0 left-0 absolute"
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
                    transform: 'rotate(-180deg)'
                  }}
                ></div>
              )}
            </div>
            {this.showMoreBtn && (
              <div class="flex mt-5 justify-center">
                <More onMore={handleMore} fold={this.fold} />
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})

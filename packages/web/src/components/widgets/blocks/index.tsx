import { defineComponent, PropType } from 'vue'

import animate from './animate.module.css'
import styles from './index.module.css'
import { handleSrcset } from '@/utils/srcset'

export type Item = {
  icons: string[]
  title: string
  subtitle: string
  content: string
}

export default defineComponent({
  name: 'Blocks',
  props: {
    list: {
      type: Array as PropType<Item[]>,
      required: true,
      default: () => []
    }
  },
  render() {
    return (
      <div class="m-auto max-w-1120px grid grid-cols-3  <md:grid-cols-1 ">
        {this.list.map(item => {
          const srcset = handleSrcset(item.icons)
          return (
            <div
              class={`${styles.hoverBox} ${animate['undefined-back-pulse']} flex <md:h-98.75 <sm:h-75 <md:w-[92%] mx-auto h-395px flex-col items-center ${animate['undefined-border-fade']}`}
              key={item.title}
            >
              <div class="mx-auto h-16 mt-14.5 w-16 <sm:mt-8">
                <img src={item.icons[0]} srcset={srcset} alt={item.title} />
              </div>
              <h1 class="font-bold mt-10 text-center mb-6.25 text-[1.5rem] text-[#111] <sm:mt-8 <sm:text-[1.4rem] <md:mt-9 <md:mb-3 <md:text-[2.5rem]">
                {item.title}
              </h1>
              {item.subtitle && (
                <h3 class="font-bold text-center mb-0.75 text-[1.25rem] text-[#555] <sm:text-[1.1rem] <md:font-500 <md:mb-3 <md:text-[1.875rem]">
                  {item.subtitle}
                </h3>
              )}
              <p class="mx-auto mx-8.5 mt-1 text-center mb-18 leading-normal text-[1rem] text-[#555] <sm:text-[1rem] <md:mx-[10%] <md:text-[1.5rem]">
                {item.content}
              </p>
            </div>
          )
        })}
      </div>
    )
  }
})

import { defineComponent } from 'vue'

import bgBubble1 from '@/assets/20220725/bg_bubble1.png'
import bgBubble1_2 from '@/assets/20220725/bg_bubble1@2x.png'
import bgBubble1_3 from '@/assets/20220725/bg_bubble1@3x.png'
import bgBubble2 from '@/assets/20220725/bg_bubble2.png'
import bgBubble2_2 from '@/assets/20220725/bg_bubble2@2x.png'
import bgBubble2_3 from '@/assets/20220725/bg_bubble2@3x.png'

import bgBubble3 from '@/assets/20220725/bg_bubble3.png'
import bgBubble4 from '@/assets/20220725/bg_bubble4.png'

import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  name: 'widgetBackground',
  render() {
    const bubble1 = [bgBubble1, bgBubble1_2, bgBubble1_3]
    const bg1 = handleSrcset(bubble1)
    const bubble2 = [bgBubble2, bgBubble2_2, bgBubble2_3]
    const bg2 = handleSrcset(bubble2)
    return (
      <>
        <div class="top-[92vh] right-0 left-0 absolute">
          <img class="w-full" srcset={bg1} src={bgBubble1} />
        </div>
        <div class="right-0 bottom-1200px absolute <md:bottom-696">
          <img class="w-full" srcset={bg2} src={bgBubble2} />
        </div>
        <div class="top-1550px left-0px absolute <md:top-403.5">
          <img class="w-full <md:h-22 <md:w-10" src={bgBubble3} />
        </div>
        <div class="top-2950px right-0px absolute <md:hidden">
          <img class="w-full" src={bgBubble4} />
        </div>
        <div class="bottom-700px left-0px absolute <md:bottom-696">
          <img class="w-full <md:h-32.5 <md:w-16.25" src={bgBubble3} />
        </div>
      </>
    )
  }
})

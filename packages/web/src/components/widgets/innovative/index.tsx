import { defineComponent } from 'vue'
import Title from '../title'

import innovative1 from '@/assets/20220725/innovative1.png'
import innovative1_2 from '@/assets/20220725/innovative1@2x.png'
import innovative1_3 from '@/assets/20220725/innovative1@3x.png'

import innovative2 from '@/assets/20220725/innovative2.png'
import innovative2_2 from '@/assets/20220725/innovative2@2x.png'
import innovative2_3 from '@/assets/20220725/innovative2@3x.png'

import innovative3 from '@/assets/20220725/innovative3.png'
import innovative3_2 from '@/assets/20220725/innovative3@2x.png'
import innovative3_3 from '@/assets/20220725/innovative3@3x.png'

import innovative4 from '@/assets/20220725/innovative4.png'
import innovative4_2 from '@/assets/20220725/innovative4@2x.png'
import innovative4_3 from '@/assets/20220725/innovative4@3x.png'
import mission from '@/assets/20220725/mission.png'
import mission2 from '@/assets/20220725/mission@2x.png'
import mission3 from '@/assets/20220725/mission@3x.png'
import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  name: 'Innovative',
  setup() {
    const list = [
      {
        icons: [innovative1, innovative1_2, innovative1_3],
        title: 'One-Click Launch',
        content:
          'Integrated resources including talents, tasks, and fundings are provided for everyone to create their own startup with single one click of a button.'
      },
      {
        icons: [innovative2, innovative2_2, innovative2_3],
        title: 'Global Network',
        content:
          'Create a new generation of human incentives that provide more bounties, global talent and equity deposits, all of which are trusted by onchain.'
      },
      {
        icons: [innovative3, innovative3_2, innovative3_3],
        title: 'Initial Build Offerings',
        content:
          'Raise funds for a startup with greater efficiency and lower cost in a secure and guaranteed mechanism.'
      },
      {
        icons: [innovative4, innovative4_2, innovative4_3],
        title: 'DAO Governance',
        content:
          'Provide a suite of  DAO governance toolkits such as KYC, Audit, Decentralized Voting, Liquidity Locking, Treasury Management, etc.'
      }
    ]
    return {
      list
    }
  },
  render() {
    return (
      <>
        <Title title="Innovative" />
        <div class="mt-78px grid gap-x-30px gap-y-24px justify-center <md:hidden">
          {this.list.map((item, $index) => {
            const str0 = $index === 0 && `row-start-1 row-end-2 col-start-1 col-end-2`
            const str1 = $index === 1 && `row-start-1 row-end-2 col-start-2 col-end-3`
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`grid gap-x-30px gap-y-33px w-540px h-224px bg-[rgba(255,255,255,0.4)] rounded-2px ${str0} ${str1} hover:bg-white`}
                key={item.title}
              >
                <h1 class="flex font-bold ml-32px text-24px text-[#111] col-start-1 col-end-2 row-start-1 row-end-2 items-end">
                  {item.title}
                </h1>
                <p class="leading-normal ml-32px text-16px text-[#555] col-start-1 col-end-2 row-start-2 row-end-3 content-start">
                  {item.content}
                </p>
                <div class="h-64px mr-40px w-64px col-start-2 col-end-3 row-start-2 row-end-3 justify-start items-start">
                  <img srcset={srcset} src={item.icons[0]} alt={item.title} />
                </div>
              </div>
            )
          })}
        </div>
        <div class="flex flex-col mt-19.5 z-1 justify-center relative md:hidden">
          {this.list.map((item, $index) => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class="mx-auto bg-[rgba(255,255,255,0.4)] rounded-2px h-86.5 mb-6 grid w-155.5 gap-x-7.5 gap-y-8.25 <sm:h-auto <sm:py-8 <sm:w-[90%] <sm:gap-y-5 hover:bg-white"
                key={item.title}
              >
                <h1 class="flex font-bold text-[2.25rem] text-[#111] col-start-1 col-end-2 row-start-1 row-end-2 items-end <sm:ml-6 <sm:text-[1.5rem]">
                  {item.title}
                </h1>
                <p class="font-400 leading-normal text-[1.5rem] text-[#555] col-start-1 col-end-2 row-start-2 row-end-3 content-start <sm:ml-6 <sm:text-[1rem]">
                  {item.content}
                </p>
                <div class="h-18 mr-12 w-18 col-start-2 col-end-3 row-start-2 row-end-3 justify-start items-start <sm:mr-6 <sm:w-10">
                  <img srcset={srcset} src={item.icons[0]} alt={item.title} />
                </div>
              </div>
            )
          })}
        </div>
        {/* <md:h-67.5 */}
        <div class="flex mx-auto my-118px justify-center <sm:my-10 <sm:w-[90%] <md:mt-19.5 <md:mb-39.5 <md:max-h-[12vh] <md:w-155.5">
          <img srcset={`${mission}, ${mission2} 2x, ${mission3} 3x`} src={mission} />
        </div>
      </>
    )
  }
})

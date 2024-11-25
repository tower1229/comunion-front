import { defineComponent } from 'vue'
import H1 from '../title/h1'

import animate from './animate.module.css'
import benefit1 from '@/assets/20220725/benefit1.png'
import benefit10 from '@/assets/20220725/benefit10.png'
import benefit10_2 from '@/assets/20220725/benefit10@2x.png'
import benefit10_3 from '@/assets/20220725/benefit10@3x.png'
import benefit11 from '@/assets/20220725/benefit11.png'
import benefit11_2 from '@/assets/20220725/benefit11@2x.png'
import benefit11_3 from '@/assets/20220725/benefit11@3x.png'
import benefit12 from '@/assets/20220725/benefit12.png'
import benefit12_2 from '@/assets/20220725/benefit12@2x.png'
import benefit12_3 from '@/assets/20220725/benefit12@3x.png'
import benefit1_2 from '@/assets/20220725/benefit1@2x.png'
import benefit1_3 from '@/assets/20220725/benefit1@3x.png'

import benefit2 from '@/assets/20220725/benefit2.png'
import benefit2_2 from '@/assets/20220725/benefit2@2x.png'
import benefit2_3 from '@/assets/20220725/benefit2@3x.png'

import benefit3 from '@/assets/20220725/benefit3.png'
import benefit3_2 from '@/assets/20220725/benefit3@2x.png'
import benefit3_3 from '@/assets/20220725/benefit3@3x.png'

import benefit4 from '@/assets/20220725/benefit4.png'
import benefit4_2 from '@/assets/20220725/benefit4@2x.png'
import benefit4_3 from '@/assets/20220725/benefit4@3x.png'

import benefit5 from '@/assets/20220725/benefit5.png'
import benefit5_2 from '@/assets/20220725/benefit5@2x.png'
import benefit5_3 from '@/assets/20220725/benefit5@3x.png'

import benefit6 from '@/assets/20220725/benefit6.png'
import benefit6_2 from '@/assets/20220725/benefit6@2x.png'
import benefit6_3 from '@/assets/20220725/benefit6@3x.png'

import benefit7 from '@/assets/20220725/benefit7.png'
import benefit7_2 from '@/assets/20220725/benefit7@2x.png'
import benefit7_3 from '@/assets/20220725/benefit7@3x.png'

import benefit8 from '@/assets/20220725/benefit8.png'
import benefit8_2 from '@/assets/20220725/benefit8@2x.png'
import benefit8_3 from '@/assets/20220725/benefit8@3x.png'

import benefit9 from '@/assets/20220725/benefit9.png'
import benefit9_2 from '@/assets/20220725/benefit9@2x.png'
import benefit9_3 from '@/assets/20220725/benefit9@3x.png'
import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  name: 'Benefits',
  setup() {
    const list = [
      {
        icons: [benefit1, benefit1_2, benefit1_3],
        h1: 'Programmable'
      },
      {
        icons: [benefit2, benefit2_2, benefit2_3],
        h1: 'Permissionless'
      },
      {
        icons: [benefit3, benefit3_2, benefit3_3],
        h1: 'Decentralized'
      },
      {
        icons: [benefit4, benefit4_2, benefit4_3],
        h1: 'More Opportunities'
      },
      {
        icons: [benefit5, benefit5_2, benefit5_3],
        h1: 'More Incomes'
      },
      {
        icons: [benefit6, benefit6_2, benefit6_3],
        h1: 'More Connections'
      },
      {
        icons: [benefit7, benefit7_2, benefit7_3],
        h1: 'Transparent'
      },
      {
        icons: [benefit8, benefit8_2, benefit8_3],
        h1: 'Sustainable'
      },
      {
        icons: [benefit9, benefit9_2, benefit9_3],
        h1: 'Efficient'
      },
      {
        icons: [benefit10, benefit10_2, benefit10_3],
        h1: 'Freedom'
      },
      {
        icons: [benefit11, benefit11_2, benefit11_3],
        h1: 'Fairness'
      },
      {
        icons: [benefit12, benefit12_2, benefit12_3],
        h1: 'On-chain'
      }
    ]
    return {
      list
    }
  },
  render() {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #5E18FE 0%, #45249F 100%)'
        }}
        class="mt-60 w-full pt-40 pb-40 relative <sm:mt-30 <sm:pb-20"
      >
        <H1 color="#fff" text="Benefits" class="mb-17.5" />
        <div class="grid gap-x-30px gap-y-24px grid-cols-[350px,350px,350px] justify-center <md:hidden">
          {this.list.map(item => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                key={item.h1}
                class={`flex h-150px items-center bg-white rounded-2px ${animate['undefined-grow']}`}
              >
                <div class="h-46px mr-28px ml-41px w-46px">
                  <img class="w-full" src={item.icons[0]} srcset={srcset} alt={item.h1} />
                </div>
                <h1 class="font-bold text-20px text-[#111]">{item.h1}</h1>
              </div>
            )
          })}
        </div>
        <div class="grid gap-x-11.5 gap-y-5 grid-cols-[1fr,1fr] justify-center <sm:px-4 <sm:gap-x-4  <sm:gap-y-4 md:hidden">
          {this.list.map(item => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                key={item.h1}
                class={`flex h-24 items-center bg-white rounded-2px <sm:h-14 ${animate['undefined-grow']}`}
              >
                <div class="h-11.5 mr-4 ml-9 w-11.5 <sm:h-6 <sm:mr-2  <sm:ml-2 <sm:w-6">
                  <img class="w-full" src={item.icons[0]} srcset={srcset} alt={item.h1} />
                </div>
                <h1 class="font-bold text-[1.5rem] text-[#111] <sm:text-[14px]">{item.h1}</h1>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})

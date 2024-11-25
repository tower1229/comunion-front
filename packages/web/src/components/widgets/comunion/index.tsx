import { defineComponent } from 'vue'
import Title from '../title'

import animate from './animate.module.css'
import styles from './index.module.css'

// import p1 from '@/assets/20220725/p1.png'
// import p1_2 from '@/assets/20220725/p1@2x.png'
// import p1_3 from '@/assets/20220725/p1@3x.png'

// import p3 from '@/assets/20220725/p3.png'
// import p3_2 from '@/assets/20220725/p3@2x.png'
// import p3_3 from '@/assets/20220725/p3@3x.png'

// import p4 from '@/assets/20220725/p4.png'
// import p4_2 from '@/assets/20220725/p4@2x.png'
// import p4_3 from '@/assets/20220725/p4@3x.png'

// import wallet from '@/assets/20220725/wallet.png'
// import wallet_2 from '@/assets/20220725/wallet@2x.png'
// import wallet_3 from '@/assets/20220725/wallet@3x.png'

import comp1 from '@/assets/20220725/comp1.png'
import comp2 from '@/assets/20220725/comp2.png'
import comp3 from '@/assets/20220725/comp3.png'
import comp4 from '@/assets/20220725/comp4.png'

import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  name: 'Comunion',
  setup() {
    const list = [
      {
        icons: [comp1, comp1, comp1],
        h1line1: 'A new era of economy',
        h1line2: 'Net-Chain Economy',
        content:
          'The core theory is based on technology of internet and blockchain to research how can increase income of labor through promoting labor’s liquidity and the capitalization of labor value'
      },
      {
        icons: [comp2, comp2, comp2],
        h1line1: 'A new decentralized organization ',
        h1line2: 'DCO',
        content:
          'Generate much higher efficient collaboration power through linking distributed labors and fragmented productivity to build. It born from DAO, but beyond DAO'
      },
      {
        icons: [comp3, comp3, comp3],
        h1line1: 'A new startup and innovation paradigm',
        h1line2: 'WELaunch',
        content:
          'The new startup paradigm which is formed by bounty, dCrowdfunding, on-chain governance and other dApps that help everyone to launch and manage their startup without limiting          '
      },
      {
        icons: [comp4, comp4, comp4],
        h1line1: 'A new group of workers',
        h1line2: 'Buidler',
        content:
          'They are gig workers, remoters, freelancers, builders or contributors etc who yearn for freedom living and working, especially want to change destiny'
      }
    ]
    return {
      list
    }
  },
  render() {
    return (
      <div class="flex flex-col items-center">
        <Title
          title="What is WELaunch"
          subTitle="Generates an all-in-one meeting place for being dedicated to building a thriving and collaborative ecosystem, community, and economy"
        />
        <div class="flex flex-row flex-wrap mx-auto mt-20 max-w-1120px <sm:mt-10 <md:hidden">
          {this.list.map((item, $index) => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`${styles.hoverBox} ${animate['undefined-back-pulse']} flex flex-col flex-grow-0 flex-shrink-0 w-556px h-316px pl-48px ${animate['undefined-border-fade']} hover:text-primary`}
                key={item.h1line1}
              >
                <div class="h-12 mt-12 w-12">
                  <img srcset={srcset} src={item.icons[0]} alt={item.h1line1} />
                </div>
                <h1 class="font-bold mt-24px text-left mb-4 text-20px text-[#555555] hover-text">
                  {item.h1line1}
                </h1>
                <h1 class="font-bold text-left text-24px hover-text">{item.h1line2}</h1>
                <p class=" mt-4 text-left mr-20 leading-normal text-16px text-[#555] <sm:mr-10">
                  {item.content}
                </p>
              </div>
            )
          })}
        </div>
        <div class="flex flex-col mt-20 md:hidden">
          {this.list.map((item, $index) => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`${styles.hoverBox} ${animate['undefined-back-pulse']} flex flex-col <md:w-[92%] <md:h-91 <md:mx-auto pl-14.5 <sm:pl-8 pb-6 !h-auto ${animate['undefined-border-fade']} hover:text-primary`}
                key={item.h1line1}
              >
                <div class="h-12 mt-12 w-12 <sm:mt-6">
                  <img srcset={srcset} src={item.icons[0]} alt={item.h1line1} />
                </div>
                <h1 class="font-bold mt-6 text-left text-[#555555] text-[2rem] hover-text <sm:text-[1.2rem]">
                  {item.h1line1}
                </h1>
                <h1 class="font-bold mt-4 text-left text-[2.5rem] hover-text  <sm:text-[1.5rem]">
                  {item.h1line2}
                </h1>
                <p class="font-400 mt-4 text-left mr-20 leading-normal text-[1.5rem] text-[#555] <sm:mr-6 <sm:text-[1rem]">
                  {item.content}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})

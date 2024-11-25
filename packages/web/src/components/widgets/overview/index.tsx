import { defineComponent } from 'vue'

import styles from './index.module.css'
import group from '@/assets/20220725/group.png'
import group2 from '@/assets/20220725/group@2x.png'
import group3 from '@/assets/20220725/group@3x.png'
import rocket from '@/assets/20220725/rocket.png'
import rocket2 from '@/assets/20220725/rocket@2x.png'
import rocket3 from '@/assets/20220725/rocket@3x.png'

import store from '@/assets/20220725/store.png'
import store3 from '@/assets/20220725/store@3x.png'
import up from '@/assets/20220725/up.png'
import up2 from '@/assets/20220725/up@2x.png'
import up3 from '@/assets/20220725/up@3x.png'

import wallet from '@/assets/20220725/wallet.png'
import wallet2 from '@/assets/20220725/wallet@2x.png'
import wallet3 from '@/assets/20220725/wallet@3x.png'

export default defineComponent({
  name: 'Overview',
  render() {
    return (
      <div class="flex flex-col mt-20 w-full text-[#111] justify-center relative <sm:mt-6 <md:mt-21">
        {/* <h1
          class="text-center mb-41px text-20px <md:mb-9 <md:text-[1.625rem]"
          style={{ color: 'rgba(17,17,17,0.6)' }}
        >
          You Can
        </h1> */}
        <div
          class="bg-transparent mx-auto grid grid-rows-4 grid-cols-6 grid-cols-[279px,136px,143px,138px,141px,276px] grid-rows-[180px,180px,180px,180px] <md:hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <div class="border border-solid bg-[#5E18FE] text-white pt-54px pl-48px col-start-1 col-end-3 row-start-1 row-end-3">
            <h1 class={styles.title36}>Lauch</h1>
            <h1 class={`${styles.title36} -mt-10px`}>a Startup</h1>
            <p class={`${styles.title14} text-white opacity-50 mt-16px`}>
              Web3, Crypto, Blockchain, Metaverse etc
            </p>
            <div class="h-54px mt-85px w-54px">
              <img
                class="w-full"
                srcset={`${rocket}, ${rocket2} 2x, ${rocket3} 3x`}
                src={rocket}
                alt="rocket"
              />
            </div>
          </div>
          <div class="border pt-54px pl-48px col-start-3 col-end-6 row-start-1 row-end-3">
            <h1 class={styles.title36}>Start, Run + Grow</h1>
            <h1 class={`${styles.title36} -mt-10px`}>Your business</h1>
            <div class="h-54px mt-125px w-54px">
              <img class="w-full" srcset={`${up}, ${up2} 2x, ${up3} 3x`} src={up} alt="up" />
            </div>
          </div>
          <div class="border pt-32px pl-36px col-start-6 col-end-7 row-start-1 row-end-2">
            <h1 class={styles.title24}>Raise money</h1>
            <div class="h-54px mt-30px w-54px">
              <img
                class="w-full"
                srcset={`${wallet}, ${wallet2} 2x, ${wallet3} 3x`}
                src={wallet}
                alt="wallet"
              />
            </div>
          </div>
          <div class="border pt-32px pl-36px col-start-6 col-end-7 row-start-2 row-end-3">
            <h1 class={styles.title24}>Earn through</h1>
            <h1 class={`${styles.title24} -mt-10px`}>bounties</h1>
          </div>
          <div class="border pt-52px pl-32px col-start-1 col-end-2 row-start-3 row-end-5">
            <h1 class={styles.title24}>Build an</h1>
            <h1 class={`${styles.title24} -mt-10px`}>organization</h1>
            <p class={`${styles.title14} mt-12px font-700 opacity-50`}>
              DAO, NGO,Commercial and Community etc
            </p>
            <div class="h-54px mt-104px w-54px">
              <img
                class="w-full"
                srcset={`${group}, ${group2} 2x, ${group3} 3x`}
                src={group}
                alt="group"
              />
            </div>
          </div>
          <div class="border pt-52px pl-32px col-start-2 col-end-4 row-start-3 row-end-4">
            <h1 class={styles.title24}>Invest</h1>
            <h1 class={`${styles.title24} -mt-10px`}>early startups</h1>
          </div>
          <div class="border pt-36px pl-32px col-start-2 col-end-5 row-start-4 row-end-5">
            <h1 class={styles.title24}>Buy and Sell</h1>
            <p class={`${styles.title14} mt-14px`} style={{ color: 'rgba(17, 17, 17, 0.5)' }}>
              Crypto, NFTs, Goods or Services etc
            </p>
          </div>
          <div class="border pt-52px pl-32px col-start-4 col-end-6 row-start-3 row-end-4">
            <h1 class={styles.title24}>Connect</h1>
            <h1 class={`${styles.title24} -mt-10px`}>global talents</h1>
          </div>
          <div class="border pt-52px pl-32px col-start-6 col-end-7 row-start-3 row-end-4">
            <h1 class={styles.title24}>Freelance work </h1>
            <h1 class={`${styles.title24} -mt-10px`}>marketplace</h1>
          </div>
          <div class="border pt-36px pl-32px col-start-5 col-end-7 row-start-4 row-end-5">
            <h1 class={styles.title24}>Dapp store as a service</h1>
            <div class="h-54px mt-37px w-54px">
              <img
                class="w-full"
                srcset={`${store}, ${store} 2x, ${store3} 3x`}
                src={store}
                alt="group"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-transparent mx-auto w-full grid grid-cols-[12.8fr,7.4fr,6.6fr,14fr] grid-rows-[12.8fr,12.8fr,10.6fr,10.6fr,12.8fr] <sm:text-[12px] <sm:w-[92%] md:hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <div class="border border-solid bg-[#5E18FE] text-white pl-10 col-start-1 col-end-3 row-start-1 row-end-3 <sm:pt-4 <sm:pl-5">
            <h1 class={styles.title30}>Lauch</h1>
            <h1 class={`${styles.title30} -mt-10px`}>a startup</h1>
            <p class={`${styles.title20} mt-4 text-white/70`}>
              Web3, Crypto, Blockchain, Metaverse etc
            </p>
            <div class="h-10.5 mt-35 w-10.5 <sm:mt-18 <md:mt-20">
              <img
                class="w-full"
                srcset={`${rocket}, ${rocket2} 2x, ${rocket3} 3x`}
                src={rocket}
                alt="rocket"
              />
            </div>
          </div>
          <div class="border pl-9 col-start-3 col-end-5 row-start-1 row-end-2 <sm:pt-4 <sm:pl-5">
            <h1 class={styles.title26}>Start, Run + Grow</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>Your business</h1>
            <div class="h-10.5 mt-12 w-10.5 <sm:mt-5">
              <img class="w-full" srcset={`${up}, ${up2} 2x, ${up3} 3x`} src={up} alt="up" />
            </div>
          </div>
          <div class="border pl-9 col-start-3 col-end-5 row-start-2 row-end-3 <sm:pt-4 <sm:pl-5">
            <h1 class={styles.title26}>Raise money</h1>
            <div class="h-10.5 mt-12.5 w-10.5  <sm:mt-5">
              <img
                class="w-full"
                srcset={`${wallet}, ${wallet2} 2x, ${wallet3} 3x`}
                src={wallet}
                alt="wallet"
              />
            </div>
          </div>
          <div class="border col-start-4 col-end-5 row-start-3 row-end-4 <sm:pt-5 <sm:pl-4">
            <h1 class={styles.title26}>Earn through</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>bounties</h1>
          </div>
          <div class="border col-start-1 col-end-2 row-start-3 row-end-5 <sm:pt-5 <sm:pl-4">
            <h1 class={styles.title26}>Build an</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>organization</h1>
            <p class={`${styles.title20} mt-3 pr-2`} style={{ color: 'rgba(17, 17, 17, 0.5)' }}>
              DAO, NGO,Commercial and Community etc
            </p>
            <div class="h-10.5 mt-12.75 w-10.5 <sm:mt-6">
              <img
                class="w-full"
                srcset={`${group}, ${group2} 2x, ${group3} 3x`}
                src={group}
                alt="group"
              />
            </div>
          </div>
          <div class="border col-start-2 col-end-4 row-start-3 row-end-4 <sm:pt-5 <sm:pl-4">
            <h1 class={styles.title26}>Invest</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>early startups</h1>
          </div>
          <div class="border col-start-1 col-end-3 row-start-5 row-end-6 <sm:pt-6 <sm:pl-4">
            <h1 class={styles.title26}>Buy and Sell</h1>
            <p class={`${styles.title20} mt-3.5`} style={{ color: 'rgba(17, 17, 17, 0.5)' }}>
              Crypto, NFTs, Goods or Services etc
            </p>
          </div>
          <div class="border col-start-2 col-end-4 row-start-4 row-end-5 <sm:pt-4 <sm:pl-4">
            <h1 class={styles.title26}>Connect</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>global talents</h1>
          </div>
          <div class="border col-start-4 col-end-5 row-start-4 row-end-5 <sm:pt-4 <sm:pl-4">
            <h1 class={styles.title26}>Freelance</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>work</h1>
            <h1 class={`${styles.title26} -mt-2.5`}>marketplace</h1>
          </div>
          <div class="border col-start-3 col-end-5 row-start-5 row-end-6 <sm:pt-6 <sm:pl-4">
            <h1 class={styles.title24}>Dapp store as a service</h1>
            <div class="h-10.5 mt-7.75 w-10.5 <sm:mt-4">
              <img
                class="w-full"
                srcset={`${store}, ${store} 2x, ${store3} 3x`}
                src={store}
                alt="group"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
})

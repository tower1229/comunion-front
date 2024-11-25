import { defineComponent, ref, onMounted, nextTick } from 'vue'
import styles from './animate.module.css'
import pullDown from '@/assets/20220725/pullDown.png'
export default defineComponent({
  name: 'BgImage',
  setup() {
    const divRef = ref()
    const text = ref('')
    const lineStatus = ref(true)
    const goTest = async () => {
      let diskText = 'launch network'
      let secound = 10
      const timer = await setInterval(() => {
        if (diskText) {
          if (diskText[0] !== ' ') {
            text.value += diskText[0]
            diskText = diskText.substring(1, diskText.length)
          } else {
            secound--
            if (secound == 0) {
              text.value += diskText[0]
              diskText = diskText.substring(1, diskText.length)
            }
          }
        } else {
          lineStatus.value = false
          secound = 10
          clearInterval(timer)
        }
      }, 100)
    }

    const onScroll = () => {
      nextTick(() => {
        const distance = divRef.value.scrollHeight
        window.scrollTo({
          top: distance,
          behavior: 'smooth'
        })
      })
    }
    onMounted(() => {
      goTest()
    })
    return {
      text,
      lineStatus,
      divRef,
      onScroll
    }
  },
  render() {
    return (
      <>
        <div ref="divRef" class={[styles.bgImage]}>
          <div class="m-auto h-10 top-0 right-0 bottom-0 left-0 w-256 absolute <sm:bottom-[10vw] <md:h-[5vh] <md:w-[90vw]">
            <div class="font-primary font-semibold">
              <p class="mb-3 top-[-1.5rem] left-[4.7rem] text-[rgba(255,255,255,0.5)] text-[20px] absolute <md:top-[-3rem] <md:left-[3rem] <md:text-[3.5vw]">
                The First One-stop-shop
              </p>
            </div>
            <p class="font-bold text-[#FFF1F1] <md:pl-[3rem]">
              <span class="ml-[4.5rem] text-[60px] <md:font-primary <md:font-medium <md:font-700 <md:ml-[0] <md:text-[8vw]">
                Co-buidling {this.text}
              </span>
              <span
                class={`${styles.lineColor} line-color inline-block h-13 w-1 bg-[#ffffff] ml-2`}
              ></span>
            </p>
            <p class="font-600 mt-8.5 text-[#ffffff] ml-[4.5rem] text-[25px] <md:font-700 <md:text-left <md:ml-[3rem] <md:text-[3.5vw]">
              to pave the way for launching a startup
            </p>
          </div>
          <div class="mx-auto right-0 bottom-15 left-0 w-256 absolute <md:w-[100vw]">
            <img
              onClick={this.onScroll}
              class="cursor-pointer mx-auto h-4 right-0 bottom-15 left-0 animate-bounce w-4 absolute <md:bottom-5"
              src={pullDown}
              alt=""
            />
          </div>
        </div>
      </>
    )
  }
})

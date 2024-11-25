import { defineComponent } from 'vue'
import Title from '../title'
import './style.css'

export default defineComponent({
  name: 'Future',
  setup() {
    const list = [
      {
        title: 'One click to launch your project'
      },
      {
        title: 'Create a launchpad for fundraising'
      },
      {
        title: 'Post a bounty for calling up buidlers'
      },
      {
        title: 'Govern on-chain transparency'
      },
      {
        title: 'Listed on wechart.io automacally'
      },
      {
        title: 'One stop shop to trade on wedex.finance'
      }
    ]

    return {
      list
    }
  },
  render() {
    return (
      <>
        <Title
          title="The Future of blockchain economy begins here"
          subTitle="shift your role liberally"
        />
        <div class="mx-auto mt-20 max-w-[1120px] relative <sm:mt-12 <md:w-[92%]">
          <ul class="text-[20px] <sm:text-[14px]">
            {this.list.map((item, index) => (
              <li class="cursor-pointer flex h-24 mb-10 text-[#111] leading-24 __futureItem <sm:h-10 <sm:mb-6 <sm:leading-10 <md:h-20 <md:leading-20 ">
                <div class="border-1 h-24 text-center  mr-10 w-24 _border <sm:h-10 <sm:w-10 <md:h-20 <md:mr-5 <md:w-20">
                  <span class="text-[14px]">{index + 1}</span>
                </div>
                <div class="font-bold border-1 flex-1 px-10 _border truncate <sm:px-4">
                  {item.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
})

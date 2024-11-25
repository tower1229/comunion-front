import { defineComponent, ref } from 'vue'
import discord from '@/assets/discord.svg'
import github from '@/assets/github.svg'
import telegram from '@/assets/telegram.svg'
import twitter from '@/assets/twitter.svg'

export default defineComponent({
  name: 'Contact',
  setup() {
    const list = ref([
      {
        title: 'telegram',
        icon: telegram,
        link: 'https://t.me/WEconomyNetwork'
      },
      {
        title: 'twitter',
        icon: twitter,
        link: 'https://twitter.com/WEconomyNetwork'
      },
      {
        title: 'discord',
        icon: discord,
        link: 'https://discord.com/invite/ujnRq3KGhQ'
      },
      {
        title: 'github',
        icon: github,
        link: 'https://github.com/comunion-io'
      }
    ])

    return {
      list
    }
  },
  render() {
    return (
      <div class="my-10 min-h-100 <lg:min-h-60 <lg:px-5">
        <ul class="gap-5 items-center lg:flex <lg:grid <lg:gap-12 <lg:grid-cols-2">
          {this.list.map(item => (
            <li
              class="cursor-pointer bg-color1 text-center lg:h-16 lg:leading-16 lg:w-16 hover:opacity-80"
              onClick={() => item.link && window.open(item.link)}
            >
              <img src={item.icon} class="inline-block lg:h-8 lg:w-8 <lg:w-full" />
            </li>
          ))}
        </ul>
      </div>
    )
  }
})

import { UPopupMenu } from '@comunion/components'
import {
  HelpFilled,
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled,
  MoreOutlined
} from '@comunion/icons'
import { defineComponent, h, ref } from 'vue'
import DropItem from './DropItem'

const MoreNavigationPage = defineComponent({
  name: 'MoreNavigationPage',
  setup() {
    const options = ref([
      // about WELaunch
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://docs.weconomy.network/"
              text="About WELaunch"
              icon={HelpFilled}
            />,
            {}
          )
        }
      },
      // line
      {
        type: 'render',
        render: () => {
          return h('div', {
            class: 'bg-grey5 h-[1px] w-full mt-4 mb-4'
          })
        }
      },
      // Website
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://docs.weconomy.network/"
              text="Website"
              icon={WebsiteFilled}
            />,
            {}
          )
        }
      },
      // Discord
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem openUrl="http://discord.gg/ujnRq3KGhQ" text="Discord" icon={DiscordFilled} />,
            {}
          )
        }
      },
      // Telegram
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://t.me/ComunionEconomics"
              text="Telegram"
              icon={TelegramFilled}
            />,
            {}
          )
        }
      },
      // Twitter
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://twitter.com/WEconomyNetwork"
              text="Twitter"
              icon={TwitterFilled}
            />,
            {}
          )
        }
      },
      // Docs
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem openUrl="https://docs.weconomy.network/" text="Docs" icon={DocsFilled} />,
            {}
          )
        }
      }
    ])

    return () => (
      <>
        <section class="<lg:hidden">
          <UPopupMenu trigger="click" options={options.value}>
            <MoreOutlined class="cursor-pointer top-9 right-15 absolute hover:bg-color-hover" />
          </UPopupMenu>
        </section>
      </>
    )
  }
})

export default MoreNavigationPage

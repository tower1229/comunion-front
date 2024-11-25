import { UTooltip } from '@comunion/components'
import {
  DiscordFilled,
  WebsiteFilled,
  FacebookFilled,
  UnionFilled,
  TelegramFilled,
  TwitterFilled,
  EmailFilled,
  MediumFilled,
  YoutubeFilled,
  RedditFilled,
  DocsFilled,
  GithubFilled,
  BehanceFilled,
  DribbbleFilled
} from '@comunion/icons'
import copy from 'copy-to-clipboard'
import { defineComponent, ref } from 'vue'
import { validateDiscordUsername } from '@/utils/valid'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    iconClass: {
      type: String,
      default: () => 'w-5 h-5'
    },
    address: {
      type: String,
      default: () => ''
    },
    disable: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const showTooltipRef = ref<boolean>(false)

    const asyncComponent = function (type: string, wrapper: string) {
      return (
        {
          Website: <WebsiteFilled class={`w-full h-full`} />,
          Discord: <DiscordFilled class={`w-full h-full`} />,
          Facebook: <FacebookFilled class={`w-full h-full`} />,
          Linktree: <UnionFilled class={`w-full h-full`} />,
          Telegram: <TelegramFilled class={`w-full h-full`} />,
          Twitter: <TwitterFilled class={`w-full h-full`} />,
          Email: <EmailFilled class={`w-full h-full`} />,
          Medium: <MediumFilled class={`w-full h-full`} />,
          Youtube: <YoutubeFilled class={`w-full h-full`} />,
          Reddit: <RedditFilled class={`w-full h-full`} />,
          Docs: <DocsFilled class={`w-full h-full`} />,
          Github: <GithubFilled class={`w-full h-full`} />,
          Behance: <BehanceFilled class={`w-full h-full`} />,
          Dribbble: <DribbbleFilled class={`w-full h-full`} />
        }[type] || <WebsiteFilled class={`w-full h-full`} />
      )
    }

    return {
      showTooltipRef,
      asyncComponent
    }
  },
  render() {
    return (
      <div
        class={`${
          this.disable
            ? 'text-[rgba(0,0,0,0.1)]'
            : 'text-color2 hover:text-color1 ' + this.iconClass
        }`}
        title={this.address || this.icon}
      >
        {this.address ? (
          <>
            {this.icon === 'Discord' && !!validateDiscordUsername(this.address) ? (
              <span
                onClick={e => {
                  e.stopPropagation()
                  this.showTooltipRef = copy(this.address)
                }}
                onMouseleave={e => {
                  e.stopPropagation()
                  this.showTooltipRef = false
                }}
              >
                <UTooltip show={this.showTooltipRef}>
                  {{
                    trigger: () => this.asyncComponent(this.icon, this.iconClass),
                    default: () => 'Copied!'
                  }}
                </UTooltip>
              </span>
            ) : (
              <a href={`${this.icon === 'Email' ? 'mailto:' : ''}${this.address}`} target="_blank">
                {this.asyncComponent(this.icon, this.iconClass)}
              </a>
            )}
          </>
        ) : (
          this.asyncComponent(this.icon, this.iconClass)
        )}
      </div>
    )
  }
})

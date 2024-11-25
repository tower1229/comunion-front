import { message } from '@comunion/components'
import { CopyOutlined, TwitterFilled, DownLoadFilled } from '@comunion/icons'
import { defineComponent, ref, computed } from 'vue'
import image from '@/assets/invite.png'
import { useShare } from '@/hooks'

const indexUrl = import.meta.env.VITE_HOST
export const HeaderInfo = defineComponent({
  name: 'HeaderInfo',
  props: {
    comer: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const { shareToTwitter, copyText } = useShare()
    const invitePath = ref('invite')
    const comer = computed(() => props.comer)
    const handleCopy = (text: string) => {
      if (
        copyText({
          text: `Click the link to earn rewards on WELaunch Network: ${text}`
        })
      ) {
        message.success('Successfully copy.')
      }
    }
    const handleShareToTwitter = (url: string) => {
      shareToTwitter({
        image: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/183484253679616.png',
        route: url,
        description: ' ',
        text: 'Click the link to earn rewards on WELaunch Network: ',
        title:
          'WELaunch is the next generation all-in-one Decentralized Economy BUIDLing and Launch Network.'
      })
    }
    const downLoad = (name = '') => {
      const a = document.createElement('a') // 生成一个a元素
      const event = new MouseEvent('click') // 创建一个单击事件
      a.download = name || 'posters' // 设置图片名称
      a.href = 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/183484253679616.png' // 将生成的URL设置为a.href属性
      a.dispatchEvent(event)
    }
    return () => (
      <div class="w-full flex justify-between">
        <div>
          <p class="u-h2 text-color1">Refer Friends and Earn Rewards</p>
          <div class="u-h6 mt-6 mb-10 text-color1 text-[14px] leading-[20px]">
            <p>
              <span class="mr-1">·</span>Get 50 CAB for each Inactived invitees
            </p>
            <p>
              <span class="mr-1">·</span>Get100 CAB for each actived invitees
            </p>
            <p>
              <span class="mr-1">·</span>More than 30 invitees can get an extra 1000 CAB
            </p>
            <p>
              <span class="mr-1">·</span>More than 100 invitees can get an extra 5000 CAB
            </p>
          </div>
          <div>
            <p class="u-h4 mb-2  text-color1">Referral Link:</p>
            <div class="flex items-center">
              <p class="py-2 px-4 flex items-center border border-[#DADCE0] rounded-sm">
                <span class="u-h6 w-68 text-color1 mr-2.5 truncate">
                  {`https://${indexUrl}/${invitePath.value}?inviteCode=${
                    comer.value.invitation_code || ''
                  }`}
                </span>
                <CopyOutlined
                  onClick={() =>
                    handleCopy(
                      `https://${indexUrl}/${invitePath.value}?inviteCode=${
                        comer.value.invitation_code || ''
                      }`
                    )
                  }
                  class="text-primary cursor-pointer"
                />
              </p>
              <p
                onClick={() =>
                  handleShareToTwitter(
                    `https://${indexUrl}/${invitePath.value}?inviteCode=${
                      comer.value.invitation_code || ''
                    }`
                  )
                }
                class="group py-2 px-4 ml-5.5 flex items-center border border-[#DADCE0] cursor-pointer hover:text-primary hover:border-[#5331F4] rounded-sm"
              >
                <TwitterFilled class="text-color2 group-hover:text-primary" />
                <span class="u-h6 text-color2 ml-2 group-hover:text-primary">share</span>
              </p>
            </div>
          </div>
        </div>
        <div class="relative">
          <img class="w-111" src={image} alt="" />
          <DownLoadFilled
            onClick={() => downLoad()}
            class="absolute top-30 left-52.5 cursor-pointer"
          />
        </div>
      </div>
    )
  }
})

export default HeaderInfo

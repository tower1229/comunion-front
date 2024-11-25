import { ULazyImage, UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import styles from '../../index.module.css'
import defaultCover from './assets/default.png'
import SocialIcon from '@/components/SocialIcon'
import { contactList } from '@/pages/project/util'
import type { ComerProfileState } from '@/types'

export default defineComponent({
  props: {
    profile: {
      type: Object as PropType<ComerProfileState>,
      required: true
    }
  },
  setup(props) {
    function getSocialValue(type: string) {
      const socialItem = (props.profile.socials || []).find((item: any) => {
        return item.social_tool.name === type
      })
      return socialItem?.value || ''
    }
    const socialsObj = computed(() => {
      const result: any = {}
      contactList.forEach(item => {
        result[item.name] = getSocialValue(item.label)
      })
      return result
    })

    return {
      profile: props.profile,
      socialsObj
    }
  },
  render() {
    const skills = (this.profile?.skills || []).map((item: any) => item.tag.name) as string[]
    const hasDetailCont =
      this.profile.info?.bio ||
      skills.length ||
      this.profile.languages ||
      this.profile.educations ||
      this.profile.socials

    return (
      <div class="bg-white border-color-border border-1 pb-4 relative">
        <div class="bg-color-hover h-45">
          <img
            src={this.profile.banner || defaultCover}
            alt="bg"
            class="h-full object-cover w-full"
          />
        </div>
        <ULazyImage
          class="rounded-1/2 h-20 top-155px left-7 w-20 absolute xl:left-11"
          src={this.profile.avatar}
        />
        <div class="mt-18 mb-6 px-7 xl:px-12">
          <p class="text-color1 u-h3">{this.profile.name}</p>
          {(this.profile.location || this.profile.time_zone) && (
            <p class="mt-1 text-color3 u-h6">
              {this.profile.location} <strong class="px-1">·</strong> {this.profile.time_zone}
            </p>
          )}
        </div>
        {hasDetailCont ? (
          <div class="border-color-border border-t-1 py-6 px-7 xl:px-12">
            {this.profile.info?.bio && (
              <div class="font-weight-400 mb-6 text-[16px] text-color1 leading-[24px]">
                {this.profile.info?.bio}
              </div>
            )}
            {skills.length && (
              <div class="flex flex-wrap mb-6 gap-2 ">
                {skills.map(value => (
                  <UTag class="text-color2">{value}</UTag>
                ))}
              </div>
            )}
            {this.profile.languages && (
              <dl class={`u-h7 mb-4 ${styles.dlList}`}>
                <dt class="text-color1 ">Language</dt>
                <dd>{this.profile.languages.map(item => item.language?.name).join('、')}</dd>
              </dl>
            )}
            {this.profile.educations && (
              <dl class={`u-h7 mb-10 ${styles.dlList}`}>
                <dt class="text-color1 u-h7">Education</dt>
                <dd>{this.profile.educations.map(item => item.school).join('、')}</dd>
              </dl>
            )}
            {this.profile.socials && (
              <div class="flex mb-4 gap-8">
                {this.profile.socials.map(item => {
                  const social_tool_name = item?.social_tool?.name || ''
                  const social = this.socialsObj[social_tool_name.toLowerCase()]
                  return (
                    <SocialIcon
                      icon={social_tool_name}
                      disable={!social}
                      address={social}
                      class="h-6 text-[#b3b3b3] w-6"
                    />
                  )
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    )
  }
})

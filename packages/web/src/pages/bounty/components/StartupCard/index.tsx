import { UTag, UCard } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import SocialIcon from '@/components/SocialIcon'
import StartupLogo from '@/components/StartupLogo'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { contactList, getContactList } from '@/pages/project/util'
import { StartupCardResponse } from '@/types'
// import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupCardResponse>,
      require: true
    }
  },
  setup(props) {
    const router = useRouter()
    const toComerDetail = () => {
      props.startup?.id && router.push({ path: `/project/${props.startup?.id}` })
    }
    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup?.type || 0) as StartupTypesType
    )

    const socialList = computed(() => {
      return (props.startup ? getContactList(props.startup.socials) : [])
        .map(item => {
          const targetIndex = contactList.findIndex(type => type.value === item.type)
          return {
            ...item,
            label: targetIndex === -1 ? '' : contactList[targetIndex].label
          }
        })
        .filter(e => e.value)
    })

    return {
      modeName,
      toComerDetail,
      socialList
    }
  },
  render() {
    const startupTags = this.startup?.tags || []

    return (
      <UCard>
        <div class="flex ">
          <StartupLogo
            src={this.startup?.logo || ''}
            class="cursor-pointer h-15 mr-6 w-15"
            onClick={this.toComerDetail}
          />
          <div class="flex-1 overflow-hidden">
            <div class="mb-2 text-color1 truncate u-h3">{this.startup?.name}</div>
            <div class="flex items-center">
              {(this.startup?.type || 0) > 0 && <UTag class="text-color2">{this.modeName}</UTag>}
              {/* {this.startup?.chain_id ? (
                <img
                  src={getChainInfoByChainId(this.startup?.chain_id)?.logo}
                  class="h-4 ml-2 w-4"
                  title={getChainInfoByChainId(this.startup?.chain_id)?.shortName}
                />
              ) : null} */}
            </div>
          </div>
        </div>
        {startupTags.length > 0 && (
          <div class="flex flex-wrap mt-4 text-[#211B42] gap-2">
            {startupTags.slice(0, 4).map(item => {
              return <UTag key={item.id}>{item.tag?.name}</UTag>
            })}

            {startupTags.length - 4 > 0 ? <UTag>+ {startupTags.length - 4}</UTag> : null}
          </div>
        )}
        {this.startup?.mission && (
          <p class="mt-2 text-color2 u-h5 line-clamp-3">{this.startup?.mission}</p>
        )}
        <div class="flex mt-4 gap-6">
          {this.socialList.map(item => (
            <SocialIcon icon={item.label} disable={!item.value} address={item.value} />
          ))}
        </div>
      </UCard>
    )
  }
})

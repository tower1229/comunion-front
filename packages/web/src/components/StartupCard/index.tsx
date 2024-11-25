import { UTag, UCard } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import SocialIcon from '@/components/SocialIcon'
import StartupLogo from '@/components/StartupLogo'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { contactList, getContactList } from '@/pages/project/util'
import { StartupDetail } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupDetail>,
      require: true
    }
  },
  setup(props) {
    const router = useRouter()
    const toComerDetail = () => {
      router.push({ path: `/project/${props.startup?.id}` })
    }

    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup?.type || 0) as StartupTypesType
    )
    const tags = computed(() => {
      if (Array.isArray(props.startup?.tags)) {
        return props.startup?.tags.map(item => item.tag?.name)
      }
      return []
    })

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
      tags,
      toComerDetail,
      socialList
    }
  },
  render() {
    return (
      <UCard>
        <div class="flex">
          <StartupLogo
            src={this.startup?.logo || ''}
            class="cursor-pointer h-15 mr-4 w-15"
            onClick={this.toComerDetail}
          />
          <div class="flex-1">
            <div class="mb-3 text-color1 truncate u-h3">{this.startup?.name}</div>
            <div class="flex items-center">
              {(this.startup?.type || 0) > 0 && <UTag class="text-color2">{this.modeName}</UTag>}
              {this.startup?.chain_id ? (
                <img
                  src={getChainInfoByChainId(this.startup?.chain_id)?.logo}
                  class="h-4 ml-2 w-4"
                  title={getChainInfoByChainId(this.startup.chain_id)?.shortName}
                />
              ) : null}
            </div>
          </div>
        </div>
        {this.tags?.length ? (
          <div class={['flex flex-wrap gap-2 mt-4']}>
            {this.tags.slice(0, 4).map((value, $index) => {
              return $index + 1 < 4 && <UTag key={value}>{value}</UTag>
            })}

            {this.tags.length - 3 > 1 ? <UTag>+ {this.tags.length - 3}</UTag> : null}
          </div>
        ) : null}
        {this.startup?.mission && (
          <p class="mt-4 text-color2 break-all u-h5 line-clamp-2">{this.startup?.mission}</p>
        )}
        {this.socialList.length ? (
          <div class="flex mt-4 gap-4">
            {this.socialList.map(item => (
              <SocialIcon icon={item.label} disable={!item.value} address={item.value} />
            ))}
          </div>
        ) : null}
      </UCard>
    )
  }
})

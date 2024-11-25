import { UTag } from '@comunion/components'
import { defineComponent, computed, ref, watch, PropType } from 'vue'
import defaultCover from './assets/cover.png'
import SocialIcon from '@/components/SocialIcon'
import StartupLogo from '@/components/StartupLogo'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { contactList, goTxHashPath, getContactList } from '@/pages/project/util'
import { StartupDetail } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import './style.css'

export default defineComponent({
  props: {
    startup: {
      type: Object as PropType<StartupDetail>,
      required: true
    }
  },
  setup(props) {
    const modeName = computed(() => {
      return getStartupTypeFromNumber(props.startup.type) as StartupTypesType
    })
    const loading = ref<boolean>(false)
    let theChainName = getChainInfoByChainId(props.startup.chain_id)?.shortName || ''

    watch(
      () => props.startup,
      () => {
        if (props.startup.on_chain) {
          theChainName = props.startup.tx_hash
          if (theChainName.length > 11) {
            theChainName =
              props.startup.tx_hash.substring(0, 7) +
              '...' +
              props.startup.tx_hash.substring(
                props.startup.tx_hash.length - 5,
                props.startup.tx_hash.length - 1
              )
          }
        } else {
          theChainName = 'Non-Blockchian'
        }
      },
      {
        immediate: true
      }
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

    const goPath = () => {
      if (props.startup?.on_chain) {
        goTxHashPath(props.startup.chain_id, props.startup.tx_hash)
      }
    }

    return {
      modeName,
      loading,
      socialList,
      theChainName,
      goPath
    }
  },
  render() {
    return (
      <div class="bg-white border rounded-sm mb-6 relative">
        <div class="h-45 overflow-hidden">
          <img
            src={this.startup?.banner || defaultCover}
            alt="bg"
            class="h-full object-cover w-full"
          />
          {/* {!this.startup?.banner && (
            <div class="text-right top-19 right-10 absolute">
              <div class="font-normal text-color2 u-h3">
                Nothing is more powerful than an idea whose time has come
              </div>
              <div class="mt-9 text-color3 u-h6">Victor Hugo</div>
            </div>
          )} */}
        </div>

        <div class="px-6 -top-6 relative">
          <div class="flex items-center justify-between">
            <StartupLogo src={this.startup?.logo || ''} class="bg-white h-20 w-20 " />
            {this.theChainName && (
              <div class="rounded flex mt-2 py-0.25rem items-center">
                <img
                  src={
                    this.startup?.on_chain
                      ? getChainInfoByChainId(this.startup?.chain_id || 1)?.logo
                      : getChainInfoByChainId(this.startup?.chain_id || 1)?.nologo
                  }
                  class="h-5 mr-2 w-5"
                />
                <span
                  class={`u-h7 truncate text-color3 ${
                    this.startup?.on_chain ? 'cursor-pointer hover:text-primary' : ''
                  }`}
                  onClick={() => this.goPath()}
                >
                  {this.theChainName}
                </span>
              </div>
            )}
          </div>
          <div class="mt-2">
            <p class="mr-4 text-color1 inline-block u-h2">{this.startup?.name}</p>
            {this.startup && this.startup.type > 0 && <UTag>{this.modeName}</UTag>}
            <p class="mt-4 text-color2 u-h6">{this.startup?.mission}</p>
            <div class="flex flex-wrap mt-5 gap-2">
              {Array.isArray(this.startup?.tags) &&
                this.startup?.tags.map(
                  (item: {
                    tag?: {
                      id: number
                      name: string
                      type: number
                    }
                  }) => {
                    return (
                      <UTag key={item.tag?.id} class="text-color1 ">
                        {item.tag?.name}
                      </UTag>
                    )
                  }
                )}
            </div>
            <div class="flex mt-6 gap-5 items-center">
              {this.socialList.map(item => (
                <SocialIcon icon={item.label} disable={!item.value} address={item.value} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

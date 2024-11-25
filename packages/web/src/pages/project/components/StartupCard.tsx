import { UTag } from '@comunion/components'
import { pluralize } from 'inflected'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { StartupItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  render() {
    const propsTags = this.startup?.tags || []
    const hashtagsArray = propsTags.map(tagItem => {
      return tagItem?.tag?.name
    })
    const modeName = getStartupTypeFromNumber(this.startup?.type || 0) as StartupTypesType

    const router = useRouter()

    const toStartDetail = (startupInfo: StartupItem) => {
      router.push({ path: `/project/${startupInfo.id}` })
    }
    const theChainName = getChainInfoByChainId(this.startup.chain_id)?.shortName
    return (
      <div
        class="bg-white border border-color-border rounded-sm cursor-pointer h-90 top-0 relative hover:bg-color-hover"
        style="transition:all ease .3s"
        onClick={() => toStartDetail(this.startup)}
      >
        <div class="p-6 ">
          <div class="flex items-center">
            <StartupLogo
              src={this.startup?.logo || ''}
              class="bg-white rounded h-3.75rem mr-0.75rem w-3.75rem !object-cover"
            />
            <div class="flex-1 ">
              <div class="mb-0.5rem float-right">
                {this.startup.type && this.startup.type > 0 ? (
                  <UTag
                    class="text-color2 !h-6"
                    // type="filled"
                    // bgColor={STARTUP_TYPES_SUBCOLOR_MAP[modeName]}
                    // style={{ color: STARTUP_TYPES_COLOR_MAP[modeName] }}
                  >
                    {modeName}
                  </UTag>
                ) : null}
              </div>
              <div class="float-right clear-right">
                {theChainName && (
                  <div
                    class=" flex py-1 items-center"
                    // style={{
                    //   color: NETWORKS_COLOR_MAP[theChainName.split(' ').join('')],
                    //   background: NETWORKS_SUBCOLOR_MAP[theChainName.split(' ').join('')]
                    // }}
                  >
                    <img
                      src={getChainInfoByChainId(this.startup.chain_id)?.logo}
                      class="h-4 mr-1 w-4"
                    />
                    <span class="text-color2 truncate u-h6">{theChainName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class="mt-12 mb-1 text-color1 truncate u-h3" title={this.startup.name}>
            {this.startup.name}
          </div>
          <p class="mb-2 text-color3 break-all u-h6 line-clamp-3">{this.startup.mission}</p>
          <div class="flex flex-wrap gap-2">
            {hashtagsArray.map((key: any, value: any) => {
              return (
                value < 4 && (
                  <UTag key={value} class="text-color1">
                    {key}
                  </UTag>
                )
              )
            })}

            {hashtagsArray.length - 4 > 0 ? (
              <UTag class="text-color1">+ {hashtagsArray.length - 4}</UTag>
            ) : null}
          </div>
          {/* footer */}
          <div class="right-6 bottom-6 left-6 absolute">
            <div class="flex items-center">
              <span class="h-4 px-2 text-color2 inline-block u-h7">
                <strong class="mr-0.2rem text-color3">{this.startup.connected_total}</strong>
                {(this.startup?.connected_total || 0) > 1 ? pluralize('Connection') : 'Connection'}
              </span>
              <div class="flex-1"></div>
              {this.startup.kyc && <UTag class="text-color2">KYC</UTag>}
              {this.startup.contract_audit && <UTag class="ml-2 text-color2">AUDIT</UTag>}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard

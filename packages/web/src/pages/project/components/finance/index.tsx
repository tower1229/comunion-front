import { UAddress, UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { allNetworks } from '@/constants'
import { StartupDetail } from '@/types'

export default defineComponent({
  name: 'StartupFinance',
  props: {
    startup: {
      type: Object as PropType<StartupDetail>
    }
  },
  setup(props) {
    const financeBasic = computed(() => {
      // TODO don' know launchNetwork the mean
      const findNet = allNetworks.find(
        network =>
          props.startup?.finance?.chain_id && network.chainId === props.startup.finance.chain_id
      )
      return [
        {
          name: 'Launch Network ：',
          value: findNet ? findNet.name : ''
        },
        {
          name: 'Token Name ：',
          value: props.startup?.finance?.name
        },
        {
          name: 'Token Symbol ：',
          value: props.startup?.finance?.symbol
        },
        {
          name: 'Token Supply ：',
          value: props.startup?.finance?.supply
            ? Number(props.startup?.finance?.supply).toLocaleString()
            : ''
        },
        {
          name: 'Token Concract ：',
          value: props.startup?.finance?.contract_address ? (
            <UAddress
              class="!inline-flex"
              autoSlice
              address={props.startup?.finance?.contract_address}
              blockchainExplorerUrl={`${blockchainExplorerUrl.value}/address/`}
            />
          ) : (
            ''
          )
        },
        {
          name: 'Presale ：',
          value:
            props.startup?.finance?.presale_started_at &&
            props.startup?.finance?.presale_ended_at &&
            Number(props.startup?.finance?.presale_started_at) &&
            Number(props.startup?.finance?.presale_ended_at)
              ? `${dayjs
                  .utc(Number(props.startup?.finance?.presale_started_at))
                  .format('YYYY-MM-DD')} ~ ${dayjs
                  .utc(Number(props.startup?.finance?.presale_ended_at))
                  .format('YYYY-MM-DD UTC')}`
              : ''
        },
        {
          name: 'Launch ：',
          value:
            props.startup?.finance?.launched_at && Number(props.startup?.finance?.launched_at)
              ? dayjs.utc(Number(props.startup?.finance?.launched_at)).format('YYYY-MM-DD UTC')
              : ''
        }
      ]
    })

    const wallets = computed(() => {
      // return [{ name: 'skkskkskssksksk', value: 'skdflsjflsjdfj' }]
      return (
        props.startup?.finance?.wallets &&
        props.startup?.finance?.wallets
          .filter(wallet => wallet.name && wallet.address)
          .map(item => ({
            name: item.name,
            value: item.address
          }))
      )
    })

    const blockchainExplorerUrl = computed(
      () =>
        allNetworks.find(item => {
          return item.chainId === props.startup?.chain_id
        })?.explorerUrl
    )

    return { financeBasic, wallets, blockchainExplorerUrl }
  },
  render() {
    const renderList = this.financeBasic.filter(item => !!item.value)

    return (
      <UCard title="Finance" class="mb-6">
        {renderList.length ? (
          <div class="flex flex-col">
            {renderList.map(item => {
              return (
                <div class="flex mt-4 items-center">
                  <p class=" font-medium tracking-normal  text-[14px] w-32 overflow-hidden">
                    {item.name}
                  </p>
                  <p
                    class={`flex-1 tracking-normal u-h5 overflow-hidden text-color3 ${
                      item.name.includes('Token Concract') ? 'text-color2' : ''
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              )
            })}
            {(this.wallets || [])?.length > 0 && (
              <div class="border-color-border  border-t-1 mt-6">
                <div class="my-6 text-color3 u-h5">Wallet</div>

                {(this.wallets || []).map(item => {
                  return (
                    <div class="flex mb-2">
                      <p class=" font-medium mr-2  tracking-normal text-[14px] w-30 overflow-hidden truncate">
                        {item.name}
                      </p>
                      <UAddress
                        class=" text-color2"
                        autoSlice
                        address={item.value}
                        blockchainExplorerUrl={`${this.blockchainExplorerUrl}/address/`}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : null}
      </UCard>
    )
  }
})

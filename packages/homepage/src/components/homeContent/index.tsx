import { defineComponent, ref } from 'vue'
import ShareOutlined from '@/assets/shareOutlined.svg'

export default defineComponent({
  name: 'homeContent',
  setup() {
    const list = ref([
      {
        title: 'A New Era of Blockchain Economy',
        content: `WEconomy is an all-in-one growth suite for empowering the blockchain economy with the power of coordinated growth offered by three components that helps chains, Dexs and projects grow organically and rapidly.`
      },
      {
        title: 'WELaunch',
        content: `An all-in-one blockchain projects launchpad, provides project launch, decentralized fundraising, on-chain governance and bounty that is devoted to helping buidlers launch their projects easily with non-code and zero costs.`,
        link: '//welaunch.work'
      },
      {
        title: 'TokenChart',
        content: `A one-stop gateway of Defi provides real-time price charts and trading data analysis across multi-chains and Dexs that integrates many utility tools, including watchlist, DeFi portfolio tracker, notebook, price alert etc.`,
        link: '//TokenChart.in'
      },
      {
        title: 'Rollex',
        content: `The first community-driven Decentralised Perpetual Exchange with up to 50x leverage on RolluxL2.`,
        link: '//Rollex.finance'
      },
      {
        title: 'EchoSwap',
        content: `The innovative community-owned native liquidity marketplace driving ve(3,3)`,
        link: '//echoswap.xyz'
      },
      {
        title: 'GoRollux',
        content: `No-code RolluxL2 launchpad enabling builders to effortlessly launch projects with decentralized fundraising, on-chain governance, and bounties.`,
        link: '//gorollux.com'
      },
      {
        title: 'SideSwap',
        content: `The leading dex and liquidity marketplace on OpsideZK powered by #ZK-RaaS.`,
        link: '//sideswap.finance'
      }
    ])

    return {
      list
    }
  },
  render() {
    return (
      <ul class="<lg:px-4">
        {this.list.map(item => (
          <li class="border-color-border border-b-1 py-9 last:border-b-0">
            <h2
              class={
                'font-600 text-base mb-2' +
                (item.link ? ' text-primary cursor-pointer hover:opacity-80' : ' text-color1')
              }
              onClick={() => item.link && window.open(item.link)}
            >
              {item.title}
              {item.link ? (
                <img
                  src={ShareOutlined}
                  class="h-3 -mt-1 ml-1 text-color3 w-3 inline-block align-middle"
                />
              ) : null}
            </h2>
            <div class="text-grey1 leading-5">{item.content}</div>
          </li>
        ))}
      </ul>
    )
  }
})

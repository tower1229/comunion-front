import { MoneyIconFilled } from '@comunion/icons'
import { defineComponent, computed } from 'vue'
import anytoken from '@/assets/networks/anytoken.svg'
import { allNetworks } from '@/constants'

export default defineComponent({
  props: {
    symbol: {
      type: String
    }
  },
  setup(props, ctx) {
    const coinImg = computed(() => {
      const supportImg = allNetworks.find(network => network.currencySymbol === props.symbol)?.logo
      if (supportImg) return <img src={supportImg} />
      // usdc
      if (props.symbol === 'USDC') return <MoneyIconFilled />
      return <img src={anytoken} />
    })

    return {
      coinImg
    }
  },
  render() {
    return <div>{this.coinImg}</div>
  }
})

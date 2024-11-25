import { SelectOption } from '@comunion/components/src/constants'
import { ethers } from 'ethers'
import { AVAX_USDC_ADDR } from '@/contracts/utils'

export function getBuyCoinAddress(mainCoinAddress: string): Record<number, SelectOption[]> {
  return {
    1: [
      { label: 'ETH', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[1] }
    ],
    5: [
      { label: 'GoerliETH', value: mainCoinAddress },
      { label: 'QT13', value: AVAX_USDC_ADDR[5] }
    ],
    56: [
      { label: 'BNB', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[56] }
    ],
    97: [
      { label: 'TBNB', value: mainCoinAddress },
      { label: 'QCTS', value: AVAX_USDC_ADDR[97] }
    ],
    2814: [
      { label: 'RSYS', value: mainCoinAddress },
      { label: 'SUSDC', value: AVAX_USDC_ADDR[2814] }
    ],
    4002: [
      { label: 'FTM', value: mainCoinAddress },
      { label: 'QCTS', value: AVAX_USDC_ADDR[4002] }
    ],
    250: [
      { label: 'FTM', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[250] }
    ],
    43113: [
      { label: 'AVAX', value: mainCoinAddress },
      { label: 'V-USDC', value: AVAX_USDC_ADDR[43113] }
    ],
    43114: [
      { label: 'AVAX', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[43114] }
    ],
    80001: [
      { label: 'MATIC', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[80001] }
    ],
    137: [
      { label: 'MATIC', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[137] }
    ],
    57: [
      { label: 'SYS', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[57] }
    ],
    57000: [{ label: 'TSYS', value: mainCoinAddress }]
  }
}

export const getMainTokenDecimal = () => {
  const oneEther = ethers.utils.parseUnits('1.0', 'ether')
  return oneEther.toString().length - 1
}

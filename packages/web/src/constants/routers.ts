export type Router = {
  icon: string
  dex: string
  address: string
  chainId: number
}

export const routers: Router[] = [
  {
    icon: '',
    dex: 'Uniswap',
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    chainId: 1
  },
  {
    icon: '',
    dex: 'Pegasys',
    address: '0x017dAd2578372CAEE5c6CddfE35eEDB3728544C4',
    chainId: 57
  },
  {
    icon: '',
    dex: 'Spooky',
    address: '0xF491e7B69E4244ad4002BC14e878a34207E38c29',
    chainId: 250
  },
  {
    icon: '',
    dex: 'Pancakeswap',
    address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    chainId: 56
  },
  {
    icon: '',
    dex: 'Quickswap',
    address: '0x1FE9fBA5955Af58C18057213F0151BBE893aB2c8',
    chainId: 137
  },
  {
    icon: '',
    dex: 'Uniswap',
    address: '0x52B2031Ea4232b68b88e1577206dc388EFcE2E49',
    chainId: 97
  },
  {
    icon: '',
    dex: 'Uniswap',
    address: '0x52B2031Ea4232b68b88e1577206dc388EFcE2E49',
    chainId: 4002
  },
  {
    icon: '',
    dex: 'Uniswap',
    address: '0x52B2031Ea4232b68b88e1577206dc388EFcE2E49',
    chainId: 5700
  },
  {
    icon: '',
    dex: 'Pegasys',
    address: '0x29f7Ad37EC018a9eA97D4b3fEebc573b5635fA84',
    chainId: 57000
  },
  {
    icon: '',
    dex: 'Pegasys',
    address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    chainId: 80001
  },
  {
    icon: '',
    dex: 'Sushi v2',
    address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    chainId: 43113
  }
]

export const findRouterByChainId = (chainId: number) => {
  return routers.filter(item => item.chainId === chainId)
}

export const findRouterByAddress = (address: string) => {
  return routers.find(router => router.address.toLowerCase() === address.toLowerCase())
}

import { allNetworks } from '@/constants'
import { SocialType } from '@/types'

export const goTxHashPath = (chainId: number, address: string) => {
  const url = allNetworks.find(item => {
    return item.chainId === chainId
  })?.explorerUrl
  if (url) {
    window.open(`${url}/tx/${address}`, address)
  }
}

export const contactList = [
  { label: 'Email', value: 1, name: 'email' },
  { label: 'Website', value: 2, name: 'website' },
  { label: 'Twitter', value: 3, name: 'twitter' },
  { label: 'Discord', value: 4, name: 'discord' },
  { label: 'Telegram', value: 5, name: 'telegram' },
  { label: 'Medium', value: 6, name: 'medium' },
  { label: 'Facebook', value: 7, name: 'facebook' },
  { label: 'Linktree', value: 8, name: 'linktree' },
  { label: 'Youtube', value: 9, name: 'youtube' },
  { label: 'Reddit', value: 10, name: 'reddit' },
  { label: 'Docs', value: 11, name: 'docs' }
]

export const getContactList = (socials?: SocialType[]) => {
  const startupSocials = Array.isArray(socials) ? socials : []

  return contactList.map(item => {
    const targetIndex = startupSocials.findIndex(social => social.social_tool?.name === item.label)
    return {
      social_tool_id: targetIndex === -1 ? undefined : startupSocials[targetIndex].social_tool_id,
      type: item.value,
      value: targetIndex === -1 ? undefined : startupSocials[targetIndex].value,
      label: item.label
    }
  })
}

export const getContactByType = (type: string | number) => {
  return contactList.find(item => item.value === Number(type))
}

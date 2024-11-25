import { ServiceReturn } from '@/services'

export type CrowdfundingItem = NonNullable<
  NonNullable<ServiceReturn<'Crowdfunding@get-crowdfunding'>>['list']
>[number]

export type SaleCrowdfundingItem = NonNullable<
  NonNullable<ServiceReturn<'SaleLaunchpad@get-sale-launchpad'>>['list']
>[number]

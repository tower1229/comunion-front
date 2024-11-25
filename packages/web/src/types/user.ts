import { ComerAccount } from '@/components/OAuth/Link/OAuthLinkWidget'

export interface UserProfileState {
  address: string
  avatar: string
  id: number
  /**
   * @description comer is seted, if false then set name
   */
  is_seted: boolean
  name: string
}

export interface ComerProfileState {
  accounts?: {
    avatar: string
    comer_id: number
    id: number
    is_linked: boolean
    is_primary: boolean
    nickname: string
    oin: string
    type: number
    custom_domain: string
  }[]
  address: string
  avatar: string
  banner: string
  connected_total?: {
    be_connect_comer_total?: number
    connect_comer_total?: number
    connect_startup_total?: number
  }
  custom_domain: string
  educations?: {
    comer_id: number
    graduated_at: string
    id: number
    major: string
    school: string
  }[]
  id: number
  info?: {
    bio: string
    comer_id: number
    id: number
  }
  is_connected: boolean
  languages?: {
    comer_id: number
    id: number
    language?: {
      code: string
      id: number
      name: string
    }
    language_id: number
    level: number
  }[]
  location: string
  name: string
  skills?: {
    id: number
    tag?: {
      id: number
      name: string
      type: number
    }
    tag_id: number
    target_id: number
    type: number
  }[]
  socials?: {
    id: number
    social_tool?: {
      id: number
      logo: string
      name: string
    }
    social_tool_id: number
    target_id: number
    type: number
    value: string
  }[]
  time_zone: string
}

export interface UserResponse
  extends Omit<UserProfileState, 'oauth' | 'walletAddress' | 'is_seted'> {
  address: string
  nick?: string
  token: string
  is_seted: boolean
  comerId: number
  oauthLinked: boolean
  oauthAccountId: number
  firstLogin: boolean
  comerAccounts: ComerAccount[]
}

export type ComerBasicResponse = {
  address: string
  avatar: string
  banner: string
  id: number
  is_connected: boolean
  location: string
  name: string
  time_zone: string
}

export type TagResponse = {
  id: number
  name: string
  type: number
}

export type TagRelationResponse = {
  id: number
  tag?: TagResponse
  tag_id: number
  target_id: number
  type: number
}

export type StartupItem = {
  chain_id: number
  comer_id: number
  connected_total?: number
  contract_audit: string
  id: number
  is_connected: boolean
  kyc: string
  logo: string
  mission: string
  name: string
  on_chain: boolean
  tags?: TagRelationResponse[]
  tx_hash: string
  type: number
}

export type SocialType = {
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
}

export type StartupFinanceWallet = {
  address: string
  id: number
  name: string
  startup_finance_id: number
  startup_id: number
}

export type StartupFinance = {
  chain_id: number
  comer_id: number
  contract_address: string
  id: number
  launched_at: string
  name: string
  presale_ended_at: string
  presale_started_at: string
  startup_id: number
  supply: number
  symbol: string
  wallets?: StartupFinanceWallet[]
}

export type StartupTeamGroup = {
  comer_id?: number
  id: number
  name: string
  startup_id?: number
}

export type StartupTeam = {
  comer?: {
    address: string
    avatar: string
    banner: string
    id: number
    is_connected: boolean
    location: string
    name: string
    time_zone: string
  }
  comer_id: number
  id: number
  position: string
  startup_id: number
  startup_team_group?: StartupTeamGroup
  startup_team_group_id: number
}

export type StartupDetail = {
  banner: string
  chain_id: number
  comer_id: number
  connected_total?: number
  contract_audit: string
  finance?: StartupFinance
  id: number
  is_connected: boolean
  kyc: string
  logo: string
  mission: string
  name: string
  on_chain: boolean
  overview: string
  socials?: SocialType[]
  tab_sequence: string
  tags?: TagRelationResponse[]
  team?: StartupTeam[]
  tx_hash: string
  type: number
}

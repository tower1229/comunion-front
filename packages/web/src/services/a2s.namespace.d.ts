/* eslint-disable */
interface BasicDto {
  [key: string]: any
}
export declare namespace ApiDocuments {
  export interface model_BountyContact extends BasicDto {
    bounty_id: number
    id: number
    type: number
    value: string
  }
  export interface model_BountyPaymentPeriod extends BasicDto {
    bounty_id: number
    hours_per_day: number
    id: number
    period: number
    period_type: number
    terms: string
    token1_amount: number
    token1_symbol: string
    token2_amount: number
    token2_symbol: string
  }
  export interface model_BountyPaymentTerms extends BasicDto {
    bounty_id: number
    id: number
    paid_info: string
    sort_index: number
    status: number
    terms: string
    token1_amount: number
    token1_symbol: string
    token2_amount: number
    token2_symbol: string
  }
  export interface model_ComerAccount extends BasicDto {
    avatar: string
    comer_id: number
    id: number
    is_linked: boolean
    is_primary: boolean
    nickname: string
    oin: string
    type: number
  }
  export interface model_ComerAccountORM extends BasicDto {
    avatar: string
    comer_id: number
    created_at?: string
    id: number
    is_linked: boolean
    is_primary: boolean
    nickname: string
    oin: string
    type: number
    updated_at?: string
  }
  export interface model_ComerConnectedTotal extends BasicDto {
    be_connect_comer_total?: number
    connect_comer_total?: number
    connect_startup_total?: number
  }
  export interface model_ComerEducation extends BasicDto {
    comer_id: number
    graduated_at: string
    id: number
    major: string
    school: string
  }
  export interface model_ComerEducationORM extends BasicDto {
    comer_id: number
    created_at?: string
    graduated_at: string
    id: number
    major: string
    school: string
    updated_at?: string
  }
  export interface model_ComerInfo extends BasicDto {
    bio: string
    comer_id: number
    id: number
  }
  export interface model_ComerInfoORM extends BasicDto {
    bio: string
    comer_id: number
    created_at?: string
    id: number
    updated_at?: string
  }
  export interface model_ComerLanguageORM extends BasicDto {
    comer_id: number
    created_at?: string
    id: number
    language?: ApiDocuments.model_LanguageORM
    language_id: number
    level: number
    updated_at?: string
  }
  export interface model_ComerORM extends BasicDto {
    accounts?: ApiDocuments.model_ComerAccountORM[]
    activation: boolean
    address: string
    avatar: string
    banner: string
    connected_total?: ApiDocuments.model_ComerConnectedTotal
    created_at?: string
    custom_domain: string
    educations?: ApiDocuments.model_ComerEducationORM[]
    id: number
    info?: ApiDocuments.model_ComerInfoORM
    invitation_code: string
    is_connected: boolean
    languages?: ApiDocuments.model_ComerLanguageORM[]
    location: string
    name: string
    skills?: ApiDocuments.model_TagRelationORM[]
    socials?: ApiDocuments.model_SocialBookORM[]
    time_zone: string
    updated_at?: string
  }
  export interface model_CrowdfundingInvestor extends BasicDto {
    /**
     * @description current balance of bought token
     */
    buy_token_balance?: number
    /**
     * @description total bought token
     */
    buy_token_total?: number
    comer_id?: number
    crowdfunding_id?: number
    id: number
    /**
     * @description current balance sold token
     */
    sell_token_balance?: number
    /**
     * @description total sold token
     */
    sell_token_total?: number
  }
  export interface model_GovernanceAdmin extends BasicDto {
    address: string
    id: number
    setting_id: number
  }
  export interface model_GovernanceStrategy extends BasicDto {
    chain_id: number
    dict_value: string
    id: number
    setting_id: number
    strategy_name: string
    token_contract_address: string
    token_min_balance: number
    vote_decimals: number
    vote_symbol: string
  }
  export interface model_Language extends BasicDto {
    code: string
    id: number
    name: string
  }
  export interface model_LanguageORM extends BasicDto {
    code: string
    created_at?: string
    id: number
    name: string
    updated_at?: string
  }
  export interface model_ProposalChoice extends BasicDto {
    id: number
    item_name: string
    proposal_id: number
    seq_num: number
    vote_total: number
  }
  export interface model_Reward extends BasicDto {
    bounty_id: number
    token1_amount: number
    token1_symbol: string
    token2_amount: number
    token2_symbol: string
  }
  export interface model_SimpleStartupInfo extends BasicDto {
    avatar?: string
    id?: number
    name?: string
    on_chain?: boolean
  }
  export interface model_SocialBookORM extends BasicDto {
    created_at?: string
    id: number
    social_tool?: ApiDocuments.model_SocialToolORM
    social_tool_id: number
    target_id: number
    type: number
    updated_at?: string
    value: string
  }
  export interface model_SocialToolORM extends BasicDto {
    created_at?: string
    id: number
    logo: string
    name: string
    updated_at?: string
  }
  export interface model_StartupBasic extends BasicDto {
    banner: string
    chain_id: number
    comer_id: number
    contract_audit: string
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    tx_hash: string
    type: number
  }
  export interface model_StartupFinanceWallet extends BasicDto {
    address: string
    id: number
    name: string
    startup_finance_id: number
    startup_id: number
  }
  export interface model_StartupTeamGroup extends BasicDto {
    comer_id: number
    id: number
    name: string
    startup_id: number
  }
  export interface model_StartupTeamGroupORM extends BasicDto {
    comer_id: number
    created_at?: string
    id: number
    name: string
    startup_id: number
    updated_at?: string
  }
  export interface model_TagORM extends BasicDto {
    ad?: number
    created_at?: string
    id: number
    name: string
    type: number
    updated_at?: string
  }
  export interface model_TagRelationORM extends BasicDto {
    created_at?: string
    id: number
    tag?: ApiDocuments.model_TagORM
    tag_id: number
    target_id: number
    type: number
    updated_at?: string
  }
  export interface proto_AdminRequest extends BasicDto {
    wallet_address?: string
  }
  export interface proto_ApplyBountyCreateRequest extends BasicDto {
    /**
     * @description bounty applicant deposit
     */
    deposit?: number
    /**
     * @description bounty description
     */
    description: string
    /**
     * @description bounty tx hash
     */
    tx_hash?: string
  }
  export interface proto_BountyApplicant extends BasicDto {
    apply_at: string
    approve_at: string
    bounty_id: number
    comer?: ApiDocuments.proto_BountyComer
    comer_id: number
    created_at?: string
    description: string
    id: number
    refunded_at: string
    status: number
  }
  export interface proto_BountyBasicResponse extends BasicDto {
    applicant_count: number
    applicant_deposit: number
    applicant_min_deposit: number
    apply_deadline: string
    chain_id?: number
    comer_id: number
    contract_address: string
    created_at?: string
    deposit_contract_address: string
    deposit_contract_token_decimal: number
    deposit_contract_token_symbol: string
    discussion_link: string
    expired_time: string
    founder_deposit: number
    id: number
    is_lock: number
    payment_mode: number
    reward?: ApiDocuments.model_Reward
    skills?: ApiDocuments.proto_TagRelationResponse[]
    startup?: ApiDocuments.model_StartupBasic
    startup_id: number
    status: number
    title: string
    tx_hash: string
  }
  export interface proto_BountyComer extends BasicDto {
    activation: boolean
    address: string
    avatar: string
    banner: string
    custom_domain: string
    id: number
    invitation_code: string
    is_connected: boolean
    location: string
    name: string
    skills?: ApiDocuments.proto_TagRelationResponse[]
    time_zone: string
  }
  export interface proto_BountyContact extends BasicDto {
    type: number
    value: string
  }
  export interface proto_BountyCreateRequest extends BasicDto {
    applicant_min_deposit?: number
    contacts: ApiDocuments.proto_BountyContact[]
    deposit_contract_token_symbol: string
    /**
     * @description bounty description
     */
    description: string
    discussion_link?: string
    founder_deposit?: number
    payment_mode: number
    period?: ApiDocuments.proto_BountyPaymentPeriod
    skills: string[]
    stages?: ApiDocuments.proto_BountyPaymentStage[]
    /**
     * @description on-chain startup id
     */
    startup_id: number
    /**
     * @description bounty title
     */
    title: string
    /**
     * @description tx hash
     */
    tx_hash: string
  }
  export interface proto_BountyDepositRecord extends BasicDto {
    amount: number
    bounty_id: number
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id: number
    created_at?: string
    id: number
    mode: number
    status: number
    tx_hash: string
  }
  export interface proto_BountyInfoResponse extends BasicDto {
    applicant_deposit: number
    applicant_min_deposit: number
    applicants?: ApiDocuments.proto_BountyApplicant[]
    apply_deadline: string
    approved?: ApiDocuments.proto_BountyApplicant
    chain_id?: number
    comer_id: number
    contacts?: ApiDocuments.model_BountyContact[]
    contract_address: string
    created_at?: string
    deposit_contract_address: string
    deposit_contract_token_decimal: number
    deposit_contract_token_symbol: string
    deposit_records?: ApiDocuments.proto_BountyDepositRecord[]
    description: string
    discussion_link: string
    expired_time: string
    founder?: ApiDocuments.proto_BountyComer
    founder_deposit: number
    id: number
    is_lock: number
    my_deposit: number
    my_role: number
    my_status: number
    payment_mode: number
    period?: ApiDocuments.model_BountyPaymentPeriod
    post_updates?: ApiDocuments.proto_PostUpdate[]
    skills?: ApiDocuments.proto_TagRelationResponse[]
    startup?: ApiDocuments.proto_StartupCardResponse
    startup_id: number
    status: number
    terms?: ApiDocuments.model_BountyPaymentTerms[]
    title: string
    tx_hash: string
  }
  export interface proto_BountyPaymentPeriod extends BasicDto {
    hours_per_day: number
    period: number
    period_type: number
    terms: string
    token1_amount: number
    token1_symbol: string
    token2_amount?: number
    token2_symbol?: string
  }
  export interface proto_BountyPaymentStage extends BasicDto {
    sort_index: number
    terms?: string
    token1_amount: number
    token1_symbol: string
    token2_amount?: number
    token2_symbol?: string
  }
  export interface proto_ComerBasicResponse extends BasicDto {
    activation: boolean
    address: string
    avatar: string
    banner: string
    custom_domain: string
    id: number
    invitation_code: string
    is_connected: boolean
    location: string
    name: string
    time_zone: string
  }
  export interface proto_ComerConnectedTotalResponse extends BasicDto {
    be_connect_comer_total?: number
    connect_comer_total?: number
    connect_startup_total?: number
  }
  export interface proto_ComerEducationBindRequest extends BasicDto {
    /**
     * @description graduated at
     */
    graduated_at: number
    /**
     * @description major, professional
     */
    major: string
    /**
     * @description school
     */
    school: string
  }
  export interface proto_ComerInfoBIOUpdateRequest extends BasicDto {
    /**
     * @description comer info bio
     */
    bio: string
  }
  export interface proto_ComerInfoDetailResponse extends BasicDto {
    accounts?: ApiDocuments.model_ComerAccount[]
    activation: boolean
    address: string
    avatar: string
    banner: string
    connected_total?: ApiDocuments.proto_ComerConnectedTotalResponse
    custom_domain: string
    educations?: ApiDocuments.model_ComerEducation[]
    id: number
    info?: ApiDocuments.model_ComerInfo
    invitation_code: string
    is_connected: boolean
    languages?: ApiDocuments.proto_ComerLanguageResponse[]
    location: string
    name: string
    skills?: ApiDocuments.proto_TagRelationResponse[]
    socials?: ApiDocuments.proto_SocialBookResponse[]
    time_zone: string
  }
  export interface proto_ComerInfoUpdateRequest extends BasicDto {
    /**
     * @description comer avatar
     */
    avatar: string
    /**
     * @description comer info banner
     */
    banner?: string
    /**
     * @description comer info location
     */
    location?: string
    /**
     * @description comer name
     */
    name: string
    /**
     * @description comer info time zone
     */
    time_zone?: string
  }
  export interface proto_ComerInvitationCountResponse extends BasicDto {
    activated_total?: number
    inactive_total?: number
  }
  export interface proto_ComerInvitationRecordResponse extends BasicDto {
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id: number
    created_at?: string
    id: number
    invitation_code: string
    invitee?: ApiDocuments.proto_ComerBasicResponse
    invitee_id: number
  }
  export interface proto_ComerLanguageBindRequest extends BasicDto {
    /**
     * @description language id
     */
    language_id: number
    /**
     * @description language level, Reference relationship comparison table
     */
    level: number
  }
  export interface proto_ComerLanguageResponse extends BasicDto {
    comer_id: number
    id: number
    language?: ApiDocuments.model_Language
    language_id: number
    level: number
  }
  export interface proto_ComerResponse extends BasicDto {
    activation: boolean
    address: string
    avatar: string
    banner: string
    custom_domain: string
    id: number
    invitation_code: string
    is_connected: boolean
    /**
     * @description comer is seted, if false then set name
     */
    is_seted: boolean
    location: string
    name: string
    time_zone: string
  }
  export interface proto_ComerSkillBindRequest extends BasicDto {
    /**
     * @description comer skills
     */
    skills: string[]
  }
  export interface proto_ComerToStartupTeamSaveRequest extends BasicDto {
    /**
     * @description startup team comer id
     */
    comer_id: number
    /**
     * @description startup team position
     */
    position: string
    /**
     * @description startup team group id
     */
    startup_team_group_id?: number
  }
  export interface proto_CreateOrUpdateGovernanceSettingRequest extends BasicDto {
    admins?: ApiDocuments.proto_AdminRequest[]
    allow_member?: boolean
    proposal_threshold?: number
    proposal_validity?: number
    strategies?: ApiDocuments.proto_StrategyRequest[]
    vote_symbol?: string
  }
  export interface proto_CreateProposalRequest extends BasicDto {
    author_comer_id?: number
    author_wallet_address?: string
    block_number?: number
    chain_id?: number
    choices?: ApiDocuments.model_ProposalChoice[]
    description?: string
    discussion_link?: string
    end_time?: number
    ipfs_hash?: string
    release_timestamp?: number
    start_time?: number
    startup_id?: number
    title?: string
    vote_system?: string
  }
  export interface proto_CrowdfundingBasicResponse extends BasicDto {
    /**
     * @description IBO rate
     */
    buy_price?: number
    buy_token_contract?: string
    buy_token_symbol?: string
    chain_id?: number
    comer_id?: number
    crowdfunding_contract?: string
    /**
     * @description dex init price
     */
    dex_init_price?: number
    dex_router?: string
    end_time?: string
    id: number
    investors?: number
    max_buy_amount?: number
    max_sell_percent?: number
    min_buy_amount?: number
    pair_address?: string
    poster?: string
    raise_balance?: number
    raise_goal?: number
    sell_tax?: number
    sell_token_contract?: string
    sell_token_symbol?: string
    start_time?: string
    startup?: ApiDocuments.proto_StartupCardResponse
    startup_id?: number
    status?: number
    swap_percent?: number
    team_wallet?: string
    title?: string
    tx_hash?: string
  }
  export interface proto_CrowdfundingCreateRequest extends BasicDto {
    chain_id: number
    description: string
    detail?: string
    poster: string
    startup_id: number
    title: string
    tx_hash: string
    youtube?: string
  }
  export interface proto_CrowdfundingResponse extends BasicDto {
    /**
     * @description IBO rate
     */
    buy_price?: number
    buy_token_contract?: string
    buy_token_decimals?: number
    buy_token_name?: string
    buy_token_supply?: number
    buy_token_symbol?: string
    chain_id?: number
    comer_id?: number
    crowdfunding_contract?: string
    description?: string
    detail?: string
    /**
     * @description dex init price
     */
    dex_init_price?: number
    dex_router?: string
    end_time?: string
    id: number
    investor?: ApiDocuments.model_CrowdfundingInvestor
    investors?: number
    max_buy_amount?: number
    max_sell_percent?: number
    min_buy_amount?: number
    pair_address?: string
    poster?: string
    raise_balance?: number
    raise_goal?: number
    sell_tax?: number
    sell_token_balance?: number
    sell_token_contract?: string
    sell_token_decimals?: number
    sell_token_deposit?: number
    sell_token_name?: string
    sell_token_supply?: number
    sell_token_symbol?: string
    start_time?: string
    startup?: ApiDocuments.proto_StartupCardResponse
    startup_id?: number
    status?: number
    swap_percent?: number
    swaps?: ApiDocuments.proto_CrowdfundingSwapResponse[]
    team_wallet?: string
    title?: string
    tx_hash?: string
    youtube?: string
  }
  export interface proto_CrowdfundingSwapResponse extends BasicDto {
    access?: number
    buy_token_amount?: number
    buy_token_symbol?: string
    chain_id?: number
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id?: number
    crowdfunding_id?: number
    id: number
    price?: number
    sell_token_amount?: number
    sell_token_symbol?: string
    status?: number
    timestamp?: string
    tx_hash?: string
  }
  export interface proto_CrowdfundingUpdateRequest extends BasicDto {
    description: string
    detail?: string
    id: number
    poster: string
    title: string
    youtube?: string
  }
  export interface proto_GovernanceBasicResponse extends BasicDto {
    author_wallet_address: string
    block_number: number
    chain_id: number
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id: number
    description: string
    discussion_link: string
    end_time: string
    id: number
    ipfs_hash: string
    max_votes: number
    max_votes_choice_item: string
    release_timestamp: string
    start_time: string
    startup?: ApiDocuments.proto_GovernanceStartupCardResponse
    startup_id: number
    /**
     * @description query crowdfunding status
     */
    status: number
    title: string
    vote_system: string
  }
  export interface proto_GovernanceResponse extends BasicDto {
    author_wallet_address: string
    block_number: number
    chain_id: number
    choices?: ApiDocuments.model_ProposalChoice[]
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id: number
    description: string
    discussion_link: string
    end_time: string
    id: number
    ipfs_hash: string
    release_timestamp: string
    start_time: string
    startup?: ApiDocuments.proto_GovernanceStartupCardResponse
    startup_id: number
    /**
     * @description query crowdfunding status
     */
    status: number
    title: string
    vote_system: string
  }
  export interface proto_GovernanceSettingDetail extends BasicDto {
    admins?: ApiDocuments.model_GovernanceAdmin[]
    allow_member: boolean
    comer_id: number
    id: number
    proposal_threshold: number
    proposal_validity: number
    startup_id: number
    strategies?: ApiDocuments.model_GovernanceStrategy[]
    vote_symbol: string
  }
  export interface proto_GovernanceSettingResponse extends BasicDto {
    allow_member: boolean
    comer_id: number
    id: number
    proposal_threshold: number
    proposal_validity: number
    startup_id: number
    strategies?: ApiDocuments.model_GovernanceStrategy
    vote_symbol: string
  }
  export interface proto_GovernanceStartupCardResponse extends BasicDto {
    banner: string
    chain_id: number
    comer_id: number
    contract_audit: string
    governance_setting?: ApiDocuments.proto_GovernanceSettingResponse
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    socials?: ApiDocuments.proto_SocialBookResponse[]
    tags?: ApiDocuments.proto_TagRelationResponse[]
    tx_hash: string
    type: number
  }
  export interface proto_GovernanceVoteResponse extends BasicDto {
    choice_item_id: number
    choice_item_name: string
    comer?: ApiDocuments.proto_ComerBasicResponse
    id: number
    ipfs_hash: string
    proposal_id: number
    voter_comer_id: number
    voter_wallet_address: string
    votes: number
  }
  export interface proto_IsConnectedResponse extends BasicDto {
    is_connected: boolean
  }
  export interface proto_IsExistResponse extends BasicDto {
    is_exist: boolean
  }
  export interface proto_JwtAuthorizationResponse extends BasicDto {
    /**
     * @description Token
     */
    token: string
  }
  export interface proto_LanguageResponse extends BasicDto {
    code: string
    id: number
    name: string
  }
  export interface proto_ListData extends BasicDto {
    /**
     * @description data list
     */
    list?: any
    /**
     * @description total
     */
    total: number
  }
  export interface proto_MessageResponse extends BasicDto {
    /**
     * @description Message
     */
    message: string
  }
  export interface proto_NonceResponse extends BasicDto {
    /**
     * @description nonce
     */
    nonce: string
  }
  export interface proto_OAuthByThridPartyRequest extends BasicDto {
    /**
     * @description callback code for third-party(google and github) oauth
     */
    code: string
    /**
     * @description invitation code
     */
    invitation_code?: string
    /**
     * @description callback state
     */
    state?: string
  }
  export interface proto_PageData extends BasicDto {
    /**
     * @description data list
     */
    list?: any
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description total
     */
    total: number
  }
  export interface proto_PaidInfoBountyCreateRequest extends BasicDto {
    /**
     * @description bounty payment paid info
     */
    paid_info?: string
  }
  export interface proto_PostUpdate extends BasicDto {
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id: number
    content: string
    created_at?: string
    id: number
    target_id: number
    type: number
  }
  export interface proto_PostUpdateBountyCreateRequest extends BasicDto {
    /**
     * @description bounty post update
     */
    content?: string
    type: number
  }
  export interface proto_ProjectCountResponse extends BasicDto {
    bounty_count: number
    crowdfunding_count: number
    governance_count: number
    other_dapp_count: number
    sale_launchpad_count: number
    startup_count: number
  }
  export interface proto_Response extends BasicDto {
    /**
     * @description Error code
     */
    code?: number
    /**
     * @description Data
     */
    data?: any
    /**
     * @description Message
     */
    message?: string
  }
  export interface proto_SaleLaunchpadBasicResponse extends BasicDto {
    chain_id?: number
    comer_id?: number
    contract_address?: string
    cycle?: number
    cycle_release?: number
    dex_init_price?: number
    dex_pair_address?: string
    dex_router?: string
    ended_at?: number
    first_release?: number
    hard_cap?: number
    id: number
    invest_token_balance?: number
    invest_token_contract?: string
    invest_token_symbol?: string
    investors?: number
    liquidity_rate?: number
    max_invest_amount?: number
    min_invest_amount?: number
    poster?: string
    presale_price?: number
    presale_token_balance?: number
    presale_token_contract?: string
    presale_token_symbol?: string
    soft_cap?: number
    started_at?: number
    startup?: ApiDocuments.proto_StartupCardResponse
    startup_id?: number
    status?: number
    team_wallet?: string
    title?: string
    tx_hash?: string
  }
  export interface proto_SaleLaunchpadHistoryResponse extends BasicDto {
    amount?: number
    chain_id?: number
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id?: number
    id: number
    sale_launchpad_id?: number
    timestamp?: number
    /**
     * @description 冗余 方便给前端使用
     */
    token_symbol?: string
    tx_hash?: string
    type?: number
  }
  export interface proto_SaleLaunchpadResponse extends BasicDto {
    chain_id?: number
    comer_id?: number
    contract_address?: string
    cycle?: number
    cycle_release?: number
    description?: string
    detail?: string
    dex_init_price?: number
    dex_pair_address?: string
    dex_router?: string
    ended_at?: number
    first_release?: number
    hard_cap?: number
    id: number
    invest_token_balance?: number
    invest_token_contract?: string
    invest_token_decimals?: number
    invest_token_name?: string
    invest_token_supply?: number
    invest_token_symbol?: string
    investor?: ApiDocuments.model_CrowdfundingInvestor
    investors?: number
    liquidity_rate?: number
    max_invest_amount?: number
    min_invest_amount?: number
    poster?: string
    presale_price?: number
    presale_token_balance?: number
    presale_token_contract?: string
    presale_token_decimals?: number
    presale_token_deposit?: number
    presale_token_name?: string
    presale_token_supply?: number
    presale_token_symbol?: string
    soft_cap?: number
    started_at?: number
    startup?: ApiDocuments.proto_StartupCardResponse
    startup_id?: number
    status?: number
    swaps?: ApiDocuments.proto_SaleLaunchpadHistoryResponse[]
    team_wallet?: string
    title?: string
    tx_hash?: string
    youtube?: string
  }
  export interface proto_ShareSetRequest extends BasicDto {
    description: string
    image: string
    route: string
    title: string
  }
  export interface proto_ShareSetResponse extends BasicDto {
    share_code: string
  }
  export interface proto_SignResponse extends BasicDto {
    /**
     * @description data
     */
    data?: string
    /**
     * @description sign
     */
    sign: string
  }
  export interface proto_SocialBindRequest extends BasicDto {
    /**
     * @description social tool id
     */
    social_tool_id: number
    /**
     * @description social value, example: website url, facebook url ...
     */
    value: string
  }
  export interface proto_SocialBookResponse extends BasicDto {
    id: number
    social_tool?: ApiDocuments.proto_SocialToolResponse
    social_tool_id: number
    target_id: number
    type: number
    value: string
  }
  export interface proto_SocialToolResponse extends BasicDto {
    id: number
    logo: string
    name: string
  }
  export interface proto_StartupBasicResponse extends BasicDto {
    banner: string
    chain_id: number
    comer_id: number
    connected_total?: number
    contract_audit: string
    finance?: ApiDocuments.proto_StartupFinance
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    tags?: ApiDocuments.proto_TagRelationResponse[]
    team?: ApiDocuments.proto_StartupTeam[]
    tx_hash: string
    type: number
  }
  export interface proto_StartupCardResponse extends BasicDto {
    banner: string
    chain_id: number
    comer_id: number
    contract_audit: string
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    socials?: ApiDocuments.proto_SocialBookResponse[]
    tags?: ApiDocuments.proto_TagRelationResponse[]
    tx_hash: string
    type: number
  }
  export interface proto_StartupConnectResponse extends BasicDto {
    banner: string
    chain_id: number
    comer_id: number
    contract_audit: string
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    tx_hash: string
    type: number
  }
  export interface proto_StartupCreateRequest extends BasicDto {
    /**
     * @description startup on-chain chain id
     */
    chain_id: number
    /**
     * @description startup mission
     */
    mission: string
    /**
     * @description startup name
     */
    name: string
    /**
     * @description startup overview
     */
    overview: string
    /**
     * @description startup tags
     */
    tags: string[]
    /**
     * @description startup type, gte and lte must be match StartupType
     */
    type: number
  }
  export interface proto_StartupFinance extends BasicDto {
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
    wallets?: ApiDocuments.model_StartupFinanceWallet[]
  }
  export interface proto_StartupFinanceUpdateRequest extends BasicDto {
    /**
     * @description startup finance chain id
     */
    chain_id: number
    contract_address?: string
    launched_at?: number
    name?: string
    presale_ended_at?: number
    presale_started_at?: number
    supply?: number
    symbol?: string
    wallets?: ApiDocuments.proto_StartupFinanceWallet[]
  }
  export interface proto_StartupFinanceWallet extends BasicDto {
    /**
     * @description startup finance wallet address
     */
    address?: string
    /**
     * @description startup finance wallet name
     */
    name?: string
  }
  export interface proto_StartupInfoResponse extends BasicDto {
    banner: string
    chain_id: number
    comer_id: number
    connected_total?: number
    contract_audit: string
    finance?: ApiDocuments.proto_StartupFinance
    id: number
    is_connected: boolean
    kyc: string
    logo: string
    mission: string
    name: string
    on_chain: boolean
    overview: string
    socials?: ApiDocuments.proto_SocialBookResponse[]
    tab_sequence: string
    tags?: ApiDocuments.proto_TagRelationResponse[]
    team?: ApiDocuments.proto_StartupTeam[]
    tx_hash: string
    type: number
  }
  export interface proto_StartupSecurityUpdateRequest extends BasicDto {
    /**
     * @description startup contract audit
     */
    contract_audit?: string
    /**
     * @description startup kyc
     */
    kyc?: string
  }
  export interface proto_StartupSocialBindRequest extends BasicDto {
    /**
     * @description Owned socials
     */
    socials?: ApiDocuments.proto_SocialBindRequest[]
  }
  export interface proto_StartupTabSequenceUpdateRequest extends BasicDto {
    /**
     * @description startup tab sequence
     */
    tab_sequence?: string
  }
  export interface proto_StartupTeam extends BasicDto {
    comer?: ApiDocuments.proto_ComerBasicResponse
    comer_id: number
    created_at?: string
    id: number
    position: string
    startup_id: number
    startup_team_group?: ApiDocuments.model_StartupTeamGroup
    startup_team_group_id: number
  }
  export interface proto_StartupTeamGroup extends BasicDto {
    /**
     * @description startup team group name
     */
    name: string
    /**
     * @description startup team group id
     */
    start_team_group_id?: number
  }
  export interface proto_StartupTeamGroupResponse extends BasicDto {
    comer_id: number
    id: number
    name: string
    startup_id: number
  }
  export interface proto_StartupTeamGroupsSaveRequest extends BasicDto {
    /**
     * @description startup team groups
     */
    groups?: ApiDocuments.proto_StartupTeamGroup[]
  }
  export interface proto_StartupUpdateRequest extends BasicDto {
    /**
     * @description startup banner
     */
    banner?: string
    /**
     * @description startup on-chain chain id
     */
    chain_id: number
    /**
     * @description startup logo
     */
    logo?: string
    /**
     * @description startup mission
     */
    mission: string
    /**
     * @description startup name
     */
    name: string
    /**
     * @description startup overview
     */
    overview: string
    /**
     * @description startup tags
     */
    tags: string[]
    /**
     * @description startup type, gte and lte must be match StartupType
     */
    type: number
  }
  export interface proto_StrategyRequest extends BasicDto {
    chain_id: number
    dict_value: string
    strategy_name: string
    token_contract_address: string
    token_min_balance?: number
    vote_decimals?: number
    vote_symbol?: string
  }
  export interface proto_TagRelationResponse extends BasicDto {
    id: number
    tag?: ApiDocuments.proto_TagResponse
    tag_id: number
    target_id: number
    type: number
  }
  export interface proto_TagResponse extends BasicDto {
    id: number
    name: string
    type: number
  }
  export interface proto_ThirdPartyVerifyResponse extends BasicDto {
    verify: boolean
  }
  export interface proto_UploadResponse extends BasicDto {
    url: string
  }
  export interface proto_VoteRequest extends BasicDto {
    choice_item_id?: number
    choice_item_name?: string
    ipfs_hash?: string
    voter_wallet_address?: string
    votes?: number
  }
  export interface proto_WalletLoginRequest extends BasicDto {
    /**
     * @description Wallet address
     */
    address: string
    /**
     * @description invitation code
     */
    invitation_code?: string
    /**
     * @description Wallet nonce
     */
    nonce: string
    /**
     * @description Wallet signature
     */
    signature: string
  }
}

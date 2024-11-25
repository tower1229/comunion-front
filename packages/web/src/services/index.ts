/* eslint-disable */
import { requestAdapter } from './a2s.adapter'
import type { ApiDocuments } from './a2s.namespace'
import { extract, replacePath } from './a2s.utils'

export const services = {
  'Authorization@github-oauth'(args: ApiDocuments.proto_OAuthByThridPartyRequest) {
    return requestAdapter<ApiDocuments.proto_JwtAuthorizationResponse>({
      url: replacePath('/authorizations/github', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Authorization@google-oauth'(args: ApiDocuments.proto_OAuthByThridPartyRequest) {
    return requestAdapter<ApiDocuments.proto_JwtAuthorizationResponse>({
      url: replacePath('/authorizations/google', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Authorization@login-by-wallet-address'(args: ApiDocuments.proto_WalletLoginRequest) {
    return requestAdapter<ApiDocuments.proto_JwtAuthorizationResponse>({
      url: replacePath('/authorizations/wallet', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Authorization@get-nonce-by-address'(args: {
    /**
     * @description wallet address
     */
    wallet_address: string
  }) {
    return requestAdapter<ApiDocuments.proto_NonceResponse>({
      url: replacePath('/authorizations/{wallet_address}/nonce', args),
      method: 'GET',
      ...extract('GET', args, [], ['wallet_address'])
    })
  },
  'Bounty@get-bounties'(args: {
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description query bounty applicant comer id
     */
    applicant_comer_id?: number
    /**
     * @description query founder comer id
     */
    founder_comer_id?: number
    /**
     * @description query keyword
     */
    keyword?: string
    /**
     * @description query startup id
     */
    startup_id?: number
    /**
     * @description query bounty status
     */
    status?: number[]
    /**
     * @description query bounty tags
     */
    tags?: string[]
  }) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_BountyBasicResponse
      }
    >({
      url: replacePath('/bounties', args),
      method: 'GET',
      ...extract(
        'GET',
        args,
        [
          'page',
          'size',
          'applicant_comer_id',
          'founder_comer_id',
          'keyword',
          'startup_id',
          'status',
          'tags'
        ],
        []
      )
    })
  },
  'Bounty@create-bounty'(args: ApiDocuments.proto_BountyCreateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/bounties', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Bounty@get-bounty-info'(args: {
    /**
     * @description bounty id
     */
    bounty_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_BountyInfoResponse>({
      url: replacePath('/bounties/{bounty_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['bounty_id'])
    })
  },
  'Bounty@apply-bounty'(
    args: {
      /**
       * @description bounty id
       */
      bounty_id: number
    } & ApiDocuments.proto_ApplyBountyCreateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/bounties/{bounty_id}/apply', args),
      method: 'POST',
      ...extract('POST', args, [], ['bounty_id'])
    })
  },
  'Bounty@close-bounty'(args: {
    /**
     * @description bounty id
     */
    bounty_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/bounties/{bounty_id}/close', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['bounty_id'])
    })
  },
  'Bounty@payment-bounty'(
    args: {
      /**
       * @description bounty payment terms id
       */
      bounty_payment_terms_id: number
      /**
       * @description bounty id
       */
      bounty_id: number
    } & ApiDocuments.proto_PaidInfoBountyCreateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/bounties/{bounty_id}/payments/{bounty_payment_terms_id}', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['bounty_payment_terms_id', 'bounty_id'])
    })
  },
  'Bounty@post-update-bounty'(
    args: {
      /**
       * @description bounty id
       */
      bounty_id: number
    } & ApiDocuments.proto_PostUpdateBountyCreateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/bounties/{bounty_id}/post-update', args),
      method: 'POST',
      ...extract('POST', args, [], ['bounty_id'])
    })
  },
  'Comer@get-comer'(args?: any) {
    return requestAdapter<ApiDocuments.proto_ComerResponse>({
      url: replacePath('/comer', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Comer@update-comer-info'(args: ApiDocuments.proto_ComerInfoUpdateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'Comer@unlink-oauth-by-comer-account-id'(args: {
    /**
     * @description comer account id
     */
    comer_account_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/accounts/{comer_account_id}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['comer_account_id'])
    })
  },
  'Comer@update-comer-info-bio'(args: ApiDocuments.proto_ComerInfoBIOUpdateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/bio', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'Comer@get-comer-info-detail'(args?: any) {
    return requestAdapter<ApiDocuments.proto_ComerInfoDetailResponse>({
      url: replacePath('/comer/detail', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Comer@bind-comer-educations'(args: ApiDocuments.proto_ComerEducationBindRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/educations', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Comer@update-comer-education'(
    args: {
      /**
       * @description comer education id
       */
      comer_education_id: number
    } & ApiDocuments.proto_ComerEducationBindRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/educations/{comer_education_id}', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['comer_education_id'])
    })
  },
  'Comer@unbind-comer-educations'(args: {
    /**
     * @description comer education id
     */
    comer_education_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/educations/{comer_education_id}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['comer_education_id'])
    })
  },
  'Comer@get-comer-invitation-count'(args?: any) {
    return requestAdapter<ApiDocuments.proto_ComerInvitationCountResponse>({
      url: replacePath('/comer/invitation-count', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Comer@get-comer-invitation-records'(args?: any) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        data?: ApiDocuments.proto_ComerInvitationRecordResponse[]
      }
    >({
      url: replacePath('/comer/invitation-records', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Comer@bind-comer-languages'(args: ApiDocuments.proto_ComerLanguageBindRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/languages', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Comer@update-comer-languages'(
    args: {
      /**
       * @description comer language id
       */
      comer_language_id: number
    } & ApiDocuments.proto_ComerLanguageBindRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/languages/{comer_language_id}', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['comer_language_id'])
    })
  },
  'Comer@unbind-comer-languages'(args: {
    /**
     * @description comer language id
     */
    comer_language_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/languages/{comer_language_id}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['comer_language_id'])
    })
  },
  'Comer@get-comer-joined-and-followed-startups'(args?: any) {
    return requestAdapter<
      (ApiDocuments.proto_ListData & {
        list?: ApiDocuments.model_SimpleStartupInfo[]
      })[]
    >({
      url: replacePath('/comer/related-startups', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Comer@bind-comer-skills'(args: ApiDocuments.proto_ComerSkillBindRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/skills', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Comer@bind-comer-socials'(args: ApiDocuments.proto_SocialBindRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/socials', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Comer@update-comer-socials'(
    args: {
      /**
       * @description social book id
       */
      soical_book_id: number
    } & ApiDocuments.proto_SocialBindRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/socials/{soical_book_id}', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['soical_book_id'])
    })
  },
  'Comer@unbind-comer-socials'(args: {
    /**
     * @description social book id
     */
    soical_book_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comer/socials/{soical_book_id}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['soical_book_id'])
    })
  },
  'Comer@get-comer-by-address'(args: {
    /**
     * @description comer address
     */
    address: string
  }) {
    return requestAdapter<ApiDocuments.proto_ComerBasicResponse>({
      url: replacePath('/comers/address/{address}', args),
      method: 'GET',
      ...extract('GET', args, [], ['address'])
    })
  },
  'Comer@set-user-custom-domain'(args: {
    /**
     * @description user custom domain
     */
    custom_domain: string
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comers/domains', args),
      method: 'PUT',
      ...extract('PUT', args, ['custom_domain'], [])
    })
  },
  'Comer@get-user-custom-domain-is-existence'(args: {
    /**
     * @description user custom domain
     */
    custom_domain: string
  }) {
    return requestAdapter<ApiDocuments.proto_IsExistResponse>({
      url: replacePath('/comers/domains/existence', args),
      method: 'GET',
      ...extract('GET', args, ['custom_domain'], [])
    })
  },
  'Comer@get-comer-by-custom-domain'(args: {
    /**
     * @description custom domain
     */
    custom_domain: string
  }) {
    return requestAdapter<ApiDocuments.proto_ComerInfoDetailResponse>({
      url: replacePath('/comers/domains/{custom_domain}', args),
      method: 'GET',
      ...extract('GET', args, [], ['custom_domain'])
    })
  },
  'Comer@verify-comer-add-profile'(args: { wallet_address: string }) {
    return requestAdapter<ApiDocuments.proto_ThirdPartyVerifyResponse>({
      url: replacePath('/comers/verify/profile', args),
      method: 'GET',
      ...extract('GET', args, ['wallet_address'], [])
    })
  },
  'Comer@get-comer-by-comer-id'(args: {
    /**
     * @description comer id
     */
    comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_ComerInfoDetailResponse>({
      url: replacePath('/comers/{comer_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['comer_id'])
    })
  },
  'Comer@get-comer-be-connect-comers-by-comer-id'(
    args: {
      /**
       * @description comer id
       */
      comer_id: string
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_ComerBasicResponse[]
      }
    >({
      url: replacePath('/comers/{comer_id}/be_connect/comers', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['comer_id'])
    })
  },
  'Comer@connect-comer'(args: {
    /**
     * @description comer id
     */
    comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comers/{comer_id}/connect', args),
      method: 'POST',
      ...extract('POST', args, [], ['comer_id'])
    })
  },
  'Comer@unconnect-comer'(args: {
    /**
     * @description comer id
     */
    comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/comers/{comer_id}/connect', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['comer_id'])
    })
  },
  'Comer@get-comer-connect-comers-by-comer-id'(
    args: {
      /**
       * @description comer id
       */
      comer_id: string
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_ComerBasicResponse[]
      }
    >({
      url: replacePath('/comers/{comer_id}/connect/comers', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['comer_id'])
    })
  },
  'Comer@get-startup-connect-by-comer-id'(
    args: {
      /**
       * @description comer id
       */
      comer_id: string
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_StartupConnectResponse[]
      }
    >({
      url: replacePath('/comers/{comer_id}/connect/startups', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['comer_id'])
    })
  },
  'Comer@connected-comer'(args: {
    /**
     * @description comer id
     */
    comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_IsConnectedResponse>({
      url: replacePath('/comers/{comer_id}/connected', args),
      method: 'GET',
      ...extract('GET', args, [], ['comer_id'])
    })
  },
  'Comer@get-comer-info-detail-by-comer-id'(args: {
    /**
     * @description comer id
     */
    comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_ComerInfoDetailResponse>({
      url: replacePath('/comers/{comer_id}/detail', args),
      method: 'GET',
      ...extract('GET', args, [], ['comer_id'])
    })
  },
  'Comer@get-comer-participated-count-by-comer-id'(args: {
    /**
     * @description comer id
     */
    comer_id: string
  }) {
    return requestAdapter<ApiDocuments.proto_ProjectCountResponse>({
      url: replacePath('/comers/{comer_id}/participated/count', args),
      method: 'GET',
      ...extract('GET', args, [], ['comer_id'])
    })
  },
  'Comer@get-comer-posted-count-by-comer-id'(args: {
    /**
     * @description comer id
     */
    comer_id: string
  }) {
    return requestAdapter<ApiDocuments.proto_ProjectCountResponse>({
      url: replacePath('/comers/{comer_id}/posted/count', args),
      method: 'GET',
      ...extract('GET', args, [], ['comer_id'])
    })
  },
  'Crowdfunding@get-crowdfunding'(args: {
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description query founder comer id
     */
    founder_comer_id?: number
    /**
     * @description query keyword
     */
    keyword?: string
    /**
     * @description query crowdfunding participate comer id
     */
    participate_comer_id?: number
    /**
     * @description query startup id
     */
    startup_id?: number
    /**
     * @description query crowdfunding status
     */
    status?: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_CrowdfundingBasicResponse
      }
    >({
      url: replacePath('/crowdfundings', args),
      method: 'GET',
      ...extract(
        'GET',
        args,
        [
          'page',
          'size',
          'founder_comer_id',
          'keyword',
          'participate_comer_id',
          'startup_id',
          'status'
        ],
        []
      )
    })
  },
  'Crowdfunding@update-crowdfunding'(args: ApiDocuments.proto_CrowdfundingUpdateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/crowdfundings', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'Crowdfunding@create-crowdfunding'(args: ApiDocuments.proto_CrowdfundingCreateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/crowdfundings', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Crowdfunding@get-crowdfunding-info'(args: {
    /**
     * @description crowdfunding id
     */
    crowdfunding_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_CrowdfundingResponse>({
      url: replacePath('/crowdfundings/{crowdfunding_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['crowdfunding_id'])
    })
  },
  'Crowdfunding@get-crowdfunding-transfer-lp-sign'(args: {
    /**
     * @description crowdfunding id
     */
    crowdfunding_id: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_Response & {
        data?: ApiDocuments.proto_SignResponse
      }
    >({
      url: replacePath('/crowdfundings/{crowdfunding_id}/sign', args),
      method: 'GET',
      ...extract('GET', args, [], ['crowdfunding_id'])
    })
  },
  'Crowdfunding@get-crowdfunding-invest-records'(
    args: {
      /**
       * @description crowdfunding id
       */
      crowdfunding_id: number
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_CrowdfundingSwapResponse
      }
    >({
      url: replacePath('/crowdfundings/{crowdfunding_id}/swap-records', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['crowdfunding_id'])
    })
  },
  'DataDict@GetdataDictbydicttype'(args: {
    /**
     * @description dict type:6-voteSystem,7-governaceStrateggy
     */
    type: number
  }) {
    return requestAdapter<any>({
      url: replacePath('/dict/{type}', args),
      method: 'GET',
      ...extract('GET', args, [], ['type'])
    })
  },
  'Governance@get-governance-setting'(args: {
    /**
     * @description startupID
     */
    startup_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_GovernanceSettingDetail>({
      url: replacePath('/governance/setting/{startup_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['startup_id'])
    })
  },
  'Governance@create-governance-setting'(
    args: {
      /**
       * @description starup id
       */
      startup_id: number
    } & ApiDocuments.proto_CreateOrUpdateGovernanceSettingRequest
  ) {
    return requestAdapter<any>({
      url: replacePath('/governance/setting/{startup_id}', args),
      method: 'POST',
      ...extract('POST', args, [], ['startup_id'])
    })
  },
  'Language@get-languages'(args?: any) {
    return requestAdapter<
      ApiDocuments.proto_ListData & {
        list?: ApiDocuments.proto_LanguageResponse[]
      }
    >({
      url: replacePath('/languages', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Proposal@get-proposal'(args: {
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description query founder comer id
     */
    founder_comer_id?: number
    /**
     * @description query keyword
     */
    keyword?: string
    /**
     * @description query governance participate comer id
     */
    participate_comer_id?: number
    /**
     * @description query startup id
     */
    startup_id?: number
    /**
     * @description query crowdfunding status
     */
    status?: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_GovernanceBasicResponse
      }
    >({
      url: replacePath('/proposals', args),
      method: 'GET',
      ...extract(
        'GET',
        args,
        [
          'page',
          'size',
          'founder_comer_id',
          'keyword',
          'participate_comer_id',
          'startup_id',
          'status'
        ],
        []
      )
    })
  },
  'Proposal@createproposal'(args?: any) {
    return requestAdapter<ApiDocuments.proto_CreateProposalRequest>({
      url: replacePath('/proposals', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Proposal@get-proposal-info'(args: {
    /**
     * @description proposal id
     */
    proposal_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_GovernanceResponse>({
      url: replacePath('/proposals/{proposal_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['proposal_id'])
    })
  },
  'Proposal@deleteproposal'(args: {
    /**
     * @description proposalID
     */
    proposal_id: number
  }) {
    return requestAdapter<any>({
      url: replacePath('/proposals/{proposal_id}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['proposal_id'])
    })
  },
  'Proposal@voiteproposal'(
    args: {
      /**
       * @description proposal ID
       */
      proposal_id: number
    } & ApiDocuments.proto_VoteRequest
  ) {
    return requestAdapter<any>({
      url: replacePath('/proposals/{proposal_id}/vote', args),
      method: 'POST',
      ...extract('POST', args, [], ['proposal_id'])
    })
  },
  'Proposal@get-proposal-invest-records'(
    args: {
      /**
       * @description proposal id
       */
      proposal_id: number
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_GovernanceVoteResponse
      }
    >({
      url: replacePath('/proposals/{proposal_id}/votes', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['proposal_id'])
    })
  },
  'SaleLaunchpad@get-sale-launchpad'(args: {
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description query founder comer id
     */
    founder_comer_id?: number
    /**
     * @description query keyword
     */
    keyword?: string
    /**
     * @description query crowdfunding participate comer id
     */
    participate_comer_id?: number
    /**
     * @description query startup id
     */
    startup_id?: number
    /**
     * @description query crowdfunding status
     */
    status?: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_SaleLaunchpadBasicResponse
      }
    >({
      url: replacePath('/sale_launchpads', args),
      method: 'GET',
      ...extract(
        'GET',
        args,
        [
          'page',
          'size',
          'founder_comer_id',
          'keyword',
          'participate_comer_id',
          'startup_id',
          'status'
        ],
        []
      )
    })
  },
  'SaleLaunchpad@update-sale-launchpad'(args: ApiDocuments.proto_CrowdfundingUpdateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/sale_launchpads', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'SaleLaunchpad@create-sale-launchpad'(args: ApiDocuments.proto_CrowdfundingCreateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/sale_launchpads', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'SaleLaunchpad@get-sale-launchpad-supply-dex'(args?: any) {
    return requestAdapter<ApiDocuments.proto_SaleLaunchpadResponse>({
      url: replacePath('/sale_launchpads/supply_dex', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'SaleLaunchpad@get-sale-launchpad-info'(args: {
    /**
     * @description sale-launchpad id
     */
    sale_launchpad_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_SaleLaunchpadResponse>({
      url: replacePath('/sale_launchpads/{sale_launchpad_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['sale_launchpad_id'])
    })
  },
  'SaleLaunchpad@get-sale-launchpad-history-records'(
    args: {
      /**
       * @description sale-launchpad id
       */
      sale_launchpad_id: number
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_SaleLaunchpadHistoryResponse
      }
    >({
      url: replacePath('/sale_launchpads/{sale_launchpad_id}/history', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['sale_launchpad_id'])
    })
  },
  'SaleLaunchpad@get-sale-launchpad-transfer-lp-sign'(args: {
    /**
     * @description sale-launchpad id
     */
    sale_launchpad_id: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_Response & {
        data?: ApiDocuments.proto_SignResponse
      }
    >({
      url: replacePath('/sale_launchpads/{sale_launchpad_id}/sign', args),
      method: 'GET',
      ...extract('GET', args, [], ['sale_launchpad_id'])
    })
  },
  'Share@set-share'(args: ApiDocuments.proto_ShareSetRequest) {
    return requestAdapter<ApiDocuments.proto_ShareSetResponse>({
      url: replacePath('/share', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'Share@get-share-page-html'(args: {
    /**
     * @description share code
     */
    share_code: string
  }) {
    return requestAdapter<any>({
      url: replacePath('/share/{share_code}', args),
      method: 'GET',
      ...extract('GET', args, [], ['share_code'])
    })
  },
  'Social@get-socials'(args?: any) {
    return requestAdapter<
      ApiDocuments.proto_ListData & {
        list?: ApiDocuments.proto_SocialToolResponse[]
      }
    >({
      url: replacePath('/socials', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'Startup@get-startups'(args: {
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description query startup team admin or founder comer id
     */
    admin_comer_id?: number
    /**
     * @description query comer id
     */
    comer_id?: number
    /**
     * @description query connected starup
     */
    connected?: boolean
    /**
     * @description query keyword
     */
    keyword?: string
    /**
     * @description query startup team comer id
     */
    startup_team_comer_id?: number
    /**
     * @description query starup tags
     */
    tags?: string[]
    /**
     * @description startup type, gte and lte must be match StartupType
     */
    type?: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_StartupBasicResponse
      }
    >({
      url: replacePath('/startups', args),
      method: 'GET',
      ...extract(
        'GET',
        args,
        [
          'page',
          'size',
          'admin_comer_id',
          'comer_id',
          'connected',
          'keyword',
          'startup_team_comer_id',
          'tags',
          'type'
        ],
        []
      )
    })
  },
  'Startup@create-startup'(args: ApiDocuments.proto_StartupCreateRequest) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'Startup@get-startup-is-existence'(args: {
    /**
     * @description starup chain id
     */
    chain_id: number
    /**
     * @description starup name
     */
    name: string
  }) {
    return requestAdapter<ApiDocuments.proto_IsExistResponse>({
      url: replacePath('/startups/existence', args),
      method: 'GET',
      ...extract('GET', args, ['chain_id', 'name'], [])
    })
  },
  'Startup@get-startup-info'(args: {
    /**
     * @description startup id
     */
    startup_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_StartupInfoResponse>({
      url: replacePath('/startups/{startup_id}', args),
      method: 'GET',
      ...extract('GET', args, [], ['startup_id'])
    })
  },
  'Startup@update-startup'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_StartupUpdateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startup_id'])
    })
  },
  'Startup@connect-startup'(args: {
    /**
     * @description startup id
     */
    startup_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/connect', args),
      method: 'POST',
      ...extract('POST', args, [], ['startup_id'])
    })
  },
  'Startup@get-comer-connect-startup-comers-by-startup-id'(
    args: {
      /**
       * @description startup id
       */
      startup_id: string
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_ComerBasicResponse[]
      }
    >({
      url: replacePath('/startups/{startup_id}/connect/comers', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size'], ['startup_id'])
    })
  },
  'Startup@connected-startup'(args: {
    /**
     * @description startup id
     */
    startup_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_IsConnectedResponse>({
      url: replacePath('/startups/{startup_id}/connected', args),
      method: 'GET',
      ...extract('GET', args, [], ['startup_id'])
    })
  },
  'Startup@set-startup-finance'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_StartupFinanceUpdateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/finance', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startup_id'])
    })
  },
  'Startup@get-startup-relation-count'(args: {
    /**
     * @description startup id
     */
    startup_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_IsExistResponse>({
      url: replacePath('/startups/{startup_id}/relation/count', args),
      method: 'GET',
      ...extract('GET', args, [], ['startup_id'])
    })
  },
  'Startup@update-startup-security'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_StartupSecurityUpdateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/security', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startup_id'])
    })
  },
  'Startup@bind-startup-socials'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_StartupSocialBindRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/socials', args),
      method: 'POST',
      ...extract('POST', args, [], ['startup_id'])
    })
  },
  'Startup@update-startup-tab-sequence'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_StartupTabSequenceUpdateRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/tab_sequence', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startup_id'])
    })
  },
  'Startup@get-startup-team'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
      /**
       * @description startup team group id
       */
      startup_team_group_id?: number
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_PageData & {
        list?: ApiDocuments.proto_StartupTeam
      }
    >({
      url: replacePath('/startups/{startup_id}/team/comers', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size', 'startup_team_group_id'], ['startup_id'])
    })
  },
  'Startup@save-comer-to-startup-team'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_ComerToStartupTeamSaveRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/team/comers', args),
      method: 'POST',
      ...extract('POST', args, [], ['startup_id'])
    })
  },
  'Startup@delete-comer-of-startup-team'(args: {
    /**
     * @description startup id
     */
    startup_id: number
    /**
     * @description comer id
     */
    startup_team_comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/team/comers/{startup_team_comer_id}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['startup_id', 'startup_team_comer_id'])
    })
  },
  'Startup@startup-team-comer-existence'(args: {
    /**
     * @description startup id
     */
    startup_id: number
    /**
     * @description comer id
     */
    startup_team_comer_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_IsExistResponse>({
      url: replacePath(
        '/startups/{startup_id}/team/comers/{startup_team_comer_id}/existence',
        args
      ),
      method: 'GET',
      ...extract('GET', args, [], ['startup_id', 'startup_team_comer_id'])
    })
  },
  'Startup@get-startup-team-groups'(args: {
    /**
     * @description startup id
     */
    startup_id: number
  }) {
    return requestAdapter<
      ApiDocuments.proto_ListData & {
        list?: ApiDocuments.proto_StartupTeamGroupResponse[]
      }
    >({
      url: replacePath('/startups/{startup_id}/team/groups', args),
      method: 'GET',
      ...extract('GET', args, [], ['startup_id'])
    })
  },
  'Startup@save-startup-team-group'(
    args: {
      /**
       * @description startup id
       */
      startup_id: number
    } & ApiDocuments.proto_StartupTeamGroupsSaveRequest
  ) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/team/groups', args),
      method: 'POST',
      ...extract('POST', args, [], ['startup_id'])
    })
  },
  'Startup@unconnect-startup'(args: {
    /**
     * @description startup id
     */
    startup_id: number
  }) {
    return requestAdapter<ApiDocuments.proto_MessageResponse>({
      url: replacePath('/startups/{startup_id}/unconnect', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['startup_id'])
    })
  },
  'Tag@get-tags-by-tag-type'(
    args: {
      /**
       * @description tag type, refer: https://comunion.yuque.com/niwla4/qbn2zb/lcaebo#FQQBR
       */
      type: string
    } & {
      /**
       * @description pagination select current page, default: 1
       */
      page?: number
      /**
       * @description pagination size, default: 20
       */
      size?: number
      /**
       * @description is ad
       */
      ad?: boolean
      /**
       * @description query keyword
       */
      keyword?: string
    }
  ) {
    return requestAdapter<
      ApiDocuments.proto_ListData & {
        list?: ApiDocuments.proto_TagResponse[]
      }
    >({
      url: replacePath('/tags/{type}', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'size', 'ad', 'keyword'], ['type'])
    })
  },
  'Upload@upload-file'(args: {
    /**
     * @description file
     */
    file: File
  }) {
    return requestAdapter<ApiDocuments.proto_UploadResponse>({
      url: replacePath('/upload', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  }
}

export type ServiceKeys = keyof typeof services

export type ServiceArg<T extends ServiceKeys> = Parameters<typeof services[T]>[0]

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

export type ServiceReturn<T extends ServiceKeys> = Awaited<ReturnType<typeof services[T]>>['data']

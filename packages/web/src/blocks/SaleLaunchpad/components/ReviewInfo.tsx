import dayjs from 'dayjs'
import { defineComponent, PropType } from 'vue'
import { CrowdfundingInfo } from '../typing'

import './reviewInfo.css'
import { findRouterByAddress } from '@/constants'

export const ReviewInfo = defineComponent({
  name: 'ReviewInfo',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  render() {
    return (
      <div class="review-info">
        <div class="review-info-item u-h6">
          <div class="w-[220px] title">Project:</div>
          <div>{this.crowdfundingInfo.startupName}</div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Token Contract :</div>
          <div class="text-primary">{this.crowdfundingInfo.sellTokenContract}</div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Team Wallet Address :</div>
          <div class="text-primary">{this.crowdfundingInfo.teamWallet}</div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Soft Cap:</div>
          <div>
            {this.crowdfundingInfo.softCap} {this.crowdfundingInfo.buyTokenSymbol}
          </div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Hard Cap:</div>
          <div>
            {this.crowdfundingInfo.hardCap} {this.crowdfundingInfo.buyTokenSymbol}
          </div>
        </div>
        {this.crowdfundingInfo.listing === 'Auto Listing' && (
          <div class="review-info-item">
            <div class="w-[220px] title">Liquidity :</div>
            <div>{this.crowdfundingInfo.liquidityPercent}%</div>
          </div>
        )}
        <div class="review-info-item">
          <div class="w-[220px] title">Rate :</div>
          <div>
            1 {this.crowdfundingInfo.buyTokenSymbol} = {this.crowdfundingInfo.buyPrice}{' '}
            {this.crowdfundingInfo.sellTokenSymbol}
          </div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Maximum Buy :</div>
          <div>
            {this.crowdfundingInfo.maxBuyAmount} {this.crowdfundingInfo.buyTokenSymbol}
          </div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Minimum Buy :</div>
          <div>
            {this.crowdfundingInfo.minBuyAmount} {this.crowdfundingInfo.buyTokenSymbol}
          </div>
        </div>

        <div class="review-info-item">
          <div class="w-[220px] title">Launchpad Start Time :</div>
          <div>{dayjs(this.crowdfundingInfo.startTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Launchpad End Time :</div>
          <div>{dayjs(this.crowdfundingInfo.endTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div class="review-info-item">
          <div class="w-[220px] title">Listing Option :</div>
          <div>{this.crowdfundingInfo.listing}</div>
        </div>
        {this.crowdfundingInfo.listing === 'Auto Listing' && (
          <div class="review-info-item">
            <div class="w-[220px] title">Router :</div>
            <div>{findRouterByAddress(this.crowdfundingInfo.Router!)?.dex}</div>
          </div>
        )}
        {this.crowdfundingInfo.listing === 'Auto Listing' && (
          <div class="review-info-item">
            <div class="w-[220px] title">Listing Rate :</div>
            <div>
              1 {this.crowdfundingInfo.buyTokenSymbol} = {this.crowdfundingInfo.listingRate}{' '}
              {this.crowdfundingInfo.sellTokenSymbol}
            </div>
          </div>
        )}
        {this.crowdfundingInfo.usingVestingContributor && (
          <>
            <div class="review-info-item">
              <div class="w-[220px] title">First Release :</div>
              <div>{this.crowdfundingInfo.firstRelease}%</div>
            </div>
            <div class="review-info-item">
              <div class="w-[220px] title">Vesting Period:</div>
              <div>{this.crowdfundingInfo.vestingPeriod}</div>
            </div>
            <div class="review-info-item">
              <div class="w-[220px] title">Token Cycle:</div>
              <div>{this.crowdfundingInfo.tokenCycle}%</div>
            </div>{' '}
          </>
        )}

        {!!this.crowdfundingInfo.youtube && (
          <div class="review-info-item">
            <div class="w-[220px] title">Youtube :</div>
            <a href={this.crowdfundingInfo.youtube} target="__blank" class="flex-1 text-primary">
              {this.crowdfundingInfo.youtube}
            </a>
          </div>
        )}
        {!!this.crowdfundingInfo.detail && (
          <div class="review-info-item">
            <div class="w-[220px] title">Launchpad detail :</div>

            <a href={this.crowdfundingInfo.detail} target="__blank" class="flex-1 text-primary">
              {this.crowdfundingInfo.detail}
            </a>
          </div>
        )}
      </div>
    )
  }
})

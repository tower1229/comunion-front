import { UTag, UTooltip, UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, ref, computed, onMounted, PropType } from 'vue'
import Paragraph from './paragraph'
import More from '@/components/More'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { getBountyStatus } from '@/pages/bounty/util'
import { getContactByType } from '@/pages/project/util'
import { BountyInfo, TagRelationResponse, BountyContract } from '@/types'

export default defineComponent({
  name: 'Info',
  props: {
    bountyDetail: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  setup(props) {
    const fold = ref<boolean>(true)
    const handleMore = () => {
      fold.value = !fold.value
    }
    // const bountyContractStore = useBountyContractStore()
    const bountyStatus = computed(() => {
      return BOUNTY_TYPES_COLOR_MAP[getBountyStatus(props.bountyDetail)]
    })
    const created_at = computed(() => {
      if (props.bountyDetail.created_at) {
        return format(props.bountyDetail.created_at, 'comunionTimeAgo')
      }
      return ''
    })

    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    onMounted(() => {
      if (pRef.value.ele.scrollHeight > 60) {
        showMoreBtn.value = true
      }
    })

    return {
      created_at,
      handleMore,
      fold,
      bountyStatus,
      pRef,
      showMoreBtn
    }
  },
  render() {
    return (
      <UCard>
        <div class="flex">
          <div class="flex flex-col flex-grow flex-1 overflow-hidden">
            <UTooltip width={400} placement="top-start" trigger="hover">
              {{
                trigger: () => (
                  <span class="text-[#333333] truncate u-h3">{this.bountyDetail.title}</span>
                ),
                default: () => this.bountyDetail.title
              }}
            </UTooltip>
            <div class="flex flex-wrap mt-5 gap-2">
              {Array.isArray(this.bountyDetail.skills) &&
                this.bountyDetail.skills.map((item: TagRelationResponse) => {
                  return (
                    <UTag key={item.id} class="text-[#211B42]">
                      {item.tag?.name}
                    </UTag>
                  )
                })}
            </div>
          </div>
          <div class="leading-[24px]">
            {this.bountyStatus && <UTag class="ml-4">{this.bountyStatus.label}</UTag>}
          </div>
        </div>
        <Paragraph
          class="mt-6 items-center"
          label={'Created :'}
          content={this.created_at}
          contentClass="text-color2"
        />
        {this.bountyDetail.contacts?.map((item: BountyContract) => {
          return (
            <Paragraph
              class="mt-2.5 items-center"
              label={`${getContactByType(item.type)?.label}`}
              content={item.value}
              contentClass="text-primary flex items-center"
              pasteboard={true}
            />
          )
        })}
        {this.bountyDetail.discussion_link && (
          <Paragraph
            class="mt-2.5 items-center"
            label="Discussion link"
            content={this.bountyDetail.discussion_link}
            contentClass="text-primary flex items-center"
            isLink
          />
        )}
        <Paragraph
          class="mt-2.5 items-center"
          label={'Apply Cutoff Date :'}
          content={dayjs
            .utc(Number(this.bountyDetail.apply_deadline))
            .format('YYYY-MM-DD HH:mm UTC')}
          contentClass="text-color2 "
        />
        <Paragraph
          class="mt-2.5 items-center"
          label={'Applicants deposit :'}
          content={`${this.bountyDetail.applicant_min_deposit} ${this.bountyDetail.deposit_contract_token_symbol}`}
          contentClass="text-color2 "
        />
        <Paragraph
          class="mt-2.5"
          label={'Description :'}
          content={this.bountyDetail.description}
          foldAble={true}
          fold={this.fold}
          maxHeight={300}
          contentClass="text-color3 "
          ref={(ref: any) => (this.pRef = ref)}
        />
        {this.showMoreBtn && (
          <div class="flex mt-6 justify-end">
            <More onMore={this.handleMore} fold={this.fold} />
          </div>
        )}
      </UCard>
    )
  }
})

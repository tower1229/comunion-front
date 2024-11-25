import { UTag } from '@comunion/components'
import { ConfirmOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { ServiceReturn } from '@/services'

export const ProposalCard = defineComponent({
  name: 'ProposalCard',
  props: {
    proposalData: {
      type: Object as PropType<NonNullable<ServiceReturn<'Proposal@get-proposal'>>['list'][number]>,
      required: true
    },
    noBorder: {
      type: Boolean,
      default: () => false
    },
    noDescription: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const router = useRouter()
    // const statusStyle = computed(() => {
    //   return GOVERNANCE_STATUS_STYLE[
    //     props.proposalData.status as keyof typeof GOVERNANCE_STATUS_STYLE
    //   ]
    // })

    const timeTip = computed(() => {
      if (dayjs.utc().isBefore(dayjs(+props.proposalData?.start_time).utc())) {
        const [days, hours, minutes] = dayjs
          .duration(dayjs(props.proposalData?.start_time).utc().diff(dayjs.utc()))
          .format('DD-HH-mm')
          .split('-')
        const basePrefix = 'Starts in '

        if (Number(days)) {
          return basePrefix + days + ' days'
        }
        if (Number(hours)) {
          return basePrefix + hours + ' hours'
        }
        if (Number(minutes)) {
          return basePrefix + minutes + ' minutes'
        }
      } else if (dayjs().isAfter(+props.proposalData?.end_time)) {
        return (
          <div class="flex items-center">
            <ConfirmOutlined class="h-4 text-primary mr-2 w-4" />{' '}
            {props.proposalData.max_votes_choice_item} -- {props.proposalData.max_votes}
          </div>
        )
      }
      return null
    })
    const timeLabel = computed(() => {
      if (dayjs().isAfter(+props.proposalData?.end_time)) {
        return 'Ended'
      }
      if (dayjs.utc().isBefore(dayjs(+props.proposalData?.start_time).utc())) {
        return 'Upcoming'
      }
      return 'Active'
    })
    const toComerDetail = (e: Event) => {
      e.stopPropagation()
      router.push({ path: '/builder', query: { id: props.proposalData?.comer_id } })
    }
    const handleCard = () => {
      router.push(`/governance/${props.proposalData?.id}`)
    }

    return {
      // statusStyle,
      timeTip,
      toComerDetail,
      handleCard,
      timeLabel
    }
  },
  render() {
    return (
      <div
        class={`bg-white rounded-sm cursor-pointer flex ${
          !this.noDescription ? 'mb-5' : ''
        } py-4 px-4 ${this.noBorder ? '' : 'border-1'} hover:bg-color-hover`}
        onClick={() => this.handleCard()}
      >
        <StartupLogo src={this.proposalData.startup.logo || ''} class="h-15 mr-4 w-15" />
        <div class="flex-1 overflow-hidden">
          <div class="flex items-center">
            <div class="flex-1 text-color3 u-h7">
              {this.proposalData.startup?.name || ''}
              <span class="px-2">by</span>
              <span class="text-color2 hover:text-primary" onClick={this.toComerDetail}>
                {this.proposalData.comer?.name || ''}
              </span>
            </div>
            {/* , this.statusStyle */}
            <UTag>
              {/* {GOVERNANCE_KEY[this.proposalData.status as keyof typeof GOVERNANCE_KEY]} */}
              {this.timeLabel}
            </UTag>
          </div>
          <div class="mt-2 mb-1 max-w-9/10 text-color1 truncate u-h4">
            {this.proposalData.title}
          </div>
          {!this.noDescription && this.proposalData.description && (
            <div class="text-color2 u-h6 line-clamp-2" v-html={this.proposalData.description} />
          )}
          {this.timeTip && <div class="mt-2 text-color3 u-h7">{this.timeTip}</div>}
        </div>
      </div>
    )
  }
})

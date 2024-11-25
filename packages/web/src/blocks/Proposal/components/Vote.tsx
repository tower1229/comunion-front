import { UDatePicker, UForm, UFormItem, UInput } from '@comunion/components'
import {
  ArrowDownOutlined,
  ConfirmOutlined,
  AddCircleOutlined,
  MinusCircleOutlined
} from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, ref, watch, computed } from 'vue'
import { ProposalInfo, VoteOption } from '../typing'

const BASIC_TYPE = 'Basic voting'

export const Vote = defineComponent({
  name: 'Vote',
  props: {
    proposalInfo: {
      type: Object as PropType<ProposalInfo>,
      required: true
    },
    voteOptions: {
      type: Array as PropType<VoteOption[]>
    }
  },
  setup(props, ctx) {
    const proposalVoteFormRef = ref()
    const showOptionsPanel = ref(false)

    const clickEventListener = (e: Event) => {
      const oIpt = e.target as HTMLDivElement
      if (oIpt['id'] !== 'voting-field') {
        showOptionsPanel.value = false
      }
    }

    watch(
      () => showOptionsPanel.value,
      value => {
        console.log('value===>', value)
        if (value) {
          document.addEventListener('click', clickEventListener, true)
        } else {
          document.removeEventListener('click', clickEventListener, true)
        }
      }
    )

    const selectedVotingInfo = computed(() => {
      console.log('voteOptions==>', props.voteOptions)
      console.log('props.proposalInfo===>', props.proposalInfo)

      return props.voteOptions?.find(voting => voting.value === props.proposalInfo.vote)
    })

    const triggerVoteField = () => {
      showOptionsPanel.value = !showOptionsPanel.value
    }
    const choiceOption = (value: string) => {
      if (value === BASIC_TYPE) {
        props.proposalInfo.vote_choices = [
          { value: 'Yes', disabled: true },
          { value: 'No', disabled: true },
          { value: 'Abstain', disabled: true }
        ]
      } else {
        props.proposalInfo.vote_choices = [{ value: '' }, { value: '' }]
      }
      props.proposalInfo.vote = value
      showOptionsPanel.value = false
    }
    const addVoteChoices = () => {
      props.proposalInfo.vote_choices?.push({ value: '' })
    }

    const delVoteChoices = (index: number) => {
      const newChoices = props.proposalInfo.vote_choices?.filter(
        (vote, voteIndex) => voteIndex !== index
      )
      props.proposalInfo.vote_choices = newChoices
    }
    ctx.expose({
      proposalVoteFormRef
    })
    return {
      showOptionsPanel,
      selectedVotingInfo,
      proposalVoteFormRef,
      triggerVoteField,
      choiceOption,
      addVoteChoices,
      delVoteChoices
    }
  },
  render() {
    return (
      <UForm ref={(ref: any) => (this.proposalVoteFormRef = ref)} model={this.proposalInfo}>
        <UFormItem showFeedback={false} label="Voting" required class="flex flex-col mb-4 relative">
          <div
            class="border rounded-sm cursor-pointer flex w-full py-2 px-4 justify-between items-center"
            onClick={this.triggerVoteField}
            id="voting-field"
          >
            <div class="flex flex-1 items-center">
              <div class="text-grey3 u-h5">Voting system</div>
              <div class="text-primary ml-2">{this.selectedVotingInfo?.label}</div>
            </div>
            <ArrowDownOutlined class="h-4 text-color3 w-4" />
          </div>
          {this.showOptionsPanel && (
            <div
              id="content"
              class="bg-white rounded min-h-100 p-4 inset-0 top-10 z-1 absolute"
              style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.097547)' }}
              onClick={e => e.stopPropagation()}
            >
              {this.voteOptions?.map(voting => (
                <div
                  key={voting.key}
                  class={[
                    'mb-4 p-4 bg-white rounded flex justify-between items-center',
                    { 'border cursor-pointer': voting.value !== this.proposalInfo.vote },
                    { 'bg-[#5E18FE1A]': voting.value === this.proposalInfo.vote }
                  ]}
                  onClick={() => this.choiceOption(voting.value)}
                >
                  <div>
                    <div class="tracking-0px u-label1">{voting.label}</div>
                    <div class="u-tag" style={{ padding: 0 }}>
                      {voting.remark}
                    </div>
                  </div>
                  {voting.value === this.proposalInfo.vote && (
                    <div class="text-primary">
                      <ConfirmOutlined />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </UFormItem>
        <div class="mb-6">
          {this.proposalInfo.vote_choices?.map((voteChoice, choiceIndex) => (
            <div class="flex mb-3 items-center">
              <UFormItem
                showFeedback={false}
                showLabel={false}
                class={[this.selectedVotingInfo?.value === BASIC_TYPE ? 'w-full' : 'w-180']}
                path="vote_choices"
                rule={[
                  {
                    validator: () => {
                      if (choiceIndex === 0 && !voteChoice.value) {
                        return false
                      }
                      return true
                    }
                  }
                ]}
              >
                <UInput
                  v-slots={{
                    prefix: (
                      <div class="text-grey3 w-20 u-h5">
                        Choice {choiceIndex + 1}
                        {choiceIndex === 0 && (
                          <span class="text-error n-form-item-label__asterisk">&nbsp;*</span>
                        )}
                      </div>
                    ),
                    suffix: <div class="pl-4 text-grey3 u-h5">{voteChoice.value.length}/32</div>
                  }}
                  v-model:value={voteChoice.value}
                  maxlength={32}
                  disabled={voteChoice.disabled}
                  class={[{ 'max-w-184': this.selectedVotingInfo?.value !== BASIC_TYPE }]}
                ></UInput>
              </UFormItem>
              {this.selectedVotingInfo?.value !== BASIC_TYPE && (
                <div class="flex flex-1 ml-4 items-center justify-start">
                  {choiceIndex !== 0 && (
                    <MinusCircleOutlined
                      class="cursor-pointer mr-3 text-error"
                      onClick={() => this.delVoteChoices(choiceIndex)}
                    />
                  )}
                  {this.proposalInfo.vote_choices?.length === choiceIndex + 1 &&
                    this.proposalInfo.vote_choices?.length < 20 && (
                      <AddCircleOutlined class="cursor-pointer" onClick={this.addVoteChoices} />
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div class="mb-3 u-body4">Voting period</div>
        <div class="flex gap-14 justify-between">
          <UFormItem
            label="Start Date(UTC)"
            labelStyle={{ fontSize: '12px' }}
            class="w-full"
            path="start_time"
            rule={[
              { required: true, message: 'Please set the start Time' },
              {
                validator: (rule, value) => {
                  if (!value || !this.proposalInfo.end_time) return true
                  return dayjs(value).isBefore(dayjs(this.proposalInfo.end_time))
                },
                message: 'Start time needs to be before End time',
                trigger: ['blur']
              }
            ]}
          >
            <UDatePicker
              placeholder="Select date"
              type="datetime"
              v-model:value={this.proposalInfo.start_time}
              format="yyyy-MM-dd HH:mm"
              class="w-full"
              isDateDisabled={(current: number) => {
                return dayjs(current) < dayjs().startOf('day')
              }}
            ></UDatePicker>
          </UFormItem>
          <UFormItem
            label="End Date(UTC)"
            labelStyle={{ fontSize: '12px' }}
            class="w-full"
            path="end_time"
            rule={[
              { required: true, message: 'Please set the end time' },
              {
                validator: (rule, value) => {
                  if (!value || !this.proposalInfo.start_time) return true
                  return dayjs(value).isAfter(dayjs(this.proposalInfo.start_time))
                },
                message: 'End time needs to be after Start time',
                trigger: ['blur']
              }
            ]}
          >
            <UDatePicker
              placeholder="Select date"
              type="datetime"
              v-model:value={this.proposalInfo.end_time}
              format="yyyy-MM-dd HH:mm"
              class="w-full"
              isDateDisabled={(current: number) => {
                return dayjs(current) < dayjs().startOf('day')
              }}
            ></UDatePicker>
          </UFormItem>
        </div>
      </UForm>
    )
  }
})

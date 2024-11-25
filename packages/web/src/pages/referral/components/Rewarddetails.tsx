import { defineComponent, computed } from 'vue'
export const Rewarddetails = defineComponent({
  name: 'Rewarddetails',
  props: {
    detail: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const detail = computed(() => props.detail)
    return () => (
      <div class="w-full">
        <p class="u-h4 mb-6 text-color1">Reward Details</p>
        <ul class="flex justify-between">
          <li class="w-72 p-6 bg-[#F5F6FA]">
            <p
              class="mb-2 font-primary font-semibold text-[32px]"
              style="color:rgba(0, 0, 0, 0.05);"
            >
              Coming soon
            </p>
            <p class="u-h6 flex items-center">
              <span class="mr-2">Rewards</span>
              {/* <UTooltip placement="top">
                {{
                  trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                  default: () => (
                    <div class="w-60">
                      Part of the funds raised will go into the swap pool as a fixed-price
                      exchangeable currency. and part will go directly to the team wallet
                    </div>
                  )
                }}
              </UTooltip> */}
            </p>
          </li>
          <li class="w-72 p-6 bg-[#F5F6FA]">
            <p class="mb-2 font-primary font-semibold text-[32px] text-color1">
              {Number(detail.value.activated_total || 0) + Number(detail.value.inactive_total || 0)}
            </p>
            <p class="u-h6 flex items-center">
              <span class="mr-2">Total Invitees</span>
              {/* <UTooltip placement="top">
                {{
                  trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                  default: () => (
                    <div class="w-60">
                      Part of the funds raised will go into the swap pool as a fixed-price
                      exchangeable currency. and part will go directly to the team wallet
                    </div>
                  )
                }}
              </UTooltip> */}
            </p>
          </li>
          <li class="w-72 p-6 bg-[#F5F6FA]">
            <p class="mb-2 font-primary font-semibold text-[32px] text-color1">
              {detail.value.activated_total || 0}
            </p>
            <p class="u-h6 flex items-center">
              <span class="mr-2">Actived Invitees</span>
              {/* <UTooltip placement="top">
                {{
                  trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                  default: () => (
                    <div class="w-60">
                      Part of the funds raised will go into the swap pool as a fixed-price
                      exchangeable currency. and part will go directly to the team wallet
                    </div>
                  )
                }}
              </UTooltip> */}
            </p>
          </li>
        </ul>
      </div>
    )
  }
})

export default Rewarddetails

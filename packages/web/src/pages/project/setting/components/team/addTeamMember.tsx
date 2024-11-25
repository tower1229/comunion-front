import { message, UButton, UInput, UInputGroup } from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import { services } from '@/services'
import { StartupItem } from '@/types'

export default defineComponent({
  name: 'addTeamMember',
  props: {
    startup_id: {
      type: Number,
      required: true
    },
    group: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const addTeamMemberVisible = ref<boolean>(false)
    const inputWalletAddress = ref<string>('')
    const teamMembers = ref<StartupItem[]>([])
    const comerProfile = reactive<any>(null)

    return {
      addTeamMemberVisible,
      inputWalletAddress,
      teamMembers,
      comerProfile,
      propGroup: props.group,
      startup_id: props.startup_id
    }
  },
  emits: ['triggerNewComer'],
  render() {
    const searchMember = async () => {
      if (this.inputWalletAddress.trim()) {
        const { error, data: ComerData } = await services['Comer@get-comer-by-address']({
          address: this.inputWalletAddress
        })

        if (!error) {
          const { data: existence } = await services['Startup@startup-team-comer-existence']({
            startup_id: this.startup_id,
            startup_team_comer_id: ComerData.id
          })
          if (existence?.is_exist) {
            return message.error('Already exists!')
          }

          this.inputWalletAddress = ''
          return this.$emit('triggerNewComer', ComerData)
        }
      }
      message.info('Please enter the content!')
    }

    return (
      <>
        <div class="mb-6 search">
          <UInputGroup>
            <UInput
              class="h-10 leading-10"
              v-model:value={this.inputWalletAddress}
              size="small"
              placeholder="Search comer by wallet address"
            />
            <UButton onClick={searchMember} type="primary" class="h-10 w-34 u-h4">
              Add
            </UButton>
          </UInputGroup>
        </div>
      </>
    )
  }
})

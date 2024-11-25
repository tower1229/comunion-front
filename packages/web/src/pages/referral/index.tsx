import { defineComponent, computed, ref, onMounted } from 'vue'
import { HeaderInfo } from './components/HeaderInfo'
import { ReferralList } from './components/ReferralList'
import { Rewarddetails } from './components/Rewarddetails'
import { services } from '@/services'
import { useUserStore } from '@/stores'

export const referral = defineComponent({
  name: 'referral',
  props: {},
  setup(props, ctx) {
    const userStore = useUserStore()
    const comer = computed(() => userStore.profile)
    const countData = ref()
    const getcountData = async () => {
      try {
        const { error, data } = await services['Comer@get-comer-invitation-count']()
        if (!error) {
          countData.value = data
        }
      } catch (error) {
        console.error('getGiveawayInfo', error)
      }
    }
    onMounted(() => {
      getcountData()
    })
    return () => (
      <div class="mx-auto mt-12 max-w-228">
        <HeaderInfo comer={comer.value || {}} />
        <Rewarddetails detail={countData.value} class="mt-16 mb-10" />
        <ReferralList />
      </div>
    )
  }
})

export default referral

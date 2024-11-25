import { reactive } from 'vue'
import { services } from '@/services'

export function useModuleTag() {
  const postedCount = reactive<Record<string, number>>({
    startup_count: 0,
    bounty_count: 0,
    crowdfunding_count: 0,
    sale_launchpad_count: 1,
    governance_count: 0
  })

  const participatedCount = reactive<Record<string, number>>({
    startup_count: 0,
    bounty_count: 0,
    crowdfunding_count: 0,
    governance_count: 0
  })

  const getData = async (comer_id: number) => {
    // type = createdByMe ? 1 : 2

    if (comer_id) {
      const { error, data } = await services['Comer@get-comer-posted-count-by-comer-id']({
        comer_id: String(comer_id)
      })
      if (!error) {
        postedCount.startup_count = data.startup_count
        postedCount.bounty_count = data.bounty_count
        postedCount.crowdfunding_count = data.crowdfunding_count
        postedCount.sale_launchpad_count = data.sale_launchpad_count
        postedCount.governance_count = data.governance_count
      }

      const { error: error2, data: data2 } = await services[
        'Comer@get-comer-participated-count-by-comer-id'
      ]({
        comer_id: String(comer_id)
      })
      if (!error2) {
        participatedCount.startup_count = data2.startup_count
        participatedCount.bounty_count = data2.bounty_count
        participatedCount.crowdfunding_count = data2.crowdfunding_count
        participatedCount.governance_count = data2.governance_count
      }
    } else {
      console.warn('Missing parameter: comer_id')
    }
  }

  return {
    postedCount,
    participatedCount,
    getData
  }
}

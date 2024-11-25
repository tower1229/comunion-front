import { computed, reactive } from 'vue'
import { ComerProfileState } from '@/types'

export function useTabs(profile?: ComerProfileState) {
  const converset = (numeric: number) => {
    const result = numeric % 10000
    if (result === numeric) {
      return numeric
    }
    return `${(numeric / 10000).toFixed(1)}w`
  }

  const count = reactive({
    startupCnt: profile?.connected_total?.connect_startup_total || 0,
    comerCnt: profile?.connected_total?.connect_comer_total || 0,
    followerCnt: profile?.connected_total?.be_connect_comer_total || 0
  })

  const tabs = computed(() => [
    {
      id: '0',
      title: 'Projects',
      totalRows: converset(count.startupCnt)
    },
    {
      id: '1',
      title: 'Comer',
      totalRows: converset(count.comerCnt)
    },
    {
      id: '2',
      title: 'Connection',
      totalRows: converset(count.followerCnt)
    }
  ])

  return tabs
}

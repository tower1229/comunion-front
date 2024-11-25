import { onMounted, reactive, watchEffect } from 'vue'

export function usePaginate({
  service,
  pageSize = 12,
  params
}: {
  service: (
    page: number,
    pageSize: number,
    params?: any
  ) => Promise<{ total: number; items: any[] }>
  pageSize?: number
  params?: any
}) {
  const data = reactive<{
    page: number
    total: number
    loading: boolean
    dataSource: any[]
  }>({
    page: 1,
    total: 0,
    loading: false,
    dataSource: []
  })

  const fetch = async () => {
    data.loading = true
    const { total, items } = await service(data.page, pageSize, params)
    data.total = total
    data.dataSource = items
    data.loading = false
  }
  watchEffect(fetch)

  onMounted(() => {
    fetch()
  })

  return { data }
}

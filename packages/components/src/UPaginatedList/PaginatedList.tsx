import { usePaginate } from '@comunion/hooks'
import { defineComponent, ExtractPropTypes, PropType, VNode } from 'vue'
import { UPagination } from '../UPagination'

type ServiceArgs = Parameters<typeof usePaginate>[0]

export const UPaginatedListProps = {
  service: {
    type: Function as PropType<ServiceArgs['service']>,
    required: true
  },
  defaultPageSize: {
    type: Number,
    default: 24
  },
  params: {
    type: Object as PropType<ServiceArgs['params']>
  },
  children: {
    type: Function as PropType<(data: ReturnType<typeof usePaginate>['data']) => VNode>
  },
  hidePaginationOnSinglePage: {
    type: Boolean,
    default: true
  }
  // onChange: {
  //   type: Function as PropType<(data: ReturnType<typeof usePaginate>['data']) => void>
  // }
} as const

export type UPaginatedListPropsType = ExtractPropTypes<typeof UPaginatedListProps>

const UPaginatedList = defineComponent({
  name: 'UPaginatedList',
  props: UPaginatedListProps,
  setup(props, ctx) {
    const { data } = usePaginate({
      service: props.service,
      pageSize: props.defaultPageSize,
      params: props.params
    })

    return () => (
      <>
        {props.children?.(data)}
        {(!props.hidePaginationOnSinglePage || data.total > data.dataSource.length) && (
          <div class="flex justify-end mt-10">
            <UPagination
              v-model:page={data.page}
              itemCount={data.total}
              v-model:pageSize={props.defaultPageSize}
            />
          </div>
        )}
      </>
    )
  }
})

export default UPaginatedList

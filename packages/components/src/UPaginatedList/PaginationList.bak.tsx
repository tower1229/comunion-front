import { range } from 'lodash'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import './index.css'
import type { UPaginationPropsType } from '../UPagination'
import { UPagination } from '../UPagination'

export const UPaginationListProps = {
  colCount: {
    type: Number,
    default: 4
  },
  // column count, default 3
  colGapSize: {
    type: Number,
    default: 40
  },
  // column gap size, default 40px
  rowGapSize: {
    type: Number,
    default: 40
  },
  // row gap size, default 40px
  pagination: Object as PropType<UPaginationPropsType>,
  dataSource: Array,
  cellKey: {
    type: String,
    default: 'key'
  },
  cellRender: Function as PropType<(item: any) => void>
} as const

export type UPaginationListPropsType = typeof UPaginationListProps

const UPaginationList = defineComponent({
  name: 'UPaginationList',
  props: UPaginationListProps,
  setup(props) {
    function parseDataSourceByRow() {
      const { dataSource, colCount } = props

      const rows: any[][] = []
      dataSource?.forEach((item, i) => {
        const colIdx = i % colCount
        if (colIdx === 0) {
          rows[rows.length] = range(colCount).map(() => null)
        }

        rows[rows.length - 1][colIdx] = item
      })

      return rows
    }

    return () => {
      const { pagination, cellKey, rowGapSize, colGapSize, colCount } = props

      const rows = parseDataSourceByRow()

      const rowCount = rows.length

      return (
        <>
          <div class="u-pagination-list">
            {rows.map((cols, rIdx) => {
              if (!cols) {
                return <></>
              }

              return (
                <div
                  key={rIdx}
                  class={`flex flex-row items-center`}
                  style={{ marginBottom: rIdx + 1 === rowCount ? 0 : `${rowGapSize}px` }}
                >
                  {cols?.map((c, cIdx) => {
                    if (!c) {
                      return (
                        <div
                          style={{ marginRight: cIdx + 1 === colCount ? 0 : `${colGapSize}px` }}
                          class={`flex-1 flex-shrink-0`}
                        ></div>
                      )
                    }

                    const key = c[cellKey] != null ? c[cellKey] : cIdx
                    return (
                      <div
                        style={{ marginRight: cIdx + 1 === colCount ? 0 : `${colGapSize}px` }}
                        class={`flex-1 flex-shrink-0`}
                        key={key}
                      >
                        {props.cellRender?.(c)}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          {!!pagination && (
            <div class="flex flex-row justify-center mt-[16px]">
              <UPagination {...pagination} />
            </div>
          )}
        </>
      )
    }
  }
})

export default UPaginationList

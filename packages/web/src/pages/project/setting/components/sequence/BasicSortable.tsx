import {
  DragFilled,
  SortIcon1Outlined,
  SortIcon2Outlined,
  SortIcon3Outlined,
  SortIcon4Outlined
} from '@comunion/icons'
import { defineComponent, ref, watch, PropType } from 'vue'
import draggable from 'vuedraggable'

type SortItemType = {
  index: number
  element: ListItemType
}

type ListItemType = {
  name: string
  text: string
  id: number
  icon: () => any
}

export const startupSortItemList = [
  {
    name: 'Bounty',
    text: '',
    id: 2,
    icon: () => <SortIcon1Outlined class="text-primary w-full" />
  },
  {
    name: 'Launchpad',
    text: '',
    id: 3,
    icon: () => <SortIcon2Outlined class="text-primary w-full" />
  },
  {
    name: 'Governance',
    text: '',
    id: 4,
    icon: () => <SortIcon3Outlined class="text-primary w-full" />
  },
  {
    name: 'Other dapp',
    text: '',
    id: 5,
    icon: () => <SortIcon4Outlined class="text-primary w-full" />
  },
  {
    name: 'SaleLaunchpad',
    text: '',
    id: 6,
    icon: () => <SortIcon2Outlined class="text-primary w-full" />
  }
]

export default defineComponent({
  name: 'Sortable',
  props: {
    modelValue: {
      type: Object as PropType<number[]>
    }
  },
  components: {
    draggable
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const list = ref<ListItemType[]>([...startupSortItemList])

    const emitChange = () => {
      ctx.emit(
        'update:modelValue',
        list.value.map(e => e.id)
      )
    }

    watch(
      () => props.modelValue,
      propData => {
        if (
          Array.isArray(propData) &&
          propData.length &&
          !propData.filter(e => [2, 3, 4, 5].indexOf(e) === -1).length
        ) {
          list.value = propData.map(index => {
            return startupSortItemList[startupSortItemList.findIndex(e => e.id === index)]
          })
        } else {
          list.value = [2, 3, 4, 5].map(index => {
            return startupSortItemList[startupSortItemList.findIndex(e => e.id === index)]
          })
        }
      },
      {
        immediate: true
      }
    )

    return {
      list,
      emitChange
    }
  },
  render() {
    return (
      <div class="flex w-full">
        <draggable
          tag="ul"
          list={this.list}
          class="w-full"
          handle=".handle"
          itemKey="name"
          onEnd={this.emitChange}
          v-slots={{
            item: (data: SortItemType) => {
              const { element } = data
              // console.log(element, index)
              return (
                <li class="bg-white border border-color-border rounded flex h-20 mb-6 w-full px-6 items-center justify-between">
                  <div class="mr-4 w-8">{element.icon()}</div>
                  <p class="flex-1 text-color1 u-h4">{element.name}</p>
                  <div class="cursor-pointer handle">
                    <DragFilled class="w-full text-color3" />
                  </div>
                </li>
              )
            }
          }}
        />
      </div>
    )
  }
})

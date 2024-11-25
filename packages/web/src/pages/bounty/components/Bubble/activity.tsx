import { VectorFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, computed } from 'vue'
import Bubble from './core'
import { PostUpdate } from '@/types'
import { textToHtml } from '@/utils/format'

type NormalMessage = {
  name: string
  date: string
  content: string
}

type TransactionMessage = {
  name: string
  date: string
  dateTime: string
  content: TransactionContent
}

type TransactionContent = {
  token1_symbol: string
  token2_symbol: string
  token1_amount: number
  token2_amount: number
  transactionHash1: string
  transactionHash2: string
  url: string
}

function normalMessage(obj: NormalMessage) {
  return (
    <div class="flex-1 ml-4">
      <div class="mb-4 items-center">
        <p class=" font-semibold mb-1 text-4">{obj.name}</p>
        <p class=" mr-16px text-14px text-color3">{obj.date}</p>
      </div>
      <div class={`bg-purple rounded-md  mt-3 py-4 px-6 <lg:-ml-14`}>
        <div
          class={` text-black u-h5 max-h-20 overflow-auto`}
          v-html={textToHtml(obj.content)}
        ></div>
      </div>
    </div>
  )
}

function transactionMessage(obj: TransactionMessage) {
  return (
    <div class="flex-1 ml-4">
      <div class="mb-4 items-center">
        <p class=" font-semibold mb-1 text-4">{obj.name}</p>
        <p class=" mr-16px text-14px text-color3">{obj.date}</p>
      </div>
      <p class="bg-purple flex rounded-8px text-black p-6 overflow-hidden items-center  <lg:-ml-14">
        <div class="flex items-center">
          <div class="bg-white flex rounded-20px h-40px w-40px justify-center items-center">
            <VectorFilled class="text-primary" />
          </div>
          <div class="border-solid border-color-border flex flex-col border-r-1px h-16 ml-3 pr-6 justify-center">
            <p class=" font-semibold text-16px text-[##333333]">Send</p>
            <p class="mt-10px text-14px text-grey3">{obj.dateTime}</p>
          </div>
        </div>
        <div class="flex flex-col flex-1 ml-6 overflow-hidden">
          <p class="text-color1 u-title2">
            {obj.content.token1_amount || 0} {obj.content.token1_symbol}
            {obj.content.token2_symbol && (
              <>
                +{obj.content.token2_amount || 0} {obj.content.token2_symbol}
              </>
            )}
          </p>
          <p class=" font-400 mt-4px">Txn Hash：</p>
          {obj.content.url ? (
            <a
              href={`${obj.content.url + obj.content.transactionHash1}`}
              target="_blank"
              class=" font-400 mt-4px text-primary"
            >
              {obj.content.transactionHash1}
            </a>
          ) : (
            <span class="cursor-default  font-400 mt-4px text-primary">
              {obj.content.transactionHash1}
            </span>
          )}

          {obj.content.transactionHash2 && obj.content.url && (
            <a
              href={`${obj.content.url + obj.content.transactionHash2}`}
              target="_blank"
              class="cursor-default  font-400 mt-4px text-primary"
            >
              {obj.content.transactionHash2}
            </a>
          )}
          {obj.content.transactionHash2 && !obj.content.url && (
            <span class="cursor-default  font-400 mt-4px text-primary">
              {obj.content.transactionHash2}
            </span>
          )}
        </div>
      </p>
    </div>
  )
}

export default defineComponent({
  name: 'ActivityBubble',
  props: {
    activity: {
      type: Object as PropType<PostUpdate>,
      required: true
    }
  },
  setup(props) {
    const fn = computed(() => {
      if (props.activity.type === 1) {
        const obj: NormalMessage = {
          name: props.activity.comer?.name || '',
          date: format(props.activity.created_at || '', 'comunionTimeAgo'),
          content: props.activity.content || ''
        }
        return () => <>{normalMessage(obj)}</>
      } else if (props.activity.type === 2) {
        const obj: TransactionMessage = {
          name: props.activity.comer?.name || '',
          date: format(props.activity.created_at || '', 'comunionTimeAgo'),
          dateTime: dayjs(props.activity.created_at || '').format('MMM D'),
          content: JSON.parse(props.activity.content as string) as TransactionContent
        }
        return () => <>{transactionMessage(obj)}</>
      }
      return () => <span>error type ${props.activity.type}</span>
    })
    return { fn }
  },
  render() {
    return (
      <>
        <Bubble
          class="mb-10"
          avatar={this.activity.comer?.avatar || ''}
          comerId={this.activity.comer?.id}
          v-slots={{
            default: this.fn
          }}
        />
      </>
    )
  }
})

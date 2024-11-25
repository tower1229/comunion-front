import { useMockCountdown } from '@comunion/hooks'
import { CheckedFilled, CloseOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, watchEffect } from 'vue'
import { ExtractPropTypes } from '../utils'
import './UTransactionWaiting.css'

export const UTransactionWaitingProps = {
  text: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  status: {
    type: String as PropType<'pending' | 'success' | 'failed'>,
    required: true,
    default: 'pending'
  },
  blockchainExplorerUrl: {
    type: String
  },
  normalType: {
    type: Boolean,
    default: true
  },
  blockchain: {
    type: Boolean,
    default: true
  }
} as const

export type UTransactionWaitingPropsType = ExtractPropTypes<typeof UTransactionWaitingProps>

const UTransactionWaiting = defineComponent({
  name: 'UTransactionWaiting',
  props: UTransactionWaitingProps,
  emits: ['close'],
  setup(props, ctx) {
    const show = ref(false)
    const { left, cancel, setLeft } = useMockCountdown()

    watchEffect(() => {
      if (props.status === 'success') {
        setLeft(0)
        setTimeout(() => {
          close()
        }, 1000)
      } else if (props.status === 'failed') {
        setLeft(0)
      } else {
        show.value = true
      }
    })

    function close() {
      cancel()
      show.value = false
      ctx.emit('close')
    }

    return () =>
      show.value ? (
        <div class="u-transaction-waiting">
          <CloseOutlined class="u-transaction-waiting-close" onClick={close} />
          <CheckedFilled class="u-transaction-waiting-checked" />
          <div>
            <div class="u-transaction-waiting-text" v-html={props.text}></div>
            {props.blockchainExplorerUrl && props.blockchain && (
              <a
                target="_blank"
                class="u-transaction-waiting-link"
                href={`${props.blockchainExplorerUrl}/tx/${props.hash}`}
              >
                View on explorer
              </a>
            )}
          </div>
          <div
            class="u-transaction-waiting-bar"
            style={{
              transform: `scaleX(${left.value / 100})`
            }}
          ></div>
        </div>
      ) : null
  }
})

export default UTransactionWaiting

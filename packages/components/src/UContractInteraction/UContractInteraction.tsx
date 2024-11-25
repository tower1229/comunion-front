import { defineComponent, PropType, ref, watchEffect } from 'vue'
import { UModal } from '../UModal'
import { ExtractPropTypes } from '../utils'

import './UContractInteraction.css'

export type UContractInteractionStatus = 'pending' | 'success' | 'canceled' | 'failed'

export const UContractInteractionProps = {
  status: {
    type: String as PropType<UContractInteractionStatus>
  },
  text: {
    type: String
  }
} as const

export type UContractInteractionPropsType = ExtractPropTypes<typeof UContractInteractionProps>

const UContractInteraction = defineComponent({
  name: 'UContractInteraction',
  props: UContractInteractionProps,
  setup(props) {
    const show = ref(false)

    // const close = () => {
    //   show.value = false
    // }

    watchEffect(() => {
      if (props.status) {
        if (['success', 'canceled', 'failed'].includes(props.status)) {
          // setTimeout(() => {
          //   show.value = false
          // }, 1000)
          // dont show the blank dialog
          show.value = false
        } else if ('pending' === props.status) {
          show.value = true
        }
      }
    })

    const statusTextFilter = (status: string) => {
      if (status === 'pending') {
        return 'Indexing'
      } else {
        return status
      }
    }

    return () => (
      <UModal
        v-model:show={show.value}
        transform-origin="center"
        close-on-esc={false}
        mask-closable={false}
      >
        {props.status && show.value ? (
          <div class={`u-contract-interaction status-${props.status}`}>
            {/* <CloseOutlined class="u-contract-interaction-close" onClick={close} /> */}
            {props.status === 'pending' && <div class="u-contract-interaction-animation"></div>}
            <div class="u-contract-interaction-status capitalize ">
              {statusTextFilter(props.status)}
            </div>
            {props.status === 'pending' && (
              <div class="u-contract-interaction-text">Note: {props.text}</div>
            )}
          </div>
        ) : (
          <div />
        )}
      </UModal>
    )
  }
})

export default UContractInteraction

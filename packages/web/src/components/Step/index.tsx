import { ConfirmOutlined, StepProcessFilled, StepWaitFilled } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import './style.css'

export interface StepProps {
  name: string
}

export interface ClassesStyle {
  stepTitle: string
}

const USteps = defineComponent({
  name: 'USteps',
  props: {
    steps: {
      type: Array as PropType<StepProps[]>,
      required: true
    },
    current: {
      type: Number,
      default: 1
    },
    classes: {
      type: Object as PropType<ClassesStyle>
    }
  },
  setup(props) {
    return () => (
      <div class="flex w-full u-steps">
        {props.steps.map((step, stepIndex) => {
          const finishStatus = stepIndex + 1 < props.current
          const waitStatus = stepIndex + 1 > props.current
          const processStatus = stepIndex + 1 === props.current
          let Icon = <StepProcessFilled />
          if (finishStatus) {
            Icon = (
              <div class="rounded-1/2 border border-primary w-6 h-6 flex items-center justify-center">
                <ConfirmOutlined class="text-primary" />
              </div>
            )
          } else if (waitStatus) {
            Icon = <StepWaitFilled />
          }
          return (
            <div class={['flex', { 'flex-1': stepIndex !== 0 }]}>
              {stepIndex !== 0 && (
                <div class={['u-splitor', { 'has-pass': finishStatus || processStatus }]} />
              )}
              <div class="u-step">
                <div>{Icon}</div>
                <div
                  class={[
                    'u-step-title',
                    props.classes?.stepTitle,
                    {
                      'text-primary': finishStatus || processStatus,
                      'text-grey3': waitStatus
                    }
                  ]}
                >
                  {step.name}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
})

export default USteps

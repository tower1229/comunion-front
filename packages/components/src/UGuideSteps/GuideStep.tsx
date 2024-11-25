import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent } from 'vue'
import './index.css'

interface UGuideStep {
  index: number
  title: string
  desc: string
}

export const UGuideStepProps = {
  steps: {
    type: Array as PropType<UGuideStep[]>,
    required: true
  }
} as const

export type UGuideStepPropsType = ExtractPropTypes<typeof UGuideStepProps>

const UGuideSteps = defineComponent({
  name: 'UGuideSteps',
  props: UGuideStepProps,
  setup(props) {
    const len = (props?.steps || []).length
    return () => {
      return (
        <>
          <div class="u-guide-steps">
            {props?.steps?.map((step: UGuideStep, i: number) => {
              return (
                <section class="u-guide-step" key={step.title}>
                  <div class="u-guide-step-index">
                    <div class="u-guide-step-index__number">
                      Step {typeof step.index === undefined ? i + 1 : step.index}
                    </div>
                    {i !== len - 1 ? <div class="u-guide-step-index__line"></div> : ''}
                  </div>

                  <div class="u-guide-step-content">
                    <div class="u-guide-step-content__title"> {step?.title} </div>
                    <div class="u-guide-step-content__desc"> {step?.desc} </div>
                  </div>
                </section>
              )
            })}
          </div>
        </>
      )
    }
  }
})
export default UGuideSteps

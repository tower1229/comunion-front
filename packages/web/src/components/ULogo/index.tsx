import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent } from 'vue'
import LogoImage from '@/assets/logo.png'

export const ULogoProps = {
  theme: {
    type: String as PropType<'colorful' | 'white'>,
    default: 'colorful'
  },
  withText: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 40
  }
} as const

export type ULogoPropsType = ExtractPropTypes<typeof ULogoProps>

const ULogo = defineComponent({
  name: 'ULogo',
  props: ULogoProps,
  setup(props) {
    return () => <img src={LogoImage} style={{ height: props.height + 'px' }} />
  }
})

export default ULogo

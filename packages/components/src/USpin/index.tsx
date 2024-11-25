import { NSpin } from 'naive-ui'
import { defineComponent } from 'vue'
import Loading from './Loading'

export const USpin = defineComponent({
  name: 'LoadingWrap',
  setup(props, ctx) {
    return () => (
      <NSpin
        {...{
          rotate: false,
          ...props
        }}
        v-slots={{
          icon: () => <Loading />,
          ...ctx.slots
        }}
      ></NSpin>
    )
  }
})

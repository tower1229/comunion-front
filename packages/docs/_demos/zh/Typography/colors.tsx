import { UStyleProvider } from '@comunion/components'
import { defineComponent } from 'vue'

// const ColorBlock = defineComponent({
//   name: 'ColorBlock',
//   props: {
//     name: {
//       type: String,
//       required: true
//     },
//     color: {
//       type: String,
//       required: true
//     }
//   },
//   setup(props) {
//     return () => (
//       <div class="border rounded-lg border-grey-5 mr-20 mb-5 p-6">
//         <div
//           class="rounded-lg h-30 w-50"
//           style={{
//             backgroundColor: props.color
//           }}
//         ></div>
//         <p class="my-5 text-xl text-grey-1">{props.name}</p>
//         <p class="my-0 text-base text-grey-3 truncate">{props.color}</p>
//       </div>
//     )
//   }
// })

const DemoColorsPage = defineComponent({
  name: 'DemoColorsPage',
  setup() {
    return () => (
      <UStyleProvider>
        <h3>主色调</h3>
        {/* <div class="flex items-center">
          <ColorBlock color="#5331F4" name="primary" />
          <ColorBlock color="#3F2D99" name="primary-1" />
          <ColorBlock color="#211B42" name="primary-2" />
        </div>
        <h3>状态色</h3>
        <div class="flex items-center">
          <ColorBlock color="#1C60F3" name="sucess" />
          <ColorBlock color="#DF4F51" name="error" />
          <ColorBlock color="#6AE0CF" name="info" />
          <ColorBlock color="#F29F39" name="warning" />
        </div>
        <h3>功能性</h3>
        <div class="flex items-center">
          <ColorBlock color="#333333" name="grey-1" />
          <ColorBlock color="#636366" name="grey-2" />
          <ColorBlock color="#9F9F9F" name="grey-3" />
          <ColorBlock color="#C0C0C0" name="grey-4" />
          <ColorBlock color="#E0E0E0" name="grey-5" />
        </div>
        <h3>背景色</h3>
        <div class="flex items-center">
          <ColorBlock color="#F5F6FA" name="purple" />
          <ColorBlock color="#D5CFF4" name="purple-light" />
          <ColorBlock
            color="radial-gradient(117.14% 462.2% at 0% 100%, #5331F4 0%, #9783F8 71.69%, #B46AF9 100%)"
            name="purple-gradient"
          />
        </div> */}
      </UStyleProvider>
    )
  }
})

export default DemoColorsPage

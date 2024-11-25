import { defineComponent, ref } from 'vue'
import IoTex from './assets/IoTex.png'
import PolygonzkEVM from './assets/PolygonzkEVM.png'
import Rollux from './assets/Rollux.png'
import Opside from './assets/opside.png'
import Syscoin from './assets/syscoin.png'
import ShareOutlined from '@/assets/shareOutlined.svg'

export default defineComponent({
  name: 'Partner',
  setup() {
    const list = ref([
      {
        title: 'Syscoin',
        icon: Syscoin,
        link: 'syscoin.org'
      },
      {
        title: 'Rollux',
        icon: Rollux,
        link: 'rollux.com'
      },
      {
        title: 'Opside',
        icon: Opside,
        link: 'opsi.de'
      },
      {
        title: 'IoTex',
        icon: IoTex,
        link: 'iotex.io'
      },
      {
        title: 'Polygon zkEVM',
        icon: PolygonzkEVM,
        link: 'polygon.technology'
      }
    ])

    return {
      list
    }
  },
  render() {
    return (
      <div class="my-10 min-h-100 <lg:min-h-60 <lg:px-5">
        <ul class="grid gap-10 grid-cols-2 <lg:grid-cols-1">
          {this.list.map(item => (
            <li
              class="cursor-pointer flex hover:text-color1"
              onClick={() => item.link && window.open('https://' + item.link)}
            >
              <img src={item.icon} class="h-30 mr-4 w-30" />
              <div class="flex-1">
                <h2 class="font-bold text-base text-color1">{item.title}</h2>
                <div>
                  {item.link}{' '}
                  <img
                    src={ShareOutlined}
                    class="h-3 -mt-0.5 ml-1 text-color3 w-3 inline-block align-middle"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
})

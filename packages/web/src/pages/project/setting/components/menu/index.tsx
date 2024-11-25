import { UMenu, MenuOption } from '@comunion/components'
import {
  InfoOutlined,
  SecurityOutlined,
  FinanceOutlined,
  TeamOutlined,
  SocialOutlined,
  GovernenceOutlined,
  SequenceOutlined,
  DappOutlined
} from '@comunion/icons'
import { defineComponent, h } from 'vue'

import './menu.css'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: 'INFO'
    }
  },
  setup() {
    const menuOptions: MenuOption[] = [
      {
        label: () => h(<p>Info</p>),
        key: 'INFO',
        icon: () => h(<InfoOutlined />)
      },
      {
        label: () => h(<p>Security</p>),
        key: 'SECURITY',
        icon: () => h(<SecurityOutlined />)
      },
      {
        label: () => h(<p>Finance</p>),
        key: 'FINANCE',
        icon: () => h(<FinanceOutlined />)
      },
      {
        label: () => h(<p>Team</p>),
        key: 'TEAM',
        icon: () => h(<TeamOutlined />)
      },
      {
        label: () => h(<p>Social</p>),
        key: 'SOCIAL',
        icon: () => h(<SocialOutlined />)
      },
      {
        label: () => h(<p>Governance</p>),
        key: 'GOVERNANCE',
        icon: () => h(<GovernenceOutlined />)
      },
      {
        label: () => h(<p>Sequence</p>),
        key: 'SEQUENCE',
        icon: () => h(<SequenceOutlined />)
      },
      {
        label: () => h(<p>Dapp</p>),
        key: 'DAPP',
        icon: () => h(<DappOutlined />)
      }
    ]
    return {
      menuOptions
    }
  },
  emits: ['routerChange'],
  render() {
    const handleUpdateValue = (key: string, item: MenuOption) => {
      this.$emit('routerChange', { key, item })
      console.log(key, item)
    }
    return (
      <div class="bg-white border rounded-ms h-200 mb-6 relative overflow-hidden menu-wrapper">
        <p class="m-6 text-color3 u-h5">Settings</p>
        <UMenu options={this.menuOptions} value={this.value} onUpdateValue={handleUpdateValue} />
      </div>
    )
  }
})

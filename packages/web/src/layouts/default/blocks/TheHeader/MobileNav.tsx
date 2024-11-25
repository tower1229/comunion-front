import { UDrawer, UMenu, MenuOption } from '@comunion/components'
import { MenuOutlined, MoreOpenOutlined } from '@comunion/icons'
import { defineComponent, ref, computed, PropType, h } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MobileNav',
  props: {
    navigations: Array as PropType<any[]>
  },
  setup(props, ctx) {
    const router = useRouter()

    const isOpen = ref(false)

    const handleClick = () => {
      isOpen.value = !isOpen.value
    }

    const menuOptions = computed(
      () =>
        (props.navigations || []).map(e => ({
          label: () =>
            h(
              <div class="flex items-center">
                <div class="flex-1 font-600 text-color2">{e.name}</div>
                {e.icon || null}
              </div>
            ),
          key: e.link || e.name,
          children: e.subMenu
            ? e.subMenu.map((subItem: any) => ({ label: subItem.name, key: subItem.url }))
            : null
        })) as MenuOption[]
    )

    const handleUpdateValue = (value: string) => {
      if (value.indexOf('//') === 0) {
        window.open(value)
      } else if (value.indexOf('/') === 0) {
        router.push(value)
      } else {
        console.warn('mobile nav click error', value)
      }
      isOpen.value = false
    }

    return {
      isOpen,
      handleClick,
      menuOptions,
      handleUpdateValue
    }
  },
  render() {
    const iconClass = (this.$attrs.class || 'h-7 w-7') as string

    return (
      <>
        {this.isOpen ? (
          <MoreOpenOutlined class={iconClass} onClick={this.handleClick} />
        ) : (
          <MenuOutlined class={iconClass} onClick={this.handleClick} />
        )}
        <UDrawer
          v-model:show={this.isOpen}
          width={240}
          style={{
            top: '58px'
          }}
          placement="left"
          v-slots={{
            whiteBoard: () => (
              <UMenu
                options={this.menuOptions}
                accordion
                onUpdateValue={this.handleUpdateValue}
                defaultValue="INFO"
              />
            )
          }}
        ></UDrawer>
      </>
    )
  }
})

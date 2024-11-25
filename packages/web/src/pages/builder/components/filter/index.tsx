import { UTabPane, UTabs } from '@comunion/components'
import { defineComponent, PropType, ref } from 'vue'
import { ModuleTags } from '@/components/Tags'
import './style.css'

export default defineComponent({
  name: 'Filter',
  props: {
    tasks: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
  emits: ['tabChange', 'selectedTagChange'],
  setup() {
    const tag1 = ref<any>()
    const tag2 = ref<any>()
    const currentTab = ref<string>('CREATED')

    return {
      tag1,
      tag2,
      currentTab
    }
  },
  render() {
    const tabsChange = (value: string) => {
      if (this.tag1) this.tag1.selectedList = ['All']
      if (this.tag2) this.tag2.selectedList = ['All']
      this.currentTab = value
      this.$emit('selectedTagChange', ['All'])
      this.$emit('tabChange', value === 'CREATED')
    }

    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }

    return (
      <div class="bg-white border border-color-border rounded-sm mb-6 py-6 px-8 relative overflow-hidden">
        <UTabs class="dashboard-tabs" onUpdateValue={tabsChange}>
          <UTabPane
            name="CREATED"
            v-slots={{
              tab: () => {
                return (
                  <div class={`${this.currentTab === 'CREATED' ? 'text-color1' : 'text-color3'}`}>
                    Created
                  </div>
                )
              }
            }}
          >
            <ModuleTags
              class="mt-2"
              tasks={this.tasks}
              onSelectedChange={handleSelectedChange}
              ref={(ref: any) => (this.tag2 = ref)}
            />
          </UTabPane>
          <UTabPane
            name="PARTICIPATED"
            v-slots={{
              tab: () => {
                return (
                  <div
                    class={`${this.currentTab === 'PARTICIPATED' ? 'text-color1' : 'text-color3'}`}
                  >
                    Participated
                  </div>
                )
              }
            }}
          >
            <ModuleTags
              class="mt-2"
              tasks={this.tasks}
              onSelectedChange={handleSelectedChange}
              ref={(ref: any) => (this.tag1 = ref)}
            />
          </UTabPane>
        </UTabs>
      </div>
    )
  }
})

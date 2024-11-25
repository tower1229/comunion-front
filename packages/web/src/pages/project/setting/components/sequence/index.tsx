import { UButton, USpin, message } from '@comunion/components'
import { PropType, defineComponent, ref, watch } from 'vue'
import BasicSortable from './BasicSortable'
import { services } from '@/services'

type DataType = {
  tab_sequence: string
}

export default defineComponent({
  name: 'sequenceSetting',
  props: {
    data: {
      type: Object as PropType<DataType>,
      required: true
    },
    startup_id: {
      type: Number,
      required: true
    }
  },
  emits: ['saved', 'edit'],
  setup(props, ctx) {
    const loading = ref(false)

    const list = ref<number[]>(
      props.data.tab_sequence ? props.data.tab_sequence.split(',').map(e => Number(e)) : []
    )

    watch(
      () => list.value,
      () => {
        if (list.value?.join(',') !== props.data.tab_sequence) {
          console.log(11111111111, 'sequence change')
          ctx.emit('edit')
        }
      },
      {
        deep: true
      }
    )

    return {
      loading,
      list
    }
  },
  render() {
    const handleSubmit = async () => {
      if (!this.startup_id) {
        return console.warn(`this.startup_id is missing!`)
      }
      // loading
      this.loading = true
      await services['Startup@update-startup-tab-sequence']({
        startup_id: this.startup_id,
        tab_sequence: this.list?.join(',')
      })
      this.loading = false
      message.success('Successfully saved')
      this.$emit('saved')
    }
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
          <h3 class="mb-10 text-color1 u-h2">
            Show each activities in project detail according to the following sequence
          </h3>
          <BasicSortable v-model={this.list} />
          <div class="flex mt-10 items-center justify-end">
            <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
              Save
            </UButton>
          </div>
        </div>
      </USpin>
    )
  }
})

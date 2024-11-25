import { UCard, UModal } from '@comunion/components'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    }
  },
  emits: ['triggerDialog'],
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    return (
      <UModal show={this.visible}>
        <UCard
          style={{
            width: '600px',
            maxWidth: '90%',
            '--n-title-text-color': '#000'
          }}
          title={this.title}
          bordered={false}
          size="huge"
          closable
          onClose={triggerDialog}
        >
          <p class="min-h-20 text-color2 u-h6">{this.content}</p>
          {this.$slots.btns && this.$slots.btns()}
        </UCard>
      </UModal>
    )
  }
})

import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UModal
} from '@comunion/components'
import { defineComponent, reactive, ref, watch, inject, PropType, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { USER_ROLE } from '@/constants'
import { services } from '@/services'
import { BountyInfo } from '@/types'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    gapValue: {
      type: Number,
      required: true,
      default: 0
    },
    bountyDetail: {
      type: Object as PropType<BountyInfo>,
      required: true
    },
    postUpdate: {
      type: Function,
      require: true,
      default: () => false
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const route = useRoute()
    const info = reactive({
      update: ''
    })

    const paramBountyId = inject<ComputedRef<number>>('paramBountyId')
    const refreshData = inject<ComputedRef<() => void>>('refreshData')

    watch(
      () => props.visible,
      value => {
        if (value) {
          info.update = ''
        }
      }
    )
    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'The update will be put on activity zone.',
        name: 'update',
        placeholder: '',
        maxlength: 1000,
        type: 'textarea',
        rules: [
          {
            required: true,
            message: 'Please enter an update'
          },
          {
            validator(rule, value) {
              return !value || value.length > 100
            },
            message: 'Please enter at least 100 character',
            trigger: 'blur'
          }
        ],
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ]

    const postUpdateFields = getFieldsRules(fields)
    const form = ref<FormInst>()

    return {
      postUpdateFields,
      fields,
      info,
      form,
      route,
      paramBountyId,
      refreshData
    }
  },
  render() {
    const triggerDialog = (status: boolean) => {
      this.$emit('triggerDialog', status)
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog(false)
        return
      }
      this.form?.validate(async err => {
        if (!this.paramBountyId) {
          return console.warn('PostUpdate: missing inject params: paramBountyId')
        }
        if (typeof err === 'undefined') {
          /**
           * only applyer within gapValue, need require contract
           * */
          if (this.bountyDetail.my_role !== USER_ROLE.FOUNDER && this.gapValue > 0) {
            await this.postUpdate(
              'Waiting to submit all contents to blockchain for post update',
              'Post update succeedes'
            )
          }
          const { error } = await services['Bounty@post-update-bounty']({
            content: this.info.update,
            bounty_id: this.paramBountyId,
            type: 1
          })
          if (!error) {
            triggerDialog(true)
            this.refreshData && this.refreshData()
          }
        }
      })
    }

    return (
      <UModal show={this.visible}>
        <UCard
          style={{
            width: '600px',
            maxWidth: '90%',
            '--n-title-text-color': '#000'
          }}
          title="Post update"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={() => triggerDialog(false)}
        >
          <>
            <UForm
              rules={this.postUpdateFields}
              model={this.info}
              ref={(ref: any) => (this.form = ref)}
              class="mt-8px mb-25px"
            >
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            <div class="flex justify-end">
              <UButton
                class="mr-16px w-164px"
                type="default"
                onClick={userBehavier('cancel')}
                size="small"
              >
                Cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={userBehavier('submit')} size="small">
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})

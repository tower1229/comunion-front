import {
  USpin,
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  ULazyImage,
  UModal
} from '@comunion/components'
import { defineComponent, reactive, ref, computed, inject, PropType, watch } from 'vue'
import defaultAvatar from './assets/avatar.png?url'
import { services } from '@/services'

export type editComerData = {
  comer_id: number
  position: string
  startup_team_group_id: number
  location?: string
  name?: string
  avatar?: string
  comer?: any
}

export default defineComponent({
  name: 'addTeamMemberDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    comer: {
      type: Object as PropType<editComerData>
    },
    startup_id: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)

    const info = reactive<{ Role: string | null; Group: number }>({
      Role: null,
      Group: 0
    })

    watch(
      () => props.comer,
      () => {
        info.Role = props.comer?.position || null
        info.Group = props.comer?.startup_team_group_id || 0
      },
      {
        immediate: true
      }
    )

    const groups = inject<any>('group')

    const groupsOption = computed(() => {
      return groups.value.map((item: { name: string; id: number }) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    })

    const form = ref<FormInst>()

    const fields = computed<FormFactoryField[]>(() => [
      {
        t: 'select',
        title: 'Role',
        name: 'Role',
        required: true,
        placeholder: 'Select role',
        options: [
          {
            label: 'Admin',
            value: 'Admin'
          },
          {
            label: 'Member',
            value: 'Member'
          }
        ],
        tag: true,
        filterable: true
      },
      {
        t: 'select',
        title: 'Group',
        name: 'Group',
        placeholder: 'Select a group',
        options: groupsOption.value
      }
    ])

    return {
      loading,
      info,
      form,
      fields,
      startup_id: props.startup_id
    }
  },
  emits: ['triggerDialog', 'triggerActionDone'],
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: string) => () => {
      if (type === 'cancel') {
        return triggerDialog()
      }

      this.form?.validate(async err => {
        if (!err) {
          this.loading = true
          if (!this.comer) {
            return console.warn('this.comer is missing!')
          }
          // create or edit
          const { error } = await services['Startup@save-comer-to-startup-team']({
            startup_id: this.startup_id,
            comer_id: this.comer.comer_id,
            position: this.info.Role as string,
            startup_team_group_id: this.info.Group || 0
          })
          if (!error) {
            console.warn(`${this.comer.startup_team_group_id ? 'create' : 'edit'} success!`)
            this.$emit('triggerActionDone')
          }

          this.loading = false

          triggerDialog()
        }
      })
    }
    const rules = getFieldsRules(this.fields)

    return (
      <UModal show={this.visible}>
        <USpin show={this.loading}>
          <UCard
            style={{ width: '600px', maxWidth: '90%', '--n-title-text-color': '#000' }}
            title="Team Setting"
            bordered={false}
            size="huge"
            role="dialog"
            aria-modal="true"
            closable
            onClose={userBehavier('cancel')}
          >
            <>
              <div class="bg-color-hover rounded-sm flex h-21  mb-6 items-center">
                <div class="h-15 mx-4 w-15">
                  <ULazyImage class="w-full" src={this.comer?.avatar || defaultAvatar} />
                </div>
                <p class="u-title1">{this.comer?.name || this.comer?.comer?.name}</p>
              </div>
              <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                <UFormItemsFactory fields={this.fields} values={this.info} />
              </UForm>
              <div class="flex mt-10 justify-end">
                <UButton
                  class="mr-4 w-40"
                  type="default"
                  onClick={userBehavier('cancel')}
                  size="small"
                >
                  Cancel
                </UButton>
                <UButton class="w-40" type="primary" onClick={userBehavier('submit')} size="small">
                  Submit
                </UButton>
              </div>
            </>
          </UCard>
        </USpin>
      </UModal>
    )
  }
})

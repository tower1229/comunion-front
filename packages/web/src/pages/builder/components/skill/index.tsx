import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  UTag,
  USpin
} from '@comunion/components'
import { defineComponent, ref, reactive, PropType, watchEffect, computed } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../editButton'
import { useTags } from '@/hooks'
import { services } from '@/services'

export default defineComponent({
  props: {
    skills: {
      type: Array as PropType<string[]>,
      required: true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['Done'],
  setup(props) {
    const loading = ref(false)
    const editMode = ref<boolean>(false)
    const optionsList = useTags('comer_skill')
    const comerSkillTagList = computed(() => {
      return Array.isArray(optionsList.TagList.value)
        ? optionsList.TagList.value.map(item => {
            return {
              label: item.name,
              value: item.name
            }
          })
        : []
    })
    const fields = computed<FormFactoryField[]>(() => {
      return [
        {
          t: 'skillTags',
          title: 'Skills',
          name: 'skills',
          charLimit: 20,
          required: true,
          options: comerSkillTagList.value
        }
      ] as unknown as FormFactoryField[]
    })
    const info = reactive<{ skills: string[] }>({
      skills: []
    })

    watchEffect(() => {
      info.skills = props.skills || []
    })
    const form = ref<FormInst>()

    return {
      loading,
      editMode,
      info,
      fields,
      form
    }
  },
  render() {
    const handleEditMode =
      (cancel = false) =>
      () => {
        if (cancel) {
          this.info.skills = this.skills
        }
        this.editMode = !this.editMode
      }
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          this.loading = true
          await services['Comer@bind-comer-skills']({
            skills: this.info.skills
          })
          handleEditMode()()
          this.$emit('Done')
          this.loading = false
        }
      })
    }
    const rules = getFieldsRules(this.fields)

    return (
      <USpin show={this.loading}>
        {this.viewMode && this.skills.length === 0 ? null : (
          <UCard
            title="Skill"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.viewMode) {
                  return
                }
                return <Edit onHandleClick={handleEditMode()}>Add</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(true), handleSubmit)}
              </div>
            ) : (
              <div class="flex flex-wrap gap-2">
                {Array.isArray(this.info.skills) && this.info.skills.length === 0 ? (
                  <p class="text-color3 u-h5">Add your skill</p>
                ) : (
                  <>
                    {this.info.skills.map(value => (
                      <UTag class="text-color1">{value}</UTag>
                    ))}
                  </>
                )}
              </div>
            )}
          </UCard>
        )}
      </USpin>
    )
  }
})

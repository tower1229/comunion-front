import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  USpin
} from '@comunion/components'
import { DeleteFilled, PenOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, PropType, watch, computed } from 'vue'
import { useComerOptionsList } from '../../hooks/useComerOptionsList'
import { btnGroup } from '../btnGroup'
import Edit from '../editButton'
import listHover from '../education/hover.module.css'
import { languageLevel } from '@/constants'
import { services } from '@/services'

type Language = {
  comer_id: number
  id: number
  language?:
    | {
        code: string
        id: number
        name: string
      }
    | undefined
  language_id: number
  level: number
}

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Language[]>,
      default: () => []
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
    const info = reactive<{ language: number | null; level: number | null; blockId?: number }>({
      // id: uniqueId('lang'),
      language: null,
      level: null
    })
    const ComerOptionsListInstance = useComerOptionsList()
    const languageTypeList = computed(() => {
      return ComerOptionsListInstance.languageList.value
    })
    const form = ref<FormInst>()

    const languages = ref<Language[]>(props.list)

    watch(
      () => props.list,
      value => {
        languages.value = (value || []) as Language[]
      },
      { immediate: true, deep: true }
    )
    const fields = computed<FormFactoryField[]>(() => {
      const languageTypeListEnd: { label: string; value: number }[] = []
      languageTypeList.value &&
        languageTypeList.value.forEach((item: any) => {
          const data = {
            label: item.name,
            value: item.id
          }
          languageTypeListEnd.push(data)
        })
      return [
        {
          t: 'select',
          title: 'Language',
          name: 'language',
          placeholder: 'Select a language',
          required: true,
          options: languageTypeListEnd,
          rules: [{ type: 'number' }]
        },
        {
          t: 'select',
          title: 'Level',
          name: 'level',
          placeholder: 'Select language level',
          required: true,
          options: languageLevel,
          rules: [{ type: 'number' }]
        }
      ]
    })
    // const fields: FormFactoryField[] = [
    //   {
    //     t: 'select',
    //     title: 'Language',
    //     name: 'language',
    //     placeholder: 'Select a language',
    //     required: true,
    //     options: LanguageList
    //   },
    //   {
    //     t: 'select',
    //     title: 'Level',
    //     name: 'level',
    //     placeholder: 'Select language level',
    //     required: true,
    //     options: [
    //       { label: 'Beginner', value: 'Beginner' },
    //       { label: 'Elementary', value: 'Elementary' },
    //       { label: 'Intermediate', value: 'Intermediate' },
    //       { label: 'Advanced', value: 'Advanced' }
    //     ]
    //   }
    // ]

    return {
      loading,
      editMode,
      info,
      form,
      fields,
      languages
    }
  },
  render() {
    const handleEditMode =
      (create = false) =>
      () => {
        if (create) {
          // this.info.id = uniqueId('lang')
          this.info.language = null
          this.info.level = null
        }
        this.editMode = !this.editMode
      }
    const rules = getFieldsRules(this.fields)

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          this.loading = true
          // const index = this.languages.findIndex(item => {
          //   return item.language_id === this.info.id
          // })
          // if (index > -1) {
          //   this.languages.splice(index, 1, {
          //     language_id: this.info.language as number,
          //     level: this.info!.level as number
          //   })
          // } else {
          //   this.languages.push({
          //     language_id: this.info.language as number,
          //     level: this.info!.level as number
          //   })
          // }
          if (this.info?.blockId) {
            await services['Comer@update-comer-languages']({
              comer_language_id: this.info.blockId,
              language_id: this.info.language as number,
              level: this.info!.level as number
            })
            this.info.blockId = 0
          } else {
            await services['Comer@bind-comer-languages']({
              language_id: this.info.language as number,
              level: this.info!.level as number
            })
          }

          this.$emit('Done')
          handleEditMode()()
          this.loading = false
        }
      })
    }

    const handleCurrentRecord = async (type: 'edit' | 'del', id: number) => {
      if (type === 'edit') {
        const result = this.languages.find(item => item.id === id)
        if (result) {
          this.info.language = result.language_id
          this.info.level = result.level
          this.info.blockId = result.id
          handleEditMode()()
        }
        return
      }
      await services['Comer@unbind-comer-languages']({
        comer_language_id: id
      })
      this.$emit('Done')
      this.loading = false
    }
    return (
      <USpin show={this.loading}>
        {this.viewMode && this.languages.length === 0 ? null : (
          <UCard
            title="Language"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.viewMode) {
                  return
                }
                return <Edit onHandleClick={handleEditMode(true)}>Add</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col ">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div class="flex flex-col ">
                {this.languages.length === 0 ? (
                  <p class="text-color3 u-h5">Add your Languages</p>
                ) : (
                  <>
                    {this.languages.map(item => (
                      <div
                        class={`cursor-pointer -mx-3.5 px-3.5 flex items-center h-11 rounded-sm ${listHover['list-hover']}`}
                      >
                        <div class="flex flex-1 items-center overflow-hidden">
                          <p
                            title={item.language?.name}
                            class="h-5 max-w-2/3 text-color1 truncate u-h6"
                          >
                            {item.language?.name}
                          </p>
                          <p class="bg-color3 h-3 mx-2 w-1px"></p>
                          <p class="text-color3 u-tag truncate">
                            {languageLevel.find(lang => lang.value === item.level)?.label}
                          </p>
                        </div>
                        <div
                          class={`hidden mr-4 ${
                            !this.viewMode ? listHover['hidden'] : ''
                          } cursor-pointer`}
                        >
                          <PenOutlined
                            class="h-4 text-primary mr-4.5 w-4"
                            onClick={() => handleCurrentRecord('edit', item.id)}
                          />
                          <DeleteFilled
                            class="h-4 text-primary w-4"
                            onClick={() => handleCurrentRecord('del', item.id)}
                          />
                        </div>
                      </div>
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

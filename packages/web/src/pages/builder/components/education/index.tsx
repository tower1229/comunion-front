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
import dayjs from 'dayjs'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../editButton'

import listHover from './hover.module.css'
import { services } from '@/services'

type EducationType = {
  id: number
  school: string
  major: string
  graduated_at: number
}

export default defineComponent({
  props: {
    viewMode: {
      type: Boolean,
      default: () => false
    },
    list: {
      type: Array as PropType<EducationType[]>,
      default: () => []
    }
  },
  emits: ['Done'],
  setup(props) {
    const loading = ref(false)
    const editMode = ref<boolean>(false)
    const info = reactive<EducationType>({
      id: 0,
      school: '',
      major: '',
      graduated_at: 1183135260000
    })
    const form = ref<FormInst>()
    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'College/University Name',
        name: 'school',
        required: true,
        placeholder: 'Your College/University Name',
        maxlength: 100,
        value: null
      },
      {
        t: 'string',
        title: 'Major',
        name: 'major',
        required: true,
        placeholder: 'Major',
        maxlength: 100,
        value: null
      },
      {
        t: 'date',
        title: 'Year of graduation',
        name: 'graduated_at',
        placeholder: 'Select Year of graduation',
        required: true,
        type: 'year',
        class: 'w-full',
        actions: []
      }
    ]

    const educations = ref<EducationType[]>([])

    watch(
      () => props.list,
      value => {
        educations.value = (value || []) as EducationType[]
      },
      { immediate: true, deep: true }
    )
    return {
      loading,
      editMode,
      info,
      form,
      fields,
      educations
    }
  },
  render() {
    const rules = getFieldsRules(this.fields)
    let isCreate = true

    const handleEditMode = (create = false) => {
      isCreate = create
      if (String(create) === 'true') {
        this.info.id = 0
        this.info.major = ''
        this.info.school = ''
        this.info.graduated_at = 1183135260000
      }
      this.editMode = !this.editMode
    }

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          // const index = this.educations.findIndex(item => {
          //   return item.id === this.info.id
          // })
          // if (index !== -1) {
          //   this.educations.splice(index, 1, this.info)
          // } else {
          //   this.educations.push(this.info)
          // }
          this.loading = true
          if (isCreate) {
            await services['Comer@bind-comer-educations'](this.info)
          } else {
            await services['Comer@update-comer-education']({
              ...this.info,
              comer_education_id: this.info.id
            })
          }

          this.$emit('Done')
          this.editMode = false
          this.loading = false
        }
      })
    }

    const handleCurrentRecord = async (type: 'edit' | 'del', id: number) => {
      const result = this.educations.find(item => item.id === id)
      if (!result) {
        return console.warn('handleCurrentRecord error')
      }
      if (type === 'edit') {
        this.info.id = result.id
        this.info.school = result.school
        this.info.major = result.major
        this.info.graduated_at = result.graduated_at
        handleEditMode()
      } else {
        this.loading = true
        await services['Comer@unbind-comer-educations']({
          comer_education_id: result.id
        })
        this.$emit('Done')
        this.loading = false
      }
    }

    return (
      <USpin show={this.loading}>
        {this.viewMode && this.educations.length === 0 ? null : (
          <UCard
            title="Education"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.viewMode) {
                  return
                }
                return <Edit onHandleClick={() => handleEditMode(true)}>Add</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div>
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode, handleSubmit)}
              </div>
            ) : (
              <div>
                {this.educations.length === 0 ? (
                  <p class="text-color3 u-h5">Add your Education</p>
                ) : (
                  <>
                    {this.educations.map(item => {
                      return (
                        <div
                          class={`-mx-3.5 px-3.5 cursor-pointer flex items-center h-17 rounded-sm ${listHover['list-hover']}`}
                        >
                          <div class="flex-1 overflow-hidden">
                            <p class=" text-color1 u-h5">{item.school}</p>

                            <div class="flex mt-2 text-color3 items-center">
                              <p class="u-tag">{item.major} Graduated</p>
                              <p class="bg-color3 h-3 mx-2 w-1px"></p>
                              <p class="u-tag">{dayjs(Number(item.graduated_at)).format('YYYY')}</p>
                            </div>
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
                      )
                    })}
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

import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  USpin
} from '@comunion/components'
import { defineComponent, ref, reactive, watch, nextTick } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../editButton'
import More from '@/components/More/shadow'
import { services } from '@/services'

export default defineComponent({
  props: {
    content: {
      type: String,
      default: () => '',
      required: true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['Done'],
  setup(props, ctx) {
    const loading = ref(false)
    const editMode = ref<boolean>(false)

    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    const info = reactive({
      bio: ''
    })

    watch(
      () => props.content,
      () => {
        info.bio = props.content
        nextTick().then(() => {
          if (pRef.value && pRef.value.clientHeight >= 164) {
            showMoreBtn.value = true
          } else {
            showMoreBtn.value = false
          }
        })
      },
      {
        immediate: true
      }
    )

    const fold = ref<boolean>(true)

    const form = ref<FormInst>()

    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'BIO',
        name: 'bio',
        type: 'textarea',
        value: null,
        required: true,
        placeholder: 'Tell the world your story',
        maxlength: 1000,
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ]
    return {
      loading,
      editMode,
      pRef,
      showMoreBtn,
      fold,
      fields,
      form,
      info
    }
  },
  render() {
    const rules = getFieldsRules(this.fields)
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const handleMore = () => {
      this.fold = !this.fold
    }
    const handleSubmit = async () => {
      if (this.info.bio.trim() !== '') {
        this.loading = true
        await services['Comer@update-comer-info-bio']({
          bio: this.info.bio
        })
        this.$emit('Done')
        handleEditMode()
        this.loading = false
      }
    }
    return (
      <USpin show={this.loading}>
        {this.viewMode && !this.content ? null : (
          <UCard
            title="BIO"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.viewMode) {
                  return
                }
                return <Edit onHandleClick={handleEditMode} />
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode, handleSubmit)}
              </div>
            ) : (
              <>
                {!this.content ? (
                  <p class="font-[400] text-14px text-color3">Add your Bio </p>
                ) : (
                  <>
                    <div
                      ref={(ref: any) => (this.pRef = ref)}
                      class="transition-all ease-linear duration-1000 overflow-hidden relative"
                      style={this.fold ? { maxHeight: '164px' } : { height: 'auto' }}
                    >
                      <p v-html={this.content} />
                      {this.fold && this.showMoreBtn && (
                        <div
                          class="h-16 right-0 bottom-0 left-0 absolute"
                          style={{
                            background:
                              'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
                            transform: 'rotate(-180deg)'
                          }}
                        ></div>
                      )}
                    </div>
                    {this.showMoreBtn && (
                      <div class="flex mt-5 justify-center">
                        <More onMore={handleMore} fold={this.fold} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </UCard>
        )}
      </USpin>
    )
  }
})

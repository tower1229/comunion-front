import { defineComponent, ref } from 'vue'
import { USelect, USkillTags } from '@/comps/index'

const SelectDemoPage = defineComponent({
  name: 'SelectDemoPage',
  setup() {
    const v = ref(1)
    const skills = ref([])
    return () => (
      <>
        <USelect
          v-model:value={v.value}
          options={[
            { value: 1, label: '1' },
            { value: 2, label: '2' }
          ]}
        ></USelect>
        {skills.value.join(',')}
        <USkillTags v-model:value={skills.value} />
      </>
    )
  }
})

export default SelectDemoPage

import { NumberDownOutlined, NumberUpOutlined } from '@comunion/icons'
import type { InputNumberProps } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'

export type UInputNumberPropsType = InputNumberProps

const UInputNumber = defineComponent({
  name: 'UInputNumber',
  extends: NInputNumber,
  // emits: ['update:value'],
  setup(props, ctx) {
    const inputValue = ref(props.value)
    const longEnterEventRef = ref()
    watch(
      () => inputValue.value,
      n => {
        ctx.emit('update:value', n)
      }
    )
    const addCurrentValue = () => {
      inputValue.value = (inputValue.value || 0) + Number(props.step)
      ctx.emit('update:value', inputValue.value)
    }

    const minusCurrentValue = () => {
      inputValue.value = (inputValue.value || 0) - Number(props.step)
      ctx.emit('update:value', inputValue.value)
    }

    const longEnterStart = (type: 'up' | 'down') => {
      longEnterEnd()
      longEnterEventRef.value = setInterval(() => {
        if (type === 'up') {
          addCurrentValue()
        } else {
          minusCurrentValue()
        }
      }, 100)
    }
    const longEnterEnd = () => {
      clearInterval(longEnterEventRef.value)
    }
    const controlSlot = () => (
      <div
        class="bg-purple flex flex-col h-6 w-4.5 items-center justify-center"
        style={{ lineHeight: 0 }}
      >
        <div
          style={{ height: '12px' }}
          onMousedown={() => longEnterStart('up')}
          onMouseup={longEnterEnd}
          onMouseleave={longEnterEnd}
        >
          <NumberUpOutlined class="cursor-pointer text-color1 block" onClick={addCurrentValue} />
        </div>
        <div
          style={{ height: '12px' }}
          onMousedown={() => longEnterStart('down')}
          onMouseup={longEnterEnd}
          onMouseleave={longEnterEnd}
        >
          <NumberDownOutlined
            class="cursor-pointer text-color1 block"
            onClick={minusCurrentValue}
          />
        </div>
      </div>
    )

    return () => (
      <NInputNumber
        {...props}
        showButton={false}
        v-slots={{ suffix: controlSlot, ...ctx.slots }}
      ></NInputNumber>
    )
  }
})

export default UInputNumber

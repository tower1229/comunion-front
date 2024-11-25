import { NumberDownOutlined, NumberUpOutlined } from '@comunion/icons'
import Big from 'big.js'
import { delay } from 'lodash'
import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import { defineComponent, ref, watch, PropType } from 'vue'

Big.strict = false
Big.NE = -21

import './index.css'

export type UInputBigNumberPropsType = InputProps & {
  step?: number
  precision?: number
  max?: string | number
  min?: string | number
  parse?: (value: any) => any
}

const UInputBigNumber = defineComponent({
  name: 'UInputBigNumber',
  extends: NInput,
  // emits: ['update:value'],
  props: {
    step: {
      type: Number,
      default: 1
    },
    precision: {
      type: Number
    },
    max: {
      type: [String, Number]
    },
    min: {
      type: [String, Number]
    },
    parse: {
      type: Function as PropType<(value: any) => any>
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const inputValue = ref(typeof props.value === 'number' ? String(props.value) : props.value)
    const longEnterEventRef = ref()
    const delayEventRef = ref()

    watch(
      () => inputValue.value,
      n => {
        if (!n) return n
        let newValue = n.toString()?.replace(/[^\d.]/g, '')
        if (props.maxlength) {
          newValue = newValue.toString().substring(0, Number(props.maxlength))
        }
        if (props.precision) {
          newValue = newValue.toString().replace(/\.(\d+)/, (e, $1) => {
            return `.${$1.substr(0, props.precision)}`
          })
        }
        if (props.parse) {
          newValue = props.parse(newValue)
        }

        inputValue.value = newValue
      }
    )
    watch(
      () => props.value,
      n => {
        inputValue.value = String(n)
      }
    )

    const formatValueWithInputEmit = (newValue: Big) => {
      if (props.max && newValue.gt(new Big(props.max))) {
        inputValue.value = String(props.max)
      } else if (typeof props.min === 'number' && newValue.lt(new Big(props.min))) {
        inputValue.value = String(props.min)
      } else {
        inputValue.value = newValue.valueOf()
      }

      ctx.emit('onInput', inputValue.value)
    }
    const inputHandler = () => {
      if (inputValue.value) {
        const newValue = new Big(inputValue.value as string)
        formatValueWithInputEmit(newValue)
      }
    }

    const blurInput = () => {
      if (inputValue.value) {
        const newValue = new Big(inputValue.value as string)
        formatValue(newValue)
      }
    }
    const formatValue = (newValue: Big) => {
      if (props.max && newValue.gt(new Big(props.max))) {
        inputValue.value = String(props.max)
      } else if (typeof props.min === 'number' && newValue.lt(new Big(props.min))) {
        inputValue.value = String(props.min)
      } else {
        inputValue.value = newValue.valueOf()
      }

      ctx.emit('update:value', inputValue.value)
    }
    const addCurrentValue = () => {
      if (props.disabled) {
        return null
      }
      const newValue = new Big((inputValue.value as string) || 0).add(props.step)
      formatValue(newValue)
    }

    const minusCurrentValue = () => {
      if (props.disabled) {
        return null
      }
      const newValue = new Big((inputValue.value as string) || 0).minus(props.step)
      formatValue(newValue)
    }

    const longEnterStart = async (type: 'up' | 'down') => {
      longEnterEnd()
      delayEventRef.value = await delay(() => {
        longEnterEventRef.value = setInterval(() => {
          if (type === 'up') {
            addCurrentValue()
          } else {
            minusCurrentValue()
          }
        }, 100)
      }, 200)
    }
    const longEnterEnd = () => {
      clearTimeout(delayEventRef.value)
      clearInterval(longEnterEventRef.value)
      longEnterEventRef.value = null
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
      <NInput
        class="input-big-number"
        {...props}
        inputProps={{ ...props.inputProps }}
        onBlur={blurInput}
        onInput={inputHandler}
        v-model:value={inputValue.value}
        v-slots={{ suffix: controlSlot, ...ctx.slots }}
      ></NInput>
    )
  }
})

export default UInputBigNumber

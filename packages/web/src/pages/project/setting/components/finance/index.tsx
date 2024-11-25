import {
  USpin,
  FormInst,
  FormItemRule,
  UAddressInput,
  UButton,
  UDatePicker,
  UForm,
  UFormItem,
  UImage,
  UInput,
  UInputNumber,
  UInputGroup,
  USelect,
  message
} from '@comunion/components'
import { CloseOutlined, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, h, reactive, PropType, watch, onMounted } from 'vue'
import { supportedNetworks } from '@/constants'
import { services } from '@/services'
import { StartupFinance } from '@/types'
import { MAX_NUMBER_INPUT } from '@/utils/valid'

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<StartupFinance>
    },
    startup_id: {
      type: Number,
      required: true
    }
  },
  emits: ['saved', 'edit'],
  setup(props, ctx) {
    const loading = ref(false)

    const form = ref<FormInst>()

    const info = reactive({
      launched_at: props.data?.launched_at ? Number(props.data?.launched_at) || null : null,
      contract: props.data?.contract_address || '',
      chain_id: Number(props.data?.chain_id) || null,
      name: props.data?.name,
      symbol: props.data?.symbol,
      supply: props.data?.supply ? Number(props.data?.supply) : undefined,
      wallets: Array.isArray(props.data?.wallets)
        ? props.data!.wallets.map(w => ({
            name: w.name,
            address: w.address,
            id: w.id
          }))
        : [
            {
              name: '',
              address: '',
              id: 0
            }
          ],
      presaleDate:
        props.data?.presale_started_at &&
        props.data?.presale_ended_at &&
        Number(props.data?.presale_started_at) &&
        Number(props.data?.presale_ended_at)
          ? [Number(props.data?.presale_started_at), Number(props.data?.presale_ended_at)]
          : null
    })

    let infoWatcher: any
    onMounted(() => {
      if (!infoWatcher) {
        infoWatcher = watch(
          () => info,
          () => {
            console.log(11111111111, 'finance change')
            ctx.emit('edit')
          },
          {
            deep: true
          }
        )
      }
    })

    const handleSubmit = () => {
      form.value?.validate(async err => {
        if (!err) {
          // loading
          loading.value = true

          const { error } = await services['Startup@set-startup-finance']({
            startup_id: props.startup_id,
            contract_address: info.contract,
            chain_id: info.chain_id as number,
            name: info.name,
            symbol: info.symbol,
            supply: info.supply,
            presale_started_at: (info.presaleDate && info.presaleDate[0]) || undefined,
            presale_ended_at: (info.presaleDate && info.presaleDate[1]) || undefined,
            launched_at: info.launched_at || undefined,
            wallets: info.wallets?.filter(e => e.name && e.address)
          })
          loading.value = false

          if (!error) {
            message.success('Successfully saved')
            ctx.emit('saved')
          }
        }
      })
    }

    return {
      loading,
      form,
      info,
      handleSubmit
    }
  },
  render() {
    const rules: Record<string, FormItemRule[]> = {
      chain_id: [
        {
          required: true,
          validator(rule: FormItemRule, value: string | undefined) {
            if (!value) {
              return new Error('Launch Network is required')
            }
            return true
          }
        }
      ],
      // contract: [{ required: true, message: 'Token contract is required', trigger: 'blur' }],
      wallets: [
        {
          required: true,
          validator(rule: FormItemRule, value: { name: string; address: string }[]) {
            if (!value.length) {
              return new Error('Wallet is required')
            } else if (value.filter(wallet => !wallet.name || !wallet.address).length) {
              return new Error('Incomplete wallet information')
            } else if (
              Array.from(new Set(value.map(wallet => wallet.name))).length !== value.length
            ) {
              // wallet name repeat check
              return new Error('Wallet name can not repeat')
            }
            return true
          },
          trigger: 'change'
        }
      ]
    }

    const addCompose = () => {
      if (!Array.isArray(this.info.wallets)) {
        this.info.wallets = []
      }
      this.info.wallets.push({
        name: '',
        address: '',
        id: 0
      })
    }

    const removeCompose = (index: number) => {
      Array.isArray(this.info.wallets) && this.info.wallets.splice(index, 1)
    }

    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
          <UForm ref={(ref: any) => (this.form = ref)} rules={rules} model={this.info}>
            <UFormItem label="Launch Network" path="chain_id">
              <div class="w-full">
                <USelect
                  v-model:value={this.info.chain_id}
                  // options={networkDateList}
                  placeholder="Select your launch network"
                  clearable
                  renderLabel={(option: any) => {
                    return [
                      h(<UImage src={option.logo} class="h-5 mr-2 w-5 inline float-left" />),
                      option.label as string
                    ]
                  }}
                  options={supportedNetworks.map(item => ({
                    label: item.name,
                    value: item.chainId,
                    logo: item.logo
                  }))}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Name">
              <div class="w-full">
                <UInput
                  v-model:value={this.info.name}
                  placeholder="Please enter your Token Name"
                  maxlength={50}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Symbol">
              <div class="w-full">
                <UInput
                  v-model:value={this.info.symbol}
                  placeholder="Please enter your Token Symbol"
                  maxlength={10}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Supply">
              <div class="w-full">
                <UInputNumber
                  v-model:value={this.info.supply}
                  placeholder="Please enter your Token Supply"
                  min={0}
                  max={MAX_NUMBER_INPUT}
                />
              </div>
            </UFormItem>
            <UFormItem label="Token Contract" path="contract">
              <UAddressInput
                placeholder="Please enter your token contract address"
                v-model:value={this.info.contract}
                noIcon
              />
            </UFormItem>
            {/* onChange={onTokenContractChange} */}
            <UFormItem label="Presale">
              <div class="w-full">
                <UDatePicker
                  v-model:value={this.info.presaleDate}
                  type="daterange"
                  clearable
                  startPlaceholder="yy-mm-dd (UTC time zone)"
                  endPlaceholder="yy-mm-dd (UTC time zone)"
                />
              </div>
            </UFormItem>
            <UFormItem label="Launch">
              <div class="w-full">
                <UDatePicker
                  v-model:value={this.info.launched_at}
                  type="date"
                  clearable
                  placeholder="yy-mm-dd (UTC time zone)"
                />
              </div>
            </UFormItem>
            <UFormItem label="Wallet" path="wallets">
              <div class="w-full">
                {Array.isArray(this.info.wallets) &&
                  this.info.wallets.map((compose, index) => (
                    <div class={`flex w-full items-center${index === 0 ? '' : ' mt-2'}`}>
                      <UInputGroup key={index} class="flex w-full">
                        <UInput
                          v-model:value={compose.name}
                          class="!w-50"
                          placeholder="Wallet name"
                          maxlength={24}
                        />
                        <UAddressInput
                          v-model:value={compose.address}
                          class="flex-1"
                          placeholder="Please enter wallet address"
                        />
                      </UInputGroup>
                      {Array.isArray(this.info.wallets) && this.info.wallets.length > 1 && (
                        <CloseOutlined
                          class="cursor-pointer ml-4 text-color3 hover:text-primary"
                          onClick={() => removeCompose(index)}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </UFormItem>
            <UButton text onClick={addCompose} type="primary">
              <PlusOutlined class="mr-2" />
              ADD ANOTHER WALLET
            </UButton>
            <div class="flex mt-10 items-center justify-end">
              <UButton class="w-30" type="primary" size="small" onClick={this.handleSubmit}>
                Save
              </UButton>
            </div>
          </UForm>
        </div>
      </USpin>
    )
  }
})

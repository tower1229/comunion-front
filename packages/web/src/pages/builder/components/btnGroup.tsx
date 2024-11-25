import { UButton } from '@comunion/components'

type FnParam = () => void

export function btnGroup(cancel: FnParam, submit: FnParam) {
  return (
    <div class="flex mt-4 justify-end">
      <UButton class="mr-4 w-30" type="default" onClick={cancel} size="small">
        Cancel
      </UButton>
      <UButton class="bg-primary1 w-30" type="primary" onClick={submit} size="small">
        Update
      </UButton>
    </div>
  )
}

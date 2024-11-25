export interface EditorOptions {
  placeholder?: string
  onChange?: (value: string) => void
}

export default class Editor {
  private _el: HTMLElement
  private _options: EditorOptions

  constructor(el: HTMLElement, options?: EditorOptions) {
    this._el = el
    this._options = options || {}
    el.contentEditable = 'plaintext-only'
    el.addEventListener('input', this._onInput)
    document.addEventListener('selectionchange', this._onSelectionChange)
  }

  private _onInput() {
    this._options.onChange?.(this._el.innerHTML)
  }

  private _onSelectionChange() {
    //
  }

  setValue(value: string) {
    this._el.innerHTML = value
  }

  getValue() {
    return this._el.innerHTML
  }

  dispose() {
    this._el.removeEventListener('input', this._onInput)
    document.removeEventListener('selectionchange', this._onSelectionChange)
  }
}

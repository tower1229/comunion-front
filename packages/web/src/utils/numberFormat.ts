export function formatToFloor(value: number | string, precision: number) {
  return String(value)
    .replace(/\.(\d+)/, (e, $1) => {
      return `.${$1.substr(0, precision)}`
    })
    .replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')
}

export function formatToFixed(value: number | string, precision: number) {
  return String(value)
    .replace(/\.(\d+)/, (e, $1) => {
      if ($1.length > precision) {
        return `.${Math.round(Number($1.substr(0, precision) + '.' + $1[precision + 1]))}`
      } else {
        return `.${$1.substr(0, precision)}`
      }
    })
    .replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')
}

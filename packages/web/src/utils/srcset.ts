export function handleSrcset(icons: string[]) {
  if (Array.isArray(icons)) {
    if (icons.length > 0) {
      return icons
        .map((icon, $index) => {
          if ($index === 0) {
            return icon
          }
          return `${icon} ${$index + 1}x`
        })
        .join(', ')
    }
  }
  return ''
}

export const textToHtml = (text?: string) => {
  return text ? text.replace(/\n/g, '<br/>') : ''
}

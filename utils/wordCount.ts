export function wordCount(text: string) {
  return text.trim().split(/[\s-—.,]+/).length
}

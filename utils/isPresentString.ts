export function isPresentString(value: unknown): value is string {
  return typeof value === 'string' && /[^\s]+/.test(value)
}

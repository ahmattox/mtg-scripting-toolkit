export enum Color {
  default = '\x1b[0m',
  bright = '\x1b[1m',
  dim = '\x1b[2m',
  black = '\x1b[30m',
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  white = '\x1b[37m'
}

export function applyColor(text: string, color: Color) {
  return `${color}${text}\x1b[0m`
}

export const log = (string = '', color = Color.default) => {
  // eslint-disable-next-line no-console
  console.log(`${color}%s\x1b[0m`, string)
}

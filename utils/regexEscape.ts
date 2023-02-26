const specialCharacters = [
  '/',
  '.',
  '*',
  '+',
  '?',
  '|',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  '\\'
]

const specialCharactersPattern = new RegExp(
  '(\\' + specialCharacters.join('|\\') + ')',
  'g'
)

export function regexEscape(value: string) {
  return value.replace(specialCharactersPattern, '\\$&')
}

import fs from 'fs'

/**
 * Loads and parses a list of cards from a file path. This loads, splits, and
 * trims lines.
 */
export function parseCardList(
  path: string,
  options: { includeBlank?: boolean } = {}
) {
  const { includeBlank = false } = options

  const inputFile = fs.readFileSync(path).toString()

  const lines = inputFile.split('\n').map((line) => line.trim())

  if (includeBlank) {
    return lines
  }

  return lines.filter((line) => line.length > 0)
}

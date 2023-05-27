import fs from 'fs'

/**
 * Loads and parses a list of cards from a file path. This loads, splits, and
 * trims lines.
 */
export function parseCardList(path: string) {
  const inputFile = fs.readFileSync(path).toString()

  return inputFile
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

import fs from 'fs'

import { Color, log } from 'utils/log'

import * as mtg from 'utils/mtg/spellCheckCardNames'

/**
 * Spellcheck a list of card names, checking against Scryfall's database. Names
 * must match exactly, including capitalization and punctuation.
 *
 * Prints a list of invalid cards and suggested corrections.
 *
 * Provide a path to a text file including card names to validate. One name per
 * line.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/spellcheck-card-names [path/to/text-file]
 *
 */

async function main() {
  const cardListPath = process.argv[2]

  if (cardListPath == null) {
    throw new Error('Pass a path to a list of cards as the first argument.')
  }

  const inputFile = fs.readFileSync(cardListPath).toString()

  const cardNames = inputFile
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const results = await mtg.spellCheckCardNames(cardNames)

  const errors = results.filter((result) => !result.valid)

  log()
  log(`${results.length} Card names validated`, Color.black)
  log(
    `${errors.length} ${errors.length === 1 ? 'Error' : 'Errors'}`,
    errors.length > 0 ? Color.red : Color.green
  )
  log()
  for (const error of errors) {
    log(`  - ${error.name}`, Color.red)
    if (error.suggestion != null) {
      log(`    ${error.suggestion}`, Color.blue)
    }
  }
  log()
}

main()

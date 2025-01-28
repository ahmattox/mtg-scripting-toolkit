import fs from 'node:fs'
import prompt from 'prompt'

import { applyColor, Color, log } from 'utils/log'

import * as mtg from 'utils/mtg'

/**
 * Spell check a list of cards from a file, providing suggestions if possible.
 * You'll be prompted for each invalid card name to accept the correction. The
 * result can either be written back to the file or will be printed in the
 * console.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/interactive-spellchecker [path/to/text-file]
 *
 */

async function main() {
  const cardListPath = process.argv[2]

  if (cardListPath == null) {
    throw new Error('Pass a path to a list of cards as the first argument.')
  }

  const rawTextLines = mtg.parseCardList(cardListPath, { includeBlank: true })

  const validatedLines = await mtg.spellCheckCardNames(rawTextLines, {
    skipValidation: (line) => line.length === 0 || line.startsWith('#')
  })

  const counts = validatedLines.reduce(
    (result, line) => {
      if (line.skipped) {
        return result
      }
      if (line.valid) {
        result.validated++
      } else {
        result.errors++
      }
      return result
    },
    { validated: 0, errors: 0 }
  )

  const output = []

  for (const line of validatedLines) {
    if (line.valid) {
      log(line.name, Color.green)
      output.push(line.name)
    } else {
      if (line.suggestion != null) {
        console.log(
          `${applyColor(line.name, Color.red)} -> ${applyColor(
            line.suggestion,
            Color.blue
          )}`
        )
        const { accept } = await prompt.get([
          {
            name: 'accept',
            description: 'Accept change?'
          }
        ])

        if (affirmativeResponse(accept)) {
          output.push(line.suggestion)
        } else {
          output.push(line.name)
        }
      } else {
        console.log(`${applyColor(line.name, Color.red)} (no suggestions)`)
        output.push(line.name)
      }
    }
  }

  log()
  log(`${counts.validated} Card names validated`, Color.black)
  if (counts.errors === 0) {
    log('No errors!', Color.green)
  } else {
    log(
      `${counts.errors} ${counts.errors === 1 ? 'Error' : 'Errors'}`,
      Color.red
    )
  }
  log()

  if (counts.errors > 0) {
    const { overwrite } = await prompt.get([
      {
        name: 'overwrite',
        description: 'Overwrite file?'
      }
    ])

    if (affirmativeResponse(overwrite)) {
      fs.writeFileSync(cardListPath, output.join('\n'))
    } else {
      log()
      log('Result:')
      log()
      log(output.join('\n'))
      log()
    }
  }
}

function affirmativeResponse(value: unknown) {
  return (
    typeof value === 'string' &&
    ['', 'y', 't', 'true'].includes(value.toLowerCase())
  )
}

main()

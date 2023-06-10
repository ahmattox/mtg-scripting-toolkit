import fs from 'fs'
import { groupBy, mapValues, sortBy } from 'lodash'
import yaml from 'yaml'

import * as scryfall from 'utils/scryfall'

import { Color, log } from 'utils/log'

/**
 * Get the first printed set for a list of cards. Pass a path to a text file
 * containing a list of cards. Output is formatted as yaml with "name" and "set"
 * fields. This was tailored specifically for formatting card lists for Lucky
 * Paper Radio show notes.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/card-list-first-printings [path/to/cards-list]
 *
 */
async function main() {
  const cardListPath = process.argv[2]

  if (cardListPath == null) {
    throw new Error('Pass a path to a list of cards as the first argument.')
  }

  const bulkData = await scryfall.fetchBulkData('default_cards')

  const cardsByName = mapValues(
    groupBy(bulkData, (card) => card.name),
    (cards) => sortBy(cards, (card) => card.released_at)
  )

  const cardList = fs.readFileSync(cardListPath).toString()

  const cardNames = cardList
    .split('\n')
    .map((line) => line.trim().replace(/^ +- +/, ''))

  const result = cardNames.map((cardName) => {
    const versions = cardsByName[cardName]
    if (versions != null) {
      return { name: cardName, set: versions[0].set }
    }
    return { name: cardName }
  })

  const output = yaml.stringify(result)

  log()
  log()
  log(output, Color.blue)
  log()
  log()
}

main()

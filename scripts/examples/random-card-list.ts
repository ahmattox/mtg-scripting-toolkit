import * as d3 from 'd3'

import * as scryfall from 'utils/scryfall'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'

/**
 * Run with
 *
 *     yarn run tsx ./scripts/examples/random-card-list 540
 *
 */

async function main() {
  const count = parseInt(process.argv[2])

  if (count == null || count < 1) {
    throw new Error('Pass a number of cards to randomly select')
  }

  const cards = mtg.uniqueFirstPrintings(
    await scryfall.fetchBulkData('oracle_cards')
  )

  const randomSubset = mtg.magicSort(d3.shuffle(cards).slice(0, count))

  log()

  log(randomSubset.map((card) => card.name).join('\n'), Color.blue)
  log()
}

main()

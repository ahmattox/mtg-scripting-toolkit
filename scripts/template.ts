import * as scryfall from '../utils/scryfall'
import * as mtg from '../utils/mtg'
import * as cubeCobra from '../utils/cube-cobra'

import { Color, log } from '../utils/log'

/**
 * Boilerplate script for querying or other tasks with Scryfall's bulk data.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/template
 *
 * Bulk data will be cached. Prepend the command with `SKIP_CACHE=1` to reload
 * it.
 */

async function main() {
  // Fetch Scryfall bulk data
  const cards = await scryfall.fetchBulkData()

  // Filter Cards
  const filteredCards = cards.filter((card) =>
    mtg.card.textIncludes(card, 'saproling')
  )

  // Sort cards
  const sortedCards = mtg.sort.byColor(
    filteredCards,
    (card) => card.color_identity
  )

  // Print the result
  log()
  log(`Found ${sortedCards.length} cards`, Color.blue)
  log()

  log(sortedCards.map((card) => card.name).join('\n'), Color.blue)
  log()
}

main()

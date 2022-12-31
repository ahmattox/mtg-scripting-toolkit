import * as scryfall from 'utils/scryfall'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'

function filterMinimumCriteria(
  cards: scryfall.Card[],
  criteria: ((card: scryfall.Card) => boolean)[],
  minimum: number
) {
  return cards.filter(
    (card) =>
      criteria.reduce((result, criterion) => {
        result += criterion(card) ? 1 : 0
        return result
      }, 0) >= minimum
  )
}

/**
 * Example script of creating an advanced query for cards matching a minimum
 * number of requirements which isn't possible directly through Scryfall.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/search-multiple-criteria
 *
 * Bulk data will be cached. Prepend the command with `SKIP_CACHE=1` to reload
 * it.
 */
async function main() {
  const cards = await scryfall.fetchBulkData()

  const criteria: ((card: scryfall.Card) => boolean)[] = [
    (card) => mtg.card.textIncludes(card, 'create'),
    (card) => mtg.card.textIncludes(card, '+1/+1 counter'),
    (card) => mtg.card.typeIncludes(card, 'instant'),
    (card) => mtg.card.textIncludes(card, 'dies')
  ]

  const filteredCards = filterMinimumCriteria(cards, criteria, 3)

  // Print the result
  log()
  log(`Found ${filteredCards.length} cards`, Color.blue)
  log()

  log(filteredCards.map((card) => card.name).join('\n'), Color.blue)
  log()
}

main()

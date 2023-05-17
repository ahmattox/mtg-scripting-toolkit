import * as scryfall from 'utils/scryfall'
import * as mtg from 'utils/mtg'
import { Color, log } from 'utils/log'

const pattern = /(\w).*\1/i

/**
 * Run with
 *
 *     yarn tsx ./scripts/examples/regex-card-search
 *
 * Scryfall's Regex has some limitations including not supporting back
 * references. But we can run any Regex filters on bulk data.
 */
async function main() {
  const allCards = await scryfall.fetchBulkData('oracle_cards')

  const cards = mtg.filterExtras(allCards)

  const matchingCards = cards.filter((card) =>
    mtg.card.names(card).some((name) => pattern.test(name))
  )

  const cardNames = matchingCards.map((card) => card.name)

  log(`${cards.length} total cards`, Color.blue)
  log(`${matchingCards.length} matched cards cards`, Color.blue)

  log('\n\n')
  log(cardNames.join('\n'), Color.blue)
  log('\n\n')
}

main()
